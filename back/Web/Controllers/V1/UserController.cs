using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.User;
using SousMarinJaune.Api.Web.Controllers.Base;
using SousMarinJauneRole = SousMarinJaune.Api.Abstractions.Transports.User.Enums.SousMarinJauneRole;

namespace SousMarinJaune.Api.Web.Controllers.V1;

[Route("api/users/")]
[ApiController]
public class UserController : BaseController
{
	private readonly IUserService _userService;

	public UserController(ILogger<BurgerController> logger, IUserService userService) : base(logger)
	{
		_userService = userService;
	}

	/// <summary>
	///     Merge
	/// </summary>
	/// <param name="users"></param>
	/// <returns></returns>
	[HttpPatch("{user}/merge")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	public async Task<IActionResult> MergeUsers(string user, [FromBody] List<string> users)
	{
		await _userService.MergeUsers(user, users);
		return NoContent();
	}

	[HttpPut("{user}/sold")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	public async Task<IActionResult> SoldUser(string user)
	{
		await _userService.SoldUser(user);
		return NoContent();
	}

	[HttpPatch("sold")]
	[ProducesResponseType(StatusCodes.Status204NoContent)]
	public async Task<IActionResult> SoldAllUsers()
	{
		await _userService.SoldAllUsers();

		return NoContent();
	}


	[HttpGet]
	[ProducesResponseType<List<UserSold>>(StatusCodes.Status200OK)]
	[AllowAnonymous]
	public async Task<IActionResult> GetUsers()
	{
		return Ok(await _userService.GetUsers());
	}

	[HttpGet("permissions")]
	[ProducesResponseType<UserPermissions>(StatusCodes.Status200OK)]
	public async Task<IActionResult> GetUserPermissions()
	{
		// Pour le moment on retourne toujours admin
		return Ok(new UserPermissions { Role = SousMarinJauneRole.Admin });
	}
}