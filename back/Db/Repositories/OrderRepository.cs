using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using MongoDB.Driver.Linq;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Order;
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
			Burgers = new List<BurgerRecord>(),
			Date = DateTime.Now,
			User = userName,
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

	public async Task AddBurgerRecord(Guid orderId, BurgerRecord record)
	{
		var order = await EntityCollection.AsQueryable().Where(order => order.Id == orderId.AsObjectId()).FirstAsync();
		order.Burgers.Add(record);
	}
}