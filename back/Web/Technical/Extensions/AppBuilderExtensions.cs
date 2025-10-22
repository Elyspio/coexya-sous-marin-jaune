using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
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
		///     Active l'authentification OIDC pour l'application, par défaut toutes les requêtes sont authentifiées.
		/// </summary>
		/// <returns></returns>
		/// <exception cref="InvalidOperationException"></exception>
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
					opt.TokenValidationParameters = new TokenValidationParameters
					{
						ValidateAudience = false,
						ValidateIssuer = oidcConfig.ValidateIssuer,
						ValidateLifetime = oidcConfig.ValidateLifetime,
						ValidIssuer = oidcConfig.ValidIssuer,
						ClockSkew = TimeSpan.FromSeconds(oidcConfig.ClockSkew)
					};
				});

			builder.Services.AddAuthorization(options =>
			{
				var policyBuilder = new AuthorizationPolicyBuilder(JwtBearerDefaults.AuthenticationScheme)
					.RequireAuthenticatedUser()
					.RequireClaim("preferred_username", "jona.guich69@gmail.com");

				var policy = policyBuilder.Build();

				options.DefaultPolicy = policy;
				options.FallbackPolicy = policy;
			});

			return builder;
		}
	}
}
