interface ImportMetaEnv {
	readonly BASE_URL: string;
	readonly VITE_OIDC_AUTHORITY?: string;
	readonly VITE_OIDC_CLIENT_ID?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}
