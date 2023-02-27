using System.Text.Json;
using System.Text.Json.Nodes;

namespace SousMarinJaune.Api.Abstractions.Transports.Order.Base;

public class SauceWithQuantity
{
	public required Sauce Sauce { get; init; }
	public required int Amount { get; init; }
}