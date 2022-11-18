using SousMarinJaune.Api.Abstractions.Models;

namespace SousMarinJaune.Api.Abstractions.Transports;

public class Order : OrderBase
{
	public required Guid Id { get; set; }
}