using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using SousMarinJaune.Api.Abstractions.Configurations;

namespace SousMarinJaune.Api.Web.Technical.Extensions;

/// <summary>
///     AppBuilderExtensions
/// </summary>
public static class AppBuilderExtensions
{
	/// <param name="builder"></param>
	extension(WebApplicationBuilder builder)
	{
		/// <summary>
		///     Active l'authentification OIDC pour l'application via Keycloak.
		///     Valide le JWT, vérifie que la claim <c>azp</c> correspond au client attendu,
		///     puis aplatit les rôles client (<c>resource_access[clientId].roles</c>)
		///     en claims <see cref="ClaimTypes.Role"/> pour que
		///     <c>[Authorize(Roles = "...")]</c> fonctionne nativement.
		/// </summary>
		public WebApplicationBuilder AddOidcSupport()
		{
			var oidcConfig = builder.Configuration.GetRequiredSection(OidcConfiguration.Section).Get<OidcConfiguration>()!;

			builder.Services
				.AddAuthentication(opt =>
				{
					opt.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
					opt.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
				})
				.AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, opt =>
				{
					opt.Authority = oidcConfig.Authority;
					// En dev, le Keycloak Aspire local tourne en HTTP : on désactive l'exigence HTTPS
					// pour permettre le téléchargement des métadonnées OIDC. En prod on garde le défaut strict.
					opt.RequireHttpsMetadata = !builder.Environment.IsDevelopment();
					opt.MapInboundClaims = false;
					opt.TokenValidationParameters = new TokenValidationParameters
					{
						// Keycloak ne place pas l'identifiant de l'API dans la claim `aud` standard :
						// les clients publics reçoivent un `aud` égal au realm/compte. Au lieu de ça
						// on valide manuellement la claim `azp` (authorized party) dans OnTokenValidated.
						ValidateAudience = false,
						ValidateIssuer = oidcConfig.ValidateIssuer,
						ValidIssuer = oidcConfig.ValidIssuer,
						ValidateLifetime = oidcConfig.ValidateLifetime,
						ValidateIssuerSigningKey = true,
						NameClaimType = "name",
						ClockSkew = TimeSpan.FromSeconds(oidcConfig.ClockSkew)
					};
					opt.Events = new JwtBearerEvents
					{
						OnTokenValidated = ctx =>
						{
							var azp = ctx.Principal?.FindFirst("azp")?.Value;
							if (!string.Equals(azp, oidcConfig.ClientId, StringComparison.Ordinal))
							{
								ctx.Fail($"Invalid azp claim: expected '{oidcConfig.ClientId}', got '{azp}'.");
								return Task.CompletedTask;
							}

							// Keycloak encode les rôles client dans une claim JSON unique :
							//   "resource_access": { "<clientId>": { "roles": ["admin", "user"] } }
							// Le JWT handler stocke ça comme une chaîne opaque ; on parse et on
							// ajoute chaque rôle comme ClaimTypes.Role pour que User.IsInRole et
							// [Authorize(Roles="admin")] fonctionnent.
							var resourceAccess = ctx.Principal?.FindFirst("resource_access")?.Value;
							if (!string.IsNullOrEmpty(resourceAccess) && ctx.Principal?.Identity is ClaimsIdentity identity)
							{
								try
								{
									using var doc = JsonDocument.Parse(resourceAccess);
									if (doc.RootElement.TryGetProperty(oidcConfig.ClientId, out var clientElement)
									    && clientElement.TryGetProperty("roles", out var rolesElement)
									    && rolesElement.ValueKind == JsonValueKind.Array)
									{
										foreach (var role in rolesElement.EnumerateArray())
										{
											var name = role.GetString();
											if (!string.IsNullOrEmpty(name))
												identity.AddClaim(new Claim(identity.RoleClaimType, name));
										}
									}
								}
								catch (JsonException)
								{
									// resource_access malformé : on laisse passer le token mais l'utilisateur
									// ne satisfera aucune policy basée sur les rôles.
								}
							}

							return Task.CompletedTask;
						}
					};
				});

			builder.Services.AddAuthorization();

			return builder;
		}
	}
}
