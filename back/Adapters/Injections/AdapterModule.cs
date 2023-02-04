using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.Adapters.AuthenticationApi;
using SousMarinJaune.Api.Adapters.Configs;
using SousMarinJaune.Api.Adapters.Custom;

namespace SousMarinJaune.Api.Adapters.Injections;

public class AdapterModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		var conf = configuration.GetSection(EndpointConfig.Section).Get<EndpointConfig>()!;

		services.AddHttpClient<IUsersClient, UsersClient>(client => { client.BaseAddress = new(conf.Authentication); });
		services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client => { client.BaseAddress = new(conf.Authentication); });
        services.AddHttpClient<IJwtClient, JwtClient>(client => { client.BaseAddress = new(conf.Authentication); });

		services.AddHttpClient<BurgerAdapter>();

		services.AddMemoryCache();
	}
}