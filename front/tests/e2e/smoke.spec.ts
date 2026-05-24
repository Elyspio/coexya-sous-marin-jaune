import { expect, test } from "@playwright/test";

test.beforeEach(async ({ page }) => {
	await page.goto("/");
	await page.evaluate(() => localStorage.clear());
	await page.reload();
});

test("la topbar et l'écran principal s'affichent", async ({ page }) => {
	await expect(page.getByText("Sous-marin Jaune", { exact: true })).toBeVisible();
	await expect(page.getByRole("button", { name: "Aujourd'hui" })).toBeVisible();
	await expect(page.getByRole("button", { name: "Historique" })).toBeVisible();
	// Sans prénom saisi, la création est désactivée.
	await expect(page.getByRole("button", { name: "Nouvelle commande" })).toBeDisabled();
});

test("le bouton de thème bascule clair / sombre", async ({ page }) => {
	const html = page.locator("html");
	await expect(html).toHaveClass("dark");
	await page.getByRole("button", { name: "Basculer le thème" }).click();
	await expect(html).toHaveClass("light");
	await page.getByRole("button", { name: "Basculer le thème" }).click();
	await expect(html).toHaveClass("dark");
});

test("la navigation Aujourd'hui / Historique change le titre", async ({ page }) => {
	await page.getByRole("button", { name: "Aujourd'hui" }).click();
	await expect(page.getByRole("heading", { name: "Commandes du midi" })).toBeVisible();
	await page.getByRole("button", { name: "Historique" }).click();
	await expect(page.getByRole("heading", { name: "Toutes les commandes" })).toBeVisible();
});
