using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Config;

namespace SousMarinJaune.Api.Web.Controllers.V1;

[Route("api/config")]
[ApiController]
public class ConfigController : ControllerBase
{
	private readonly IConfigService _configService;

	public ConfigController(IConfigService burgerService)
	{
		_configService = burgerService;
	}

	[HttpGet]
	[ProducesResponseType<Config>(StatusCodes.Status200OK)]
	[AllowAnonymous]
	public async Task<IActionResult> Get()
	{
		return Ok(await _configService.Get());
	}


	[HttpPut]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	public async Task<IActionResult> Update(ConfigBase config)
	{
		await _configService.Update(config);

		return NoContent();
	}
}