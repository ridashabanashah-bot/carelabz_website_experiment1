import { chromium } from "playwright";

(async () => {
  const browser = await chromium.launch();
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  const page = await context.newPage();
  await page.goto(
    "http://localhost:3000/ae/services/study-analysis/arc-flash-study/",
    { waitUntil: "load", timeout: 60000 }
  );
  await page.waitForTimeout(2500);
  await page.screenshot({
    path: "data/screenshots/arc-flash-study-final.png",
    fullPage: true,
  });
  await browser.close();
  console.log("Screenshot saved to data/screenshots/arc-flash-study-final.png");
})();
