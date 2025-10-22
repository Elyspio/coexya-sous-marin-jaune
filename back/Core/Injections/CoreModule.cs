using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Core.Services;

namespace SousMarinJaune.Api.Core.Injections;

public class CoreModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		services.Scan(scan => scan
			.FromAssemblyOf<CoreModule>()
			.AddClasses(classes => classes.InNamespaceOf<BurgerService>(), false)
			.AsImplementedInterfaces()
			// We need Transient to be able to call Hubs
			.WithTransientLifetime()
		);

		services.Scan(scan => scan
			.FromAssemblyOf<CoreModule>()
			.AddClasses(classes => classes.InNamespaceOf<OrderAssembler>(), false)
			.AsSelf()
			.WithSingletonLifetime());
	}
}