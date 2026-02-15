using Microsoft.AspNetCore.Mvc;
using Microsoft.OpenApi;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SousMarinJaune.Api.Web.Technical.Swagger.Headers;

/// <summary>
///     Filtre pour mettre le content type de la réponse en fonction de l'attribut <see cref="ProducesAttribute" />
/// </summary>
public class ProducesContentTypeFilter : IOperationFilter
{
	/// <inheritdoc />
	public void Apply(OpenApiOperation operation, OperationFilterContext context)
	{
		var textPlainAttributes = context.MethodInfo.GetCustomAttributes(true)
			.OfType<ProducesAttribute>()
			.ToList();

		if (textPlainAttributes.Count <= 0) return;

		var attribute = textPlainAttributes[0];

		foreach (var resp in operation.Responses ?? [])
		{
			if (resp.Value is OpenApiResponse r)
			{
				r.Content = resp.Value.Content!.Where(c => attribute.ContentTypes.Contains(c.Key)).ToDictionary(pair => pair.Key, pair => pair.Value);
			}
		}
	}
}