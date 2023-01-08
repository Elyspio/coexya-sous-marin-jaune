using SousMarinJaune.Api.Abstractions.Transports.Order.Base;
using System.ComponentModel.DataAnnotations;

namespace SousMarinJaune.Api.Abstractions.Transports.Order;

public class Order : OrderBase
{
	[Required] public required Guid Id { get; set; }
}