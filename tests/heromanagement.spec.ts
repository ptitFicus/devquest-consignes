/*import { expect, test } from "@playwright/test";
import { read } from "fs";

import AxeBuilder from "@axe-core/playwright";

test("Empty application should display team creation button", async ({
  page,
}) => {
  await expect(
    page.getByRole("link", { name: "Create your team" })
  ).toBeVisible();
  await page.getByRole("link", { name: "Create your team" }).click();
  await expect(page).toHaveURL("/new-team");
});

async function readQuests(page): Promise<string[]> {
  const quests = await page.getByRole("listitem").all();
  const questTexts = await Promise.all(quests.map((l) => l.textContent()));
  return questTexts;
}

test("Reroll button should reroll quests and withdraw money", async ({
  page,
}) => {
  const quests = await readQuests(page);

  await page.getByRole("button", { name: "Reroll" }).click();

  await expect(page.getByText(quests[0])).toBeHidden();
  const questAfter = await readQuests(page);

  expect(quests).not.toEqual(questAfter);

  await expect(page.getByTestId("money")).toContainText("9000");
});

test("Creation screen should", async ({ page }) => {
  await page.getByRole("link", { name: "Create your team" }).click();
  await page.getByRole("button", { name: "Recruter Sir Belric de" }).click();
  await page
    .getByRole("button", { name: "Recruter Mirelda l’Onguentée" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Thamior Ombrefeuille" })
    .click();
  await page
    .getByRole("button", { name: "Recruter Gromrak Brisecasque" })
    .click();
  await page.getByRole("button", { name: "Créer le groupe" }).click();
  await expect(page).toHaveURL("/");
  await expect(
    page.getByRole("heading", { name: "Sir Belric de Griseval" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mirelda l’Onguentée" })
  ).toBeVisible();
  await expect(
    page.getByRole("heading", { name: "Mirelda l’Onguentée" })
  ).toBeVisible();
});

test("Title should be displayed", async ({ page }) => {
  await page.goto("/landing-page");
  await expect(
    page.getByRole("heading", { name: "Bienvenue aventurier !" })
  ).toBeVisible();
});

test("quest success should be displayed correctly", async ({ page }) => {
  await page.goto("/landing-page");
  await page.route(/api\/quetes\/.*\/_commencer/, async (route) => {
    route.fulfill({
      json: {
        name: "La clé du néant du volcan silencieux",
        morts: [],
        gain: 110,
      },
    });
  });

  await page.getByRole("textbox", { name: "Choisissez un nom" }).fill("foo");
  await page.getByRole("button", { name: "Commencer l'aventure !" }).click();
  await page.getByRole("link", { name: "Créé ton équipe !" }).click();
  await page.getByRole("button", { name: "Recruter Sir Belric de" }).click();
  await page.getByRole("button", { name: "Créer le groupe" }).click();
  await page.getByRole("listitem").nth(1).getByRole("button").click();
  await expect(
    page.getByRole("heading", {
      name: "La quête La clé du néant du volcan silencieux est un succès",
    })
  ).toBeVisible();
  await expect(page.getByText("Vous avez gagné 110")).toBeVisible();
  await expect(page.getByText("Aucun mort à déplorer")).toBeVisible();
});

test("accessibility", async ({ page, browser, context }) => {
  const anotherPageInNewContext = await (await browser.newContext()).newPage();
  const anotherPageInCurrentContext = await context.newPage();
});
*/
