using Elyspio.Utils.Results;
using Shouldly;

namespace SousMarinJaune.Api.Tests;

internal static class ResultShould
{
	public static T ShouldSucceed<T>(this Result<T> result)
	{
		result.TryGet(out var value, out var error).ShouldBeTrue($"Failed with {error}");
		return value!;
	}
}
