# Playwright

## Table des matières

- [Mise en place](#mise-en-place)
- [Mise en place - application de test](#mise-en-place-application-de-test)
- [Premier test](#premier-test)
  - [Anatomie d'un test](#anatomie-dun-test)
- [C'est parti !](#cest-parti-)
  - [Apparté sur les sélecteurs](#apparté-sur-les-sélecteurs)
- [Lancer le test](#lancer-le-test)
- [À vous de jouer](#à-vous-de-jouer)
- [Codegen](#codegen)
- [BeforeEach](#beforeeach)
- [Plein de bonus si vous êtes en avance](#plein-de-bonus-si-vous-êtes-en-avance)
  - [Bouton de reroll](#bouton-de-reroll)
  - [Composition de l'équipe](#composition-de-léquipe)
  - [Invocation d'un héro](#invocation-dun-héro)
- [Bouchons](#bouchons)
- [Non régression visuelle](#non-régression-visuelle)
- [Tests de non régression d'accessibilité](#tests-de-non-régression-daccessibilité)
- [Tests multi onglets](#tests-multi-onglets)
- [Bonus : Playwright sans les tests](#bonus-playwright-sans-les-tests)
- [Bonus final : Page object model](#bonus-final-page-object-model)

## Mise en place

Pour installer Playwright, utilisez la commande suivante dans un dossier vide

```sh
npm init playwright@latest
```

L'outil va vous demander si vous voulez installer les navigateurs, dites oui !

Concernant JavaSrcript / Typescript je vous laisse décider.

Une fois tout installé, lancez la commande suivante pour vérifier l'installation.

```sh
npx playwright test --trace on
```

Vous aurez également besoin du codegen

```sh
npx playwright codegen
```

Enfin, copier / coller le contenu du fichier [playwright.config.ts](playwright.config.ts) à la place du votre.

[La doc](https://playwright.dev/docs/intro#installing-playwright)

## Mise en place - application de test

L'application à tester est disponible sous plusieurs formats :

- Un conteneur docker téléchargeable depuis docker hub `docker run -p 8080:8080 ptitficus/playwright`
- Des fichiers binaires disponibles ici https://github.com/ptitFicus/devquest/tree/main/bin
- Un jar (nécessite un jre 17+) disponible ici https://github.com/ptitFicus/devquest/blob/main/hero-management.jar

Par défaut, l'application démarre sur le port 8080.

## Premier test

### Anatomie d'un test

Un test se présente de la manière suivante :

```js
import { test, expect } from "@playwright/test";

test("Le nom du test", async ({ page }) => {
  // Le code du test ici
});
```

L'objet `page` donné en entrée représente un onglet du navigateur, et permet toute sorte d'interractions.

Les méthodes seront détaillées au fur et à mesures des besoins, mais elles sont toutes listées [sur cette page](https://playwright.dev/docs/api/class-page).

## C'est parti !

Nous allons rédiger un premier test allant sur la page de l'application et vérifiant que le titre est bien visible.
Pour commencez, créer un fichier `hero-management.js` dans le dossiers `tests` créé lors de l'initialisation de Playwright.

```js
test("Title should be displayed", async ({ page }) => {
  // Fait naviguer l'onglet vers l'adresse donnée
  await page.goto("http://localhost:8080/landing-page");

  // Décrit à playwright comment trouver l'élément qui nous intéresse
  const headerLocator = page.getByRole("heading", {
    name: "Bienvenue aventurier !",
  });

  // Test que l'élément décrit ci-dessus existe bien et soit visible
  await expect(headerLocator).toBeVisible();
});
```

### Apparté sur les sélecteurs

Le test ci-dessus utilise la méthode `getByRole` pour trouver un élément de la page.

Cette méthode permet de trouver un élément en se basant sur son rôle d'accessibilité, il faut lui passer le rôle de l'élément en premier argument (`heading`, `button`, `checkbox`, ...). Le deuxième argument permet de passer tout un tas d'argument, le plus utilisé étant `name`, qui permet de spécifier le nom de l'élément dans l'arbre d'accessibilité.

Pour plus de détails sur ce sélecteur (et sur les autres), [voir cette doc](https://playwright.dev/docs/locators#locate-by-role).

## Lancer le test

Pour lancer le test, plusieurs commande sont possibles :

```
npx playwright test
```

c'est la méthode la plus simple, mais aussi la moins aidante, tout va s'exécuter en arrière plan sans visualisation du navigateur par défaut.

Alternativement, Playwright propose une jolie UI permettant de visualiser divers détails

```
npx playwright test --ui
```

Enfin, Playwright dispose d'un excellent plugin VScode qui permet de lancer les tests directement depuis l'éditeur.

## À vous de jouer

Écrivez un premier test permettant de remplir le formulaire de la landing page et de passer à la page suivante.

Ne vous embêter pas avec le champ seed, saisissez juste un nom.

Vous aurez besoin des éléments suivants:

```js
page.getByLabel("<LE LABEL DU CHAMP>"); // Permet de sélectionner un champ de formulaire par label
await page.getByLabel("<>").fill("devquest"); // Rempli un champ de formulaire textuel
await page.getByRole("link", { name: "<NOM DU LIEN>" }).click(); // Click sur un lien, marche aussi avec "button"

await expect(page).toHaveUrl("http://localhost:8080/"); // Fait un assert sur l'URL attendue

await expect(page.getByRole(/*XXX*/)).toBeVisible(); // Sélectionne l'élément avec le rôle donné et vérifie qu'il est visible
await expect(page.getByText("<TEXT>")).toBeVisible(); // Vérifie que le texte donné est visible sur la page
```

Une fois le formulaire rempli et le bouton pressé, votre test doit vérifier que :

1. on arrive bien sur l'url "/"
2. Le titre "Hero manager" est visible
3. Le nom d'utilisateur saisi dans le formulaure est visible

⚠️⚠️⚠️
**N'oubliez pas les `await`**
⚠️⚠️⚠️

## Codegen

Nous allons utiliser le codegen pour écrire un autre test, tout d'abord lancez le codegen.

```sh
npx playwright codegen
```

Voici ce que le test devra faire

1. Passer le formulaire de la landing page en y saissant un nom (comme précédemment)
2. Aller sur la page de création de groupe
3. Sélectionner 4 héros
4. Créer le groupe
5. Vérifier que les héros sélectionnés sont bien présents sur la page d'accueil

Copiez / collez le code généré dans un nouveau test, nettoyer le en retirant les lignes qui vous semblent inutile et rajouter des `expect` là ou c'est nécessaire.

## BeforeEach

Nos tests modifient l'état interne de l'application, ce qui risque d'avoir des effets de bords indésirables sur d'autres tests.

Pour régler ce souci, nous allons réinitialiser l'application avant chaque test.

Pour cela appeler l'endpoint `/api/_reset` du backend (il faut faire un `DELETE` dessus) dans un `beforeEach`.

```js
test.beforeEach(async ({ page }) => {
  // ce code sera exécuté avant chaque test
});
```

Tout comme dans le code des tests, le code du beforeEach est exécuté dans un contexte nodeJS, et pas dans un contexte de navigateur.
Cela signifie que vous pouvez utilisez n'importe quelle dépendance node pour interragir avec le monde extérieur (driver de BDD, ...).

L'appel de cet endpoint provoque l'abandon de la partie en cours.

Vérifiez que le beforeEach fonctionne correctement en modifiant les tests précédents pour ne plus aller explicitement sur `landing-page`, mais sur `/` (la page `/` redirige vers `landing-page` lorsqu'aucune partie n'est en cours).

## Plein de bonus si vous êtes en avance

### Bouton de reroll

1. Vérifiez que le bouton reroll (visible lorsqu'un groupe est configuré) diminue bien l'argent (en haut à droite de l'écran) de 1000 à chaque utilisation.
2. Vérifiez qu'il est bien désactivé lorsque l'argent est insuffisant.
3. Vérifiez que le bouton génère bien une nouvelle liste de quête lorsque l'on clique dessus

### Composition de l'équipe

1. Vérifiez que la somme d'argent restante diminue bien lorsqu'un groupe est créé (-1000 par nouvel aventurier).
2. Vérifier que les boutons de recrutement disparaissent de l'écran de sélection des héros lorsque vous en avez 4.
3. Vérifiez que l'écran principal vous propose de compléter votre groupe si il comporte moins de 4 héros.

### Invocation d'un héro

1. Vérifier que le héro invoqué est bien ajouté à la liste
2. Vérifier que le héro invoqué peut-être ajoutée au groupe.

## Bouchons

Lorsque vous vous lancez dans une quête avec votre groupe de héros :

- Une quête peut être soit échouée soit réussie, si elle est réussie elle rapporte une récompense liée à sa difficuluté
- Que la quête soit réussie ou non, des héros peuvent y avoir laissé la vie

Ces deux éléments son aléatoires, ce qui rend les tests complexes.

Il y a deux moyens de régler ce problème : bouchonner les appels ou utiliser le système de seed.

Dans un premier temps nous allons utiliser un bouchon.

```js
await page.route(/.*\/url\/to\/mock\/.*/, async (route) => {
  await route.fullfill({
    json: /* JSON DATA */,
    status: /* status code */
  })
});
```

[La doc associée](https://playwright.dev/docs/api/class-page#page-route).

### Ce qu'il faut faire

1. À l'aide des devtools du navigateur, analysez le traffic http (endpoint / format de réponse) lors de la réalisation d'une quête
2. En vous aidant de l'extrait de code ci-dessus, testez le bon affichage des quêtes réussies et échouées

Pour faire des assertions plus précises et éviter les répétitions, il est possible de chaîner des locators :

```js
page.getByRole("dialog").getByText("<MON TEXTE>");

// Ou pour éviter de se répéter
const dialog = page.getByRole("dialog");
dialog.getByText("<MON TEXTE>");
```

### Bonus

Récupérer le nom de la quête dans la requête interceptée pour renvoyer un bouchon le plus fidèle possible à la réalité.

La requête peut être récupérée de la façon suivante :

```js
await page.route("/<ROUTE_TO_MOCK>", async (route) => {

  const request = route.request(); // Récupération de la requête

  await route.fullfill({
    json: /* JSON DATA */,
    status: /* status code */
  })
});
```

### Super bonus

[En vous aidant de cette page](https://playwright.dev/docs/mock#mocking-with-har-files) enregistrez l'ensemble des appels au backend au format HAR, de manière à pouvoir les rejouer lorsqu'une variable d'environnement `CI` est présente.

Utilisez une seed fixe pour vous assurez que le test soient reproductibles lorsque les "vrais appels" sont effectués.

C'est particulièrement utile si vous souhaitez pouvoir tester votre frontend en isolation du backend.

## Non régression visuelle

Les tests de non régressions visuels peuvent être utiles pour s'assurer qu'une page ou partie de la page ne change pas par accident.

Ils sont très simples et rapides à mettre en place, en revanche ils sont très sensibles au moindre changement graphique et sont donc à réserver pour des éléments n'ayant pas vocation à changer beaucoup.

```js
await expect(page).toHaveScreenshot();
```

Le test échouera la première fois, mais génèrera un screenshot "référence". Lors des exécutions suivantes, il comparera les nouveaux screenshots aux existants, et échouera si trop de pixels sont différents (ce seuil est paramétrable).

⚠️⚠️⚠️
**En fonction des navigateurs et OS, le rendu changera faisant échouer ces tests. Pour généraliser leur usage il est donc nécessaire de les exécuter dans un environnement contrôlé (par exemple dans un conteneur docker).**

[La documentation associée](https://playwright.dev/docs/test-snapshots)

### Ce qu'il faut faire

Réaliser un test de régression visuel sur la landing page.

Assurez vous que votre test fonctionnne correctement en modifiant l'affichage, par exemple en diminuant la taille du viewport avec :

```js
await page.setViewportSize({ width: 750, height: 750 });
```

## Tests de non régression d'accessibilité

Les tests de non régression d'accessibility permettent de garantir que l'accessibilité d'une page ne se dégrade pas au cours du temps, en s'appuyant sur un certain nombre de règles vérifiables automatiquement.

⚠️⚠️⚠️
**L'accessibilité ne peut être vérifiée en intégralité automatiquement, ce n'est pas parce que les vérifications automatique ne trouvent rien que votre site est accessible**

Vous allez tout d'abord avoir besoin d'installer axe et son intégration playwright.

```sh
npm i @axe-core/playwright
```

Le code pour déclencher une analyse est assez simple

```js
import AxeBuilder from "@axe-core/playwright";

const accessibilityScanResults = await new AxeBuilder({ page }).analyze();
expect(accessibilityScanResults.violations).toEqual([]);
```

[La documentation associée](https://playwright.dev/docs/accessibility-testing)

### Ce qu'il faut faire

Lancez un test d'accessibilité sur la landing page.

### Bonus

Il reste une erreur d'accessibilité sur la landing page, précisez au test de l'ignorer lors de la vérification, pour cela il faut trouver l'id de l'erreur et préciser que l'onsouhaite l'ignorer :

```js
await new AxeBuilder({ page }).disableRules(["<ID DE LA REGLE>"]).analyze();
```

## Tests multi onglets

Playwright permet d'ouvrir de nouveaux onglets, ou même de nouveau contextes de navigation.

```js
test("Opening a new tab", async ({ page, browser, context }) => {
  const anotherPageInNewContext = await (await browser.newContext()).newPage();
  const anotherPageInCurrentContext = await context.newPage();
});
```

### Ce qu'il faut faire

Ouvrez un nouvel onglet, puis vérifier que les modifications dans un onglet sont bien répertoriées dans le nouveau (en rechargeant la page).

## Bonus : Playwright sans les tests

Nous allons maintenant voir comment utiliser playwright hors de tout contexte de test, simplement pour exécuter et automatiser des actions dans le navigateur.

Créer un nouveau dossier `src` et un fichier `experimentation.js` (ou .ts) dedans.

### Ce qu'il faut faire

Dans ce fichier, écrivez un bout de code qui va sur la landing page, en prend un screenshot et le stocke dans un fichier local.

Voici le code pour prendre un screenshot

```js
import { chromium } from "playwright";

await page.screenshot({
  path: "./landing-page.jpg",
});
```

Et la structure globale du fichier

```js
import { chromium } from "playwright";

(async () => {
  // Setup
  const browser = await chromium.launch({ headless: false }); // Changer headless à true pour ne plus voir le navigateur
  const context = await browser.newContext();
  const page = await context.newPage();

  // Votre code va ici

  // Teardown
  await context.close();
  await browser.close();
})();
```

## Bonus final : Page object model

Lorsque les tests s'accumulent, le code peut vite devenir redondant.

On peut bien sûr factoriser du code en créant des fonctions, mais il est égalament possible d'organiser son code de test d'une autre manière à l'aide de la technique des "Page Object Models".

L'idée est de représenter chaque page de votre application par une classe JavaScript, chaque classe conservant les locator les plus couramment utilisés ainsi que les opérations les plus fréquentes.

### Ce qu'il faut faire

[Lisez la documentation sur les page object models](https://playwright.dev/docs/pom) et implémentez ce pattern dans vos tests.
