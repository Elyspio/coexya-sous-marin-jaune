using Microsoft.AspNetCore.Mvc;

namespace SousMarinJaune.Api.Web.Controllers.Base;

/// <summary>
///     BaseController
/// </summary>
[ApiController]
public class BaseController : ControllerBase
{
	/// <summary>
	///     Constructeur de la classe
	/// </summary>
	/// <param name="logger"></param>
	protected BaseController(ILogger logger)
	{
	}
}
