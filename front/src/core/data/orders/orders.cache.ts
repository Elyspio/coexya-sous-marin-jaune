import type { QueryClient } from "@tanstack/react-query";
import type { Order } from "@apis/rest/api/generated";
import { ordersKeys } from "./orders.keys";

type Updater = (order: Order) => Order;

export const ordersCache = {
	setList(qc: QueryClient, list: Order[]) {
		qc.setQueryData<Order[]>(ordersKeys.list(), list);
	},
	upsert(qc: QueryClient, order: Order) {
		qc.setQueryData<Order[]>(ordersKeys.list(), (old) => {
			if (!old) return [order];
			const idx = old.findIndex((o) => o.id === order.id);
			if (idx < 0) return [...old, order];
			return [...old.slice(0, idx), order, ...old.slice(idx + 1)];
		});
	},
	remove(qc: QueryClient, id: Order["id"]) {
		qc.setQueryData<Order[]>(ordersKeys.list(), (old) => {
			if (!old) return old;
			return old.filter((o) => o.id !== id);
		});
	},
	patch(qc: QueryClient, id: Order["id"], updater: Updater) {
		qc.setQueryData<Order[]>(ordersKeys.list(), (old) => {
			if (!old) return old;
			const idx = old.findIndex((o) => o.id === id);
			if (idx < 0) return old;
			const next = updater(old[idx]);
			if (next === old[idx]) return old;
			return [...old.slice(0, idx), next, ...old.slice(idx + 1)];
		});
	},
};
