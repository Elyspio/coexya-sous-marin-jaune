import type { StoreState } from "@store";
import type { Order } from "@apis/backend/generated";
import dayjs from "dayjs";

export const dateTemplate = "DD/MM/YYYY";

export const canCreateSelector = (state: StoreState): boolean | "no-name" | "closed" => {
	if (!state.orders.name) return "no-name";
	if (!state.config.kitchenOpened) return "closed";

	const orders = Object.values(state.orders.all);

	return !orders.filter((order) => order.user === state.orders.name).some(isToday);
};

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));
export const isTodayFormatted = (date: string) => date === dayjs().format(dateTemplate);
