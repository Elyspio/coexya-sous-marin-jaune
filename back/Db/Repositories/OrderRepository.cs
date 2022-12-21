using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Db.Repositories.Internal;

namespace SousMarinJaune.Api.Db.Repositories;

internal class OrderRepository : BaseRepository<OrderEntity>, IOrderRepository
{
	public OrderRepository(IConfiguration configuration, ILogger<BaseRepository<OrderEntity>> logger) : base(configuration, logger)
	{
	}


	public async Task<OrderEntity> Create(string userName)
	{
		var order = new OrderEntity
		{
			Burgers = new(),
			Date = DateTime.Now,
			User = userName,
			Student = false,
			Payments = new()
		};
		await EntityCollection.InsertOneAsync(order);
		return order;
	}

	public async Task<List<OrderEntity>> GetAll()
	{
		return await EntityCollection.AsQueryable().ToListAsync();
	}

	public async Task<List<OrderEntity>> GetForUser(string user)
	{
		return await EntityCollection.AsQueryable().Where(order => order.User == user).ToListAsync();
	}

	public async Task Delete(Guid order)
	{
		await EntityCollection.DeleteOneAsync(o => o.Id == order.AsObjectId());
	}

	public async Task Update(OrderEntity order)
	{
		await EntityCollection.ReplaceOneAsync(o => o.Id == order.Id, order);
	}

	public async Task<List<OrderEntity>> MergeUsers(string newName, List<string> users)
	{
		var orders = await EntityCollection.AsQueryable().Where(order => users.Contains(order.User)).ToListAsync();

		await Task.WhenAll(orders.Select(async order =>
		{
			order.User = newName;
			await Update(order);
		}));

		return orders;
	}

	public async Task<OrderEntity> UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, double value)
	{
		var order = await  EntityCollection.AsQueryable().FirstOrDefaultAsync(order => order.Id == idOrder.AsObjectId());

		var payment = order.Payments.Find(p => p.Type == type);
		payment.Received = value;

		await Update(order);
		
		return order;

	}
}