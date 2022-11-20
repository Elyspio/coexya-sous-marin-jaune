import { createAsyncThunk } from "@reduxjs/toolkit";
import { getService } from "../../common/common.actions";
import { OrderService } from "../../../core/services/order.service";
import { StoreState } from "../../index";


export const getOrders = createAsyncThunk("orders/getOrders", async (_, { extra }) => {
	const orderService = getService(OrderService, extra);
	return orderService.getAll();
});


export const createOrder = createAsyncThunk("orders/createOrder", async (_, { extra, getState }) => {
	const orderService = getService(OrderService, extra);

	const { orders: { name } } = getState() as StoreState;

	return orderService.createOrder(name!);
});