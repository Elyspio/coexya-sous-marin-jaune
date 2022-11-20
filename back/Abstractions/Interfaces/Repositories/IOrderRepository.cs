using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Order;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Repositories;

public interface IOrderRepository
{
	Task<OrderEntity> Create(string userName);
	Task<List<OrderEntity>> GetAll();
	Task<List<OrderEntity>> GetForUser(string user);
	Task AddBurgerRecord(Guid orderId, BurgerRecord record);
}