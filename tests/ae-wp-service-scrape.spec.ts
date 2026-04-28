import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const SCREENSHOT_DIR = path.join(__dirname, "screenshots", "wp-services");
const REPORT_PATH = path.join(__dirname, "..", "data", "wp-scrape-report.json");

const URL_LIST_PATH = path.join(__dirname, "..", "data", "ae-missing-service-urls.txt");
const URLS = fs
  .readFileSync(URL_LIST_PATH, "utf-8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

interface ScrapeResult {
  url: string;
  slug: string;
  status: number;
  screenshot: string;
  // DOM-extracted content kept as a fallback / sanity-check; OCR is the source of truth per spec.
  title: string;
  metaDescription: string;
  bodyText: string;
}

const results: ScrapeResult[] = [];

test.describe("AE WP Service Scraper", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(900000);

  for (const url of URLS) {
    const slug = url.replace(/\/+$/, "").split("/").pop() || "unknown";
    test(`scrape: ${slug}`, async ({ page }) => {
      let status = 0;
      let title = "";
      let metaDescription = "";
      let bodyText = "";

      try {
        const res = await page.goto(url, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
        status = res?.status() ?? 0;

        if (status < 400) {
          title = await page.locator("h1").first().innerText().catch(() => "");
          metaDescription = await page
            .locator('meta[name="description"]')
            .getAttribute("content")
            .catch(() => null) ?? "";
          bodyText = await page
            .locator(".entry-content, .post-content, article")
            .first()
            .innerText()
            .catch(() => "");
        }

        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${slug}.png`),
          fullPage: true,
          timeout: 30000,
        });
      } catch (e) {
        console.log(`  FAIL ${slug}: ${e}`);
      }

      results.push({
        url,
        slug,
        status,
        screenshot: `tests/screenshots/wp-services/${slug}.png`,
        title,
        metaDescription,
        bodyText: bodyText.slice(0, 20000),
      });

      fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
      console.log(`  [${status}] ${slug} (${bodyText.length} chars body)`);
    });
  }
});
