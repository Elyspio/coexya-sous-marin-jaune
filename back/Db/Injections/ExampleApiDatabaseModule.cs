using Example.Api.Abstractions.Interfaces.Injections;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace Example.Api.Db.Injections
{
	public class ExampleApiDatabaseModule : IDotnetModule
	{
		public void Load(IServiceCollection services, IConfiguration configuration)
		{
			var nsp = typeof(ExampleApiDatabaseModule).Namespace!;
			var baseNamespace = nsp[..nsp.LastIndexOf(".")];
			services.Scan(scan => scan
				.FromAssemblyOf<ExampleApiDatabaseModule>()
				.AddClasses(classes => classes.InNamespaces(baseNamespace + ".Repositories"))
				.AsImplementedInterfaces()
				.WithSingletonLifetime()
			);
		}
	}
}