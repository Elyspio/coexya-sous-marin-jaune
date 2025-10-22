namespace SousMarinJaune.Api.AppHost.Utils;

public static class AppPathHelper
{
	internal static string GetRootPath() => Path.GetFullPath("..", Directory.GetCurrentDirectory());
	internal static string FrontPath => Path.Combine(GetRootPath(), "..",  "front");

}