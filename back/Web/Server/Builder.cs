﻿using Mapster;
using Microsoft.AspNetCore.Mvc.Formatters;
using Microsoft.AspNetCore.Server.Kestrel.Core;
using MongoDB.Bson;
using Newtonsoft.Json.Converters;
using NSwag;
using NSwag.Generation.Processors.Security;
using Serilog;
using Serilog.Events;
using Serilog.Sinks.SystemConsole.Themes;
using SousMarinJaune.Api.Abstractions.Extensions;
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
	private const string AppPath = "/example";
	private readonly string _frontPath = Env.Get("FRONT_PATH", "/front");

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


		builder.Services.AddResponseCompression();
		builder.Services.AddResponseCaching();
		
		// Setup CORS
		if (builder.Environment.IsDevelopment())
		{
			builder.Services.AddCors(options =>
				{
					options.AddDefaultPolicy(b =>
						{
							b.WithOrigins("http://localhost:3000");
							b.AllowAnyHeader();
							b.AllowAnyMethod();
							b.AllowCredentials();
						}
					);

				}
			);
		}
		


		builder.Services.AddModule<AdapterModule>(builder.Configuration);
		builder.Services.AddModule<CoreModule>(builder.Configuration);
		builder.Services.AddModule<DatabaseModule>(builder.Configuration);

		// Setup Logging
		builder.Host.UseSerilog((_, lc) => lc
			.MinimumLevel.Debug()
			.Filter.ByExcluding(e => e.Level == LogEventLevel.Debug && e.Properties["SourceContext"].ToString().Contains("Microsoft"))
			.Enrich.FromLogContext()
			.WriteTo.Console(outputTemplate: "[{Timestamp:HH:mm:ss} {Level} {SourceContext:l}] {Message:lj}{NewLine}{Exception}", theme: AnsiConsoleTheme.Sixteen)
		);

		builder.Services.AddLogging(log => { log.AddConsole(); });

		// Convert Enum to String 
		builder.Services.AddControllers(o =>
				{
					o.Conventions.Add(new ControllerDocumentationConvention());
					o.OutputFormatters.RemoveType<StringOutputFormatter>();
					o.Filters.Add<HttpExceptionFilter>();
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
			document.AddSecurity("bearer", new()
			{
				In = OpenApiSecurityApiKeyLocation.Header,
				Description = "Please insert JWT with Bearer into field",
				Name = "Authorization",
				Type = OpenApiSecuritySchemeType.ApiKey
			});
			document.OperationProcessors.Add(new AspNetCoreOperationSecurityScopeProcessor("bearer"));
		});
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

		Application = builder.Build();
	}

	public WebApplication Application { get; }
}