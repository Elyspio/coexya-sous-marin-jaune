using MongoDB.Bson;
using SousMarinJaune.Api.Abstractions.Transports.Config;

namespace SousMarinJaune.Api.Abstractions.Models;

public class ConfigEntity : ConfigBase
{
	public ObjectId Id { get; set; }
}