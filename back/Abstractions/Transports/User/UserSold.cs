namespace SousMarinJaune.Api.Abstractions.Transports.User;

public class UserSold
{
	public required string Name { get; set; }
	public required double Sold { get; init; }
}