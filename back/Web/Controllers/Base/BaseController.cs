using Elyspio.Utils.Telemetry.Tracing.Elements;
using Microsoft.AspNetCore.Mvc;

namespace SousMarinJaune.Api.Web.Controllers.Base;

/// <summary>
///     BaseController
/// </summary>
[ApiController]
public class BaseController : TracingController
{
	/// <summary>
	///     Constructeur de la classe
	/// </summary>
	/// <param name="logger"></param>
	protected BaseController(ILogger logger) : base(logger)
	{
	}
}
