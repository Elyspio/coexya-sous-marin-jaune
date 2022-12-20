namespace SousMarinJaune.Api.Abstractions.Transports.Order.Payment;

public class OrderPayment
{
	public required OrderPaymentType Type { get; set; }
	public required double Amount { get; init; }

	public double? Received { get; set; }
}