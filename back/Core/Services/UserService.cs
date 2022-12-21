using Microsoft.AspNetCore.SignalR;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Abstractions.Transports.User;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;
using System.Collections.Concurrent;

namespace SousMarinJaune.Api.Core.Services;

public class UserService : IUserService
{
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext;
	private readonly OrderAssembler _orderAssembler;
	private readonly IOrderRepository _orderRepository;

	public UserService(IOrderRepository orderRepository, IHubContext<UpdateHub, IUpdateHub> hubContext, OrderAssembler orderAssembler)
	{
		_orderRepository = orderRepository;
		_hubContext = hubContext;
		_orderAssembler = orderAssembler;
	}

	public async Task MergeUsers(string newName, List<string> users)
	{
		var entities = await _orderRepository.MergeUsers(newName, users);

		var orders = _orderAssembler.Convert(entities);

		await Task.WhenAll(orders.Select(_hubContext.Clients.All.OrderUpdated));
	}

	public async Task<List<User>> GetUsers()
	{
		var orders = await _orderRepository.GetAll();
		var grouped = orders.GroupBy(order => order.User).ToDictionary(pair => pair.Key, pair => pair.ToList());
		var users = new ConcurrentBag<User>();

		Parallel.ForEach(grouped, (pair, _) =>
		{
			var prices = pair.Value.Sum(order => order.Price);
			var payments = pair.Value.Sum(order => order.Payments.Sum(p => p.Amount));
			users.Add(new()
			{
				Name = pair.Key,
				Sold = payments - prices
			});
		});

		return users.ToList();
	}

	public async Task SoldUser(string user)
	{
		var orders = await _orderRepository.GetForUser(user);
		var prices = orders.Sum(order => order.Price);
		var payments = orders.Sum(order => order.Payments.Sum(p => p.Amount));
		var delta = payments - prices;

		// Only if some money is missing
		if (delta < 0)
		{
			var lastOrder = orders.Last();
			lastOrder.Payments.Add(new OrderPayment
			{
				Amount = -delta,
				Received = -delta,
				Type = OrderPaymentType.Admin
			});

			await _orderRepository.Update(lastOrder);
		}
	}
}