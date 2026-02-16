using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;
using SousMarinJaune.Api.Web.Controllers.Base;

namespace SousMarinJaune.Api.Web.Controllers.V1;

[Route("api/burgers")]
[ApiController]
[AllowAnonymous]
public class BurgerController : BaseController
{
	private readonly IBurgerService _burgerService;

	public BurgerController(ILogger<BurgerController> logger, IBurgerService burgerService) : base(logger)
	{
		_burgerService = burgerService;
	}

	[HttpGet]
	[ProducesResponseType<List<Burger>>(StatusCodes.Status200OK)]
	[ResponseCache(VaryByHeader = "User-Agent", Duration = 60 * 60)]
	public async Task<IActionResult> GetAll(CancellationToken ct)
	{
		return Ok(await _burgerService.GetAll(ct));
	}
}