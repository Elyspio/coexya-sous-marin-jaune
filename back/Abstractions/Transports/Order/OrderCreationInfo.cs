namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class OrderCreationInfo
{
	public bool Deferred { get; set; }
	public DateTime PlannedDate { get; set; }
}
