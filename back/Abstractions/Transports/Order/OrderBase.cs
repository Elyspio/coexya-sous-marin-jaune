namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class OrderBase
{
	public required List<BurgerRecord> Burgers;
	public required string User { get; init; }

	public required DateTime Date { get; init; }
}