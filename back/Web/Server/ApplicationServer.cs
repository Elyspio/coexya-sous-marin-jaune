using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Web.Server;

public static class ApplicationServer
{
	public static WebApplication Initialize(this WebApplication application)
	{
		// Allow CORS
		application.UseCors("Cors");

		application.UseOpenApi();
		application.UseSwaggerUi3();

		// Start Dependency Injection
		application.UseAdvancedDependencyInjection();

		// Setup Controllers
		application.MapControllers();

		application.UseAuthentication();

		application.MapHub<UpdateHub>("/ws/update");


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

			application.UseEndpoints(endpoints => { endpoints.MapFallbackToFile("/index.html"); });
		}

		return application;
	}
}