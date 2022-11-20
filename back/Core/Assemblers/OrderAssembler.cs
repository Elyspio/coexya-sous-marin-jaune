using SousMarinJaune.Api.Abstractions.Assemblers;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Order;

namespace SousMarinJaune.Api.Core.Assemblers;

public class OrderAssembler : BaseAssembler<Order, OrderEntity>
{
	public override Order Convert(OrderEntity obj)
	{
		return new Order
		{
			Id = obj.Id.AsGuid(),
			User = obj.User,
			Burgers = obj.Burgers,
			Date = obj.Date
		};
	}

	public override OrderEntity Convert(Order obj)
	{
		return new OrderEntity
		{
			Id = obj.Id.AsObjectId(),
			User = obj.User,
			Burgers = obj.Burgers,
			Date = obj.Date
		};
	}
}