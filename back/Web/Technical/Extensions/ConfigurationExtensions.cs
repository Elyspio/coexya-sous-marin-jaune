namespace SousMarinJaune.Api.Web.Technical.Extensions;

public static class ConfigurationExtensions
{
	extension(IConfigurationBuilder configuration)
	{
		public IConfigurationBuilder AddCommon()
		{
			configuration.AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
				.AddJsonFile("appsettings.dockerhost.json", optional: true, reloadOnChange: true)
				.AddEnvironmentVariables();

			return configuration;
		}
	}
}