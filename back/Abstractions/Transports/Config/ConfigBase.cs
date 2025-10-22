namespace SousMarinJaune.Api.Abstractions.Transports.Config;

public class ConfigBase
{
	public string? Carrier { get; set; }
	public bool KitchenOpened { get; set; } = true;
	public bool PaymentEnabled { get; set; } = true;
}