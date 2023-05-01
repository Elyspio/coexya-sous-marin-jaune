import { createSlice } from "@reduxjs/toolkit";
import { getAllUsers } from "./users.async.action";
import { UserSold } from "@apis/backend/generated";

export type UserState = {
	all: UserSold[];
};

const initialState: UserState = {
	all: [],
};

const slice = createSlice({
	name: "users",
	initialState,
	reducers: {},
	extraReducers: (builder) => {
		builder.addCase(getAllUsers.fulfilled, (state, action) => {
			state.all = action.payload;
		});
	},
});

export const userReducer = slice.reducer;
