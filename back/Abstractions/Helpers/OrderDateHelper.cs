namespace SousMarinJaune.Api.Abstractions.Helpers;

public static class OrderDateHelper
{
	private static readonly TimeSpan Cutoff = new(11, 30, 0);

	// La cuisine n'ouvre que le jeudi. On ne peut commander pour aujourd'hui
	// qu'un jeudi avant 11h30 ; sinon la commande est reportée (et l'utilisateur prévenu).
	public static bool IsDeferred(DateTime now) => !(now.DayOfWeek == DayOfWeek.Thursday && now.TimeOfDay < Cutoff);

	public static DateTime ComputeOrderDate(DateTime now)
	{
		if (!IsDeferred(now))
		{
			return new DateTime(now.Year, now.Month, now.Day, 11, 30, 0, DateTimeKind.Local);
		}

		// Jeudi après 11h30 : on saute au jeudi suivant ; sinon on cible le prochain jeudi.
		var daysUntilThursday = ((int)DayOfWeek.Thursday - (int)now.DayOfWeek + 7) % 7;
		if (daysUntilThursday == 0) daysUntilThursday = 7;
		return now.Date.AddDays(daysUntilThursday).AddHours(12);
	}
}