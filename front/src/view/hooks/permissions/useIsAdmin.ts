import { useMemo } from "react";
import { useAuth } from "@/core/data/auth/AuthContext";

type AccessTokenPayload = {
	resource_access?: Record<string, { roles?: string[] }>;
};

function decodeJwtPayload(token: string): AccessTokenPayload | null {
	const segment = token.split(".")[1];
	if (!segment) return null;
	try {
		const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
		const padded = normalized + "=".repeat((4 - (normalized.length % 4)) % 4);
		const json = atob(padded);
		return JSON.parse(json) as AccessTokenPayload;
	} catch {
		return null;
	}
}

/**
 * Keycloak ships **client** role memberships in the access token's
 * `resource_access[<clientId>].roles` claim. We decode the access token locally
 * to drive UI affordances; every admin-only endpoint is also server-gated with
 * `[Authorize(Roles = "admin")]`, which is the authoritative check.
 */
export function useIsAdmin(): boolean {
	const { user } = useAuth();
	const accessToken = user?.access_token;
	const clientId = window.config.oidc.client_id;
	return useMemo(() => {
		if (!accessToken || !clientId) return false;
		const payload = decodeJwtPayload(accessToken);
		const roles = payload?.resource_access?.[clientId]?.roles;
		return Array.isArray(roles) && roles.includes("admin");
	}, [accessToken, clientId]);
}
