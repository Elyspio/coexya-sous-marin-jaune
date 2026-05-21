import { useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import type { BurgerRecord, Order, OrderPaymentType } from "@apis/backend/generated";
import { ordersCache } from "./orders.cache";
import { useClientStore } from "@/core/store/clientStore";
import { useUpdateRemoteOrder } from "./orders.mutations";

export const noneBurger = "none" as const;

export function useOrderEditing() {
	const qc = useQueryClient();

	const createOrderRecord = useCallback(() => {
		const altering = useClientStore.getState().altering;
		if (!altering) return;
		let nextIndex = 0;
		ordersCache.patch(qc, altering.order, (order) => {
			const burgers = [...order.burgers, { name: noneBurger, vegetarian: false, xl: false, excluded: [] }];
			nextIndex = burgers.length - 1;
			return { ...order, burgers };
		});
		useClientStore.setState((s) => ({
			altering: s.altering ? { ...s.altering, record: nextIndex } : s.altering,
			mode: { ...s.mode, record: "create" },
		}));
	}, [qc]);

	const updateBurgerRecord = useCallback(
		(burger: BurgerRecord) => {
			const altering = useClientStore.getState().altering;
			if (!altering || altering.record === undefined) return;
			ordersCache.patch(qc, altering.order, (order) => {
				const burgers = order.burgers.slice();
				burgers[altering.record!] = burger;
				return { ...order, burgers };
			});
		},
		[qc],
	);

	const setOrderRecordBurger = useCallback(
		(name: BurgerRecord["name"]) => {
			const altering = useClientStore.getState().altering;
			if (!altering || altering.record === undefined) return;
			ordersCache.patch(qc, altering.order, (order) => {
				const burgers = order.burgers.slice();
				burgers[altering.record!] = { ...burgers[altering.record!], name };
				return { ...order, burgers };
			});
		},
		[qc],
	);

	const deleteOrderRecord = useCallback(
		(index: number) => {
			const altering = useClientStore.getState().altering;
			if (!altering) return;
			ordersCache.patch(qc, altering.order, (order) => ({
				...order,
				burgers: [...order.burgers.slice(0, index), ...order.burgers.slice(index + 1)],
			}));
			const state = useClientStore.getState();
			if (state.altering && index === state.altering.record) {
				useClientStore.setState({
					altering: { ...state.altering, record: undefined },
					mode: { ...state.mode, record: undefined },
				});
			}
		},
		[qc],
	);

	const deleteCurrentOrderRecord = useCallback(() => {
		const altering = useClientStore.getState().altering;
		if (!altering || altering.record === undefined) return;
		deleteOrderRecord(altering.record);
	}, [deleteOrderRecord]);

	const updateOrderPayment = useCallback(
		(type: OrderPaymentType, value: number) => {
			const altering = useClientStore.getState().altering;
			if (!altering) return;
			ordersCache.patch(qc, altering.order, (order: Order) => {
				if (value === 0) {
					return { ...order, payments: order.payments.filter((p) => p.type !== type) };
				}
				const existing = order.payments.find((p) => p.type === type);
				const payments = existing ? order.payments.map((p) => (p.type === type ? { ...p, amount: value } : p)) : [...order.payments, { type, amount: value }];
				return { ...order, payments };
			});
		},
		[qc],
	);

	return {
		createOrderRecord,
		updateBurgerRecord,
		setOrderRecordBurger,
		deleteOrderRecord,
		deleteCurrentOrderRecord,
		updateOrderPayment,
	};
}

/**
 * Mutate an order locally and persist it immediately.
 * Replaces the old `dispatch(updateOrder(...)) + dispatch(updateRemoteOrder())` pair.
 */
export function useUpdateAndSaveOrder() {
	const qc = useQueryClient();
	const updateRemote = useUpdateRemoteOrder();
	return useCallback(
		(order: Order) => {
			ordersCache.upsert(qc, order);
			updateRemote.mutate(order);
		},
		[qc, updateRemote],
	);
}
