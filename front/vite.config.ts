import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import { defineConfig } from "vite-plus";

const config = getDefaultConfig({ basePath: import.meta.dirname });

export default defineConfig({
	...config,
	fmt: {
		...config.fmt,
		ignorePatterns: [...config.fmt.ignorePatterns, "**/generated/**", "**/generated.ts", "public/**"],
	},
	lint: {
		...config.lint,
		ignorePatterns: [...config.lint.ignorePatterns, "**/generated/**", "**/generated.ts", "public/**"],
	},
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
});
