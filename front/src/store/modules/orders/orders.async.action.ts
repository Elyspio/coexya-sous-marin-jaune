import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { OrderService } from "@services/order.service";
import { StoreState } from "@store";
import { Order, OrderPaymentType, Sauce } from "@apis/backend/generated";
import { deleteOrderRecord, updateOrder } from "./orders.action";
import { cloneDeep } from "lodash";
import { toast } from "react-toastify";

const createAsyncThunk = createAsyncActionGenerator("orders");

export const getOrders = createAsyncThunk("getOrders", async (_, { extra }) => {
	const orderService = getService(OrderService, extra);
	return orderService.getAll();
});

export const createOrder = createAsyncThunk("createOrder", async (_, { extra, getState }) => {
	const orderService = getService(OrderService, extra);

	const {
		orders: { name },
	} = getState() as StoreState;

	return orderService.createOrder(name!);
});

export const updateRemoteOrder = createAsyncThunk("updateRemoteOrder", async (_, { extra, getState }) => {
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
export const updatePaymentReceived = createAsyncThunk("updatePaymentReceived", async ({ idOrder, value, type }: UpdatePaymentReceivedParams, { extra }) => {
	const orderService = getService(OrderService, extra);
	await orderService.updatePaymentReceived(idOrder, type, value);
});

export const deleteOrder = createAsyncThunk("deleteOrder", async (id: Order["id"], { extra }) => {
	const orderService = getService(OrderService, extra);
	await orderService.deleteOrder(id);
});

export const deleteCurrentOrderRecord = createAsyncThunk<void>("deleteCurrentOrderRecord", (_, { getState, dispatch }) => {
	const {
		orders: { altering },
	} = getState() as StoreState;
	dispatch(deleteOrderRecord(altering!.record!));
});

export const duplicateOrder = createAsyncThunk("duplicateOrder", async (id: Order["id"], { getState, dispatch }) => {
	const { orders, burgers } = getState() as StoreState;
	const oldOrder = orders.all[id];

	let newOrder = (await dispatch(createOrder())).payload as Order;
	newOrder = {
		...cloneDeep(oldOrder),
		date: new Date().toISOString(),
		id: newOrder.id,
		user: orders.name!,
		payments: [],
		paymentEnabled: newOrder.paymentEnabled,
	};

	const burgersToRemove = newOrder.burgers.filter((b) => !burgers.all.some((b2) => b.name === b2.name));
	burgersToRemove.forEach((burger) => {
		toast.warning(`Le burger "${burger.name}" n'est plus disponible`);
		newOrder.burgers = newOrder.burgers.filter((b) => b.name !== burger.name);
	});

	dispatch(updateOrder(newOrder));
});

type DeleteOrderPayementParams = { idOrder: Order["id"]; payementType: OrderPaymentType };
export const deleteOrderPayement = createAsyncThunk("deleteOrderPayement", async ({ payementType, idOrder }: DeleteOrderPayementParams, { getState, extra }) => {
	const {
		orders: { all },
	} = getState() as StoreState;
	const order: Order = cloneDeep(all[idOrder]);

	order.payments = order.payments.filter((payement) => payement.type !== payementType);

	const orderService = getService(OrderService, extra);

	await orderService.updateOrder(order);
});

type UpdateOrderSauceQuantity = {
	idOrder: Order["id"];
	quantity: number;
	sauce: Sauce;
};
export const updateOrderSauceQuantity = createAsyncThunk("updateOrderSauceQuantity", async ({ sauce, quantity, idOrder }: UpdateOrderSauceQuantity, { extra, getState }) => {
	const {
		orders: { all },
	} = getState() as StoreState;
	const order: Order = cloneDeep(all[idOrder]);

	if (!order.fries) return order;

	let sauceQuantity = order.fries.sauces.find((sq) => sq.sauce === sauce);

	if (!sauceQuantity) {
		sauceQuantity = {
			sauce,
			amount: quantity,
		};
		order.fries?.sauces.push(sauceQuantity);
	}

	sauceQuantity.amount = quantity;

	const orderService = getService(OrderService, extra);

	await orderService.updateOrder(order);
});
