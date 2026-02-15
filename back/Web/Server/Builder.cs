using Mapster;
using Microsoft.AspNetCore.Mvc.Formatters;
using MongoDB.Bson;
using Serilog;
using Serilog.Sinks.SystemConsole.Themes;
using SousMarinJaune.Api.Abstractions.Extensions;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.ExternalApi.Injections;
using SousMarinJaune.Api.Core.Injections;
using SousMarinJaune.Api.Db.Injections;
using SousMarinJaune.Api.Web.Filters;
using SousMarinJaune.Api.Web.Utils;
using System.Text.Json.Serialization;
using SousMarinJaune.Api.ServiceDefaults;
using SousMarinJaune.Api.Web.Technical.Extensions;

namespace SousMarinJaune.Api.Web.Server;

public class ServerBuilder
{
	private readonly string _frontPath = Env.Get("FRONT_PATH", "/front");

	public ServerBuilder(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);

		builder.Configuration.AddCommon();
		

		// Setup Logging
		builder.Host.UseSerilog((_, lc) => lc
			.ReadFrom.Configuration(builder.Configuration)
			.WriteTo.OpenTelemetry()
		);

		
		
		builder.Services.AddResponseCompression();
		builder.Services.AddResponseCaching();
		

		builder.Services.AddModule<ExternalApiModule>(builder.Configuration);
		builder.Services.AddModule<CoreModule>(builder.Configuration);
		builder.Services.AddModule<DatabaseModule>(builder.Configuration);

		// Convert Enum to String 
		builder.Services.AddControllers(o =>
				{
					o.Conventions.Add(new ControllerDocumentationConvention());
					o.OutputFormatters.RemoveType<StringOutputFormatter>();
					o.Filters.Add<HttpExceptionFilter>();
				}
			)
			.AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));

		builder.Services.AddVersioning().AddSwaggerVersioning(builder.Configuration);

		builder.AddOidcSupport();
		
		// Setup SPA Serving
		if (builder.Environment.IsProduction()) Console.WriteLine($"Server in production, serving SPA from {_frontPath} folder");

		builder.Services.AddSignalR(options => { options.EnableDetailedErrors = true; })
			.AddJsonProtocol(options =>
				{
					options.PayloadSerializerOptions.IncludeFields = true;
					options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
				}
			);

		TypeAdapterConfig.GlobalSettings.ForType<Guid, ObjectId>().MapWith(id => id.AsObjectId());
		TypeAdapterConfig.GlobalSettings.ForType<ObjectId, Guid>().MapWith(id => id.AsGuid());

		builder.AddDefaultHealthChecks();
		
		Application = builder.Build();
	}

	public WebApplication Application { get; }
}