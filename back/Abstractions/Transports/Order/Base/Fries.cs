﻿namespace SousMarinJaune.Api.Abstractions.Transports.Order.Base;

public class Fries
{
	public required List<SauceWithQuantity> Sauces { get; init; }
}