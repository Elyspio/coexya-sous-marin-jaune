// craco.config.js
const CracoSwcPlugin = require("craco-swc");
const rewireBabelLoader = require("craco-babel-loader");

const path = require("path");
const fs = require("fs");

const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);

module.exports = {
	plugins: [
		{
			plugin: CracoSwcPlugin,
			options: {
				swcLoaderOptions: {
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
			},
		},
		{
			plugin: rewireBabelLoader,
			options: {
				excludes: [], //things you want to exclude here
				//you can omit include or exclude if you only want to use one option
			},
		},
	],
	webpack: {
		configure: {
			ignoreWarnings: [
				function ignoreSourceMapsLoaderWarnings(warning) {
					return warning.module?.resource.includes("node_modules") && warning.details?.includes("source-map-loader");
				},
			],
		},
	},
};
