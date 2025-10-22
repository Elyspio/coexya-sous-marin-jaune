import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { TokenService } from "@services/common/token.service";
import { type User, UserManager } from "oidc-client-ts";
import { UserService } from "@services/user.service";

const createAsyncThunk = createAsyncActionGenerator("authentication");

export const login = createAsyncThunk("login/start", async (_, { getState, dispatch, extra }) => {
	const mgr = getService(UserManager, extra);
	await mgr.signinRedirect();
});

export const silentLogin = createAsyncThunk("login/start-silent", async (_, { extra, dispatch }) => {
	const mgr = getService(UserManager, extra);
	const user = await mgr.signinSilent();
	if (user && !user.expired) {
		dispatch(finishLogin(user));
	}
});

export const logout = createAsyncThunk("logout", async () => {
	console.log("TODO : logout");
});

export const continueLogin = createAsyncThunk("login/continue", async (_, { getState, dispatch, extra }) => {
	const mgr = getService(UserManager, extra);
	const user = await mgr.signinCallback();
	if (user && !user.expired) {
		dispatch(finishLogin(user));
	}
	await window.router.navigate("/");
});

export const finishLogin = createAsyncThunk("login/finish", async (user: User, { extra }) => {
	const userService = getService(UserService, extra);

	const tokenService = getService(TokenService, extra);

	tokenService.setToken(user.access_token);

	return {
		user,
		permissions: await userService.getUserPermissions(),
	};
});
