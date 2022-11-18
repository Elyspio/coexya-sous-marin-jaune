using HtmlAgilityPack;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Web;

namespace SousMarinJaune.Api.Adapters.Custom;

public class BurgerAdapter
{
	private readonly HttpClient client;

	public BurgerAdapter(HttpClient httpClient)
	{
		client = httpClient;
	}


	public async Task<List<Burger>> GetBurgers()
	{
		var doc = await GetDocument();
		var mainNodes = doc.DocumentNode.Descendants()
			.Where(node => node.HasClass("single-menu-details"))
			.Select(node => node.ChildNodes.First(n => n.HasClass("food-menu-details")))
			.ToList();


		return mainNodes.Select(main =>
		{
			var children = main.ChildNodes.Where(node => node.Name == "h3").ToList();

			// Get burger label
			var name = children[0].InnerText!;

			// Get burger ingredients
			var allIngredients = children.Skip(1).Aggregate("", (current, ingredientList) => current + "-" + ingredientList.InnerText);

			return new Burger
			{
				Name = name,
				Ingredients = HttpUtility.HtmlDecode(allIngredients)
					.Split('-', '–', '–')
					.Select(i => i.Trim())
					.Where(i => i.Any())
					.ToList()
			};
		}).ToList();
	}

	private async Task<HtmlDocument> GetDocument()
	{
		var response = await client.GetAsync("https://www.le-sous-marin-jaune.fr/page-nos-burgers");

		var doc = new HtmlDocument();

		doc.Load(await response.Content.ReadAsStreamAsync());

		return doc;
	}
}