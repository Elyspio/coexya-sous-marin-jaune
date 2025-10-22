namespace SousMarinJaune.Api.Abstractions.Configurations;

/// <summary>
///    Configuration pour l'authentification OIDC
/// </summary>
public class OidcConfiguration 
{
	/// <summary>
	///    Section de configuration dans les appsettings.json
	/// </summary>
	public const string Section = "Oidc";

	/// <summary>
	///	URL de l'autorité OIDC (url du royaume keycloak)
	/// </summary>
	public required string Authority { get; set; }

	/// <summary>
	///   Audiences valides pour les tokens JWT
	/// </summary>
	public required string[] ValidAudiences { get; set; }

	/// <summary>
	///  Émetteur valide pour les tokens JWT
	/// </summary>
	public required string ValidIssuer { get; set; }

	/// <summary>
	/// Valider l'émetteur des tokens JWT
	/// </summary>
	public bool ValidateIssuer { get; set; } = true;

	/// <summary>
	/// Valider l'audience des tokens JWT
	/// </summary>
	public bool ValidateAudience { get; set; } = true;

	/// <summary>
	/// Valider la durée de vie des tokens JWT
	/// </summary>
	public bool ValidateLifetime { get; set; } = true;

	/// <summary>
	/// Tolérance de l'horloge en secondes pour la validation des tokens JWT
	/// </summary>
	public int ClockSkew { get; set; } = 10;
}
