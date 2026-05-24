import { defineConfig, devices } from "@playwright/test";

/**
 * E2E contre l'app live servie par Aspire (Vite dev) sur https://localhost:3000.
 * Le certificat est auto-signé → ignoreHTTPSErrors. L'app doit déjà tourner (aspire run).
 */
export default defineConfig({
	testDir: "./tests/e2e",
	fullyParallel: false,
	workers: 1,
	retries: 0,
	timeout: 30_000,
	expect: { timeout: 10_000 },
	reporter: [["list"]],
	use: {
		baseURL: "https://localhost:3000",
		ignoreHTTPSErrors: true,
		headless: true,
		trace: "on-first-retry",
		screenshot: "only-on-failure",
	},
	projects: [{ name: "chromium", use: { ...devices["Desktop Chrome"] } }],
});
