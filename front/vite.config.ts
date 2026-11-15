import { getDefaultConfig } from "@elyspio/vite-eslint-config";
import babel from "@rolldown/plugin-babel";
import { reactCompilerPreset } from "@vitejs/plugin-react";
import { defineConfig, type PluginOption } from "vite-plus";

const config = getDefaultConfig({ basePath: import.meta.dirname });

// The shared config runs the React Compiler through Babel, whose parser rejects the legacy
// (TypeScript) decorators used by the Inversify services. Swap its Babel plugin for one that
// also parses `decorators-legacy`; the decorators themselves are still transformed by Oxc.
const isDefaultBabelPlugin = (plugin: PluginOption) => typeof plugin === "object" && plugin !== null && "name" in plugin && plugin.name === "@rolldown/plugin-babel";
// Typed as plain plugins, but the Babel one is an async factory: resolve them before filtering.
const defaultPlugins = (await Promise.all(config.plugins.map((plugin) => Promise.resolve(plugin as PluginOption)))).filter((plugin) => !isDefaultBabelPlugin(plugin));

export default defineConfig({
	...config,
	plugins: [
		...defaultPlugins,
		babel({
			presets: [reactCompilerPreset()],
			// Appended after the plugin's own per-extension overrides, so these parser plugin lists win.
			overrides: [
				{ include: /\.ts(?:$|\?)/, parserOpts: { plugins: ["typescript", "decorators-legacy"] } },
				{ include: /\.tsx(?:$|\?)/, parserOpts: { plugins: ["typescript", "jsx", "decorators-legacy"] } },
			],
		}),
	],
	fmt: {
		...config.fmt,
		ignorePatterns: [...config.fmt.ignorePatterns, "**/generated/**", "**/generated.ts", "public/**"],
	},
	lint: {
		...config.lint,
		ignorePatterns: [...config.lint.ignorePatterns, "**/generated/**", "**/generated.ts", "public/**"],
	},
	test: {
		// Playwright e2e specs under tests/e2e run with `pnpm test:e2e`, not Vitest.
		include: ["tests/units/**/*.test.{ts,tsx}", "src/**/*.test.{ts,tsx}"],
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
