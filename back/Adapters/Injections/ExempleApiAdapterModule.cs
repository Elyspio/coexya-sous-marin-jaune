using SousMarinJaune.Api.Adapters.AuthenticationApi;
using SousMarinJaune.Api.Adapters.Configs;
using SousMarinJaune.Api.Adapters.Custom;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;

namespace SousMarinJaune.Api.Adapters.Injections;

public class ExampleApiAdapterModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		var conf = new EndpointConfig();
		configuration.GetSection(EndpointConfig.Section).Bind(conf);

		services.AddHttpClient<IUsersClient, UsersClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });

		services.AddHttpClient<IAuthenticationClient, AuthenticationClient>(client => { client.BaseAddress = new Uri(conf.Authentication); });

		services.AddHttpClient<BurgerAdapter>();
	}
}