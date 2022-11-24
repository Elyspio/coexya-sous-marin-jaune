import { createSlice } from "@reduxjs/toolkit";
import { BurgerRecord, Order } from "../../../core/apis/backend/generated";
import {
	addOrderRecord,
	deleteOrderRecord,
	setAlteringOrder,
	setAlteringRecord,
	setOrderRecordBurger,
	setUser,
	updateBurgerRecord,
	updateOrder,
} from "./orders.action";
import { createOrder, getOrders } from "./orders.async.action";

export type OrderState = {
	altering?: {
		order: Order["id"],
		record?: number
	},
	name?: string,
	wip: BurgerRecord[]
	all: Record<Order["id"], Order>
};

export const noneBurger = "none" as const;

const initialState: OrderState = {
	name: localStorage.getItem("user") ?? undefined,
	wip: [],
	all: {},
};

const slice = createSlice({
	name: "orders",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(addOrderRecord, (state) => {
			const len = state.all[state.altering!.order].burgers.push({
				name: noneBurger,
				vegetarian: false,
				xl: false,
				excluded: [],
			});
			state.altering!.record = len - 1;
		});

		builder.addCase(updateBurgerRecord, (state, action) => {
			state.all[state.altering!.order].burgers[state.altering!.record!] = action.payload;
		});

		builder.addCase(setOrderRecordBurger, (state, action) => {
			state.all[state.altering!.order].burgers[state.altering!.record!].name = action.payload;
		});

		builder.addCase(setUser, (state, action) => {
			state.name = action.payload;
			localStorage.setItem("user", state.name!);
		});

		builder.addCase(getOrders.fulfilled, (state, action) => {
			state.all = {};
			action.payload.forEach(order => {
				state.all[order.id] = order;
			});
		});

		builder.addCase(createOrder.fulfilled, (state, action) => {
			state.all[action.payload.id] = action.payload;
			state.altering = {
				order: action.payload.id,
			};
		});


		builder.addCase(updateOrder, (state, action) => {
			state.all[action.payload.id] = action.payload;
		});

		builder.addCase(setAlteringRecord, (state, action) => {
			state.altering!.record = action.payload;
		});

		builder.addCase(setAlteringOrder, (state, action) => {
			state.altering = action.payload ? {
				order: action.payload,
			} : undefined;

		});

		builder.addCase(deleteOrderRecord, (state, action) => {
			let order = state.all[state.altering!.order];
			order.burgers = [...order.burgers.slice(0, action.payload), ...order.burgers.slice(action.payload + 1)];
		});
	},
});

export const ordersReducer = slice.reducer;
