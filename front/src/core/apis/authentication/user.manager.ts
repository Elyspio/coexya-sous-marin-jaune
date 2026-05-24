import { UserManager } from "oidc-client-ts";

// Vite-injected env vars (set by Aspire AppHost) win over the static `public/conf.js` runtime
// config. This lets the local Keycloak managed by Aspire override the conf.js defaults without
// rebuilding the SPA.
export function getUserManager() {
	const runtime = window.config.oidc;
	const authority = import.meta.env.VITE_OIDC_AUTHORITY ?? runtime.authority;
	const clientId = import.meta.env.VITE_OIDC_CLIENT_ID ?? runtime.client_id;

	return new UserManager({
		...runtime,
		authority,
		client_id: clientId,
		automaticSilentRenew: true,
	});
}
