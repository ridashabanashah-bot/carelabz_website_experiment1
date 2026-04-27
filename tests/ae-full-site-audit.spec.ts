import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

test.setTimeout(300000);

test("Full AE site crawl — collect all internal links and verify", async ({ page }) => {
  const visited = new Set<string>();
  const broken: string[] = [];
  const queue = ["/ae/"];

  while (queue.length > 0 && visited.size < 200) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    try {
      const res = await page.goto(`${BASE}${path}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      if (res && res.status() >= 400) {
        broken.push(`${res.status()} ${path}`);
        continue;
      }

      const links = await page
        .locator('a[href^="/ae/"]')
        .evaluateAll((els) =>
          els.map((el) => el.getAttribute("href")).filter(Boolean)
        );

      for (const link of links) {
        if (link && !visited.has(link) && link.startsWith("/ae/")) {
          queue.push(link);
        }
      }
    } catch {
      broken.push(`TIMEOUT ${path}`);
    }
  }

  console.log(`\nCrawled ${visited.size} pages`);
  if (broken.length > 0) {
    console.log("\nBROKEN:");
    broken.forEach((b) => console.log(`  ${b}`));
  }
  expect(broken.length, `Found ${broken.length} broken pages: ${broken.join(", ")}`).toBe(0);
});
