import { ExtraArgument } from "../index";
import { createAction, createAsyncThunk } from "@reduxjs/toolkit";
import { getOrders } from "../module/orders/orders.async.action";
import { getBurgers } from "../module/burgers/burgers.async.action";
import { silentLogin } from "../module/authentication/authentication.action";
import { getAllUsers } from "../module/users/users.async.action";
import { getConfig } from "../module/config/config.async.action";
import { UpdateSocketService } from "../../core/services/socket/update.socket.service";
import { removeOrder, updateOrder } from "../module/orders/orders.action";
import { setConfig } from "../module/config/config.actions";

type Constructor<T> = new (...args: any[]) => T;

export function getService<T>(service: Constructor<T>, extra): T {
	const { container } = extra as ExtraArgument;
	return container.get(service);
}

export function createActionBase(base: string) {
	return <T = void>(suffix: string) => createAction<T>(`${base}/${suffix}`);
}

export const initApp = createAsyncThunk("initApp", async (_, { dispatch, extra }) => {
	dispatch(getBurgers());
	dispatch(getOrders());
	dispatch(silentLogin());
	dispatch(getAllUsers());
	dispatch(getConfig());

	const updateSocketService = getService(UpdateSocketService, extra);

	const socket = await updateSocketService.createSocket();

	socket.on("OrderUpdated", order => {
		dispatch(updateOrder(order));
		dispatch(getAllUsers());
	});

	socket.on("OrderDeleted", orderId => {
		dispatch(removeOrder(orderId));
		dispatch(getAllUsers());
	});

	socket.on("ConfigUpdated", config => dispatch(setConfig(config)));
});
