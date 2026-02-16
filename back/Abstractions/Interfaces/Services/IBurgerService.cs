using SousMarinJaune.Api.Abstractions.Transports;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Services;

public interface IBurgerService
{
	Task<List<Burger>> GetAll(CancellationToken ct);
}