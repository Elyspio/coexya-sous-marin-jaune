using SousMarinJaune.Api.Abstractions.Transports.User;

namespace SousMarinJaune.Api.Abstractions.Interfaces.Services;

public interface IUserService
{
	Task MergeUsers(string newName, List<string> users);
	Task<List<UserSold>> GetUsers();
	Task SoldUser(string user);
	Task SoldAllUsers();
}