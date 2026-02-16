using Elyspio.Utils.Telemetry.Technical.Helpers;
using HealthChecks.UI.Client;
using Microsoft.AspNetCore.Diagnostics.HealthChecks;
using SousMarinJaune.Api.Sockets.Hubs;
using SousMarinJaune.Api.Web.Technical.Extensions;
using Log = SousMarinJaune.Api.Abstractions.Helpers.Log;

namespace SousMarinJaune.Api.Web.Server;

public static class ApplicationServer
{
	public static WebApplication Initialize(this WebApplication application)
	{
		application.UseResponseCompression();
		application.UseResponseCaching();

		application.UseSwaggerWithVersioning();

		// Setup Controllers
		application.MapControllers();


		application.MapHub<UpdateHub>("/ws/update").AllowAnonymous();


		Serilog.Log.Logger.Information("Application started");

		// Start SPA serving
		if (application.Environment.IsProduction())
		{
			application.UseRouting();

			application.UseDefaultFiles(new DefaultFilesOptions
				{
					DefaultFileNames = new List<string>
					{
						"index.html"
					},
					RedirectToAppendTrailingSlash = true
				}
			);


			application.UseStaticFiles();

			application.MapFallbackToFile("/index.html").AllowAnonymous();
			
			Serilog.Log.Logger.Information("SPA serving enabled");
		}

		application.MapHealthChecks("/health", new HealthCheckOptions
		{
			Predicate = _ => true,
			ResponseWriter = UIResponseWriter.WriteHealthCheckUIResponse,
		}).AllowAnonymous();

		application.UseAuthentication();
		application.UseAuthorization();

		return application;
	}
}