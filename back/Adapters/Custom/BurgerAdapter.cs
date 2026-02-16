using HtmlAgilityPack;
using Microsoft.Extensions.Caching.Memory;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Web;
using Microsoft.Extensions.Logging;
using Polly;
using Polly.Retry;
using SousMarinJaune.Api.Abstractions.Helpers;

namespace SousMarinJaune.Api.ExternalApi.Custom;

public class BurgerAdapter
{
	public const string? UrlSousMarinJaune = "https://sousmarinjaune.fr/carte-le-sous-marin-jaune/";
	private readonly IMemoryCache _cache;
	private readonly HttpClient _client;
	private readonly ILogger<BurgerAdapter> _logger;

	public BurgerAdapter(HttpClient httpClient, IMemoryCache cache, ILogger<BurgerAdapter> logger)
	{
		_client = httpClient;
		_cache = cache;
		_logger = logger;
	}


	public async Task<List<Burger>> GetBurgers(CancellationToken ct)
	{
		using var logger = _logger.Enter();

		if (_cache.TryGetValue("burgers", out List<Burger>? burgers)) return burgers!;

		var doc = await GetDocument(ct);

		var mainNodes = doc.DocumentNode.Descendants()
			.Where(node => node.HasClass("elementor-image-box-content"))
			.ToList();

		burgers = mainNodes.Select(main =>
		{
			var children = main.ChildNodes.Where(node => node.Name is "h3" or "p").ToList();

			// Get burger label
			var name = children.Find(n => n.Name == "h3")!;

			// Get burger ingredients
			var allIngredients = children.Except([name]).Aggregate("", (current, ingredientList) => current + "-" + ingredientList.InnerText);


			return new Burger
			{
				Name = HttpUtility.HtmlDecode(name.InnerText).Trim(),
				Ingredients = HttpUtility.HtmlDecode(allIngredients)
					.Split('-', '–', '–')
					.Select(i => i.Trim())
					.Where(i => i.Length > 0)
					.ToList()
			};
		}).ToList();

		_cache.Set("burgers", burgers, TimeSpan.FromHours(1));

		return burgers;
	}

	private static readonly AsyncRetryPolicy StrategyRetryStrategy = Policy.Handle<HttpRequestException>()
		.WaitAndRetryAsync(10, retryAttempt => TimeSpan.FromSeconds(1 * retryAttempt));


	private async Task<HtmlDocument> GetDocument(CancellationToken ct)
	{
		using var logger = _logger.Enter();

		return await StrategyRetryStrategy.ExecuteAsync(async token =>
		{
			var response = await _client.GetAsync(UrlSousMarinJaune, token);

			response.EnsureSuccessStatusCode();

			var doc = new HtmlDocument();

			doc.Load(await response.Content.ReadAsStreamAsync(token));

			return doc;
		}, ct);
	}
}