using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SousMarinJaune.Api.Web.Technical.Swagger.Nullable;

/// <summary>
///     Filtre pour rendre les paramètres requis en fonction de la métadonnée du modèle.
/// </summary>
public class ImplicitRequiredParameterFilter : IParameterFilter
{
	/// <inheritdoc />
	public void Apply(OpenApiParameter parameter, ParameterFilterContext context) =>
		parameter.Required = context.ApiParameterDescription.ModelMetadata?.IsRequired ?? context.ApiParameterDescription.IsRequired;
}
