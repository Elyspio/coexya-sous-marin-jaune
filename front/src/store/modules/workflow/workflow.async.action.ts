import { getBurgers } from "@modules/burgers/burgers.async.action";
import { getOrders } from "@modules/orders/orders.async.action";
import { silentLogin } from "@modules/authentication/authentication.async.action";
import { getAllUsers } from "@modules/users/users.async.action";
import { getConfig } from "@modules/config/config.async.action";
import { UpdateSocketService } from "@services/socket/update.socket.service";
import { removeOrder, updateOrder } from "@modules/orders/orders.action";
import { setConfig } from "@modules/config/config.actions";
import { createAsyncActionGenerator, getService } from "@store/utils/utils.actions";

const createAsyncThunk = createAsyncActionGenerator("workflow");

export const initApp = createAsyncThunk("initApp", async (_, { dispatch, extra }) => {
	dispatch(getBurgers());
	dispatch(getOrders());
	dispatch(silentLogin());
	dispatch(getAllUsers());
	dispatch(getConfig());

	const updateSocketService = getService(UpdateSocketService, extra);

	const socket = await updateSocketService.createSocket();

	socket.on("OrderUpdated", (order) => {
		dispatch(updateOrder(order));
		dispatch(getAllUsers());
	});

	socket.on("OrderDeleted", (orderId) => {
		dispatch(removeOrder(orderId));
		dispatch(getAllUsers());
	});

	socket.on("ConfigUpdated", (config) => dispatch(setConfig(config)));
});
