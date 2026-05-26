namespace SousMarinJaune.Api.Abstractions.Helpers;

public static class OrderDateHelper
{
	public static readonly TimeSpan Cutoff = new(11, 30, 0);

	public static bool IsDeferred(DateTime now) => now.TimeOfDay >= Cutoff;

	public static DateTime ComputeOrderDate(DateTime now)
	{
		if (!IsDeferred(now)) return now;

		var daysUntilThursday = ((int) DayOfWeek.Thursday - (int) now.DayOfWeek + 7) % 7;
		if (daysUntilThursday == 0) daysUntilThursday = 7;

		return now.Date.AddDays(daysUntilThursday).AddHours(12);
	}
}
