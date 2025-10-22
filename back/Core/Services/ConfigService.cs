using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Config;
using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Core.Services;

public class ConfigService : IConfigService
{
	private readonly IConfigRepository _configRepository;
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext;
	private readonly ILogger<ConfigService> _logger;

	public ConfigService(ILogger<ConfigService> logger, IConfigRepository configRepository, IHubContext<UpdateHub, IUpdateHub> hubContext)
	{
		_logger = logger;
		_configRepository = configRepository;
		_hubContext = hubContext;
	}

	private static ConfigBase DefaultConfig => new()
	{
		Carrier = "Jonathan",
		KitchenOpened = true,
		PaymentEnabled = true
	};

	public async Task<Config> Update(ConfigBase config)
	{
		using var logger = _logger.Enter(Log.Format(config));

		var entity = await _configRepository.Update(config);

		var data = entity.Adapt<Config>();
		await _hubContext.Clients.All.ConfigUpdated(data);


		return data;
	}

	public async Task<Config> Get()
	{
		using var logger = _logger.Enter();

		var entity = await _configRepository.Get();

		var data = entity == default
			? await Update(DefaultConfig)
			: entity.Adapt<Config>();

		return data;
	}
}