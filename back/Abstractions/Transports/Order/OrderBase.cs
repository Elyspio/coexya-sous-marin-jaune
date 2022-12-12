namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class OrderBase
{
	public required List<BurgerRecord> Burgers { get; init; }
	public required string User { get; set; }
	public required DateTime Date { get; init; }
	public required bool Student { get; init; }
	public Drink? Drink { get; init; }
	public Fries? Fries { get; init; }
	public Dessert? Dessert { get; init; }
}