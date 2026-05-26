using Shouldly;
using SousMarinJaune.Api.Abstractions.Helpers;

namespace SousMarinJaune.Api.Tests.Helpers;

public class OrderDateHelperTests
{
	[Fact]
	public void BeforeCutoff_ReturnsNowAndNotDeferred()
	{
		var now = new DateTime(2026, 5, 25, 10, 0, 0); // Monday 10:00
		OrderDateHelper.IsDeferred(now).ShouldBeFalse();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(now);
	}

	[Fact]
	public void MondayAfterCutoff_ReturnsThursdayOfSameWeek()
	{
		var now = new DateTime(2026, 5, 25, 12, 0, 0); // Monday 12:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 5, 28, 12, 0, 0));
	}

	[Fact]
	public void ThursdayBeforeCutoff_ReturnsSameDay()
	{
		var now = new DateTime(2026, 5, 28, 11, 0, 0); // Thursday 11:00
		OrderDateHelper.IsDeferred(now).ShouldBeFalse();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(now);
	}

	[Fact]
	public void ThursdayAfterCutoff_ReturnsNextThursday()
	{
		var now = new DateTime(2026, 5, 28, 13, 0, 0); // Thursday 13:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 6, 4, 12, 0, 0));
	}

	[Fact]
	public void SundayAfterCutoff_ReturnsUpcomingThursday()
	{
		var now = new DateTime(2026, 5, 31, 14, 0, 0); // Sunday 14:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 6, 4, 12, 0, 0));
	}

	[Fact]
	public void AtCutoffExactly_IsDeferred()
	{
		var now = new DateTime(2026, 5, 25, 11, 30, 0); // Monday 11:30:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
	}
}
