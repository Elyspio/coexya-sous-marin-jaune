using Example.Api.Abstractions.Interfaces.Injections;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Example.Api.Core.Injections
{
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
		}
	}
}