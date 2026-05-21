import type { Order } from "@apis/backend/generated";
import dayjs from "dayjs";

export const dateTemplate = "DD/MM/YYYY";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));
export const isTodayFormatted = (date: string) => date === dayjs().format(dateTemplate);

export const lastTime = dayjs().locale("fr").startOf("d").set("h", 11).set("m", 30);

export function calculateOrderPrice(order: Order): number {
	if (order.burgers.length === 0) return 0;

	let sum = 0;

	if (order.student) {
		sum += 11;
	} else {
		let menu = 8.5;

		if (order.drink) menu += 2;
		if (order.fries) menu += 3.5;
		if (order.drink && order.fries) menu = 12.5;

		sum += menu;
	}

	if (order.burgers[0].xl) sum += 5;

	if (order.dessert) sum += 3;

	for (const burger of order.burgers.slice(1)) {
		sum += 8.5;
		if (burger.xl) sum += 5;
	}

	return sum;
}

export function canCreate(orderName: string | undefined, kitchenOpened: boolean, orders: Order[]): boolean | "no-name" | "closed" {
	if (!orderName) return "no-name";
	if (!kitchenOpened) return "closed";
	return !orders.filter((order) => order.user === orderName).some(isToday);
}
