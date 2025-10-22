using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using SousMarinJaune.Api.Abstractions.Exceptions;

namespace SousMarinJaune.Api.Web.Filters;

public class HttpExceptionFilter : ExceptionFilterAttribute
{
	public override void OnException(ExceptionContext context)
	{
		if (context.Exception is HttpException ex)
			context.Result = new ObjectResult(ex.ToString())
			{
				StatusCode = (int) ex.Code
			};

		base.OnException(context);
	}
}