namespace SousMarinJaune.Api.Abstractions.Models;

public class BurgerRecord
{
	public Drink? Drink;
	public Fries? Fries;
	public required string Name { get; init; }
	public required List<string> Excluded { get; init; }
	public required bool Vegetarian { get; init; }
	public bool Xl { get; init; }
	public string Comment { get; init; }
}