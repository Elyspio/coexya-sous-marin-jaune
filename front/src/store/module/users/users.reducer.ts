import { createSlice } from "@reduxjs/toolkit";
import { User } from "../../../core/apis/backend/generated";
import { getAllUsers } from "./users.async.action";

export type ModalType = "message" | "mergeUsers" | "balances";

export type UserState = {
	all: User[];
};

const initialState: UserState = {
	all: [],
};

const slice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: builder => {
		builder.addCase(getAllUsers.fulfilled, (state, action) => {
			state.all = action.payload;
		});
	},
});

export const userReducer = slice.reducer;
