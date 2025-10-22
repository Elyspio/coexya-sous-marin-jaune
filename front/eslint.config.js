import config from "@elyspio/vite-eslint-config/eslint.config.mjs";

/**
 * @type {import("eslint").Linter.Config[]}
 */
const conf = config;

conf.push({
	ignores: ["**/node_modules/**", "**/generated/**", "public/*", "dist/**"],
});

return conf;
