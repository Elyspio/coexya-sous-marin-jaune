namespace SousMarinJaune.Api.Abstractions.Transports.User;

public class User : UserBase
{
	public Guid Id { get; set; }

	public double Sold => this.Bills.Sum(bill => bill.Amount);
}