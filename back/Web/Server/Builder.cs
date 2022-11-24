using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using Newtonsoft.Json.Converters;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Abstractions.Interfaces.Injections;
using SousMarinJaune.Api.Adapters.Injections;
using SousMarinJaune.Api.Core.Injections;
using SousMarinJaune.Api.Db.Injections;
using SousMarinJaune.Api.Web.Filters;
using SousMarinJaune.Api.Web.Processors;
using SousMarinJaune.Api.Web.Utils;
using System.Net;
using System.Text.Json.Serialization;

namespace SousMarinJaune.Api.Web.Server;

public class ServerBuilder
{
	private readonly string appPath = "/example";
	private readonly string frontPath = Env.Get("FRONT_PATH", "/front");

	public ServerBuilder(string[] args)
	{
		var builder = WebApplication.CreateBuilder(args);
		builder.WebHost.ConfigureKestrel((_, options) =>
			{
				options.Listen(IPAddress.Any, 4000, listenOptions =>
					{
						// Use HTTP/3
						listenOptions.Protocols = HttpProtocols.Http1AndHttp2;
					}
				);
			}
		);


		// Setup CORS
		builder.Services.AddCors(options =>
			{
				options.AddPolicy("Cors", b =>
					{
						b.WithOrigins("http://localhost:3000");
						b.AllowAnyHeader();
						b.AllowAnyMethod();
						b.AllowCredentials();
					}
				);

				options.DefaultPolicyName = "Cors";
			}
		);


		builder.Services.AddModule<AdapterModule>(builder.Configuration);
		builder.Services.AddModule<CoreModule>(builder.Configuration);
		builder.Services.AddModule<DatabaseModule>(builder.Configuration);

		// Setup Logging
		builder.Host.UseSerilog((_, lc) => lc
			.Enrich.FromLogContext()
			.Enrich.With(new CallerEnricher())
			.WriteTo.Console(LogEventLevel.Debug, "[{Timestamp:HH:mm:ss} {Level}{Caller}] {Message:lj}{NewLine}{Exception}", theme: AnsiConsoleTheme.Code)
		);

		// Convert Enum to String 
		builder.Services.AddControllers(o =>
				{
					o.Conventions.Add(new ControllerDocumentationConvention());
					o.OutputFormatters.RemoveType<StringOutputFormatter>();
				}
			)
			.AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()))
			.AddNewtonsoftJson(x => x.SerializerSettings.Converters.Add(new StringEnumConverter()));

		// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
		builder.Services.AddEndpointsApiExplorer();
		builder.Services.AddOpenApiDocument(document =>
		{
			document.DocumentName = "SousMarinJaune.Api";
			document.Title = "SousMarinJaune.Api";
			document.SchemaProcessors.Add(new NullableSchemaProcessor());
			document.OperationProcessors.Add(new NullableOperationProcessor());
			document.OperationProcessors.Add(new RequireAuthAttribute.Swagger());
		});
		// Setup SPA Serving
		if (builder.Environment.IsProduction()) Console.WriteLine($"Server in production, serving SPA from {frontPath} folder");

		builder.Services.AddSignalR(options => { options.EnableDetailedErrors = true; })
			.AddJsonProtocol(options =>
				{
					options.PayloadSerializerOptions.IncludeFields = true;
					options.PayloadSerializerOptions.Converters.Add(new JsonStringEnumConverter());
				}
			);


		Application = builder.Build();
	}

	public WebApplication Application { get; }
}