using Microsoft.IdentityModel.Tokens;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Adapters.AuthenticationApi;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Cryptography;

namespace SousMarinJaune.Api.Core.Services;

internal class AuthenticationService : IAuthenticationService
{
    private readonly IJwtClient _jwtClient;
	private readonly SecurityKey _publicKey;

	public AuthenticationService(IJwtClient jwtClient)
	{
        _jwtClient = jwtClient;
        _publicKey = GetPublicKey().Result;
	}

	public bool ValidateJwt(string? token, out JwtSecurityToken? validatedToken)
	{
		validatedToken = null;

		if (string.IsNullOrWhiteSpace(token))
			return false;


		token = token[("Bearer".Length + 1)..];

		var tokenHandler = new JwtSecurityTokenHandler();

		try
		{
			tokenHandler.ValidateToken(token, new()
			{
				ValidateIssuerSigningKey = true,
				IssuerSigningKey = _publicKey,
				ValidateIssuer = false,
				ValidateAudience = false,
				ClockSkew = TimeSpan.Zero
			}, out var securityToken);

			validatedToken = (JwtSecurityToken?)securityToken;

			return true;
		}
		catch
		{
			return false;
		}
	}

	private async Task<SecurityKey> GetPublicKey()
	{
		var key = (await _jwtClient.GetValidationKeyAsync()).Data;
		var rsa = RSA.Create();

		rsa.ImportFromPem(key);

		return new RsaSecurityKey(rsa);
	}
}