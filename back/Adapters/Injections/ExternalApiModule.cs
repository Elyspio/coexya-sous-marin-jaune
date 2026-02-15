using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.ExternalApi.Checks;
using SousMarinJaune.Api.ExternalApi.Custom;

namespace SousMarinJaune.Api.ExternalApi.Injections;

public class ExternalApiModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		services.AddHttpClient<BurgerAdapter>();

		services.AddMemoryCache();
		
		services.AddHealthChecks().AddCheck<UpStreamHealthcheck>("upstream");
	}
}