import AxeBuilder from "@axe-core/playwright";
import { test, expect } from "@playwright/test";

test.beforeEach(async ({ page }) => {
  fetch("http://localhost:8080/api/_reset", {
    method: "DELETE",
  });
});

test("Title should be displayed", async ({ page }) => {
  // Fait naviguer l'onglet vers l'adresse donnée
  await page.goto("/landing-page");

  // Décrit à playwright comment trouver l'élément qui nous intéresse
  const headerLocator = page.getByRole("heading", {
    name: "Bienvenue aventurier !",
  });

  // Test que l'élément décrit ci-dessus existe bien et soit visible
  await expect(headerLocator).toBeVisible();
});

test("Landing page form", async ({ page }) => {
  await page.goto("/landing-page");
  await page.getByLabel("Choisissez un nom").fill("devquest");
  await page.getByRole("button", { name: "Commencer l'aventure !" }).click();

  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Hero manager " })
  ).toBeVisible();
});

test("Group creation", async ({ page }) => {
  await page.goto("/");
  await page.getByRole("textbox", { name: "Choisissez un nom" }).fill("fooo");
  await page.getByRole("button", { name: "Commencer l'aventure !" }).click();

  await page.getByRole("link", { name: "Crée ton équipe !" }).click();
  await page.getByRole("button", { name: "Recruter Sir Belric de" }).click();
  await page
    .getByRole("button", { name: "Recruter Mirelda l'Onguentée" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Thamior Ombrefeuille" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Gromrak Brisecasque" })
    .click();
  await page.getByRole("button", { name: "Créer le groupe" }).click();

  await expect(page).toHaveURL("/");

  await expect(page.getByText("Sir Belric de Griseval 🪑 A d")).toBeVisible();
  await page.getByText("Mirelda l'Onguentée 🌪️ A").click();
  await page.getByRole("heading", { name: "Thamior Ombrefeuille" }).click();
  await page.getByText("Gromrak Brisecasque 🍺 A vid").click();
});

async function buildGroupe(page) {
  await page.goto("/");
  await page
    .getByRole("textbox", { name: "Choisissez un nom" })
    .fill("devquest");
  await page.getByRole("button", { name: "Commencer l'aventure !" }).click();

  await page.getByRole("link", { name: "Crée ton équipe !" }).click();
  await page.getByRole("button", { name: "Recruter Sir Belric de" }).click();
  await page
    .getByRole("button", { name: "Recruter Mirelda l'Onguentée" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Thamior Ombrefeuille" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Gromrak Brisecasque" })
    .click();
  await page.getByRole("button", { name: "Créer le groupe" }).click();

  await expect(page).toHaveURL("/");
}

test("Stub quest result", async ({ page }) => {
  let name = "";
  await page.route(/.*\/api\/quetes\/.*\/_commencer/, async (route) => {
    const url = new URL(route.request().url());
    name = decodeURIComponent(
      url.pathname.replace("/api/quetes/", "").replace("/_commencer", "")
    );
    await route.fulfill({
      json: {
        name: name,
        morts: ["Sir Belric de Griseval"],
      },
    });
  });

  await buildGroupe(page);
  await page.getByRole("button", { name: "commencer" }).nth(0).click();

  const dialog = page.getByRole("dialog");
  await expect(dialog.getByText(name)).toBeVisible();
  await expect(
    dialog.getByRole("heading", { name: "Les héros suivants sont tombé" })
  ).toBeVisible();
  await expect(dialog.getByText("Sir Belric de Griseval")).toBeVisible();
});

test("HAR record", async ({ page }) => {
  await page.routeFromHAR("./hars/network.har", {
    update: !process.env.CI,
    url: "**/api/**",
  });
  await page.goto("/");
  await page.getByRole("textbox", { name: "Choisissez un nom" }).click();
  await page.getByRole("textbox", { name: "Choisissez un nom" }).fill("har");
  await expect(page.getByTestId("money")).toBeVisible();
  await page.getByRole("spinbutton", { name: "Seed" }).click();
  await page.getByRole("spinbutton", { name: "Seed" }).fill("3");
  await page.getByRole("button", { name: "Commencer l'aventure !" }).click();
  await page.getByRole("link", { name: "Crée ton équipe !" }).click();
  await page.getByRole("button", { name: "Recruter Sir Belric de" }).click();
  await page
    .getByRole("button", { name: "Recruter Mirelda l'Onguentée" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Thamior Ombrefeuille" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Gromrak Brisecasque" })
    .click();
  await page.getByRole("button", { name: "Créer le groupe" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "Le bouclier de l'aube des" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "OK" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "La voix des profondeurs des" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "OK" }).click();
  await page.getByRole("link", { name: "Compléter l'équipe" }).click();
  await page.getByRole("button", { name: "Recruter Sir Belric de" }).click();
  await page
    .getByRole("button", { name: "Recruter Mirelda l'Onguentée" })
    .click();
  await page.getByRole("button", { name: "Mettre à jour le groupe" }).click();
  await page
    .getByRole("listitem")
    .filter({ hasText: "La chaîne du sacrifice de la" })
    .getByRole("button")
    .click();
  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByTestId("money")).toBeVisible();
});

test("visual regression", async ({ page }) => {
  await page.goto("/landing-page");
  await expect(page).toHaveScreenshot();
});

test("accessibility", async ({ page }) => {
  await page.goto("/landing-page");
  const result = await new AxeBuilder({ page })
    .disableRules(["region"])
    .analyze();
  expect(result.violations).toHaveLength(0);
});

test("multi tabs", async ({ page, context }) => {
  await buildGroupe(page);

  await page.getByRole("button", { name: "Reroll" }).click();

  await expect(page.getByTestId("money").getByText("5000")).toBeVisible();
  await expect(page.getByText("devquest")).toBeVisible();

  const newPage = await context.newPage();
  await newPage.goto("/");
  await expect(newPage.getByTestId("money").getByText("5000")).toBeVisible();
  await expect(newPage.getByText("devquest")).toBeVisible();
});
