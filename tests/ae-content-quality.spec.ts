import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

const AE_PAGES = [
  "/ae/",
  "/ae/about/",
  "/ae/contact/",
  "/ae/services/",
  "/ae/blog/",
  "/ae/case-studies/",
];

test.describe("AE Content Quality — No Formatting Artifacts", () => {
  for (const path of AE_PAGES) {
    test(`${path} — no stray ** markdown bold`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      const matches = body.match(/\*{2,}/g) || [];
      expect(matches.length, `Found stray ** on ${path}: ${matches.join(", ")}`).toBe(0);
    });

    test(`${path} — no stray ## markdown headers in text`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      const matches = body.match(/#{2,}\s/g) || [];
      expect(matches.length, `Found stray ## on ${path}`).toBe(0);
    });

    test(`${path} — no HTML entities visible`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      const entities = ["&amp;", "&nbsp;", "&rsquo;", "&ldquo;", "&rdquo;", "&#8217;", "&#8220;"];
      for (const e of entities) {
        expect(body).not.toContain(e);
      }
    });

    test(`${path} — no null-prefixed emails`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      expect(html).not.toContain("nullinfo@");
      expect(html).not.toContain("nullmailto:");
    });

    test(`${path} — no Cloudflare email protection artifacts`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      expect(html).not.toContain("/cdn-cgi/l/email-protection");
    });

    test(`${path} — no dead carelabs.me links`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const deadLinks = await page.locator('a[href*="carelabs.me"]').count();
      expect(deadLinks).toBe(0);
    });
  }

  test("Service detail body has no ** artifacts", async ({ page }) => {
    await page.goto(`${BASE}/ae/services/`, { waitUntil: "domcontentloaded" });
    const firstLink = page.locator('a[href*="/ae/services/"][href$="-ae/"]').first();
    const href = await firstLink.getAttribute("href");
    if (href) {
      await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      const matches = body.match(/\*{2,}/g) || [];
      // Log context if found
      if (matches.length > 0) {
        const idx = body.indexOf("**");
        console.log(`URL: ${href}`);
        console.log(`First ** at ${idx}: ${body.substring(Math.max(0, idx - 60), idx + 100)}`);
      }
      expect(matches.length, `Found stray ** on ${href}`).toBe(0);
    }
  });

  test("Blog detail body has no ** artifacts", async ({ page }) => {
    await page.goto(`${BASE}/ae/blog/`, { waitUntil: "domcontentloaded" });
    const firstLink = page.locator('main a[href*="/ae/blog/"]').first();
    const href = await firstLink.getAttribute("href");
    if (href && href !== "/ae/blog/") {
      await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      const matches = body.match(/\*{2,}/g) || [];
      if (matches.length > 0) {
        const idx = body.indexOf("**");
        console.log(`URL: ${href}`);
        console.log(`First ** at ${idx}: ${body.substring(Math.max(0, idx - 60), idx + 100)}`);
      }
      expect(matches.length, `Found stray ** on ${href}`).toBe(0);
    }
  });
});
