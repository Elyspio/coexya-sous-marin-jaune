﻿using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;

namespace SousMarinJaune.Api.Abstractions.Transports.Order.Base;

public class OrderBase
{
	public required List<BurgerRecord> Burgers { get; init; }
	public required string User { get; set; }
	public required DateTime Date { get; init; }
	public required bool Student { get; init; }
	public Drink? Drink { get; init; }
	public Fries? Fries { get; init; }
	public Dessert? Dessert { get; init; }

	public required List<OrderPayment> Payments { get; init; }

	public bool PaymentEnabled { get; set; }


	public double Price
	{
		get
		{
			if (Burgers.Count == 0) return 0;


			double sum = 0;

			if (Student)
			{
				sum += 11;
			}
			else
			{
				var menu = 8.5;

				if (Drink != null) menu += 2;

				if (Fries != null) menu += 3.5;

				if (Drink != null && Fries != null) menu = 12.5; // promotion du meny

				sum += menu;
			}

			if (Burgers[0].Xl) sum += 5;


			if (Dessert != null) sum += 3;


			foreach (var burger in Burgers.Skip(1))
			{
				sum += 8.5;
				if (burger.Xl) sum += 5;
			}


			return sum;
		}
	}
}