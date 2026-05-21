import { describe, expect, it } from "vitest";
import { Dessert, Drink, type Order } from "../../src/core/apis/backend/generated";
import { calculateOrderPrice } from "../../src/core/data/orders/orders.utils";

function createOrder(overrides: Partial<Order> = {}): Order {
	return {
		id: "order-id",
		burgers: [{ name: "Classique", excluded: [], vegetarian: false }],
		user: "User",
		date: "2026-05-21T00:00:00.000Z",
		student: false,
		payments: [],
		paymentEnabled: true,
		...overrides,
	};
}

describe("calculateOrderPrice", () => {
	it("returns 0 when the order has no burger", () => {
		expect(calculateOrderPrice(createOrder({ burgers: [] }))).toBe(0);
	});

	it("calculates the student menu price", () => {
		expect(calculateOrderPrice(createOrder({ student: true }))).toBe(11);
	});

	it("calculates a non-student burger without menu options", () => {
		expect(calculateOrderPrice(createOrder())).toBe(8.5);
	});

	it("applies the drink and fries menu promotion", () => {
		const order = createOrder({
			drink: Drink.Coca,
			fries: { sauces: [] },
		});

		expect(calculateOrderPrice(order)).toBe(12.5);
	});

	it("adds XL, dessert, and extra burger supplements", () => {
		const order = createOrder({
			burgers: [
				{ name: "Classique", excluded: [], vegetarian: false, xl: true },
				{ name: "Second", excluded: [], vegetarian: false, xl: true },
			],
			dessert: Dessert.Cookie,
		});

		expect(calculateOrderPrice(order)).toBe(30);
	});
});
