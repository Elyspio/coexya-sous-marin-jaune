using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Core.Assemblers;

namespace SousMarinJaune.Api.Core.Services;

public class OrderService : IOrderService
{
	private readonly IOrderRepository orderRepository;
	private readonly OrderAssembler orderAssembler;

	public OrderService(IOrderRepository orderRepository, OrderAssembler orderAssembler)
	{
		this.orderRepository = orderRepository;
		this.orderAssembler = orderAssembler;
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
		return orderAssembler.Convert(await orderRepository.Create(userName));
	}

	public async Task AddBurgerRecord(Guid order, BurgerRecord record)
	{
		await orderRepository.AddBurgerRecord(order, record);
	}
	
}