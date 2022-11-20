import { defineConfig } from "vite";
import swcReact from "vite-plugin-swc-react";
import usePluginImport from "vite-plugin-importer";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";


// https://vitejs.dev/config/
let isProduction = process.env.NODE_ENV === "production";
export default defineConfig({
	resolve: {
		alias: {
			events: "rollup-plugin-node-polyfills/polyfills/events",
		},
	},
	base: isProduction ? "/coexya/burgers/" : undefined,
	server: {
		port: 3000,
		host: true,
	},
	build: {
		minify: "terser",
		sourcemap: true,
		// terserOptions: {
		// 	compress: isProduction,
		// 	mangle: isProduction,
		// 	ie8: false,
		// 	keep_classnames: true,
		// 	ecma:2 020,
		// },
		rollupOptions: {
			output: {
				manualChunks: (id) => {
					if (id.includes("node_modules")) return "vendor";
				},
			},
		},
	},
	optimizeDeps: {
		esbuildOptions: {
			// Enable esbuild polyfill plugins
			plugins: [
				NodeModulesPolyfillPlugin(),
			],
		},
	},
	plugins: [
		swcReact({
			swcOptions: {
				jsc: {
					externalHelpers: true,
					target: isProduction ? "es2015" : "es2021",
					parser: {
						syntax: "typescript",
						jsx: true,
						dynamicImport: true,
						decorators: true,
						exportDefaultFrom: true,
					},
				},
			},
		}),
		usePluginImport({
			libraryName: "@mui/icons-material",
			libraryDirectory: "esm",
		}),
	],

});
