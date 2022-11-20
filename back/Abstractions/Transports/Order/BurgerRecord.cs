namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class BurgerRecord
{
	public Drink? Drink { get; init; }
	public Fries? Fries { get; init; }
	public Dessert? Dessert { get; init; }
	public required string Name { get; init; }
	public required List<string> Excluded { get; init; }
	public required bool Vegetarian { get; init; }
	public bool Xl { get; init; }
	public string? Comment { get; init; }
}