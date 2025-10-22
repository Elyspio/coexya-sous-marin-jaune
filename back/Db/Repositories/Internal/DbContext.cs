using Microsoft.Extensions.Configuration;
using MongoDB.Bson;
using MongoDB.Bson.Serialization;
using MongoDB.Bson.Serialization.Conventions;
using MongoDB.Driver;
using SousMarinJaune.Api.Db.Configs;

namespace SousMarinJaune.Api.Db.Repositories.Internal;

public class MongoContext
{
	public MongoContext(IConfiguration configuration)
	{
        var connectionString = configuration.GetConnectionString("MongoDb");

		var url = new MongoUrl(connectionString);
		var client = new MongoClient(url);

		Console.WriteLine($"Connecting to Database '{url.DatabaseName}'");

		MongoDatabase = client.GetDatabase(url.DatabaseName ?? "coexya_sous-marin-jaune");

		var pack = new ConventionPack
		{
			new EnumRepresentationConvention(BsonType.String)
		};
		ConventionRegistry.Register("EnumStringConvention", pack, _ => true);
		BsonSerializer.RegisterSerializationProvider(new EnumAsStringSerializationProvider());
	}

	/// <summary>
	///     Récupération de la IMongoDatabase
	/// </summary>
	/// <returns></returns>
	public IMongoDatabase MongoDatabase { get; }
}