using SousMarinJaune.Api.Abstractions.Transports.Config;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Services;

public interface IConfigService
{
	Task<Config> Update(ConfigBase config);

	Task<Config> Get();
}