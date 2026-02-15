using Microsoft.Extensions.Diagnostics.HealthChecks;
using SousMarinJaune.Api.ExternalApi.Custom;

namespace SousMarinJaune.Api.ExternalApi.Checks;

public class UpStreamHealthcheck: IHealthCheck
{
	private readonly BurgerAdapter _burgerAdapter;

	public UpStreamHealthcheck(BurgerAdapter burgerAdapter)
	{
		_burgerAdapter = burgerAdapter;
	}

	/// <inheritdoc />
	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = new())
	{
		try
		{
			var burgers = await _burgerAdapter.GetBurgers();
			
			return burgers.Count > 0 ? HealthCheckResult.Healthy() : HealthCheckResult.Unhealthy("No burgers found");
		}
		catch (Exception ex)
		{
			return HealthCheckResult.Unhealthy("Failed to fetch burgers", ex);
		}
	}
}