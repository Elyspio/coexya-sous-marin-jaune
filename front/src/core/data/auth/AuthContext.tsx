import {createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState} from "react";
import {type User, UserManager} from "oidc-client-ts";
import {getService} from "../api/services";
import {TokenService} from "@services/common/token.service";

type AuthState = {
	user: User | null;
	logged: boolean;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	continueLogin: () => Promise<void>;
	silentLogin: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function applyUser(user: User | null) {
	const tokenService = getService(TokenService);
	if (user && !user.expired) tokenService.setToken(user.access_token);
	else tokenService.delete();
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const logged = !!user && !user.expired;

	const finish = useCallback((next: User | null) => {
		applyUser(next);
		setUser(next);
	}, []);

	const login = useCallback(async () => {
		const mgr = getService(UserManager);
		await mgr.signinRedirect();
	}, []);

	const silentLogin = useCallback(async () => {
		const mgr = getService(UserManager);
		try {
			const next = await mgr.signinSilent();
			if (next && !next.expired) finish(next);
		} catch {
			// silent renew can fail when no session — that's fine
		}
	}, [finish]);

	const continueLogin = useCallback(async () => {
		const mgr = getService(UserManager);
		const next = await mgr.signinCallback();
		if (next && !next.expired) finish(next);
		await window.router.navigate("/");
	}, [finish]);

	const logout = useCallback(async () => {
		const mgr = getService(UserManager);
		try {
			await mgr.removeUser();
		} catch {
			// ignore
		}
		finish(null);
	}, [finish]);

	useEffect(() => {
		const mgr = getService(UserManager);

		const onLoaded = (next: User) => finish(next);
		const onUnloaded = () => finish(null);
		// Silent renew exhausted its refresh token (or the session ended). Drop the
		// stale token so the UI falls back to a fresh login instead of sending an expired one.
		const onRenewError = () => finish(null);

		mgr.events.addUserLoaded(onLoaded);
		mgr.events.addUserUnloaded(onUnloaded);
		mgr.events.addSilentRenewError(onRenewError);

		void silentLogin();

		return () => {
			mgr.events.removeUserLoaded(onLoaded);
			mgr.events.removeUserUnloaded(onUnloaded);
			mgr.events.removeSilentRenewError(onRenewError);
		};
	}, [finish, silentLogin]);

	const value = useMemo<AuthState>(
		() => ({
			user,
			logged,
			login,
			logout,
			continueLogin,
			silentLogin,
		}),
		[user, logged, login, logout, continueLogin, silentLogin],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
