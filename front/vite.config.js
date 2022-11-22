import { defineConfig } from "vite";
import usePluginImport from "vite-plugin-importer";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";
import react from "@vitejs/plugin-react";


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
		host: "0.0.0.0",
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
		react(),
		usePluginImport({
			libraryName: "@mui/icons-material",
			libraryDirectory: "esm",
		}),
	],

});
