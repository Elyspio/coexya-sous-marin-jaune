using SousMarinJaune.Api.Abstractions.Transports.Order;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Hubs;

public interface IUpdateHub
{
	Task OrderUpdated(Order order);
	Task OrderDeleted(Guid orderId);
}