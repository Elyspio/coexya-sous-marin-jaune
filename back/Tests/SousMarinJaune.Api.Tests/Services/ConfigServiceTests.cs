using NSubstitute;
using Shouldly;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Abstractions.Transports.Config;
using SousMarinJaune.Api.Tests.Fixtures;

namespace SousMarinJaune.Api.Tests.Services;

[Collection("MongoDB")]
public class ConfigServiceTests : IntegrationTestBase
{
	public ConfigServiceTests(MongoDbFixture mongoDbFixture) : base(mongoDbFixture)
	{
	}

	[Fact]
	public async Task Get_WhenNoConfigExists_ShouldReturnDefaultConfig()
	{
		// Arrange
		var configService = GetService<IConfigService>();

		// Act
		var config = await configService.Get();

		// Assert
		config.ShouldNotBeNull();
		config.Carrier.ShouldBe("Jonathan");
		config.KitchenOpened.ShouldBeTrue();
		config.PaymentEnabled.ShouldBeTrue();
		config.Id.ShouldNotBe(Guid.Empty);
	}

	[Fact]
	public async Task Get_WhenConfigExists_ShouldReturnExistingConfig()
	{
		// Arrange
		var configService = GetService<IConfigService>();
		var initialConfig = new ConfigBase
		{
			Carrier = "TestCarrier",
			KitchenOpened = false,
			PaymentEnabled = false
		};
		await configService.Update(initialConfig);
		HubClients.ClearReceivedCalls();

		// Act
		var config = await configService.Get();

		// Assert
		config.ShouldNotBeNull();
		config.Carrier.ShouldBe("TestCarrier");
		config.KitchenOpened.ShouldBeFalse();
		config.PaymentEnabled.ShouldBeFalse();
	}

	[Fact]
	public async Task Update_ShouldPersistConfigAndNotifyHub()
	{
		// Arrange
		var configService = GetService<IConfigService>();
		var newConfig = new ConfigBase
		{
			Carrier = "NewCarrier",
			KitchenOpened = true,
			PaymentEnabled = false
		};

		// Act
		var result = await configService.Update(newConfig);

		// Assert
		result.ShouldNotBeNull();
		result.Carrier.ShouldBe("NewCarrier");
		result.KitchenOpened.ShouldBeTrue();
		result.PaymentEnabled.ShouldBeFalse();
		result.Id.ShouldNotBe(Guid.Empty);

		// Verify hub notification
		await HubClients.Received(1).ConfigUpdated(Arg.Is<Config>(c => 
			c.Carrier == "NewCarrier" && 
			c.KitchenOpened == true && 
			c.PaymentEnabled == false));
	}

	[Fact]
	public async Task Update_CalledMultipleTimes_ShouldUpdateSameDocument()
	{
		// Arrange
		var configService = GetService<IConfigService>();

		// Act
		var first = await configService.Update(new ConfigBase { Carrier = "First", KitchenOpened = true, PaymentEnabled = true });
		var second = await configService.Update(new ConfigBase { Carrier = "Second", KitchenOpened = false, PaymentEnabled = false });

		// Assert
		first.Id.ShouldBe(second.Id);
		second.Carrier.ShouldBe("Second");
		second.KitchenOpened.ShouldBeFalse();
		second.PaymentEnabled.ShouldBeFalse();
	}

	[Fact]
	public async Task Update_ShouldBeRetrievableAfterUpdate()
	{
		// Arrange
		var configService = GetService<IConfigService>();
		var newConfig = new ConfigBase
		{
			Carrier = "PersistenceTest",
			KitchenOpened = false,
			PaymentEnabled = true
		};

		// Act
		await configService.Update(newConfig);
		var retrieved = await configService.Get();

		// Assert
		retrieved.Carrier.ShouldBe("PersistenceTest");
		retrieved.KitchenOpened.ShouldBeFalse();
		retrieved.PaymentEnabled.ShouldBeTrue();
	}
}

