import { useMemo } from "react";
import dayjs from "dayjs";
import { useOrders } from "@/core/data/orders/orders.queries";

export function useOrderDates() {
	const orders = useOrders();

	return useMemo(() => {
		const dates = orders.map((order) => dayjs(order.date).startOf("day").toISOString());
		const distinctDates = [...new Set(dates)];
		const dayjsDates = distinctDates.map((d) => dayjs(d));

		dayjsDates.sort((d1, d2) => (d1.isAfter(d2) ? -1 : 1));

		return dayjsDates;
	}, [orders]);
}
