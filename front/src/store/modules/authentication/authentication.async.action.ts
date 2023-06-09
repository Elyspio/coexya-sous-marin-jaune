import store, { StoreState } from "../../index";
import { setTheme } from "../theme/theme.action";
import { toast } from "react-toastify";
import { container } from "@/core/di";
import { AuthenticationEvents, AuthenticationService } from "@services/common/authentication.service";
import { LocalStorageService } from "@services/common/localStorage.service";
import { DiKeysService } from "@/core/di/services/di.keys.service";
import { createAsyncActionGenerator, getService } from "../../utils/utils.actions";
import { setUserFromToken } from "./authentication.action";
import { TokenService } from "@services/common/token.service";
import { SettingsType } from "@apis/authentication/generated";

const createAsyncThunk = createAsyncActionGenerator("authentication");

const authentication = container.get(AuthenticationService);
const localStorages = container.get<LocalStorageService>(DiKeysService.localStorage.jwt);

function waitForLogin(page: Window) {
	return new Promise<void>((resolve) => {
		let interval: NodeJS.Timer | undefined;

		const clearInter = () => interval !== undefined && clearInterval(interval);
		page.onclose = clearInter;

		const func = () => {
			console.debug("Checking if user is logged from local storage");
			const isPresent = localStorages.get() !== undefined;
			if (isPresent) {
				clearInter();
				resolve();
				return true;
			}

			return false;
		};

		if (!func()) {
			interval = setInterval(() => {
				func();
			}, 250);
		}
	});
}

export const login = createAsyncThunk("login", async (_, { getState, dispatch, extra }) => {
	const tokenService = getService(TokenService, extra);

	const { logged } = (getState() as StoreState).authentication;

	if (!logged) {
		const toastId = toast.info("Connecting", { autoClose: false });
		const page = authentication.openLoginPage();
		if (page != null) {
			await waitForLogin(page);
			page.close();
			const user = tokenService.parseJwt(localStorages.get()!);
			AuthenticationEvents.emit("login", user);
			toast.update(toastId, {
				type: "success",
				render: "Logged",
				autoClose: 3000,
			});
			dispatch(setUserFromToken(user));
		} else {
			toast.update(toastId, {
				type: "error",
				render: "Could not login",
				autoClose: 3000,
			});
			throw new Error("An error occurred while opening the login page");
		}
	}
});

export const silentLogin = createAsyncThunk("silentLogin", async (_, { extra, dispatch }) => {
	const authenticationService = getService(AuthenticationService, extra);
	const tokenService = getService(TokenService, extra);

	const jwt = tokenService.getToken();

	if (jwt && (await authenticationService.isValid())) {
		const user = tokenService.parseJwt(jwt);
		AuthenticationEvents.emit("login", user);
		dispatch(setUserFromToken(user));
	} else {
		tokenService.delete();
	}
});

export const logout = createAsyncThunk("logout", async () => {
	await authentication.logout();
	AuthenticationEvents.emit("logout");
});

window.matchMedia("(prefers-color-scheme: dark)").addEventListener("change", (e) => {
	const newColorScheme = e.matches ? "dark" : "light";
	const { settings } = store.getState().authentication;
	if (settings?.theme === SettingsType.System) {
		store.dispatch(setTheme(newColorScheme));
	}
});
