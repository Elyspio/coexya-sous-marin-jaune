using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Config;
using System.Net;

namespace SousMarinJaune.Api.Web.Controllers;

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
	[SwaggerResponse(HttpStatusCode.OK, typeof(Config))]
	public async Task<IActionResult> Get()
	{
		return Ok(await _configService.Get());
	}


	[HttpPut]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> Update(ConfigBase config)
	{
		await _configService.Update(config);

		return NoContent();
	}
}