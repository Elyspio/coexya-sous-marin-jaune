using Microsoft.AspNetCore.SignalR;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;

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

	public async Task<double> GetUserBalance(string user)
	{
		var orders = await _orderRepository.GetForUser(user);
		return orders.Sum(order => order.Price);
	}
}