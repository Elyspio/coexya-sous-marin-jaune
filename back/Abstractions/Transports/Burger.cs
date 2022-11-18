namespace SousMarinJaune.Api.Abstractions.Transports;

public class Burger
{
	public required List<string> Ingredients { get; init; }
	public required string Name { get; init; }
}