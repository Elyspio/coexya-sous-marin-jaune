using Elyspio.Utils.Results;

namespace SousMarinJaune.Api.Abstractions.Errors;

/// <summary>The order deadline has passed: the user must confirm that the order moves to next Thursday.</summary>
public sealed record OrderDeferralRequired()
	: Conflict("order.deferral-required", "L'heure limite est passée. Confirmation requise pour reporter la commande au prochain jeudi.");
