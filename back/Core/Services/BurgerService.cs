using SousMarinJaune.Api.Adapters.Custom;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports;

namespace SousMarinJaune.Api.Core.Services;

public class BurgerService : IBurgerService
{
	private readonly BurgerAdapter burgerAdapter;

	public BurgerService(BurgerAdapter burgerAdapter)
	{
		this.burgerAdapter = burgerAdapter;
	}


	public async Task<List<Burger>> GetAll()
	{
		return await burgerAdapter.GetBurgers();
	}
}