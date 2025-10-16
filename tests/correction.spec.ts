import AxeBuilder from "@axe-core/playwright";
import { test, expect, Page } from "@playwright/test";

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

// BONUS SI VOUS ÊTES EN AVANCE
test("reroll should lower money while possible", async ({ page }) => {
  await buildGroupe(page);
  const rerollButton = page.getByRole("button", { name: "Reroll" });
  await expect(page.getByTestId("money").getByText("6000")).toBeVisible();
  await rerollButton.click();
  await expect(page.getByTestId("money").getByText("5000")).toBeVisible();
  await rerollButton.click();
  await rerollButton.click();
  await rerollButton.click();
  await rerollButton.click();
  await rerollButton.click();
  await expect(rerollButton).toBeDisabled();
});

async function questNames(page) {
  const questList = await page
    .getByRole("button", { name: "commencer" })
    .locator("..")
    .all();

  return await Promise.all(questList.map((q) => q.textContent()));
}

test("reroll should update quest list", async ({ page }) => {
  await buildGroupe(page);

  const currentQuests = await questNames(page);
  const currentQuestsCheck = await questNames(page);
  expect(currentQuests).toEqual(currentQuestsCheck); // Consistency check

  await page.getByRole("button", { name: "Reroll" }).click();

  const newQuests = await questNames(page);
  expect(currentQuests).not.toEqual(newQuests);
});

async function intializeWithSeed(
  page: Page,
  seed: number,
  heroCount: number = 0
) {
  await page.goto("/");
  await page.getByLabel("Choisissez").fill("devquest");
  await page.getByLabel("Seed").fill("" + seed);
  await page.getByRole("button", { name: "Commencer" }).click();

  if (heroCount > 0) {
    await page.getByRole("link", { name: "Crée ton équipe !" }).click();
    for (let i = 0; i < heroCount; i++) {
      await page.getByRole("button", { name: "Recruter" }).nth(0).click();
    }

    await page.getByRole("button", { name: "Créer le groupe" }).click();
  }
}

test("Adding a member to the group should lower money", async ({ page }) => {
  await intializeWithSeed(page, 3, 2);
  await page.getByRole("link", { name: "Compléter l'équipe" }).click();
  await page.getByRole("button", { name: "Recruter" }).nth(0).click();
  await page.getByRole("button", { name: "Mettre à jour le groupe" }).click();
  await expect(page.getByTestId("money").getByText("7000")).toBeVisible();

  await page.getByRole("link", { name: "Compléter l'équipe" }).click();
  await page.getByRole("button", { name: "Recruter" }).nth(0).click();
  await expect(
    page.getByRole("button", { name: "Recruter" })
  ).not.toBeVisible();
  await page.getByRole("button", { name: "Mettre à jour le groupe" }).click();
  await expect(
    page.getByRole("link", { name: "Compléter l'équipe" })
  ).not.toBeVisible();
});

test("hero invocation", async ({ page }) => {
  await intializeWithSeed(page, 3);
  await page.getByRole("link", { name: "Crée ton équipe !" }).click();
  await page.getByRole("button", { name: "Invoquer un nouveau héro" }).click();
  await page.getByRole("textbox", { name: "Nom" }).fill("benjamin");
  await page.getByLabel("Classe").selectOption("wizard");
  await page
    .getByRole("textbox", { name: "Exploits (1 exploit / ligne)" })
    .fill(
      "A presque fini de préparer son codelab avant le jour j\nA passer 2 fois plus de temps à coder ce jeu nul que le corrigé"
    );
  await page
    .getByRole("button", { name: "Invoquer le héro (1000 💰)" })
    .click();
  await page
    .getByRole("button", { name: "Recruter benjamin (1000💰)" })
    .click();
  await page.getByRole("button", { name: "Créer le groupe" }).click();
  await expect(page.getByTestId("money").getByText("9000")).toBeVisible();
  await expect(page.getByText("benjamin")).toBeVisible();
});

// FIN DES BONUS

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

async function stubQuestResult(
  page: Page,
  deaths: string[] = [],
  gain?: Number
) {
  await page.route("**/_commencer", async (route) => {
    const url = route.request().url();
    const questName = decodeURIComponent(
      url.replaceAll(/.*\/quetes\//g, "").replaceAll("/_commencer", "")
    );

    await route.fulfill({
      json: {
        morts: deaths,
        name: questName,
        gain: gain,
      },
    });
  });
}

test("quest result should display correctly is quest succeeded", async ({
  page,
}) => {
  await buildGroupe(page);
  await stubQuestResult(page, ["Sir Belric de Griseval"], 100);
  await page.getByRole("button", { name: "commencer" }).first().click();

  await expect(
    page.getByRole("dialog").getByText(/La quête ".*" est un succès/)
  ).toBeVisible();

  await expect(page.getByText("🪦 Sir Belric de Griseval")).toBeVisible();
  await expect(page.getByText("Vous avez gagné 100 💰")).toBeVisible();

  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
});

test("quest result should display correctly is quest failed", async ({
  page,
}) => {
  await buildGroupe(page);
  await stubQuestResult(page, ["Sir Belric de Griseval"]);
  await page.getByRole("button", { name: "commencer" }).first().click();

  await expect(
    page.getByRole("dialog").getByText(/La quête ".*" a échoué/)
  ).toBeVisible();

  await expect(page.getByText("🪦 Sir Belric de Griseval")).toBeVisible();
  await expect(page.getByText("Vous avez gagné")).not.toBeVisible();

  await page.getByRole("button", { name: "OK" }).click();
  await expect(page.getByRole("dialog")).not.toBeVisible();
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

test("game end", async ({ page }) => {
  await buildGroupe(page);
  const rerollButton = page.getByRole("button", { name: "Reroll" });
  let totalSwords = await doFirstQuest(page);

  async function hasGroup() {
    return !(await page
      .getByText("Aucun membre dans votre groupe")
      .isVisible());
  }

  let hasGroupMember = await hasGroup();
  while (hasGroupMember) {
    totalSwords += await doFirstQuest(page);
    hasGroupMember = await hasGroup();
  }

  let gameOver = await isGameOver(page);
  while (!gameOver) {
    await rerollButton.click();
    gameOver = await isGameOver(page);
  }

  await expect(page.locator("#app")).toContainText(
    `Votre score est ${totalSwords} ⚔`
  );
});

async function isGameOver(page: Page) {
  return page
    .getByText("Partie terminée !")
    .waitFor({ state: "visible", timeout: 500 })
    .then(() => {
      console.log("visible");
      return true;
    })
    .catch(() => false);
}

async function doFirstQuest(page: Page) {
  const startButton = page.getByRole("button", { name: "commencer" }).first();
  const difficulty = await startButton
    .locator("..")
    .getByRole("img")
    .getAttribute("aria-label");

  await startButton.click();
  const dialog = page.locator("dialog");
  const isSuccess = (await dialog.textContent())?.includes("succès");
  await dialog.getByRole("button", { name: "OK" }).click();
  if (isSuccess) {
    return difficultyLabelToScore(difficulty!);
  } else {
    return 0;
  }
}

function difficultyLabelToScore(diff: string) {
  switch (diff) {
    case "facile":
      return 1;
    case "moyen":
      return 2;
    case "difficile":
      return 3;
    case "extreme":
      return 4;
    case "impossible":
      return 5;
    default:
      throw new Error(`unknown difficulty ${diff}`);
  }
}

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

test("aria snapshot", async ({ page }) => {
  await page.goto("/landing-page");
  await expect(page.getByRole("document")).toMatchAriaSnapshot(`
      - heading "Bienvenue aventurier !" [level=1]
      - text: Choisissez un nom
      - textbox "Choisissez un nom"
      - text: Seed
      - spinbutton "Seed"
      - button "Commencer l'aventure !"`);
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
