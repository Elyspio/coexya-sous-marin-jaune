using Microsoft.Extensions.Diagnostics.HealthChecks;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;

namespace SousMarinJaune.Api.Core.Checks;

/// <summary>
/// Health check that verifies the BurgerService can retrieve burgers.
/// </summary>
public class BurgerServiceHealthcheck : IHealthCheck
{
	private readonly IBurgerService _burgerService;

	public BurgerServiceHealthcheck(IBurgerService burgerService)
	{
		_burgerService = burgerService;
	}

	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		try
		{
			var burgers = await _burgerService.GetAll(cancellationToken);
			var count = burgers.Count;
			
			return count > 0 
				? HealthCheckResult.Healthy($"BurgerService is operational, {count} burgers available") 
				: HealthCheckResult.Unhealthy("BurgerService returned no burgers");
		}
		catch (Exception ex)
		{
			return HealthCheckResult.Unhealthy("BurgerService failed to retrieve burgers", ex);
		}
	}
}


