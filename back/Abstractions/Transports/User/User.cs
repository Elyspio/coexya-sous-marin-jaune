using System.ComponentModel.DataAnnotations;

namespace SousMarinJaune.Api.Abstractions.Transports.User;

public class User : UserBase
{
	[Required]
	public required Guid Id { get; set; }
}