using Elyspio.Utils.Telemetry.Tracing.Elements;

namespace SousMarinJaune.Api.Web.Controllers.Base;

/// <summary>
///     BaseController
/// </summary>
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
