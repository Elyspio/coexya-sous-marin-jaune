using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Core.Services;

public class OrderService : IOrderService
{
	private readonly ILogger<OrderService> _logger;
	private readonly OrderAssembler _orderAssembler;
	private readonly IOrderRepository _orderRepository;
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext;

	public OrderService(IOrderRepository orderRepository, OrderAssembler orderAssembler, IHubContext<UpdateHub, IUpdateHub> hubContext, ILogger<OrderService> logger)
	{
		_orderRepository = orderRepository;
		_orderAssembler = orderAssembler;
		this._hubContext = hubContext;
		_logger = logger;
	}

	public async Task<List<Order>> GetAll()
	{
		var logger = _logger.Enter();

		var orders = _orderAssembler.Convert(await _orderRepository.GetAll());

		logger.Exit();
		return orders;
	}

	public async Task<List<Order>> GetForUser(string user)
	{
		var logger = _logger.Enter(Log.Format(user));

		var orders = _orderAssembler.Convert(await _orderRepository.GetForUser(user));

		logger.Exit();

		return orders;
	}

	public async Task<Order> Create(string user)
	{
		var logger = _logger.Enter(Log.Format(user));

		var data = _orderAssembler.Convert(await _orderRepository.Create(user));
		await _hubContext.Clients.All.OrderUpdated(data);

		logger.Exit();

		return data;
	}

	public async Task Delete(Guid orderId)
	{
		var logger = _logger.Enter(Log.Format(orderId));

		await _orderRepository.Delete(orderId);
		await _hubContext.Clients.All.OrderDeleted(orderId);

		logger.Exit();
	}

	public async Task Update(Order order)
	{
		var logger = _logger.Enter(Log.Format(order.Id));

		await _orderRepository.Update(_orderAssembler.Convert(order));
		await _hubContext.Clients.All.OrderUpdated(order);

		logger.Exit();
	}

	public async Task UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, double value)
	{
		var logger = _logger.Enter($"{Log.Format(idOrder)} {Log.Format(type)} {Log.Format(value)}");

		var entity = await _orderRepository.UpdateOrderPaymentReceived(idOrder, type, value);

		await _hubContext.Clients.All.OrderUpdated(_orderAssembler.Convert(entity));

		logger.Exit();
	}
}