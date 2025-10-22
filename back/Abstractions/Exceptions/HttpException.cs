using System.Net;

namespace SousMarinJaune.Api.Abstractions.Exceptions;

public class HttpException : Exception
{
	public HttpException(HttpStatusCode code, string? message, Exception? innerException) : base(message, innerException)
	{
		Code = code;
	}

	public HttpException(HttpStatusCode code, string? message) : base(message)
	{
		Code = code;
	}

	public HttpStatusCode Code { get; }
}