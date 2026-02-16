using Microsoft.Extensions.Diagnostics.HealthChecks;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;

namespace SousMarinJaune.Api.Core.Checks;

/// <summary>
/// Health check that verifies the OrderService can retrieve orders.
/// </summary>
public class OrderServiceHealthcheck : IHealthCheck
{
	private readonly IOrderService _orderService;

	public OrderServiceHealthcheck(IOrderService orderService)
	{
		_orderService = orderService;
	}

	public async Task<HealthCheckResult> CheckHealthAsync(HealthCheckContext context, CancellationToken cancellationToken = default)
	{
		try
		{
			// Just verify we can query the orders - an empty list is valid
			var orders = await _orderService.GetAll();
			
			return HealthCheckResult.Healthy($"OrderService is operational, {orders.Count} orders found");
		}
		catch (Exception ex)
		{
			return HealthCheckResult.Unhealthy("OrderService failed to retrieve orders", ex);
		}
	}
}

