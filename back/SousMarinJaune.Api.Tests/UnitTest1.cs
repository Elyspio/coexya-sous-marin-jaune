using Shouldly;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Base;

namespace SousMarinJaune.Api.Tests;

public class PriceTests
{
	[Fact]
	public void Order_Price_Menu()
	{
		var order = new Order
		{
			Id = Guid.Empty,
			Burgers =
			[
				new BurgerRecord
				{
					Name = "null",
					Excluded = [],
					Vegetarian = false
				}
			],
			Drink = Drink.Coca,
			Fries = new Fries { Sauces = [] },
			User = "",
			Date = default,
			Student = false,
			Payments = []
		};


		order.Price.ShouldBe(12.5);
	}

	[Fact]
	public void Order_Price_Menu_Without_Drink()
	{
		var order = new Order
		{
			Id = Guid.Empty,
			Burgers =
			[
				new BurgerRecord
				{
					Name = "null",
					Excluded = [],
					Vegetarian = false
				}
			],
			Fries = new Fries { Sauces = [] },
			User = "",
			Date = default,
			Student = false,
			Payments = []
		};


		order.Price.ShouldBe(12);
	}
	[Fact]
	public void Order_Price_Single_Burger()
	{
		var order = new Order
		{
			Id = Guid.Empty,
			Burgers =
			[
				new BurgerRecord
				{
					Name = "null",
					Excluded = [],
					Vegetarian = false
				}
			],
			User = "",
			Date = default,
			Student = false,
			Payments = []
		};


		order.Price.ShouldBe(8.5);
	}	[Fact]
	public void Order_Price_Two_Burgers()
	{
		var order = new Order
		{
			Id = Guid.Empty,
			Burgers =
			[
				new BurgerRecord
				{
					Name = "null",
					Excluded = [],
					Vegetarian = false
				},	new BurgerRecord
				{
					Name = "null",
					Excluded = [],
					Vegetarian = false
				},
			],
			User = "",
			Date = default,
			Student = false,
			Payments = []
		};


		order.Price.ShouldBe(8.5 * 2);
	}
}