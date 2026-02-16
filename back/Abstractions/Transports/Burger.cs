namespace SousMarinJaune.Api.Abstractions.Transports;

public record Burger
{
	public required List<string> Ingredients { get; init; }
	public required string Name { get; init; }
}