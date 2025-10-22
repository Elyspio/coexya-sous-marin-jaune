namespace SousMarinJaune.Api.Abstractions.Transports.User.Enums;

[Flags]
public enum SousMarinJauneRole
{
	User = 1 << 1,
	Admin = 1 << 2,
}