import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { OrderService } from "../../../core/services/order.service";
import { StoreState } from "../../index";
import { Order } from "../../../core/apis/backend/generated";
import { deleteOrderRecord, removeOrder, updateOrder } from "./orders.action";
import { UpdateSocketService } from "../../../core/services/socket/update.socket.service";
import { cloneDeep } from "lodash";

export const getOrders = createAsyncThunk("orders/getOrders", async (_, { extra }) => {
	const orderService = getService(OrderService, extra);
	return orderService.getAll();
});


export const createOrder = createAsyncThunk("orders/createOrder", async (_, { extra, getState }) => {
	const orderService = getService(OrderService, extra);

	const { orders: { name } } = getState() as StoreState;

	return orderService.createOrder(name!);
});


export const updateRemoteOrder = createAsyncThunk("orders/updateRemoteOrder", async (_, { extra, getState }) => {
	const { orders: { all, altering } } = getState() as StoreState;
	const order = all[altering!.order];

	const orderService = getService(OrderService, extra);

	await orderService.updateOrder(order);


});

export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (id: Order["id"], { extra, getState }) => {
	const orderService = getService(OrderService, extra);
	await orderService.deleteOrder(id);
});

export const deleteCurrentOrderRecord = createAsyncThunk<void>("orders/deleteCurrentOrderRecord", (_, {
	getState,
	dispatch,
}) => {
	const { orders: { altering } } = getState() as StoreState;
	dispatch(deleteOrderRecord(altering!.record!));
});


export const duplicateOrder = createAsyncThunk("orders/duplicateOrder", async (id: Order["id"], {
	getState,
	dispatch,
}) => {
	const { orders } = getState() as StoreState;
	const oldOrder = orders.all[id];


	let newOrder = (await dispatch(createOrder())).payload as Order;
	newOrder = {
		...cloneDeep(oldOrder),
		date: new Date().toISOString(),
		id: newOrder.id,
		user: orders.name,
	};

	dispatch(updateOrder(newOrder));
});


export const startOrderUpdateSynchro = createAsyncThunk("orders/startWebSocketSynchro", async (_, {
	extra,
	dispatch,
}) => {
	const updateSocketService = getService(UpdateSocketService, extra);

	const socket = await updateSocketService.createSocket();

	socket.on("OrderUpdated", order => {
		dispatch(updateOrder(order));
	});

	socket.on("OrderDeleted", orderId => {
		dispatch(removeOrder(orderId));
	});
});