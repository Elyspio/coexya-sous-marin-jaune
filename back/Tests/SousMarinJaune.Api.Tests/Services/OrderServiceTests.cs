using NSubstitute;
using Shouldly;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Order;
using SousMarinJaune.Api.Abstractions.Transports.Order.Base;
using SousMarinJaune.Api.Abstractions.Transports.Order.Payment;
using SousMarinJaune.Api.Tests.Fixtures;

namespace SousMarinJaune.Api.Tests.Services;

[Collection("MongoDB")]
public class OrderServiceTests : IntegrationTestBase
{
	public OrderServiceTests(MongoDbFixture mongoDbFixture) : base(mongoDbFixture)
	{
	}

	[Fact]
	public async Task Create_ShouldCreateOrderAndNotifyHub()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		const string userName = "TestUser";

		// Act
		var order = await orderService.Create(userName);

		// Assert
		order.ShouldNotBeNull();
		order.Id.ShouldNotBe(Guid.Empty);
		order.User.ShouldBe(userName);
		order.Burgers.ShouldNotBeNull();
		order.Burgers.ShouldBeEmpty();
		order.Payments.ShouldNotBeNull();
		order.PaymentEnabled.ShouldBeTrue(); // Default config has PaymentEnabled = true

		// Verify hub notification
		await HubClients.Received(1).OrderUpdated(Arg.Is<Order>(o => o.User == userName));
	}

	[Fact]
	public async Task Create_WithPaymentDisabled_ShouldRespectConfigSetting()
	{
		// Arrange
		var configService = GetService<IConfigService>();
		var orderService = GetService<IOrderService>();
		
		await configService.Update(new Abstractions.Transports.Config.ConfigBase
		{
			Carrier = "Test",
			KitchenOpened = true,
			PaymentEnabled = false
		});
		HubClients.ClearReceivedCalls();

		// Act
		var order = await orderService.Create("TestUser");

		// Assert
		order.PaymentEnabled.ShouldBeFalse();
	}

	[Fact]
	public async Task GetAll_WhenNoOrders_ShouldReturnEmptyList()
	{
		// Arrange
		var orderService = GetService<IOrderService>();

		// Act
		var orders = await orderService.GetAll();

		// Assert
		orders.ShouldNotBeNull();
		orders.ShouldBeEmpty();
	}

	[Fact]
	public async Task GetAll_WithMultipleOrders_ShouldReturnAllOrders()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		await orderService.Create("User1");
		await orderService.Create("User2");
		await orderService.Create("User3");

		// Act
		var orders = await orderService.GetAll();

		// Assert
		orders.Count.ShouldBe(3);
		orders.Select(o => o.User).ShouldContain("User1");
		orders.Select(o => o.User).ShouldContain("User2");
		orders.Select(o => o.User).ShouldContain("User3");
	}

	[Fact]
	public async Task GetForUser_ShouldReturnOnlyUserOrders()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		await orderService.Create("TargetUser");
		await orderService.Create("TargetUser");
		await orderService.Create("OtherUser");

		// Act
		var orders = await orderService.GetForUser("TargetUser");

		// Assert
		orders.Count.ShouldBe(2);
		orders.ShouldAllBe(o => o.User == "TargetUser");
	}

	[Fact]
	public async Task GetForUser_WhenUserHasNoOrders_ShouldReturnEmptyList()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		await orderService.Create("ExistingUser");

		// Act
		var orders = await orderService.GetForUser("NonExistentUser");

		// Assert
		orders.ShouldBeEmpty();
	}

	[Fact]
	public async Task Delete_ShouldRemoveOrderAndNotifyHub()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		var order = await orderService.Create("TestUser");
		HubClients.ClearReceivedCalls();

		// Act
		await orderService.Delete(order.Id);

		// Assert
		var orders = await orderService.GetAll();
		orders.ShouldBeEmpty();

		// Verify hub notification
		await HubClients.Received(1).OrderDeleted(order.Id);
	}

	[Fact]
	public async Task Update_ShouldModifyOrderAndNotifyHub()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		var order = await orderService.Create("OriginalUser");
		HubClients.ClearReceivedCalls();

		order.User = "UpdatedUser";

		// Act
		await orderService.Update(order);

		// Assert
		var orders = await orderService.GetForUser("UpdatedUser");
		orders.Count.ShouldBe(1);
		orders.First().User.ShouldBe("UpdatedUser");

		// Verify hub notification
		await HubClients.Received(1).OrderUpdated(Arg.Is<Order>(o => o.User == "UpdatedUser"));
	}

	[Fact]
	public async Task UpdateOrderPaymentReceived_ShouldUpdatePaymentAndNotifyHub()
	{
		// Arrange
		var orderService = GetService<IOrderService>();
		var order = await orderService.Create("TestUser");
		
		// Add a payment to the order
		order.Payments.Add(new OrderPayment
		{
			Type = OrderPaymentType.Cash,
			Amount = 10.0,
			Received = null
		});
		await orderService.Update(order);
		HubClients.ClearReceivedCalls();

		// Act
		await orderService.UpdateOrderPaymentReceived(order.Id, OrderPaymentType.Cash, 10.0);

		// Assert
		var orders = await orderService.GetForUser("TestUser");
		var updatedOrder = orders.First();
		var payment = updatedOrder.Payments.First(p => p.Type == OrderPaymentType.Cash);
		payment.Received.ShouldBe(10.0);

		// Verify hub notification
		await HubClients.Received(1).OrderUpdated(Arg.Any<Order>());
	}

	[Fact]
	public async Task Create_MultipleTimes_ShouldCreateDistinctOrders()
	{
		// Arrange
		var orderService = GetService<IOrderService>();

		// Act
		var order1 = await orderService.Create("User1");
		var order2 = await orderService.Create("User1");
		var order3 = await orderService.Create("User2");

		// Assert
		order1.Id.ShouldNotBe(order2.Id);
		order1.Id.ShouldNotBe(order3.Id);
		order2.Id.ShouldNotBe(order3.Id);

		var allOrders = await orderService.GetAll();
		allOrders.Count.ShouldBe(3);
	}
}

