using SousMarinJaune.Api.Abstractions.Models;
using SousMarinJaune.Api.Abstractions.Transports.Config;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Repositories;

public interface IConfigRepository
{
	Task<ConfigEntity> Update(ConfigBase config);

	Task<ConfigEntity?> Get();
}