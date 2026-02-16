using Mapster;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using MongoDB.Bson;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Core.Checks;
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
		
		// Health checks for core services
		services.AddHealthChecks()
			.AddCheck<ConfigServiceHealthcheck>("config-service")
			.AddCheck<OrderServiceHealthcheck>("order-service")
			.AddCheck<BurgerServiceHealthcheck>("burger-service");
		
		TypeAdapterConfig.GlobalSettings.ForType<Guid, ObjectId>().MapWith(id => id.AsObjectId());
		TypeAdapterConfig.GlobalSettings.ForType<ObjectId, Guid>().MapWith(id => id.AsGuid());
	}
}