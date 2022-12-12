using SousMarinJaune.Api.Abstractions.Models;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Repositories;

public interface IOrderRepository
{
	Task<OrderEntity> Create(string userName);
	Task<List<OrderEntity>> GetAll();
	Task<List<OrderEntity>> GetForUser(string user);
	Task Delete(Guid order);
	Task Update(OrderEntity order);
	Task<List<OrderEntity>> MergeUsers(string newName, List<string> users);
}