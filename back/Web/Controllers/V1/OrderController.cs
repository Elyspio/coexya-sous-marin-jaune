using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.ExternalApi.AuthenticationApi;
using SousMarinJaune.Api.Web.Controllers.Base;

namespace SousMarinJaune.Api.Web.Controllers.V1;

[Route("api/orders")]
[ApiController]
public class OrderController : BaseController
{
	private readonly IOrderService _orderService;

	public OrderController(ILogger<BurgerController> logger, IOrderService burgerService) : base(logger)
	{
		_orderService = burgerService;
	}

	[HttpGet]
	[ProducesResponseType<List<Order>>(StatusCodes.Status200OK)]
	[AllowAnonymous]
	public async Task<IActionResult> GetAll()
	{
		return Ok(await _orderService.GetAll());
	}


	[HttpGet("users/{user}")]
	[ProducesResponseType<List<Order>>(StatusCodes.Status200OK)]
	[AllowAnonymous]
	public async Task<IActionResult> GetForUser(string user)
	{
		return Ok(await _orderService.GetForUser(user));
	}


	[HttpPost("users/{user}")]
	[ProducesResponseType<Order>(StatusCodes.Status201Created)]
	[AllowAnonymous]
	public async Task<IActionResult> Create(string user)
	{
		var order = await _orderService.Create(user);
		return Created($"orders/{order.Id}", order);
	}

	[HttpDelete("{order:guid}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[AllowAnonymous]
	public async Task<IActionResult> Delete(Guid order)
	{
		await _orderService.Delete(order);
		return NoContent();
	}

	[HttpPut("{orderId:guid}")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	[AllowAnonymous]
	public async Task<IActionResult> UpdateOrder(Guid orderId, Order order)
	{
		order.Id = orderId;
		await _orderService.Update(order);
		return NoContent();
	}

	[HttpPut("{idOrder:guid}/payment/{type}/received")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	public async Task<IActionResult> UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, [FromBody] double value)
	{
		await _orderService.UpdateOrderPaymentReceived(idOrder, type, value);
		return NoContent();
	}
}
