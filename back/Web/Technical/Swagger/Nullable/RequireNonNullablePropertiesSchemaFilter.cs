using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SousMarinJaune.Api.Web.Technical.Swagger.Nullable;

/// <summary>
///     Rend toutes les propriétés non-nullables requises dans le schéma OpenAPI.
/// </summary>
public class RequireNonNullablePropertiesSchemaFilter : ISchemaFilter
{
	/// <inheritdoc />
	public void Apply(OpenApiSchema model, SchemaFilterContext context)
	{
		var additionalRequiredProps = model.Properties
			.Where(x => !x.Value.Nullable && !model.Required.Contains(x.Key))
			.Select(x => x.Key);
		foreach (var propKey in additionalRequiredProps)
		{
			model.Required.Add(propKey);
		}
	}
}
