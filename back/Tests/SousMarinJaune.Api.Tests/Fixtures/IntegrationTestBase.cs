using Mapster;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using MongoDB.Bson;
using NSubstitute;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.Core.Injections;
using SousMarinJaune.Api.Db.Injections;
using SousMarinJaune.Api.ExternalApi.Injections;
using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Tests.Fixtures;

[Collection("MongoDB")]
public abstract class IntegrationTestBase : IAsyncLifetime
{
	protected readonly MongoDbFixture MongoDbFixture;
	protected IServiceProvider ServiceProvider { get; private set; } = null!;
	protected IHubContext<UpdateHub, IUpdateHub> HubContext { get; private set; } = null!;
	protected IUpdateHub HubClients { get; private set; } = null!;

	protected IntegrationTestBase(MongoDbFixture mongoDbFixture)
	{
		MongoDbFixture = mongoDbFixture;
	}

	public async Task InitializeAsync()
	{
		await MongoDbFixture.ClearDatabaseAsync();
		ServiceProvider = BuildServiceProvider();
	}

	public Task DisposeAsync()
	{
		return Task.CompletedTask;
	}

	private IServiceProvider BuildServiceProvider()
	{
		var services = new ServiceCollection();

		// Configuration with MongoDB connection string
		// Testcontainers returns: mongodb://user:pass@host:port/?directConnection=true
		// We need to insert the database name before the query string
		var baseConnectionString = $"{MongoDbFixture.ConnectionString}&authMechanism=SCRAM-SHA-256&authSource=admin"; // Ensure we use the correct auth mechanism
		string connectionString;
		
		var queryIndex = baseConnectionString.IndexOf('?');
		if (queryIndex > 0)
		{
			var baseUrl = baseConnectionString.Substring(0, queryIndex).TrimEnd('/');
			var queryString = baseConnectionString.Substring(queryIndex);
			connectionString = $"{baseUrl}/test_db{queryString}";
		}
		else
		{
			connectionString = $"{baseConnectionString.TrimEnd('/')}/test_db";
		}
		

		var configuration = new ConfigurationBuilder()
			.AddInMemoryCollection(new Dictionary<string, string?>
			{
				["ConnectionStrings:MongoDb"] = connectionString
			})
			.Build();

		services.AddSingleton<IConfiguration>(configuration);

		// Logging
		services.AddLogging(builder => builder.AddConsole().SetMinimumLevel(LogLevel.Debug));

		// Register modules (same as Web project)
		services.AddModule<ExternalApiModule>(configuration);
		services.AddModule<CoreModule>(configuration);
		services.AddModule<DatabaseModule>(configuration);

		// Mock SignalR Hub Context
		HubClients = Substitute.For<IUpdateHub>();
		HubContext = Substitute.For<IHubContext<UpdateHub, IUpdateHub>>();
		var hubClients = Substitute.For<IHubClients<IUpdateHub>>();
		hubClients.All.Returns(HubClients);
		HubContext.Clients.Returns(hubClients);
		services.AddSingleton(HubContext);


		return services.BuildServiceProvider();
	}

	protected T GetService<T>() where T : notnull => ServiceProvider.GetRequiredService<T>();
}

