using Asp.Versioning.ApiExplorer;
using Microsoft.Extensions.Options;
using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SousMarinJaune.Api.Web.Technical.Versioning.Options;

/// <summary>
///     ConfigureSwaggerOptions
/// </summary>
public class ConfigureSwaggerOptions : IConfigureNamedOptions<SwaggerGenOptions>
{
	private readonly IApiVersionDescriptionProvider provider;

	/// <summary>
	///     Constructor
	/// </summary>
	/// <param name="provider"></param>
	/// <param name="configuration"></param>
	public ConfigureSwaggerOptions(IApiVersionDescriptionProvider provider, IConfiguration configuration)
	{
		this.provider = provider;
	}

	/// <summary>
	///     Configure
	/// </summary>
	/// <param name="options"></param>
	public void Configure(SwaggerGenOptions options)
	{
		// add swagger document for every API version discovered
		foreach (var description in provider.ApiVersionDescriptions)
		{
			options.SwaggerDoc(description.GroupName, CreateInfoForApiVersion(description));
		}
	}

	/// <summary>
	///     Configure
	/// </summary>
	/// <param name="name"></param>
	/// <param name="options"></param>
	public void Configure(string? name, SwaggerGenOptions options) => Configure(options);

	private OpenApiInfo CreateInfoForApiVersion(ApiVersionDescription description)
	{
		var info = new OpenApiInfo
		{
			Title = "SousMarinJaune.Api",
			Version = description.ApiVersion.ToString()
		};

		if (description.IsDeprecated) info.Description += " This API version has been deprecated.";

		return info;
	}
}
