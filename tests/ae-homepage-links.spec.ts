import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

test.describe("AE Homepage — Click Every Link", () => {
  test.setTimeout(300000);

  test("Every link on the homepage resolves (not 404)", async ({ page }) => {
    await page.goto(`${BASE}/ae/`, { waitUntil: "domcontentloaded" });

    const links = await page.locator("a[href]").evaluateAll((els) =>
      Array.from(
        new Set(
          els
            .map((el) => el.getAttribute("href") || "")
            .filter(
              (h) =>
                h.startsWith("/ae/") &&
                !h.includes("#") &&
                !h.includes("mailto:") &&
                !h.includes("tel:")
            )
        )
      )
    );

    console.log(`Found ${links.length} unique internal links`);

    const broken: string[] = [];
    const ok: string[] = [];

    for (const href of links) {
      const res = await page.goto(`${BASE}${href}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });
      const status = res?.status() ?? 0;
      if (status >= 400) {
        broken.push(`${status} ${href}`);
        console.log(`  FAIL ${status} ${href}`);
      } else {
        ok.push(href);
      }
    }

    console.log(`\n${ok.length} OK, ${broken.length} broken`);
    expect(broken.length, `Broken links: ${broken.join(", ")}`).toBe(0);
  });
});
