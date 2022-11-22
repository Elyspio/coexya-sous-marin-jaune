namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class BurgerRecord
{
	public required string Name { get; init; }
	public required List<string> Excluded { get; init; }
	public required bool Vegetarian { get; init; }
	public bool Xl { get; init; }
	public string? Comment { get; init; }
}