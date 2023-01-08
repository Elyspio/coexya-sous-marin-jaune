using HtmlAgilityPack;
using Microsoft.Extensions.Caching.Memory;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Web;

namespace SousMarinJaune.Api.Adapters.Custom;

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
			.Where(node => node.HasClass("single-menu-details"))
			.Select(node => node.ChildNodes.First(n => n.HasClass("food-menu-details")))
			.ToList();

		burgers = mainNodes.Select(main =>
		{
			var children = main.ChildNodes.Where(node => node.Name == "h3" || node.Name == "p").ToList();

			// Get burger label
			var name = children[0].InnerText!;

			// Get burger ingredients
			var allIngredients = children.Skip(1).Aggregate("", (current, ingredientList) => current + "-" + ingredientList.InnerText);


			return new Burger
			{
				Name = HttpUtility.HtmlDecode(name).Trim(),
				Ingredients = HttpUtility.HtmlDecode(allIngredients)
					.Split('-', '–', '–')
					.Select(i => i.Trim())
					.Where(i => i.Any())
					.ToList()
			};
		}).ToList();

		_cache.Set("burgers", burgers, TimeSpan.FromHours(1));

		return burgers;
	}

	private async Task<HtmlDocument> GetDocument()
	{
		var response = await _client.GetAsync("https://www.le-sous-marin-jaune.fr/page-nos-burgers");

		var doc = new HtmlDocument();

		doc.Load(await response.Content.ReadAsStreamAsync());

		return doc;
	}
}