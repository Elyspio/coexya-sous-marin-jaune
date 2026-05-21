import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import type { Order } from "@apis/backend/generated";
import { service } from "../api/services";
import { OrderService } from "@services/order.service";
import { ordersKeys } from "./orders.keys";

const EMPTY: Order[] = [];

export function useOrders(): Order[] {
	const query = useQuery({
		queryKey: ordersKeys.list(),
		queryFn: () => service(OrderService).getAll(),
	});
	return query.data ?? EMPTY;
}

export function useOrdersById(): Record<string, Order> {
	const list = useOrders();
	return useMemo(() => {
		const map: Record<string, Order> = {};
		for (const o of list) map[o.id] = o;
		return map;
	}, [list]);
}

export function useOrder(id: string | undefined): Order | undefined {
	const byId = useOrdersById();
	return id ? byId[id] : undefined;
}
