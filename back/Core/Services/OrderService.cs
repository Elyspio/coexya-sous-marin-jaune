using Microsoft.AspNetCore.SignalR;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Core.Services;

public class OrderService : IOrderService
{
	private readonly IHubContext<UpdateHub, IUpdateHub> hubContext;
	private readonly OrderAssembler orderAssembler;
	private readonly IOrderRepository orderRepository;

	public OrderService(IOrderRepository orderRepository, OrderAssembler orderAssembler, IHubContext<UpdateHub, IUpdateHub> hubContext)
	{
		this.orderRepository = orderRepository;
		this.orderAssembler = orderAssembler;
		this.hubContext = hubContext;
	}

	public async Task<List<Order>> GetAll()
	{
		return orderAssembler.Convert(await orderRepository.GetAll());
	}

	public async Task<List<Order>> GetForUser(string user)
	{
		return orderAssembler.Convert(await orderRepository.GetForUser(user));
	}

	public async Task<Order> Create(string userName)
	{
		var data = orderAssembler.Convert(await orderRepository.Create(userName));
		await hubContext.Clients.All.OrderUpdated(data);
		return data;
	}

	public async Task Delete(Guid orderId)
	{
		await orderRepository.Delete(orderId);
		await hubContext.Clients.All.OrderDeleted(orderId);
	}

	public async Task Update(Order order)
	{
		await orderRepository.Update(orderAssembler.Convert(order));
		await hubContext.Clients.All.OrderUpdated(order);
	}
}