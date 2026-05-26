import type { Order } from "@apis/rest/api/generated";
import dayjs from "dayjs";

export const dateTemplate = "DD/MM/YYYY";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));
export const isTodayFormatted = (date: string) => date === dayjs().format(dateTemplate);

export const lastTime = dayjs().locale("fr").startOf("d").set("h", 11).set("m", 30);

export const isSameDay = (a: string | Date | undefined, b: string | Date | undefined) =>
	!!a && !!b && dayjs(a).startOf("day").isSame(dayjs(b).startOf("day"));

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

export function canCreate(
	orderName: string | undefined,
	kitchenOpened: boolean,
	orders: Order[],
	plannedDate?: string,
): boolean | "no-name" | "closed" | "already-planned" {
	if (!orderName) return "no-name";
	if (!kitchenOpened) return "closed";
	const target = plannedDate ?? new Date().toISOString();
	const userOrders = orders.filter((order) => order.user === orderName);
	if (userOrders.some((o) => isSameDay(o.date, target))) {
		return plannedDate && !isSameDay(target, new Date().toISOString()) ? "already-planned" : false;
	}
	return true;
}
