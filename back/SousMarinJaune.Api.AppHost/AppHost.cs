using SousMarinJaune.Api.AppHost.Utils;

var builder = DistributedApplication.CreateBuilder(args);

var mongo = builder.AddMongoDB("MongoDb") .WithLifetime(ContainerLifetime.Persistent)
	.WithEndpoint("mongodb", e =>
	{
		e.TargetPort = 27017;   // port dans le conteneur
		e.Port = 27017;         // port publié sur l’hôte
		e.Transport = "tcp";
		e.IsProxied = false;    // publication directe
		e.UriScheme = "mongodb";
	});

mongo.AddDatabase("sous-marin-jaune");


builder.AddProject<Projects.SousMarinJaune_Api_Web>("api", "local")
    .WithReference(mongo);


builder.AddNpmApp("front", AppPathHelper.FrontPath)
	.WithHttpsEndpoint(port: 3000, targetPort: 3000, isProxied: false);

builder.Build().Run();