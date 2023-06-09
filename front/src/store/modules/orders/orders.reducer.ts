import { createSlice } from "@reduxjs/toolkit";
import { Order } from "@apis/backend/generated";
import {
	createOrderRecord,
	deleteOrderRecord,
	removeOrder,
	setAlteringOrder,
	setAlteringRecord,
	setOrderRecordBurger,
	setOrderTimeRange,
	setUser,
	updateBurgerRecord,
	updateOrder,
	updateOrderPayment,
} from "./orders.action";
import { createOrder, deleteOrderPayement, getOrders, updateRemoteOrder } from "./orders.async.action";

export enum OrderTime {
	"today" = "Aujourd'hui",
	"month" = "1 mois",
	"months3" = "3 mois",
	"months6" = "6 mois",
	"year" = "1 an",
	"all" = "Toutes",
}

export type OrderState = {
	altering?: {
		order: Order["id"];
		record?: number;
	};
	name?: string;
	all: Record<Order["id"], Order>;
	mode: {
		order?: "create" | "update";
		record?: "create" | "update";
	};
	timeRange: OrderTime;
};

export const noneBurger = "none" as const;

let previousName = localStorage.getItem("user") ?? undefined;

if (previousName === "undefined") previousName = "";

const initialState: OrderState = {
	name: previousName,
	all: {},
	mode: {},
	timeRange: OrderTime.months3,
};

const slice = createSlice({
	name: "orders",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(createOrderRecord, (state) => {
			const len = state.all[state.altering!.order].burgers.push({
				name: noneBurger,
				vegetarian: false,
				xl: false,
				excluded: [],
			});
			state.altering!.record = len - 1;
			state.mode.record = "create";
		});

		builder.addCase(updateBurgerRecord, (state, action) => {
			state.all[state.altering!.order].burgers[state.altering!.record!] = action.payload;
		});

		builder.addCase(setOrderRecordBurger, (state, action) => {
			state.all[state.altering!.order].burgers[state.altering!.record!].name = action.payload;
		});

		builder.addCase(setUser, (state, action) => {
			state.name = action.payload;
			state.mode = {};
			localStorage.setItem("user", state.name!);
		});

		builder.addCase(getOrders.fulfilled, (state, action) => {
			state.all = {};
			action.payload.forEach((order) => {
				state.all[order.id] = order;
			});
		});

		builder.addCase(createOrder.fulfilled, (state, action) => {
			state.all[action.payload.id] = action.payload;
			state.altering = {
				order: action.payload.id,
			};
			state.mode.order = "create";
			state.mode.record = undefined;
		});

		builder.addCase(updateOrder, (state, action) => {
			state.all[action.payload.id] = action.payload;
		});

		builder.addCase(updateRemoteOrder.fulfilled, (state) => {
			state.mode = {};
		});

		builder.addCase(setAlteringRecord, (state, action) => {
			state.altering!.record = action.payload;
			if (action.payload === undefined) {
				state.mode.record = undefined;
			} else {
				state.mode.record = "update";
			}
		});

		builder.addCase(setAlteringOrder, (state, action) => {
			state.altering = action.payload
				? {
						order: action.payload,
				  }
				: undefined;
		});

		builder.addCase(deleteOrderRecord, (state, action) => {
			const order = state.all[state.altering!.order];
			order.burgers = [...order.burgers.slice(0, action.payload), ...order.burgers.slice(action.payload + 1)];
			if (action.payload === state.altering?.record) state.altering.record = undefined;
		});

		builder.addCase(removeOrder, (state, action) => {
			delete state.all[action.payload];
		});

		builder.addCase(setOrderTimeRange, (state, action) => {
			state.timeRange = action.payload;
		});

		builder.addCase(updateOrderPayment, (state, { payload: { type, value } }) => {
			const order = state.all[state.altering!.order];
			if (value === 0) {
				order.payments = order.payments.filter((p) => p.type !== type);
				return;
			}
			const payment = order.payments.find((p) => p.type === type);
			if (payment !== undefined) {
				payment.amount = value;
			} else {
				order.payments.push({
					type,
					amount: value,
				});
			}
		});

		builder.addCase(deleteOrderPayement.fulfilled, (state, action) => {
			const order = state.all[action.meta.arg.idOrder];
			order.payments = order.payments.filter((payment) => payment.type !== action.meta.arg.payementType);
		});
	},
});

export const ordersReducer = slice.reducer;
