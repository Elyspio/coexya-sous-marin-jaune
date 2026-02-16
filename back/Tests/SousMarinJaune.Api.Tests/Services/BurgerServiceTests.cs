using Shouldly;
using SousMarinJaune.Api.Abstractions.Interfaces.Services;
using SousMarinJaune.Api.Tests.Fixtures;

namespace SousMarinJaune.Api.Tests.Services;

[Collection("MongoDB")]
public class BurgerServiceTests : IntegrationTestBase
{
	public BurgerServiceTests(MongoDbFixture mongoDbFixture) : base(mongoDbFixture)
	{
	}

	[Fact]
	public async Task GetAll_ShouldReturnBurgersFromRealWebsite()
	{
		// Arrange
		var burgerService = GetService<IBurgerService>();

		// Act
		var burgers = await burgerService.GetAll(CancellationToken.None);

		// Assert
		burgers.ShouldNotBeNull();
		burgers.ShouldNotBeEmpty();
		burgers.Count.ShouldBeGreaterThan(0);


		foreach (var burger in burgers)
		{
			burger.Name.ShouldNotBeNullOrWhiteSpace();
			burger.Ingredients.ShouldNotBeEmpty();
			foreach (var ingredient in burger.Ingredients)
			{
				ingredient.ShouldNotBeNullOrWhiteSpace();
			}
		}
	}

	[Fact]
	public async Task GetAll_CalledTwice_ShouldUseCaching()
	{
		// Arrange
		var burgerService = GetService<IBurgerService>();

		// Act
		var firstCall = await burgerService.GetAll(CancellationToken.None);
		var secondCall = await burgerService.GetAll(CancellationToken.None);

		// Assert
		firstCall.ShouldNotBeNull();
		secondCall.ShouldNotBeNull();
		firstCall.Count.ShouldBe(secondCall.Count);

		// Same references due to caching
		ReferenceEquals(firstCall, secondCall).ShouldBeTrue();
	}
}