using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;
using SousMarinJaune.Api.Abstractions.Transports.Order.Base;

namespace SousMarinJaune.Api.Abstractions.Models;

[BsonIgnoreExtraElements]
public class OrderEntity : OrderBase
{
	[BsonId]
	[BsonRepresentation(BsonType.ObjectId)]
	public ObjectId Id { get; init; }
}