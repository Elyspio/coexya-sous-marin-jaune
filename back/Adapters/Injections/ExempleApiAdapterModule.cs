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
		var conf = configuration.GetValue<EndpointConfig>(EndpointConfig.Section)!;

		services.AddHttpClient<IUsersClient, UsersClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });

		services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });

		services.AddHttpClient<BurgerAdapter>();

		services.AddMemoryCache();
	}
}