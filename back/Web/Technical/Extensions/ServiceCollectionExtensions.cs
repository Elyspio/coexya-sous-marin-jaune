using Asp.Versioning;
using Microsoft.OpenApi;
using SousMarinJaune.Api.Abstractions.Configurations;
using SousMarinJaune.Api.Web.Technical.Swagger.Headers;
using SousMarinJaune.Api.Web.Technical.Versioning.Options;
using Swashbuckle.AspNetCore.SwaggerGen;

namespace SousMarinJaune.Api.Web.Technical.Extensions;

/// <summary>
///     ServiceCollectionExtensions
/// </summary>
public static class ServiceCollectionExtensions
{
	#region Versioning

	/// <summary>
	///     Active le versioning au niveau de dotnet (controllers, etc.)
	/// </summary>
	/// <param name="services"></param>
	/// <returns></returns>
	public static IServiceCollection AddVersioning(this IServiceCollection services)
	{
		services.AddApiVersioning(setup =>
		{
			setup.DefaultApiVersion = new ApiVersion(1, 0);
			setup.AssumeDefaultVersionWhenUnspecified = true;
			setup.ReportApiVersions = true;
		}).AddApiExplorer(setup =>
		{
			// add the versioned api explorer, which also adds IApiVersionDescriptionProvider service
			// note: the specified format code will format the version as "'v'major[.minor][-status]"
			setup.GroupNameFormat = "'v'VVV";
			// note: this option is only necessary when versioning by url segment. the SubstitutionFormat
			// can also be used to control the format of the API version in route templates
			setup.SubstituteApiVersionInUrl = true;
		});

		return services;
	}


	/// <summary>
	///     Active le versionning dans la génération de la documentation Swagger
	/// </summary>
	/// <param name="services"></param>
	/// <param name="configuration"></param>
	/// <returns></returns>
	public static IServiceCollection AddSwaggerVersioning(this IServiceCollection services, IConfiguration configuration)
	{
		// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
		services.AddEndpointsApiExplorer();

		// Setup ConfigureSwaggerOptions
		services.ConfigureOptions<ConfigureSwaggerOptions>();

		services.AddSwaggerGen(options =>
		{
			options.OperationFilter<SwaggerRemoveVersionFilter>();
			options.OperationFilter<ProducesContentTypeFilter>();

			options.SupportNonNullableReferenceTypes();
			options.UseAllOfToExtendReferenceSchemas();
			options.UseAllOfForInheritance();
			options.UseOneOfForPolymorphism();

			options.DescribeAllParametersInCamelCase();

			options.CustomOperationIds(e => $"{e.GroupName!}_{e.ActionDescriptor.RouteValues["controller"]}_{e.ActionDescriptor.RouteValues["action"]}");

			var xmlFiles = Directory.GetFiles(AppContext.BaseDirectory, "*.xml");
			foreach (var file in xmlFiles)
			{
				options.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, file));
			}

			SetupAuthorization(options, configuration.GetRequiredSection(OidcConfiguration.Section).Get<OidcConfiguration>()!);
		});

		return services;
	}

	/// <summary>
	///     Ajoutes les informations liées à l'authentification dans la documentation swagger
	/// </summary>
	/// <param name="options"></param>
	/// <param name="oidcConfiguration"></param>
	private static void SetupAuthorization(SwaggerGenOptions options, OidcConfiguration oidcConfiguration)
	{
		options.AddSecurityDefinition("bearer", new OpenApiSecurityScheme
		{
			In = ParameterLocation.Header,
			Description = "Veuillez entrer JWT valide (sans le BEARER).",
			Name = "Authorization",
			Type = SecuritySchemeType.Http,
			BearerFormat = "JWT",
			Scheme = "bearer"
		});


		options.AddSecurityRequirement(
			doc => new OpenApiSecurityRequirement
			{
				{
					new OpenApiSecuritySchemeReference("bearer", doc)
					{
						Reference = new OpenApiReferenceWithDescription()
						{
							Type = ReferenceType.SecurityScheme,
							Id = "Bearer"
						}
					},
					[]
				}
			}
		);
	}

	#endregion
}