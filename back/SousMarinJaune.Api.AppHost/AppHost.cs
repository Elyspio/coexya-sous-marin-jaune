using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using SousMarinJaune.Api.AppHost.Utils;

var builder = DistributedApplication.CreateBuilder(args);

builder.Services.AddLogging(b => b.AddSimpleConsole(options => options.SingleLine = true));

var mongo = builder.AddMongoDB("MongoDb").WithLifetime(ContainerLifetime.Persistent)
	.WithEndpoint("mongodb", e =>
	{
		e.TargetPort = 27017;
		e.Port = 27017;
		e.Transport = "tcp";
		e.IsProxied = false;
		e.UriScheme = "mongodb";
	});

mongo.AddDatabase("sous-marin-jaune");

// Local Keycloak for development. The realm import file under ./Realms seeds the `apps` realm
// with a client `sous-marin-jaune` and 2 deterministic users (admin / user, password = "password").
//
// Aspire.Hosting.Keycloak 13.x runs Keycloak in `start-dev --import-realm`, with the primary
// endpoint exposed as **HTTPS on 8443** (the package injects an Aspire-managed dev certificate
// via KC_HTTPS_CERTIFICATE_FILE). The 2nd positional argument of AddKeycloak pins that HTTPS
// host port — fixed so cookies / OIDC discovery URLs stay stable across `aspire run` cycles.
//
// The dev cert is automatically trusted by the .NET runtime (used by the API for OIDC metadata
// discovery) and by Chrome on Windows when the ASP.NET Core dev cert is installed in the user
// trust store (`dotnet dev-certs https --trust`).
const int keycloakPort = 8089;
const string keycloakRealm = "apps";
const string keycloakClientId = "sous-marin-jaune";

var keycloak = builder.AddKeycloak("keycloak", keycloakPort)
	.WithDataVolume("sous-marin-jaune-keycloak-data")
	.WithRealmImport(Path.Combine(builder.AppHostDirectory, "Realms"))
	.WithContainerName("sous-marin-jaune-keycloak")
	.WithLifetime(ContainerLifetime.Persistent);

var keycloakAuthority = $"https://localhost:{keycloakPort}/realms/{keycloakRealm}";

builder.AddProject<Projects.SousMarinJaune_Api_Web>("api", "local")
	.WithReference(mongo, "MongoDb")
	.WithReference(keycloak)
	.WithEnvironment("Oidc__Authority", keycloakAuthority)
	.WithEnvironment("Oidc__ValidIssuer", keycloakAuthority)
	.WithEnvironment("Oidc__ClientId", keycloakClientId)
	.WaitFor(keycloak);


builder.AddViteApp("front", AppPathHelper.FrontPath)
	.WithHttpsEndpoint(port: 3000, targetPort: 3000, isProxied: false)
	.WithPnpm()
	.WithEnvironment("VITE_OIDC_AUTHORITY", keycloakAuthority)
	.WithEnvironment("VITE_OIDC_CLIENT_ID", keycloakClientId)
	.WaitFor(keycloak);

builder.Build().Run();
