import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

test.describe("AE smoke", () => {
  test("homepage renders + nav has only About / Services / Contact", async ({ page }) => {
    const resp = await page.goto(`${BASE}/ae/`, { waitUntil: "domcontentloaded" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("h1")).not.toBeEmpty();

    const navText = (await page.locator("header nav").first().innerText()).toLowerCase();
    expect(navText).toContain("about us");
    expect(navText).toContain("services");
    expect(navText).toContain("contact");
    expect(navText).not.toContain("home");
    expect(navText).not.toContain("insights");
    expect(navText).not.toContain("case studies");
  });

  test("services index loads + lists services", async ({ page }) => {
    const resp = await page.goto(`${BASE}/ae/services/`, { waitUntil: "domcontentloaded" });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("main")).toContainText(/Service|Study|Test/i);
  });

  test("a service detail page renders", async ({ page }) => {
    const resp = await page.goto(`${BASE}/ae/services/arc-flash-study-analysis/`, {
      waitUntil: "domcontentloaded",
    });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/arc.*flash/i);
  });

  test("blog detail renders top-traffic article", async ({ page }) => {
    const resp = await page.goto(`${BASE}/ae/blog/megger-test-performed/`, {
      waitUntil: "domcontentloaded",
    });
    expect(resp?.status()).toBe(200);
    await expect(page.locator("h1")).toContainText(/megger/i);
  });
});
