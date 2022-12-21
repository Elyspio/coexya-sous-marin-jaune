using System.ComponentModel.DataAnnotations;

namespace SousMarinJaune.Api.Abstractions.Transports.Config;

public class Config : ConfigBase
{
	[Required] public Guid Id { get; set; }
}