using Microsoft.AspNetCore.Mvc;
using NSwag.Annotations;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;
using System.Net;

namespace SousMarinJaune.Api.Web.Controllers;

[Route("api/users/{user}")]
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
	[HttpPatch("merge")]
	[SwaggerResponse(HttpStatusCode.NoContent, typeof(void))]
	public async Task<IActionResult> MergeUsers(string user,  [FromBody] List<string> users)
	{
		await _userService.MergeUsers(user, users);
		return NoContent();
	}
}