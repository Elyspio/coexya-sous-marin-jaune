using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Net;

namespace SousMarinJaune.Api.Web.Controllers;

[Route("api/orders")]
[ApiController]
public class OrderController : ControllerBase
{
	private readonly IBurgerService _burgerService;

	public OrderController(IBurgerService burgerService)
	{
		_burgerService = burgerService;
	}

	[HttpGet]
	[SwaggerResponse(HttpStatusCode.OK, typeof(List<Burger>))]
	public async Task<IActionResult> GetAll()
	{
		return Ok(await _burgerService.GetAll());
	}
}