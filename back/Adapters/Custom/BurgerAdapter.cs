using HtmlAgilityPack;
using Microsoft.Extensions.Caching.Memory;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Web;

namespace SousMarinJaune.Api.ExternalApi.Custom;

public class BurgerAdapter
{
	private readonly IMemoryCache _cache;
	private readonly HttpClient _client;

	public BurgerAdapter(HttpClient httpClient, IMemoryCache cache)
	{
		_client = httpClient;
		_cache = cache;
	}


	public async Task<List<Burger>> GetBurgers()
	{
		if (_cache.TryGetValue("burgers", out List<Burger>? burgers)) return burgers!;


		var doc = await GetDocument();
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

	private async Task<HtmlDocument> GetDocument()
	{
		var response = await _client.GetAsync("https://sousmarinjaune.fr/carte-le-sous-marin-jaune/");

		var doc = new HtmlDocument();

		doc.Load(await response.Content.ReadAsStreamAsync());

		return doc;
	}
}