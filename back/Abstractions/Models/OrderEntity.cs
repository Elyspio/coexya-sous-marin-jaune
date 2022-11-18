using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace SousMarinJaune.Api.Abstractions.Models;

public class OrderEntity : OrderBase
{
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	public ObjectId Id { get; init; }
}