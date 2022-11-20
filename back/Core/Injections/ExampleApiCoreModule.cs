using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;

namespace SousMarinJaune.Api.Core.Injections;

public class ExampleApiCoreModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		var nsp = typeof(ExampleApiCoreModule).Namespace!;
		var baseNamespace = nsp[..nsp.LastIndexOf(".")];
		services.Scan(scan => scan
			.FromAssemblyOf<ExampleApiCoreModule>()
			.AddClasses(classes => classes.InNamespaces(baseNamespace + ".Services"))
			.AsImplementedInterfaces()
			.WithSingletonLifetime()
		);

		services.Scan(scan => scan
			.FromAssemblyOf<ExampleApiCoreModule>()
			.AddClasses(classes => classes.InNamespaces(baseNamespace + ".Assemblers"))
			.AsSelf()
			.WithSingletonLifetime());
	}
}