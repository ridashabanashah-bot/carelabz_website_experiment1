import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const SCREENSHOT_DIR = path.join(__dirname, "screenshots", "wp-blog");
const REPORT_PATH = path.join(__dirname, "..", "data", "wp-blog-scrape-report.json");

const URLS = fs
  .readFileSync(path.join(__dirname, "..", "data", "wp-blog-urls.txt"), "utf-8")
  .split("\n").map((l) => l.trim()).filter(Boolean);

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });

interface ScrapeResult {
  url: string;
  slug: string;
  status: number;
  screenshot: string;
  title: string;
  metaDescription: string;
  metaKeywords: string;
  publishedDate: string;
  modifiedDate: string;
  author: string;
  category: string;
  tags: string[];
  heroImage: string;
  heroImageAlt: string;
  bodyHTML: string;
  bodyText: string;
}

const results: ScrapeResult[] = [];

test.describe("AE WP Blog Scraper", () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(1800000);

  for (const url of URLS) {
    const slug = url.replace(/\/+$/, "").split("/").pop() || "unknown";
    test(`scrape: ${slug}`, async ({ page }) => {
      const r: ScrapeResult = {
        url, slug, status: 0,
        screenshot: `tests/screenshots/wp-blog/${slug}.png`,
        title: "", metaDescription: "", metaKeywords: "",
        publishedDate: "", modifiedDate: "",
        author: "", category: "", tags: [],
        heroImage: "", heroImageAlt: "",
        bodyHTML: "", bodyText: "",
      };

      try {
        const res = await page.goto(url, { waitUntil: "domcontentloaded", timeout: 45000 });
        r.status = res?.status() ?? 0;

        if (r.status < 400) {
          // Title
          r.title = (await page.locator("h1").first().innerText().catch(() => "")) ||
                    (await page.locator("title").innerText().catch(() => ""));

          // Meta tags
          r.metaDescription = (await page.locator('meta[name="description"]').getAttribute("content").catch(() => "")) ?? "";
          r.metaKeywords = (await page.locator('meta[name="keywords"]').getAttribute("content").catch(() => "")) ?? "";
          r.publishedDate = (await page.locator('meta[property="article:published_time"]').getAttribute("content").catch(() => "")) ?? "";
          r.modifiedDate = (await page.locator('meta[property="article:modified_time"]').getAttribute("content").catch(() => "")) ?? "";
          r.author = (await page.locator('meta[name="author"]').getAttribute("content").catch(() => "")) ??
                     (await page.locator('meta[property="article:author"]').getAttribute("content").catch(() => "")) ?? "";

          // Category from article:section meta
          r.category = (await page.locator('meta[property="article:section"]').getAttribute("content").catch(() => "")) ?? "";

          // Tags
          const tagEls = await page.locator('meta[property="article:tag"]').all().catch(() => []);
          for (const t of tagEls) {
            const v = await t.getAttribute("content").catch(() => "");
            if (v) r.tags.push(v);
          }

          // Hero image (og:image first, then first img in entry-content)
          r.heroImage = (await page.locator('meta[property="og:image"]').getAttribute("content").catch(() => "")) ?? "";
          if (r.heroImage) {
            r.heroImageAlt = (await page.locator('meta[property="og:image:alt"]').getAttribute("content").catch(() => "")) ?? "";
          }
          if (!r.heroImage) {
            const firstImg = page.locator(".entry-content img, article img").first();
            r.heroImage = (await firstImg.getAttribute("src").catch(() => "")) ?? "";
            r.heroImageAlt = (await firstImg.getAttribute("alt").catch(() => "")) ?? "";
          }

          // Body — full HTML preserved (will convert to markdown later)
          const bodyEl = page.locator(".entry-content, article .content, article > div").first();
          r.bodyHTML = (await bodyEl.innerHTML().catch(() => "")) ?? "";
          r.bodyText = (await bodyEl.innerText().catch(() => "")) ?? "";

          // Fallback: if no .entry-content, grab article element
          if (!r.bodyHTML || r.bodyHTML.length < 200) {
            const article = page.locator("article").first();
            r.bodyHTML = (await article.innerHTML().catch(() => "")) ?? "";
            r.bodyText = (await article.innerText().catch(() => "")) ?? "";
          }
        }

        // Full-page screenshot regardless
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${slug}.png`),
          fullPage: true,
          timeout: 30000,
        }).catch(async () => {
          await page.screenshot({
            path: path.join(SCREENSHOT_DIR, `${slug}.png`),
            fullPage: false,
          }).catch(() => {});
        });
      } catch (e) {
        console.log(`  ERROR ${slug}: ${e}`);
      }

      // Trim mega-large bodies to 50k chars to keep JSON manageable
      if (r.bodyHTML.length > 50000) r.bodyHTML = r.bodyHTML.slice(0, 50000);
      if (r.bodyText.length > 30000) r.bodyText = r.bodyText.slice(0, 30000);

      results.push(r);
      fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
      console.log(`  [${r.status}] ${slug} title="${r.title.slice(0, 60)}" body=${r.bodyText.length}c img=${r.heroImage ? "Y" : "N"}`);
    });
  }
});
