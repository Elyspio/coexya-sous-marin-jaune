import { createReducer } from "@reduxjs/toolkit";
import { finishLogin, logout } from "./authentication.async.action";
import type { UserPermissions } from "@apis/backend/generated";

export interface AuthenticationState {
	logged: boolean;
	permissions?: UserPermissions;
}

const defaultState: AuthenticationState = {
	logged: false,
};

export const authenticationReducer = createReducer(defaultState, (builder) => {
	builder.addCase(finishLogin.fulfilled, (state, action) => {
		state.logged = true;
		state.permissions = action.payload.permissions;
	});

	builder.addCase(logout.fulfilled, (state) => {
		state.logged = defaultState.logged;
		state.permissions = undefined;
	});
});
