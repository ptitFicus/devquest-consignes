# Playwright

## Table des matières

- [Mise en place](#mise-en-place)
- [Mise en place - application de test](#application-de-test)
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
  - [Fin de partie](#fin-de-partie)
- [Bouchons](#bouchons)
- [Non régression visuelle](#non-régression-visuelle)
- [Tests de non régression d'accessibilité](#tests-de-non-régression-daccessibilité)
- [Tests de l'arbre d'accessibilité](#non-régression-de-larbre-daccessibilité)
- [Tests multi onglets](#tests-multi-onglets)
- [Bonus - Playwright sans les tests](#bonus--playwright-sans-les-tests)
- [Bonus final - Page object model](#bonus-final--page-object-model)
- [Corrigé](#correction)

## Mise en place

Pour installer Playwright, utilisez la commande suivante dans un dossier vide

```sh
npm init playwright@latest
```

L'outil va vous demander si vous voulez installer les navigateurs, dites oui !

Concernant JavaSrcript / Typescript je vous laisse décider.

Une fois tout installé, lancez la commande suivante pour vérifier l'installation.

```sh
npx playwright test
```

Enfin, copier / coller le contenu du fichier [playwright.config.ts](playwright.config.ts) à la place du votre.

[La doc](https://playwright.dev/docs/intro#installing-playwright)

## Application de test

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


## On se concentre sur Chromium

Comme vous avez pu le voir dans l'exécution de ce premier test, les tests s'exécutent sur firefox et chrome (Playwright supporte également edge et safari).

Pour gagner du temps dans la suite de ce hand's on, nous allons pour la suite nous concentrer surtout sur le navigateur chromium.

Pour cela, copiez / collez le contenu de [playwright-chromium.config.ts](playwright-chromium.config.ts) à la place de votre fichier `playwright.config.ts`.

## À vous de jouer

Écrivez un premier test permettant de remplir le formulaire de la landing page et de passer à la page suivante.

Ne vous embêtez pas avec le champ seed, saisissez juste un nom.

Le formulaire à remplir se trouve à [http://localhost:8080/landing-page](http://localhost:8080/landing-page).

Vous aurez besoin des éléments suivants:

```js
await page.goto("http://localhost:8080/UNE_URL"); // fait naviguer l'onglet actuel jusqu'à l'url donnée

page.getByLabel("<LE LABEL DU CHAMP>"); // Permet de sélectionner un champ de formulaire par label
await page.getByLabel("<>").fill("devquest"); // Rempli un champ de formulaire textuel
await page.getByRole("link", { name: "<NOM DU LIEN>" }).click(); // Click sur un lien, marche aussi avec "button"

await expect(page).toHaveURL("http://localhost:8080/"); // Fait un assert sur l'URL attendue

await expect(page.getByRole(/*XXX*/)).toBeVisible(); // Sélectionne l'élément avec le rôle donné et vérifie qu'il est visible
await expect(page.getByText("<TEXT>")).toBeVisible(); // Vérifie que le texte donné est visible sur la page
```

Une fois le formulaire rempli et le bouton pressé, votre test doit vérifier que :

1. on arrive bien sur l'url "/"
2. Le titre "Hero manager" est visible
3. Le nom d'utilisateur saisi dans le formulaire est visible

⚠️⚠️⚠️
**N'oubliez pas les `await`**
⚠️⚠️⚠️

## Codegen

Nous allons utiliser le codegen pour écrire un autre test, tout d'abord lancez le codegen.

```sh
npx playwright codegen
```

### Ce qu'il faut faire

Écriver un test qui

1. passe le formulaire de la landing page en y saissant un nom (comme précédemment)
2. va sur la page de création de groupe
3. sélectionn 4 héros
4. Crée le groupe
5. Vérifie que les héros sélectionnés sont bien présents **sur la page d'accueil**

Copiez / collez le code généré dans un nouveau test, nettoyer le en retirant les lignes qui vous semblent inutiles et rajouter des `expect` là ou c'est nécessaire.

Pour vous facilitez la vie pour la suite, vous pouvez factorisez la création d'un groupe dans une fonction prenant la `page` courante en entrée.

## BeforeEach

Nos tests modifient l'état interne de l'application, ce qui risque d'avoir des effets de bords indésirables sur d'autres tests.

Pour régler ce souci, nous allons réinitialiser l'application avant chaque test.

Pour cela, il faut appeler l'endpoint `/api/_reset` du backend (il faut faire un `DELETE` dessus) dans un `beforeEach`.

```js
test.beforeEach(async ({ page }) => {
  // ce code sera exécuté avant chaque test
  await fetch("http://localhost:8080/api/_reset", { method: "DELETE" });
});
```

Tout comme dans le code des tests, le code du beforeEach est exécuté dans un contexte nodeJS, et pas dans un contexte de navigateur.
Cela signifie que vous pouvez utilisez n'importe quelle dépendance node pour interragir avec le monde extérieur (driver de BDD, ...).

L'appel de cet endpoint provoque l'abandon de la partie en cours.

### Ce qu'il faut faire

- Vérifiez que le beforeEach fonctionne correctement en modifiant les tests précédents pour ne plus aller explicitement sur `landing-page`, mais sur `/` (la page `/` redirige vers `landing-page` lorsqu'aucune partie n'est en cours).
- Factorisez le remplissage du nom d'aventurier dans le beforeEach.

## Plein de bonus si vous êtes en avance

### Bouton de reroll

1. Vérifiez que le bouton reroll (visible lorsqu'un groupe est configuré) diminue bien l'argent (en haut à droite de l'écran) de 1000 à chaque utilisation.
2. Vérifiez qu'il est bien désactivé lorsque l'argent est insuffisant.
3. Vérifiez que le bouton génère bien une nouvelle liste de quêtes lorsque l'on clique dessus. Cet exercice peut s'avérer assez complexe car les quêtes changent à chaque nouvelle aventure. Pour régler ce problème vous pouvez soit fixer la "seed" sur la landing page dans votre test pour éliminer l'aléatoire, soit récupérer les noms de quêtes affichés avant / après pour vous assurez de leur différence.

<details>
  <summary>Spoiler (cliquez pour voir)</summary>
  <ul>
    <li>Pour lire le montant d'argent actuellement possédé, utilisez son attribut <a href="https://playwright.dev/docs/locators#locate-by-test-id">data-testid</a></li>
    <li>Récupérer le nom des quêtes est assez complexe, une solution est de partir des boutons "commencer" et de "remonter" le sélecteur d'un cran en faisant <code>bouton.locator("..")</code></li>
    <li>Pour faire un assert sur une différence, utilisez le modificateur ".not" <code>expect(oldQuests).not.toEqual(newQuests)</code></li>
  </ul>
</details>

### Composition de l'équipe

1. Vérifiez que la somme d'argent restante diminue bien lorsqu'un groupe est créé (-1000 par nouvel aventurier).
2. Vérifier que les boutons de recrutement disparaissent de l'écran de sélection des héros lorsque vous en avez 4.
3. Vérifiez que l'écran principal vous propose de compléter votre groupe si il comporte moins de 4 héros.

<details>
  <summary>Spoiler (cliquez pour voir)</summary>
  <ul>
    <li>Pour faire un assert sur la non visibilité d'un élément, utilisez le modificateur ".not" <code>await expect(page.getByRole("button", {name: "Recruter"})).not.toBeVisible()</code></li>
  </ul>
</details>

### Invocation d'un héro

1. Vérifier que le héro invoqué est bien ajouté à la liste
2. Vérifier que le héro invoqué peut-être ajoutée au groupe.


### Fin de partie

1. Vérifier qu'un écran de fin de partie s'affiche bien quand vous n'avez plus de héro et plus assez d'argent pour en recruter (utilisez le bouton reroll pour diminuer facilement votre argent).
2. Écrivez un test qui construit un groupe, fait des quêtes et vérifie que le nombre d'épée affichée à la fin de partie correspond bien aux quêtes qui ont été réussies (pour vous failitez la vie, vous pouvez fixer la seed, mais c'est possible sans).

## Bouchons

Lorsque vous vous lancez dans une quête avec votre groupe de héros :

- Une quête peut être soit échouée soit réussie, si elle est réussie elle rapporte une récompense liée à sa difficulté
- Que la quête soit réussie ou non, des héros peuvent y avoir laissé la vie

Ces deux éléments sont aléatoires, ce qui rend les tests complexes.

Il y a deux moyens de régler ce problème : bouchonner les appels ou utiliser le système de seed.

Dans cette section nous allons utiliser un bouchon.

```js

await page.route("**/mon/url", async (route) => {
// ou alors await page.route(/.*\/url\/as\/regex\/.*/, async (route) => {
  await route.fulfill({
    json: /* JSON DATA */,
    status: /* status code */
  })
});
```

[La doc associée](https://playwright.dev/docs/api/class-page#page-route).

### Ce qu'il faut faire

1. À l'aide des devtools du navigateur, analysez le traffic http (endpoint / format de réponse) lors de la réalisation d'une quête
2. En vous aidant de l'extrait de code ci-dessus, testez le bon affichage des quêtes réussies et échouées. Le but est uniquement de tester le contenu de la dialog, la situation de jeu est mise à jour via un autre endpoint !

Pour faire des assertions plus précises et éviter les répétitions, il est possible de chaîner des locators :

```js
page.getByRole("dialog").getByText("<MON TEXTE>");

// Ou pour éviter de se répéter
const dialog = page.getByRole("dialog");
dialog.getByText("<MON TEXTE>");
```

<details>
  <summary>Spoilers (cliquez pour afficher)</summary>
  Pour sélectionner le premier élément d'un locator, utilisez ".first()" : <code>await page.getByRole(/* TODO */).first().click();</code>
</details>

### Bonus

Récupérer le nom de la quête dans la requête interceptée pour renvoyer un bouchon le plus fidèle possible à la réalité.

La requête peut être récupérée de la façon suivante :

```js
await page.route("/<ROUTE_TO_MOCK>", async (route) => {

  const request = route.request(); // Récupération de la requête

  await route.fulfill({
    json: /* JSON DATA */,
    status: /* status code */
  })
});
```

### Super bonus

[En vous aidant de cette page](https://playwright.dev/docs/mock#mocking-with-har-files) enregistrez l'ensemble des appels au backend au format HAR, de manière à pouvoir les rejouer lorsqu'une variable d'environnement `CI` est présente.

Utilisez une seed fixe pour vous assurez que le test soient reproductibles lorsque les "vrais appels" sont effectués.

Ces bouchons au format HAR peuvent s'avérer particulièrement utiles si vous souhaitez pouvoir tester votre frontend en isolation du backend.

### Méga bonus (promis après on passe à autre chose)

Rejouez les tests en désactivant les endpoints du backend de manière à ce que le rejeux se fasse en se basant sur les fichiers HARs de l'étape précédente.

Pour cela : 

- Copiez le code ci-dessous SOUS votre bloc de code utilisant `routeFromHAR`

```js
// Playwright s'emmêle les pinceaux dans les requêtes successives
// à un même endpoint, ce bout de code règle le problème
// en incrémentant un header dédié à chaque appel
const requestUrlToSequence = new Map();
await page.route("**/api/**", async (route, request) => {
  const url = request.url();

  const previousRequestIndex = requestUrlToSequence.get(url) ?? 0;
  const currentRequestIndex = previousRequestIndex + 1;
  const headers = {
    ...request.headers(),
    "X-Playwright-Sequence": `${currentRequestIndex}`,
  };
  requestUrlToSequence.set(url, currentRequestIndex);

  await route.fallback({ headers });
});
```

- Coupez votre backend et relancez le avec le paramètre `--nobackend=true`, avec ce paramètre l'application devrait être inutilisable (le front est servie, l'endpoint de reset fonctionne, tous le reste renvoie des 500). Avec docker, vous pouvez relancer l'application en faisant `docker run -p 8080:8080 -e JAVA_TOOL_OPTIONS="-Dnobackend=true" ptitficus/playwright`
- Relancez vos tests en valorisant la variable d'environnement CI : `CI=true npx playwright test`

⚠️⚠️⚠️ Une fois que vous avez fini avec cette section, n'oubliez pas de relance l'application sans le `--nobackend=true` ⚠️⚠️⚠️

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

Les tests de non régression d'accessibilité permettent de garantir que l'accessibilité d'une page ne se dégrade pas au cours du temps, en s'appuyant sur un certain nombre de règles vérifiables automatiquement.

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


## Non régression de l'arbre d'accessibilité

Comme nous l'avons vu dans les sections précédentes, Playwright permet une approche très programmatique des vérifications (en sélectionnant les éléments via les locators et vérifiant leurs attributs) mais aussi une approche purement visuelle (via le snapshot testing).

Un entre-deux existe, qui permet de tester la non régression de l'arbre d'accessibilité.

```js
await expect(page.getByRole("document")).toMatchAriaSnapshot(`
  - heading "Coucou je suis un titre" [level=1]
  - text: Quel est votre nom ?
  - textbox "Choisissez un nom"
  - button "C'est mon nom !"`);
```

La méthode `toMatchAriaSnapshot` permet en effet de comparer le contenu d'un locator donné à une représentation textuelle de l'arbre d'accessibilité.

Cet arbe d'accessibilité peut omettre des éléments, ou même leur contenu textuel.

Il s'agit donc d'un mode de test assez résilient et très lisible, mais qui offre des garanties moins "strictes" que les deux autres.

[La documentation associée](https://playwright.dev/docs/aria-snapshots)

### Ce qu'il faut faire

Écrivez un test de non régression basé sur le snapshot d'accessibilité pour la landing page.

Le contenu de l'arbe peut-être obtenu facilement via le codegen ou vscode.

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


## Correction

La correction de tous les exercices et bonus (sauf les deux derniers) est disponibles dans le fichier [correction.spec.ts](./tests/correction.spec.ts).

La correction de l'avant dernier bonus "Playwright sans les tests" est disponible dans le fichier [experimentation.ts](./src/experimentation.ts).

Le dernier bonus "Page object model" n'a pas de correction parce que je n'ai pas encore pris le temps de le faire, n'hésitez pas à m'envoyer une Pull Request !
