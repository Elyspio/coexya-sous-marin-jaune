using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Db.Repositories.Internal;

namespace SousMarinJaune.Api.Db.Repositories;

internal class OrderRepository : BaseRepository<OrderEntity>, IOrderRepository
{
	public OrderRepository(IConfiguration configuration, ILogger<BaseRepository<OrderEntity>> logger) : base(configuration, logger)
	{
	}
}