using Elyspio.Utils.Results;
using Elyspio.Utils.Telemetry;
using Microsoft.AspNetCore.SignalR;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.Abstractions.Errors;
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
		using var trace = _logger.Trace();

		var orders = _orderAssembler.Convert(await _orderRepository.GetAll());
		
		return orders;
	}

	public async Task<List<Order>> GetForUser(string user)
	{
		using var trace = _logger.Trace($"{Log.F(user)}");

		var orders = _orderAssembler.Convert(await _orderRepository.GetForUser(user));
		
		return orders;
	}

	public async Task<Result<Order>> Create(string user, bool acceptDefer = false)
	{
		using var trace = _logger.Trace($"{Log.F(user)}");

		var now = DateTime.Now;
		var deferred = OrderDateHelper.IsDeferred(now);
		if (deferred && !acceptDefer)
			return trace.Fail(new OrderDeferralRequired());

		var date = OrderDateHelper.ComputeOrderDate(now);

		var config = await _configService.Get();

		var entity = await _orderRepository.Create(user, config.PaymentEnabled, date);

		var data = _orderAssembler.Convert(entity);
		await _hubContext.Clients.All.OrderUpdated(data);

		return data;
	}

	public OrderCreationInfo GetCreationInfo()
	{
		var now = DateTime.Now;
		return new OrderCreationInfo
		{
			Deferred = OrderDateHelper.IsDeferred(now),
			PlannedDate = OrderDateHelper.ComputeOrderDate(now)
		};
	}

	public async Task Delete(Guid orderId)
	{
		using var trace = _logger.Trace($"{Log.F(orderId)}");

		await _orderRepository.Delete(orderId);
		
		await _hubContext.Clients.All.OrderDeleted(orderId);
	}

	public async Task Update(Order order)
	{
		using var trace = _logger.Trace($"{Log.F(order.Id)}");

		await _orderRepository.Update(_orderAssembler.Convert(order));
		await _hubContext.Clients.All.OrderUpdated(order);

	}

	public async Task UpdateOrderPaymentReceived(Guid idOrder, OrderPaymentType type, double value)
	{
		using var trace = _logger.Trace($"{Log.F(idOrder)} {Log.F(type)} {Log.F(value)}");

		var entity = await _orderRepository.UpdateOrderPaymentReceived(idOrder, type, value);

		await _hubContext.Clients.All.OrderUpdated(_orderAssembler.Convert(entity));
	}
}