using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Core.Services;

public class OrderService : IOrderService
{
	private readonly ILogger<OrderService> _logger;
	private readonly IHubContext<UpdateHub, IUpdateHub> hubContext;
	private readonly OrderAssembler orderAssembler;
	private readonly IOrderRepository orderRepository;

	public OrderService(IOrderRepository orderRepository, OrderAssembler orderAssembler, IHubContext<UpdateHub, IUpdateHub> hubContext, ILogger<OrderService> logger)
	{
		this.orderRepository = orderRepository;
		this.orderAssembler = orderAssembler;
		this.hubContext = hubContext;
		_logger = logger;
	}

	public async Task<List<Order>> GetAll()
	{
		var logger = _logger.Enter();

		var orders = orderAssembler.Convert(await orderRepository.GetAll());

		logger.Exit();
		return orders;
	}

	public async Task<List<Order>> GetForUser(string user)
	{
		var logger = _logger.Enter(Log.Format(user));

		var orders = orderAssembler.Convert(await orderRepository.GetForUser(user));

		logger.Exit();

		return orders;
	}

	public async Task<Order> Create(string user)
	{
		var logger = _logger.Enter(Log.Format(user));

		var data = orderAssembler.Convert(await orderRepository.Create(user));
		await hubContext.Clients.All.OrderUpdated(data);

		logger.Exit();

		return data;
	}

	public async Task Delete(Guid orderId)
	{
		var logger = _logger.Enter(Log.Format(orderId));

		await orderRepository.Delete(orderId);
		await hubContext.Clients.All.OrderDeleted(orderId);

		logger.Exit();
	}

	public async Task Update(Order order)
	{
		var logger = _logger.Enter(Log.Format(order.Id));

		await orderRepository.Update(orderAssembler.Convert(order));
		await hubContext.Clients.All.OrderUpdated(order);

		logger.Exit();
	}
}