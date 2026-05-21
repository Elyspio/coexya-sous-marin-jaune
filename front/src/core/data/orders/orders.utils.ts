import type { Order } from "@apis/backend/generated";
import dayjs from "dayjs";

export const dateTemplate = "DD/MM/YYYY";

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));
export const isTodayFormatted = (date: string) => date === dayjs().format(dateTemplate);

export const lastTime = dayjs().locale("fr").startOf("d").set("h", 11).set("m", 30);

export function canCreate(
	orderName: string | undefined,
	kitchenOpened: boolean,
	orders: Order[]
): boolean | "no-name" | "closed" {
	if (!orderName) return "no-name";
	if (!kitchenOpened) return "closed";
	return !orders.filter((order) => order.user === orderName).some(isToday);
}
