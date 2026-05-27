import { expect, test } from "@playwright/test";

/**
 * Cycle de vie d'une commande contre l'API réelle (cuisine ouverte).
 * Crée une commande pour un prénom unique, vérifie le prix issu de calculateOrderPrice,
 * parcourt l'étape paiement, puis supprime la commande pour ne rien laisser en base.
 */
test("création → personnalisation → prix → paiement → suppression", async ({ page }) => {
	const user = `E2E${Date.now()}`;

	await page.goto("/");
	await page.evaluate(() => localStorage.clear());
	await page.reload();

	// Saisie du prénom → activation de la création.
	const name = page.getByPlaceholder("Prénom");
	await name.click();
	await name.fill(user);
	await name.blur();

	const create = page.getByRole("button", { name: "Nouvelle commande" });
	await expect(create).toBeEnabled();
	await create.click();

	// La modale de choix de burger s'ouvre automatiquement.
	const dialog = page.getByRole("dialog");
	await expect(dialog.getByText("Choisir un burger")).toBeVisible();
	await dialog.getByTestId("burger-card-Yellow Submarine").click();
	await dialog.getByRole("button", { name: "Confirmer" }).click();

	// Retour au contenu : accompagnements.
	await expect(page.getByText("Accompagnements")).toBeVisible();
	await page.getByRole("switch", { name: "Frites" }).click();
	await page.getByRole("button", { name: "Coca", exact: true }).click();
	await page.getByRole("button", { name: "Cookie", exact: true }).click();

	// Prix = calculateOrderPrice : menu (burger + frites + boisson = 12,50) + dessert (3) = 15,50€.
	await expect(page.getByTestId("panel-total")).toHaveText("15,50€");

	// Aucun prix par burger : la carte burger du panneau ne contient pas de « € ».
	const panel = page.locator(".MuiDrawer-paper");
	const burgerCard = panel.getByText("Yellow Submarine").locator("xpath=ancestor::*[1]");
	await expect(burgerCard).not.toContainText("€");

	// Étape paiement : libellés et coordonnées réelles.
	await page.getByRole("button", { name: "Payer" }).click();
	await expect(page.getByText("Choisir les moyens")).toBeVisible();
	await expect(page.getByText("Liquide")).toBeVisible();
	// Sélection de Virement → l'IBAN apparaît dans la ligne de répartition.
	await page.getByTestId("pay-card-BankTransfer").click();
	await expect(page.getByText(/FR76/)).toBeVisible();
	// On déselectionne pour ne payer qu'en liquide.
	await page.getByTestId("pay-card-BankTransfer").click();

	// Sélection de Liquide + AUTO couvre le reste → le paiement est appliqué et persiste.
	await page.getByTestId("pay-card-Cash").click();
	await page.getByTestId("pay-auto-Cash").click();
	const validate = page.getByRole("button", { name: "Valider" });
	await expect(validate).toBeEnabled();
	await validate.click();

	// La ligne de commande apparaît dans la liste.
	const row = page.getByTestId(`order-row-${user}`);
	await expect(row).toBeVisible();
	await expect(row).toContainText("Yellow Submarine");

	// Nettoyage : suppression de la commande de test.
	await row.getByRole("button", { name: "Supprimer" }).click();
	await page.getByRole("button", { name: "Oui" }).click();
	await expect(page.getByTestId(`order-row-${user}`)).toHaveCount(0);
});
