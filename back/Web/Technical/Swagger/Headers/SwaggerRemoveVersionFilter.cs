using Microsoft.OpenApi.Models;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SousMarinJaune.Api.Web.Technical.Swagger.Headers;

/// <summary>
///     Supprime le parametre "api-version" qui est automatiquement ajouter par le framework
/// </summary>
public class SwaggerRemoveVersionFilter : IOperationFilter
{
	/// <summary>
	///     Ajout dans la documentation Swagger le header x-token-claims-idTechPs
	/// </summary>
	/// <param name="operation"></param>
	/// <param name="context"></param>
	public void Apply(OpenApiOperation operation, OperationFilterContext context)
	{
		operation.Parameters ??= new List<OpenApiParameter>();

		var apiVersionParameter = operation.Parameters.FirstOrDefault(p => p.Name == "api-version");
		if (apiVersionParameter is not null) operation.Parameters.Remove(apiVersionParameter);
	}
}
