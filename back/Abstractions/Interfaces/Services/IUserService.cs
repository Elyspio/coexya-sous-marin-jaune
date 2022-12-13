namespace SousMarinJaune.Api.Abstractions.Interfaces.Services;

public interface IUserService
{
	Task MergeUsers(string newName, List<string> users);
	Task<double> GetUserBalance(string user);
}