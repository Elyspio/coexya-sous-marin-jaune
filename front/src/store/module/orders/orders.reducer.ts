import { createSlice } from "@reduxjs/toolkit";
import { BurgerRecord, Order } from "../../../core/apis/backend/generated";
import {
	addOrderRecord,
	setAlteringOrder,
	setAlteringRecord,
	setUser,
	updateBurgerRecord,
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
		builder.addCase(addOrderRecord, (state, action) => {
			state.wip.push({
				name: action.payload,
				vegetarian: false,
				xl: false,
				excluded: [],
			});
			state.altering!.record = state.wip.length - 1;
		});


		builder.addCase(updateBurgerRecord, (state, action) => {
			state.all[state.altering!.order].burgers[state.altering!.record!] = action.payload;
		});

		builder.addCase(setUser, (state, action) => {
			state.name = action.payload;
			localStorage.setItem("user", state.name!);
		});

		builder.addCase(getOrders.fulfilled, (state, action) => {
			action.payload.forEach(order => {
				state.all[order.id] = order;
			});
		});

		builder.addCase(createOrder.fulfilled, (state, action) => {
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

	},
});

export const ordersReducer = slice.reducer;
