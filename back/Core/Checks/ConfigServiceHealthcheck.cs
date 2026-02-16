using Microsoft.Extensions.Diagnostics.HealthChecks;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;

namespace SousMarinJaune.Api.Core.Checks;

/// <summary>
/// Health check that verifies the ConfigService can retrieve configuration.
/// </summary>
public class ConfigServiceHealthcheck : IHealthCheck
{
	private readonly IConfigService _configService;

	public ConfigServiceHealthcheck(IConfigService configService)
	{
		_configService = configService;
	}

	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		try
		{
			var config = await _configService.Get();

			return !config.PaymentEnabled ? new HealthCheckResult(HealthStatus.Degraded, "ConfigService is operational but payment is disabled") : HealthCheckResult.Healthy($"ConfigService is operational, carrier: {config.Carrier}");
		}
		catch (Exception ex)
		{
			return HealthCheckResult.Unhealthy("ConfigService failed to retrieve configuration", ex);
		}
	}
}


