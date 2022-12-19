namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class OrderPayment
{
	public OrderPaymentType Type { get; set; }
	public double Amount { get; set; }
}