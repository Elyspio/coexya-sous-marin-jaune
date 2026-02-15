using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.Db.Repositories;
using SousMarinJaune.Api.Db.Repositories.Internal;

namespace SousMarinJaune.Api.Db.Injections;

public class DatabaseModule : IDotnetModule
{
	public void Load(IServiceCollection services, IConfiguration configuration)
	{
		services.Scan(scan => scan
			.FromAssemblyOf<DatabaseModule>()
			.AddClasses(classes => classes.InNamespaceOf<ConfigRepository>(), false)
			.AsImplementedInterfaces()
			.WithSingletonLifetime()
		);
		
		services.AddHealthChecks().AddMongoDb((sp) => new MongoContext(sp.GetRequiredService<IConfiguration>()).MongoDatabase);
	}
}