import { createContext, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type User, UserManager } from "oidc-client-ts";
import { service } from "../api/services";
import { UserService } from "@services/user.service";
import { TokenService } from "@services/common/token.service";
import type { UserPermissions } from "@apis/backend/generated";

type AuthState = {
	user: User | null;
	logged: boolean;
	permissions: UserPermissions | undefined;
	login: () => Promise<void>;
	logout: () => Promise<void>;
	continueLogin: () => Promise<void>;
	silentLogin: () => Promise<void>;
};

const AuthContext = createContext<AuthState | null>(null);

function applyUser(user: User | null) {
	const token = service(TokenService);
	if (user && !user.expired) token.setToken(user.access_token);
	else token.delete();
}

export function AuthProvider({ children }: { children: ReactNode }) {
	const [user, setUser] = useState<User | null>(null);
	const qc = useQueryClient();
	const logged = !!user && !user.expired;

	const permissionsQuery = useQuery({
		queryKey: ["auth", "permissions"],
		queryFn: () => service(UserService).getUserPermissions(),
		enabled: logged,
		staleTime: 5 * 60_000,
	});

	const finish = useCallback(
		(next: User | null) => {
			applyUser(next);
			setUser(next);
			if (next && !next.expired) {
				void qc.invalidateQueries({ queryKey: ["auth", "permissions"] });
			} else {
				qc.setQueryData(["auth", "permissions"], undefined);
			}
		},
		[qc],
	);

	const login = useCallback(async () => {
		const mgr = service(UserManager);
		await mgr.signinRedirect();
	}, []);

	const silentLogin = useCallback(async () => {
		const mgr = service(UserManager);
		try {
			const next = await mgr.signinSilent();
			if (next && !next.expired) finish(next);
		} catch {
			// silent renew can fail when no session — that's fine
		}
	}, [finish]);

	const continueLogin = useCallback(async () => {
		const mgr = service(UserManager);
		const next = await mgr.signinCallback();
		if (next && !next.expired) finish(next);
		await window.router.navigate("/");
	}, [finish]);

	const logout = useCallback(async () => {
		const mgr = service(UserManager);
		try {
			await mgr.removeUser();
		} catch {
			// ignore
		}
		finish(null);
	}, [finish]);

	useEffect(() => {
		void silentLogin();
	}, [silentLogin]);

	const value = useMemo<AuthState>(
		() => ({
			user,
			logged,
			permissions: permissionsQuery.data,
			login,
			logout,
			continueLogin,
			silentLogin,
		}),
		[user, logged, permissionsQuery.data, login, logout, continueLogin, silentLogin],
	);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth(): AuthState {
	const ctx = useContext(AuthContext);
	if (!ctx) throw new Error("useAuth must be used within AuthProvider");
	return ctx;
}
