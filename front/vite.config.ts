import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import { defineConfig, type UserConfig } from "vite";

const config = getDefaultConfig({ basePath: __dirname }) as UserConfig;

export default defineConfig((env) => ({
	...config,
	server: {
		...config.server,
		proxy: {
			"/api": {
				target: "https://localhost:16000",
				changeOrigin: true,
				secure: false,
			},
			"/ws": {
				target: "https://localhost:16000",
				changeOrigin: true,
				secure: false,
				ws: true,
			},
		},
	},
}));
