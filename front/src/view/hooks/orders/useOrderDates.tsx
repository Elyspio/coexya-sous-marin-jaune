import { StoreState, useAppSelector } from "@store";
import { useMemo } from "react";
import dayjs from "dayjs";
import { createSelector } from "@reduxjs/toolkit";

const selector = createSelector([(s: StoreState) => s.orders.all], (order) => Object.values(order));

export function useOrderDates() {
	const orders = useAppSelector(selector);

	const availableDates = useMemo(() => {
		console.count("orders");

		const dates = orders.map((order) => dayjs(order.date).startOf("day").toISOString());
		const distinctDates = [...new Set(dates)];
		const dayjsDates = distinctDates.map(dayjs);

		dayjsDates.sort((d1, d2) => (d1.isAfter(d2) ? -1 : 1));

		return dayjsDates;
	}, [orders]);

	return availableDates;
}
