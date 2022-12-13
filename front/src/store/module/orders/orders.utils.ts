import type { StoreState } from "../../index";
import type { Order } from "../../../core/apis/backend/generated";
import dayjs from "dayjs";

export const dateTemplate = "DD/MM/YYYY";

export const canCreateSelector = (state: StoreState) => {
	if (!state.orders.name) return false;

	const orders = Object.values(state.orders.all);

	return !orders.filter(order => order.user === state.orders.name).some(isToday);
};

export const isToday = (order: Order) => dayjs().startOf("day").isSame(dayjs(order.date).startOf("day"));
export const isTodayFormatted = (date: string) => date === dayjs().format(dateTemplate);
