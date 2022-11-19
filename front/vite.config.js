import { defineConfig } from "vite";
import swcReact from "vite-plugin-swc-react";
import usePluginImport from "vite-plugin-importer";
import { NodeModulesPolyfillPlugin } from "@esbuild-plugins/node-modules-polyfill";


// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			events: "rollup-plugin-node-polyfills/polyfills/events",
		},
	},
	base: process.env.NODE_ENV === "production" ? "/coexya/burgers/" : undefined,
	server: {
		port: 3000,
		host: true,
	},
	build: {
		minify: "terser",
		terserOptions: {
			compress: true,
			mangle: true,
			ie8: false,
			keep_classnames: true,
			ecma: 2020,
			format: { comments: false },
		},
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
					target: "es2015",
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
