import type { OidcClientSettings } from "oidc-client-ts";
import type { createBrowserRouter } from "react-router";

export type Config = {
	endpoints: {
		core: string;
		authentication: string;
	};
	loginPageUrl: "http://localhost";
	oidc: OidcClientSettings;
};

declare global {
	interface Window {
		config: Config;
		router: ReturnType<typeof createBrowserRouter>;
	}
}
