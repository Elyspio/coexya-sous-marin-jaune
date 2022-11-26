using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;

namespace SousMarinJaune.Api.Core.Injections;

public class CoreModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		var nsp = typeof(CoreModule).Namespace!;
		var baseNamespace = nsp[..nsp.LastIndexOf(".", StringComparison.Ordinal)];
		services.Scan(scan => scan
			.FromAssemblyOf<CoreModule>()
			.AddClasses(classes => classes.InNamespaces(baseNamespace + ".Services"))
			.AsImplementedInterfaces()
			// We need Transient to be able to call Hubs
			.WithTransientLifetime()
		);

		services.Scan(scan => scan
			.FromAssemblyOf<CoreModule>()
			.AddClasses(classes => classes.InNamespaces(baseNamespace + ".Assemblers"))
			.AsSelf()
			.WithSingletonLifetime());
	}
}