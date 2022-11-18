import { createSlice } from "@reduxjs/toolkit";
import { Burger } from "../../../core/apis/backend/generated";
import { getBurgers } from "./burgers.actions";

export type TodoState = {
	all: Burger[]
};

const initialState: TodoState = {
	all: [],
};

const slice = createSlice({
	name: "burgers",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getBurgers.fulfilled, (state, action) => {
			state.all = action.payload;
		});
	},
});

export const burgersReducer = slice.reducer;
