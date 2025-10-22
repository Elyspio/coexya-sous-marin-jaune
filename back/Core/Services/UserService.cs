using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Abstractions.Transports.User;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;
using System.Collections.Concurrent;

namespace SousMarinJaune.Api.Core.Services;

internal class UserService : IUserService
{
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext;
	private readonly ILogger<UserService> _logger;
	private readonly OrderAssembler _orderAssembler;
	private readonly IOrderRepository _orderRepository;

	public UserService(IOrderRepository orderRepository, IHubContext<UpdateHub, IUpdateHub> hubContext, OrderAssembler orderAssembler, ILogger<UserService> logger)
	{
		_orderRepository = orderRepository;
		_hubContext = hubContext;
		_orderAssembler = orderAssembler;
		_logger = logger;
	}

	public async Task MergeUsers(string newName, List<string> users)
	{
		using var logger = _logger.Enter($"{Log.Format(newName)} {Log.Format(users)}");

		var entities = await _orderRepository.MergeUsers(newName, users);

		var orders = _orderAssembler.Convert(entities);

		await Task.WhenAll(orders.Select(_hubContext.Clients.All.OrderUpdated));

	}

	public async Task<List<UserSold>> GetUsers()
	{
		using var logger = _logger.Enter();

		var orders = await _orderRepository.GetAll();
		var grouped = orders.GroupBy(order => order.User).ToDictionary(pair => pair.Key, pair => pair.ToList());
		var users = new ConcurrentBag<UserSold>();

		Parallel.ForEach(grouped, (pair, _) =>
		{
			var total = pair.Value.Where(order => order.PaymentEnabled).Sum(order => order.Price);
			var payments = pair.Value.Where(order => order.PaymentEnabled).Sum(order => order.Payments.Sum(p => p.Received ?? 0));
			users.Add(new()
			{
				Name = pair.Key,
				Sold = Math.Round(payments - total, 3)
			});
		});


		return users.ToList();
	}

	public async Task SoldUser(string user)
	{
		using var logger = _logger.Enter(Log.Format(user));

		var orders = await _orderRepository.GetForUser(user);
		var prices = orders.Where(order => order.PaymentEnabled).Sum(order => order.Price);
		var payments = orders.Where(order => order.PaymentEnabled).Sum(order => order.Payments.Sum(p => p.Amount));
		var delta = payments - prices;

		// Only if some money is missing
		if (delta < 0)
		{
			var lastOrder = orders.Last();
			lastOrder.Payments.Add(new()
			{
				Amount = -delta,
				Received = -delta,
				Type = OrderPaymentType.Admin
			});

			await _orderRepository.Update(lastOrder);
		}

	}

	public async Task SoldAllUsers()
	{
		using var logger = _logger.Enter();

		var users = (await _orderRepository.GetAll()).Select(order => order.User).Distinct();
		await Task.WhenAll(users.Select(SoldUser));

	}
}