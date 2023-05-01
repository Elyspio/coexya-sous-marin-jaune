import { useAppSelector } from "@store";
import { useMemo } from "react";
import dayjs from "dayjs";

export function useOrderDates() {
	const ordersMap = useAppSelector((s) => s.orders.all);

	const orders = useMemo(() => Object.values(ordersMap), [ordersMap]);

	const availableDates = useMemo(() => {
		const dates = orders.map((order) => dayjs(order.date).startOf("day").toISOString());
		const distinctDates = [...new Set(dates)];
		const dayjsDates = distinctDates.map(dayjs);

		dayjsDates.sort((d1, d2) => (d1.isAfter(d2) ? -1 : 1));

		return dayjsDates;
	}, [orders]);

	return availableDates;
}
