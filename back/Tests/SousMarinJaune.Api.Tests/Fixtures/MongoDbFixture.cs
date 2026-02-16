using MongoDB.Driver;
using Testcontainers.MongoDb;

namespace SousMarinJaune.Api.Tests.Fixtures;

public class MongoDbFixture : IAsyncLifetime
{
	private readonly MongoDbContainer _container = new MongoDbBuilder()
		.WithImage("mongo:7.0")
		.Build();

	public string ConnectionString => _container.GetConnectionString();

	public async Task InitializeAsync()
	{
		await _container.StartAsync();
	}

	public async Task DisposeAsync()
	{
		await _container.DisposeAsync();
	}

	public async Task ClearDatabaseAsync()
	{
		// Build connection string with authSource for the admin database
		var baseConnectionString = ConnectionString;
		string connectionStringWithDb;
		
		var queryIndex = baseConnectionString.IndexOf('?');
		if (queryIndex > 0)
		{
			var baseUrl = baseConnectionString.Substring(0, queryIndex).TrimEnd('/');
			var queryString = baseConnectionString.Substring(queryIndex);
			connectionStringWithDb = $"{baseUrl}/test_db{queryString}&authSource=admin";
		}
		else
		{
			connectionStringWithDb = $"{baseConnectionString.TrimEnd('/')}/test_db?authSource=admin";
		}
		
		var client = new MongoClient(connectionStringWithDb);
		var database = client.GetDatabase("test_db");
		
		var collections = await database.ListCollectionNamesAsync();
		await collections.ForEachAsync(async name =>
		{
			await database.DropCollectionAsync(name);
		});
	}
}

[CollectionDefinition("MongoDB")]
public class MongoDbCollection : ICollectionFixture<MongoDbFixture>
{
}
