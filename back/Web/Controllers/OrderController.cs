using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports;
using SousMarinJaune.Api.Abstractions.Transports.Order;
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
	
	[HttpPost("{order:guid}/records")]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> AddRecord(Guid order, BurgerRecord record)
	{
		await _orderService.AddBurgerRecord(order, record);

		return NoContent();
	}
	
}