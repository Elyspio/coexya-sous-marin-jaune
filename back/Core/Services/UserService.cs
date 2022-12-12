using SousMarinJaune.Api.Abstractions.Interfaces.Repositories;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;

namespace SousMarinJaune.Api.Core.Services;

public class UserService : IUserService
{
	private readonly IOrderRepository _orderRepository;

	public UserService(IOrderRepository orderRepository)
	{
		_orderRepository = orderRepository;
	}

	public async Task MergeUsers(string newName, List<string> users)
	{
		await _orderRepository.MergeUsers(newName, users);
	}
}