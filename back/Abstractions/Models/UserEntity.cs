using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SousMarinJaune.Api.Abstractions.Transports.User;

namespace SousMarinJaune.Api.Abstractions.Models;

public class UserEntity : UserBase
{
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	public ObjectId Id { get; init; }
}