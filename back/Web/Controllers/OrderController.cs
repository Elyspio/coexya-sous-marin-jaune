using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Web.Filters;
using System.Net;

namespace SousMarinJaune.Api.Web.Controllers;

[Route("api/orders")]
[ApiController]
public class OrderController : ControllerBase
{
	private readonly IOrderService _orderService;

	public OrderController(IOrderService burgerService)
	{
		_orderService = burgerService;
	}

	[HttpGet]
	[SwaggerResponse(HttpStatusCode.OK, typeof(List<Order>))]
	public async Task<IActionResult> GetAll()
	{
		return Ok(await _orderService.GetAll());
	}


	[HttpGet("users/{user}")]
	[SwaggerResponse(HttpStatusCode.OK, typeof(List<Order>))]
	public async Task<IActionResult> GetForUser(string user)
	{
		return Ok(await _orderService.GetForUser(user));
	}


	[HttpPost("users/{user}")]
	[SwaggerResponse(HttpStatusCode.Created, typeof(Order))]
	public async Task<IActionResult> Create(string user)
	{
		var order = await _orderService.Create(user);
		return Created($"orders/{order.Id}", order);
	}

	[HttpDelete("{order:guid}")]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> Delete(Guid order)
	{
		await _orderService.Delete(order);
		return NoContent();
	}

	[HttpPut("{orderId:guid}")]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> UpdateOrder(Guid orderId, Order order)
	{
		order.Id = orderId;
		await _orderService.Update(order);
		return NoContent();
	}
	
	[HttpPut("{idOrder:guid}/payment/{type}/received")]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	[RequireAuth]
	public async Task<IActionResult> UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, [FromBody] double value)
	{
		await _orderService.UpdateOrderPaymentReceived(idOrder, type, value);
		return NoContent();
	}}