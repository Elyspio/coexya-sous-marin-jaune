using SousMarinJaune.Api.Abstractions.Transports.Order;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Services;

public interface IOrderService
{
	Task<List<Order>> GetAll();
	Task<List<Order>> GetForUser(string user);

	Task<Order> Create(string userName);
	Task Delete(Guid orderId);
	Task Update(Order order);
}