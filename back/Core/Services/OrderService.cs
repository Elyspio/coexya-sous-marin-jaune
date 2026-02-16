using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;
using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Core.Assemblers;
using SousMarinJaune.Api.Sockets.Hubs;

namespace SousMarinJaune.Api.Core.Services;

internal class OrderService : IOrderService
{
	private readonly IConfigService _configService;
	private readonly IHubContext<UpdateHub, IUpdateHub> _hubContext;
	private readonly ILogger<OrderService> _logger;
	private readonly OrderAssembler _orderAssembler;
	private readonly IOrderRepository _orderRepository;

	public OrderService(IOrderRepository orderRepository, OrderAssembler orderAssembler, IHubContext<UpdateHub, IUpdateHub> hubContext, ILogger<OrderService> logger,
		IConfigService configService)
	{
		_orderRepository = orderRepository;
		_orderAssembler = orderAssembler;
		_hubContext = hubContext;
		_logger = logger;
		_configService = configService;
	}

	public async Task<List<Order>> GetAll()
	{
		using var logger = _logger.Enter();

		var orders = _orderAssembler.Convert(await _orderRepository.GetAll());
		
		return orders;
	}

	public async Task<List<Order>> GetForUser(string user)
	{
		using var logger = _logger.Enter(Log.Format(user));

		var orders = _orderAssembler.Convert(await _orderRepository.GetForUser(user));
		
		return orders;
	}

	public async Task<Order> Create(string user)
	{
		using var logger = _logger.Enter(Log.Format(user));

		var config = await _configService.Get();

		var entity = await _orderRepository.Create(user, config.PaymentEnabled);

		var data = _orderAssembler.Convert(entity);
		await _hubContext.Clients.All.OrderUpdated(data);

		return data;
	}

	public async Task Delete(Guid orderId)
	{
		using var logger = _logger.Enter(Log.Format(orderId));

		await _orderRepository.Delete(orderId);
		
		await _hubContext.Clients.All.OrderDeleted(orderId);
	}

	public async Task Update(Order order)
	{
		using var logger = _logger.Enter(Log.Format(order.Id));

		await _orderRepository.Update(_orderAssembler.Convert(order));
		await _hubContext.Clients.All.OrderUpdated(order);

	}

	public async Task UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, double value)
	{
		using var logger = _logger.Enter($"{Log.Format(idOrder)} {Log.Format(type)} {Log.Format(value)}");

		var entity = await _orderRepository.UpdateOrderPaymentReceived(idOrder, type, value);

		await _hubContext.Clients.All.OrderUpdated(_orderAssembler.Convert(entity));
	}
}