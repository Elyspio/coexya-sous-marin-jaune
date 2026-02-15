using Serilog;
using SousMarinJaune.Api.Abstractions.Helpers;
using SousMarinJaune.Api.Web.Server;
using SousMarinJaune.Api.Web.Technical.Extensions;


var config = new ConfigurationBuilder().AddCommon().Build();

Serilog.Log.Logger = new Serilog.LoggerConfiguration()
	.ReadFrom.Configuration(config)
	.WriteTo.OpenTelemetry()
	.CreateBootstrapLogger();

try
{
	new ServerBuilder(args).Application.Initialize().Run();
}
catch (Exception e)
{
	Serilog.Log.Logger = new Serilog.LoggerConfiguration()
		.ReadFrom.Configuration(config)
		.WriteTo.OpenTelemetry()
		.CreateBootstrapLogger();
	
	Serilog.Log.Fatal(e, "Application terminated unexpectedly");
	
	throw;
}