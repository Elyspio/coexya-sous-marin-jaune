using System.ComponentModel.DataAnnotations;

namespace SousMarinJaune.Api.Abstractions.Transports.User;

public class User 
{
	public required string  Name { get; set; }
	public required double Sold { get; set; }

}