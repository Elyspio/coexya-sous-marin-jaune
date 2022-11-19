import { createSlice } from "@reduxjs/toolkit";
import { BurgerRecord } from "../../../core/apis/backend/generated";
import { addOrderRecord, openOrderModal, updateBurgerRecord } from "./orders.action";

export type OrderState = {
	altering?: number,
	name: string,
	wip: BurgerRecord[]

};


const initialState: OrderState = {
	name: "",
	wip: [],
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
			state.altering = state.wip.length - 1;
		});


		builder.addCase(updateBurgerRecord, (state, action) => {
			state.wip[state.altering!] = action.payload;
		});

		builder.addCase(openOrderModal, (state, action) => {
			state.altering = action.payload;
		});

	},
});

export const ordersReducer = slice.reducer;
