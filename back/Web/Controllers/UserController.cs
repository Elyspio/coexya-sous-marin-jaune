using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.User;
using SousMarinJaune.Api.Adapters.AuthenticationApi;
using SousMarinJaune.Api.Web.Filters;
using System.Net;

namespace SousMarinJaune.Api.Web.Controllers;

[Route("api/users/")]
[ApiController]
public class UserController : ControllerBase
{
	private readonly IUserService _userService;

	public UserController(IUserService userService)
	{
		_userService = userService;
	}

	/// <summary>
	///     Merge
	/// </summary>
	/// <param name="users"></param>
	/// <returns></returns>
	[HttpPatch("{user}/merge")]
	[Authorize(SousMarinJauneRole.Admin)]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> MergeUsers(string user, [FromBody] List<string> users)
	{
		await _userService.MergeUsers(user, users);
		return NoContent();
	}

	[HttpPut("{user}/sold")]
	[Authorize(SousMarinJauneRole.Admin)]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> SoldUser(string user)
	{
		await _userService.SoldUser(user);
		return NoContent();
	}

	[HttpPatch("sold")]
	[Authorize(SousMarinJauneRole.Admin)]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> SoldAllUsers()
	{
		await _userService.SoldAllUsers();
		return NoContent();
	}


	[HttpGet]
	[SwaggerResponse(HttpStatusCode.OK, typeof(List<UserSold>))]
	public async Task<IActionResult> GetUsers()
	{
		return Ok(await _userService.GetUsers());
	}
}