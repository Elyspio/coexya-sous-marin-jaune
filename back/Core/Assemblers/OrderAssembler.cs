using Mapster;
using SousMarinJaune.Api.Abstractions.Assemblers;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Order;

namespace SousMarinJaune.Api.Core.Assemblers;

public class OrderAssembler : BaseAssembler<Order, OrderEntity>
{
	public override Order Convert(OrderEntity obj)
	{
		return obj.Adapt<Order>();
	}

	public override OrderEntity Convert(Order obj)
	{
		return obj.Adapt<OrderEntity>();
	}
}