import { createSlice } from "@reduxjs/toolkit";
import { ConfigBase } from "@apis/backend/generated";
import { setConfig } from "./config.actions";

export type ConfigState = ConfigBase;

const initialState: ConfigState = {
	kitchenOpened: false,
	paymentEnabled: false,
};

const slice = createSlice({
	name: "config",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(setConfig, (state, action) => {
			state.kitchenOpened = action.payload.kitchenOpened;
			state.paymentEnabled = action.payload.paymentEnabled;
			state.carrier = action.payload.carrier;
		});
	},
});

export const configReducer = slice.reducer;
