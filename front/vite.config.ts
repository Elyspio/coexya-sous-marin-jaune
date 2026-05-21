import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import { defineConfig } from "vite-plus";

const config = getDefaultConfig({ basePath: import.meta.dirname });

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
