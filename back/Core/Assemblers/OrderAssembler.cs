using SousMarinJaune.Api.Abstractions.Assemblers;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports;

namespace SousMarinJaune.Api.Core.Assemblers;

public class OrderAssembler : BaseAssembler<Order, OrderEntity>
{
	public override Order Convert(OrderEntity obj)
	{
		return new Order
		{
			Id = obj.Id.AsGuid(),
			Burger = obj.Burger,
			User = obj.User,
			Excluded = obj.Excluded,
			Vegetarian = obj.Vegetarian
		};
	}

	public override OrderEntity Convert(Order obj)
	{
		return new OrderEntity
		{
			Id = obj.Id.AsObjectId(),
			Burger = obj.Burger,
			User = obj.User,
			Excluded = obj.Excluded,
			Vegetarian = obj.Vegetarian
		};
	}
}