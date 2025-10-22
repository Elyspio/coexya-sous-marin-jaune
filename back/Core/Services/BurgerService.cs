using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;
using SousMarinJaune.Api.ExternalApi.Custom;

namespace SousMarinJaune.Api.Core.Services;

internal class BurgerService : IBurgerService
{
	private readonly BurgerAdapter _burgerAdapter;
	private readonly ILogger<BurgerService> _logger;

	public BurgerService(BurgerAdapter burgerAdapter, ILogger<BurgerService> logger)
	{
		_burgerAdapter = burgerAdapter;
		_logger = logger;
	}


	public async Task<List<Burger>> GetAll()
	{
		using var logger = _logger.Enter();
		
		return await _burgerAdapter.GetBurgers();
	}
}