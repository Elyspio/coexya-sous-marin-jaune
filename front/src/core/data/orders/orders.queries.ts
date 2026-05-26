import {useMemo} from "react";
import {useQuery} from "@tanstack/react-query";
import type {Order, OrderCreationInfo} from "@apis/backend/generated";
import {getService} from "../api/services";
import {OrderService} from "@services/order.service";
import {ordersKeys} from "./orders.keys";

const EMPTY: Order[] = [];

export function useOrders(): Order[] {
	const query = useQuery({
		queryKey: ordersKeys.list(),
		queryFn: () => getService(OrderService).getAll(),
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

export function useOrderCreationInfo(): OrderCreationInfo | undefined {
	const query = useQuery({
		queryKey: ordersKeys.creationInfo(),
		queryFn: () => getService(OrderService).getCreationInfo(),
		staleTime: 30_000,
		refetchInterval: 60_000,
	});
	return query.data;
}
