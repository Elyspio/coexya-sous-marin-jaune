import { createSlice } from "@reduxjs/toolkit";
import { ConfigBase } from "../../../core/apis/backend/generated";
import { setConfig } from "./config.actions";

export type ConfigState = ConfigBase & {};

const initialState: ConfigState = {
	kitchenOpened: false,
	paymentEnabled: false,
};

const slice = createSlice({
	name: "config",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(setConfig, (state, action) => {
			Object.keys(action.payload).forEach(key => {
				state[key] = action.payload[key];
			});
		});
	},
});

export const configReducer = slice.reducer;
