using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace Example.Api.Abstractions.Models
{
	public class TodoEntity
	{
		[BsonId]
		[BsonRepresentation(BsonType.ObjectId)]
		public ObjectId Id { get; init; }

		public string Label { get; init; } = null!;
		public bool Checked { get; set; }
		public string User { get; init; }
	}
}