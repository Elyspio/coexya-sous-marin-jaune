
using Microsoft.OpenApi.Models;

namespace SousMarinJaune.Api.Web.Technical.Extensions;

/// <summary>
///     Extensions pour la configuration runtime de l'application
/// </summary>
public static class RuntimeExtensions
{
	/// <summary>
	///     Active la gestion de swagger et son interface en gérant le versioning
	/// </summary>
	/// <param name="app"></param>
	/// <returns></returns>
	public static IApplicationBuilder UseSwaggerWithVersioning(this WebApplication app)
	{
		if (app.Environment.IsDevelopment())
		{
			app.UseSwagger(options =>
			{
				options.PreSerializeFilters.Add((swagger, httpReq) =>
				{
					var serverUrl = $"{httpReq.Scheme}://{httpReq.Headers.Host}";
					swagger.Servers = new List<OpenApiServer> { new() { Url = serverUrl } };
				});
			});
			app.UseSwaggerUI(options =>
			{
				foreach (var groupNameDescription in app.DescribeApiVersions().Select(o => o.GroupName))
				{
					options.SwaggerEndpoint($"/swagger/{groupNameDescription}/swagger.json", groupNameDescription.ToUpperInvariant());
				}
			});
		}
		else
		{
			app.UseSwagger(options =>
			{
				var basePath = app.Configuration.GetSection("BasePathSwagger")?.Value;
				//Workaround to use the Swagger UI "Try Out" functionality when deployed behind a reverse proxy (APIM) with API prefix /sub context configured
				options.PreSerializeFilters.Add((swagger, httpReq) =>
				{
					if (!httpReq.Headers.ContainsKey("X-Forwarded-Host")) return;

					var serverUrl = $"{httpReq.Scheme}://{httpReq.Headers["X-Forwarded-Host"]}/{basePath}";
					swagger.Servers = new List<OpenApiServer> { new() { Url = serverUrl } };
				});
			});
			app.UseSwaggerUI(options =>
			{
				foreach (var groupNameDescription in app.DescribeApiVersions().Select(o => o.GroupName))
				{
					options.SwaggerEndpoint($"{groupNameDescription}/swagger.json", groupNameDescription.ToUpperInvariant());
				}
			});
		}

		return app;
	}

}
