import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { OrderService } from "../../../core/services/order.service";
import { StoreState } from "../../index";
import { Order, OrderPaymentType } from "../../../core/apis/backend/generated";
import { deleteOrderRecord, updateOrder } from "./orders.action";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";

export const getOrders = createAsyncThunk("orders/getOrders", async (_, { extra }) => {
	const orderService = getService(OrderService, extra);
	return orderService.getAll();
});

export const createOrder = createAsyncThunk("orders/createOrder", async (_, { extra, getState }) => {
	const orderService = getService(OrderService, extra);

	const {
		orders: { name },
	} = getState() as StoreState;

	return orderService.createOrder(name!);
});

export const updateRemoteOrder = createAsyncThunk("orders/updateRemoteOrder", async (_, { extra, getState }) => {
	const {
		orders: { all, altering },
	} = getState() as StoreState;
	const order = all[altering!.order];

	const orderService = getService(OrderService, extra);

	await orderService.updateOrder(order);
});

export type UpdatePaymentReceivedParams = {
	idOrder: Order["id"];
	type: OrderPaymentType;
	value: number;
};
export const updatePaymentReceived = createAsyncThunk("orders/updatePaymentReceived", async ({ idOrder, value, type }: UpdatePaymentReceivedParams, { extra }) => {
	const orderService = getService(OrderService, extra);
	await orderService.updatePaymentReceived(idOrder, type, value);
});

export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (id: Order["id"], { extra, getState }) => {
	const orderService = getService(OrderService, extra);
	await orderService.deleteOrder(id);
});

export const deleteCurrentOrderRecord = createAsyncThunk<void>("orders/deleteCurrentOrderRecord", (_, { getState, dispatch }) => {
	const {
		orders: { altering },
	} = getState() as StoreState;
	dispatch(deleteOrderRecord(altering!.record!));
});

export const duplicateOrder = createAsyncThunk("orders/duplicateOrder", async (id: Order["id"], { getState, dispatch }) => {
	const { orders, burgers } = getState() as StoreState;
	const oldOrder = orders.all[id];

	let newOrder = (await dispatch(createOrder())).payload as Order;
	newOrder = {
		...cloneDeep(oldOrder),
		date: new Date().toISOString(),
		id: newOrder.id,
		user: orders.name,
		payments: [],
		paymentEnabled: newOrder.paymentEnabled,
	};

	const burgersToRemove = newOrder.burgers.filter(b => !burgers.all.some(b2 => b.name === b2.name));
	burgersToRemove.forEach(burger => {
		toast.warning(`Le burger "${burger.name}" n'est plus disponible`);
		newOrder.burgers = newOrder.burgers.filter(b => b.name !== burger.name);
	});

	dispatch(updateOrder(newOrder));
});

type DeleteOrderPayementParams = { idOrder: Order["id"]; payementType: OrderPaymentType };
export const deleteOrderPayement = createAsyncThunk("orders/deleteOrderPayement", async ({ payementType, idOrder }: DeleteOrderPayementParams, { getState, extra }) => {
	const {
		orders: { all },
	} = getState() as StoreState;
	const order = cloneDeep(all[idOrder]);

	order.payments = order.payments.filter(payement => payement.type !== payementType);

	const orderService = getService(OrderService, extra);

	await orderService.updateOrder(order);
});
