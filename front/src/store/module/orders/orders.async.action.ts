import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { OrderService } from "../../../core/services/order.service";
import { StoreState } from "../../index";
import { Order } from "../../../core/apis/backend/generated";


export const getOrders = createAsyncThunk("orders/getOrders", async (_, { extra }) => {
	const orderService = getService(OrderService, extra);
	return orderService.getAll();
});


export const createOrder = createAsyncThunk("orders/createOrder", async (_, { extra, getState }) => {
	const orderService = getService(OrderService, extra);

	const { orders: { name } } = getState() as StoreState;

	return orderService.createOrder(name!);
});


export const deleteOrder = createAsyncThunk("orders/deleteOrder", async (id: Order["id"], { extra, getState }) => {
	const orderService = getService(OrderService, extra);
	await orderService.deleteOrder(id);
});

