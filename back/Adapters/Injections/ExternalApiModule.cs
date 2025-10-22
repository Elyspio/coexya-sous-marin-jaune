using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.ExternalApi.AuthenticationApi;
using SousMarinJaune.Api.ExternalApi.Configs;
using SousMarinJaune.Api.ExternalApi.Custom;

namespace SousMarinJaune.Api.ExternalApi.Injections;

public class ExternalApiModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		var conf = configuration.GetSection(EndpointConfig.Section).Get<EndpointConfig>()!;

		services.AddHttpClient<IUsersClient, UsersClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });
		services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });
		services.AddHttpClient<IJwtClient, JwtClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });

		services.AddHttpClient<BurgerAdapter>();

		services.AddMemoryCache();
	}
}