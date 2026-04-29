import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

// Spot-check a handful of service slugs that should always resolve.
// (Footer used to list these directly; now footer is category-only, but
// the URLs themselves still need to work.)
const FOOTER_LINKS = [
  "/ae/services/arc-flash-study-analysis-ae/",
  "/ae/services/short-circuit-study-analysis-ae/",
  "/ae/services/load-flow-analysis-ae/",
  "/ae/services/relay-coordination-study-and-analysis-ae/",
  "/ae/services/protection-coordination-study-ae/",
  "/ae/services/cable-testing-ae/",
];

const FOOTER_CATEGORY_LINKS = [
  "/ae/services/category/testing/",
  "/ae/services/category/calibration/",
  "/ae/services/category/inspection/",
  "/ae/services/category/study-and-analysis/",
];

test.describe("AE Broken Link Fixes", () => {
  for (const path of FOOTER_LINKS) {
    test(`Footer link ${path} should not 404`, async ({ page }) => {
      const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      expect(res?.status()).not.toBe(404);
    });
  }

  test("No /ae/contact-us/ links on about page", async ({ page }) => {
    await page.goto(`${BASE}/ae/about/`, { waitUntil: "domcontentloaded" });
    expect(await page.locator('a[href*="/ae/contact-us"]').count()).toBe(0);
  });

  test("No /ae/contact-us/ links on a service detail", async ({ page }) => {
    await page.goto(`${BASE}/ae/services/arc-flash-study-analysis-ae/`, {
      waitUntil: "domcontentloaded",
    });
    expect(await page.locator('a[href*="/ae/contact-us"]').count()).toBe(0);
  });

  test("No nullinfo@ / nullmailto: anywhere on homepage", async ({ page }) => {
    await page.goto(`${BASE}/ae/`, { waitUntil: "domcontentloaded" });
    const html = await page.content();
    expect(html).not.toContain("nullinfo@");
    expect(html).not.toContain("nullmailto:");
  });

  test("No /cdn-cgi/ links on Trakhees blog post", async ({ page }) => {
    const slug =
      "electrical-installation-inspection-fulfilling-trakhees-guidelines-to-procure-operation-fitness-certificate-ofc";
    await page.goto(`${BASE}/ae/blog/${slug}/`, { waitUntil: "domcontentloaded" });
    expect(await page.locator('a[href*="cdn-cgi"]').count()).toBe(0);
  });

  test("No carelabs.me links on Megger Test blog", async ({ page }) => {
    await page.goto(`${BASE}/ae/blog/megger-test-performed/`, {
      waitUntil: "domcontentloaded",
    });
    expect(await page.locator('a[href*="carelabs.me"]').count()).toBe(0);
  });

  test("Footer renders 4 category hrefs on /ae/", async ({ page }) => {
    await page.goto(`${BASE}/ae/`, { waitUntil: "domcontentloaded" });
    const footer = page.locator("footer");
    for (const path of FOOTER_CATEGORY_LINKS) {
      await expect(footer.locator(`a[href="${path}"]`)).toBeVisible();
    }
  });
});
