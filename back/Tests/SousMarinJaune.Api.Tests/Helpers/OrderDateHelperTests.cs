using Shouldly;
using SousMarinJaune.Api.Abstractions.Helpers;

namespace SousMarinJaune.Api.Tests.Helpers;

public class OrderDateHelperTests
{
	[Fact]
	public void ThursdayBeforeCutoff_IsNotDeferredAndKeepsToday()
	{
		var now = new DateTime(2026, 5, 28, 11, 0, 0); // Thursday 11:00
		OrderDateHelper.IsDeferred(now).ShouldBeFalse();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(now);
	}

	[Fact]
	public void ThursdayAtCutoff_IsDeferredToNextThursday()
	{
		var now = new DateTime(2026, 5, 28, 11, 30, 0); // Thursday 11:30:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 6, 4, 12, 0, 0));
	}

	[Fact]
	public void ThursdayAfterCutoff_IsDeferredToNextThursday()
	{
		var now = new DateTime(2026, 5, 28, 13, 0, 0); // Thursday 13:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 6, 4, 12, 0, 0));
	}

	[Fact]
	public void Monday_TargetsUpcomingThursday()
	{
		var now = new DateTime(2026, 5, 25, 9, 0, 0); // Monday 09:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 5, 28, 12, 0, 0));
	}

	[Fact]
	public void Wednesday_TargetsUpcomingThursday()
	{
		var now = new DateTime(2026, 5, 27, 14, 0, 0); // Wednesday 14:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 5, 28, 12, 0, 0));
	}

	[Fact]
	public void Friday_TargetsNextThursday()
	{
		var now = new DateTime(2026, 5, 29, 9, 0, 0); // Friday 09:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 6, 4, 12, 0, 0));
	}

	[Fact]
	public void Sunday_TargetsNextThursday()
	{
		var now = new DateTime(2026, 5, 31, 14, 0, 0); // Sunday 14:00
		OrderDateHelper.IsDeferred(now).ShouldBeTrue();
		OrderDateHelper.ComputeOrderDate(now).ShouldBe(new DateTime(2026, 6, 4, 12, 0, 0));
	}
}
