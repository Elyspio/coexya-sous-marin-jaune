using Microsoft.AspNetCore.SignalR;
using SousMarinJaune.Api.Abstractions.Interfaces.Hubs;

namespace SousMarinJaune.Api.Sockets.Hubs;

public class UpdateHub : Hub<IUpdateHub>
{
}