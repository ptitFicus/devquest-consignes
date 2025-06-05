import { chromium } from "playwright";

(async () => {
  // Setup
  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  await page.goto("http://localhost:3000/landing-page");
  await page.waitForTimeout(500);
  await page.screenshot({
    path: "./landing-page.jpg",
  });
  // Teardown
  await context.close();
  await browser.close();
})();
