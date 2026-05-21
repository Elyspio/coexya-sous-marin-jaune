import { useCallback } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";
import type { Order, OrderPaymentType, Sauce } from "@apis/backend/generated";
import { service } from "../api/services";
import { OrderService } from "@services/order.service";
import { extractApiError } from "../api/extractError";
import { usersKeys } from "../users/users.keys";
import { ordersCache } from "./orders.cache";
import { useClientStore } from "@/core/store/clientStore";

export function useCreateOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (user: string) => service(OrderService).createOrder(user),
		onError: (e) => {
			toast.error(extractApiError(e, "Création impossible."));
		},
		onSuccess: (created) => {
			ordersCache.upsert(qc, created);
			useClientStore.setState({
				altering: { order: created.id },
				mode: { order: "create", record: undefined },
			});
		},
	});
}

export function useDeleteOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (id: Order["id"]) => service(OrderService).deleteOrder(id),
		onError: (e) => {
			toast.error(extractApiError(e, "Suppression impossible."));
		},
		onSuccess: (_data, id) => {
			ordersCache.remove(qc, id);
			void qc.invalidateQueries({ queryKey: usersKeys.list() });
		},
	});
}

export function useUpdateRemoteOrder() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: (order: Order) => service(OrderService).updateOrder(order),
		onError: (e) => {
			toast.error(extractApiError(e, "Mise à jour impossible."));
		},
		onSuccess: (_data, order) => {
			ordersCache.upsert(qc, order);
			useClientStore.setState({ mode: {} });
			void qc.invalidateQueries({ queryKey: usersKeys.list() });
		},
	});
}

export type UpdatePaymentReceivedParams = {
	idOrder: Order["id"];
	type: OrderPaymentType;
	value: number;
};

export function useUpdatePaymentReceived() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: ({ idOrder, type, value }: UpdatePaymentReceivedParams) => service(OrderService).updatePaymentReceived(idOrder, type, value),
		onError: (e) => {
			toast.error(extractApiError(e, "Mise à jour du paiement impossible."));
		},
		onSuccess: (_data, { idOrder, type, value }) => {
			ordersCache.patch(qc, idOrder, (order) => ({
				...order,
				payments: order.payments.map((p) => (p.type === type ? { ...p, received: value } : p)),
			}));
			void qc.invalidateQueries({ queryKey: usersKeys.list() });
		},
	});
}

type DeleteOrderPaymentParams = {
	idOrder: Order["id"];
	payementType: OrderPaymentType;
};

export function useDeleteOrderPayment() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ idOrder, payementType }: DeleteOrderPaymentParams) => {
			const list = qc.getQueryData<Order[]>(["orders", "list"]);
			const current = list?.find((o) => o.id === idOrder);
			if (!current) throw new Error("Order introuvable dans le cache.");
			const next: Order = cloneDeep(current);
			next.payments = next.payments.filter((p) => p.type !== payementType);
			await service(OrderService).updateOrder(next);
			return next;
		},
		onError: (e) => {
			toast.error(extractApiError(e, "Suppression du paiement impossible."));
		},
		onSuccess: (next) => {
			ordersCache.upsert(qc, next);
			void qc.invalidateQueries({ queryKey: usersKeys.list() });
		},
	});
}

type UpdateSauceQuantityParams = {
	idOrder: Order["id"];
	sauce: Sauce;
	quantity: number;
};

export function useUpdateSauceQuantity() {
	const qc = useQueryClient();
	return useMutation({
		mutationFn: async ({ idOrder, sauce, quantity }: UpdateSauceQuantityParams) => {
			const list = qc.getQueryData<Order[]>(["orders", "list"]);
			const current = list?.find((o) => o.id === idOrder);
			if (!current || !current.fries) return null;
			const next: Order = cloneDeep(current);
			const sauces = next.fries!.sauces;
			const existing = sauces.find((sq) => sq.sauce === sauce);
			if (existing) existing.amount = quantity;
			else sauces.push({ sauce, amount: quantity });
			await service(OrderService).updateOrder(next);
			return next;
		},
		onError: (e) => {
			toast.error(extractApiError(e, "Mise à jour des sauces impossible."));
		},
		onSuccess: (next) => {
			if (next) ordersCache.upsert(qc, next);
		},
	});
}

export function useDuplicateOrder() {
	const qc = useQueryClient();
	const createOrder = useCreateOrder();
	return useCallback(
		async (id: Order["id"]) => {
			const list = qc.getQueryData<Order[]>(["orders", "list"]);
			const burgersList = qc.getQueryData<{ name: string }[]>(["burgers", "list"]) ?? [];
			const old = list?.find((o) => o.id === id);
			if (!old) return;

			const orderName = useClientStore.getState().orderName;
			const created = await createOrder.mutateAsync(orderName ?? old.user);

			const duplicate: Order = {
				...cloneDeep(old),
				date: new Date().toISOString(),
				id: created.id,
				user: orderName ?? old.user,
				payments: [],
				paymentEnabled: created.paymentEnabled,
			};
			const missing = duplicate.burgers.filter((b) => !burgersList.some((b2) => b2.name === b.name));
			missing.forEach((burger) => {
				toast.warning(`Le burger "${burger.name}" n'est plus disponible`);
				duplicate.burgers = duplicate.burgers.filter((b) => b.name !== burger.name);
			});

			ordersCache.upsert(qc, duplicate);
		},
		[createOrder, qc],
	);
}
