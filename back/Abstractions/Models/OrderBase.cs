using SousMarinJaune.Api.Abstractions.Transports;

namespace SousMarinJaune.Api.Abstractions.Models;

public class OrderBase
{
	public required Burger Burger { get; init; }
	public required List<string> Excluded { get; init; }
	public required bool Vegetarian { get; init; }
	public required string User { get; init; }
}