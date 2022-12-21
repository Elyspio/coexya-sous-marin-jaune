using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Logging;
using MongoDB.Driver;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Config;
using SousMarinJaune.Api.Db.Repositories.Internal;

namespace SousMarinJaune.Api.Db.Repositories;

public class ConfigRepository : BaseRepository<ConfigEntity>, IConfigRepository
{
	public ConfigRepository(IConfiguration configuration, ILogger<BaseRepository<ConfigEntity>> logger) : base(configuration, logger)
	{
	}

	public async Task<ConfigEntity> Update(ConfigBase config)
	{
		var update = Builders<ConfigEntity>.Update
			.Set(c => c.Carrier, config.Carrier)
			.Set(c => c.KitchenOpened, config.KitchenOpened)
			.Set(c => c.PaymentEnabled, config.PaymentEnabled);

		return await EntityCollection.FindOneAndUpdateAsync(c => true, update, new()
		{
			IsUpsert = true,
			ReturnDocument = ReturnDocument.After
		});
	}

	public async Task<ConfigEntity> Get()
	{
		return await EntityCollection.AsQueryable().FirstOrDefaultAsync();
	}
}