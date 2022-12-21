using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Services;

public interface IOrderService
{
	Task<List<Order>> GetAll();
	Task<List<Order>> GetForUser(string user);

	Task<Order> Create(string user);
	Task Delete(Guid orderId);
	Task Update(Order order);
	Task UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, double value);
}