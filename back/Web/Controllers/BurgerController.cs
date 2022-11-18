using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Net;

namespace SousMarinJaune.Api.Web.Controllers;

[Route("api/burgers")]
[ApiController]
public class BurgerController : ControllerBase
{
	private readonly IBurgerService _burgerService;

	public BurgerController(IBurgerService burgerService)
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