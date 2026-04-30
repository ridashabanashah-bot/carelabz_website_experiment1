import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const CC = process.env.CC || "uk";
const KIND = process.env.KIND || "blog"; // "blog" or "service"

const URL_FILE = path.join(__dirname, "..", "data", CC, `wp-${KIND}-urls.txt`);
const SCREENSHOT_DIR = path.join(__dirname, "screenshots", `wp-${CC}-${KIND}`);
const REPORT_PATH = path.join(__dirname, "..", "data", CC, `wp-${KIND}-scrape-report.json`);

if (!fs.existsSync(URL_FILE)) {
  throw new Error(`URL file not found: ${URL_FILE}`);
}

const URLS = fs
  .readFileSync(URL_FILE, "utf-8")
  .split("\n")
  .map((l) => l.trim())
  .filter(Boolean);

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

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

test.describe(`Country WP scrape — ${CC} ${KIND}`, () => {
  test.describe.configure({ mode: "serial" });
  test.setTimeout(2700000);

  for (const url of URLS) {
    const slug = url.replace(/\/+$/, "").split("/").pop() || "unknown";
    test(`scrape ${CC}/${KIND}: ${slug}`, async ({ page }) => {
      const r: ScrapeResult = {
        url, slug, status: 0,
        screenshot: `tests/screenshots/wp-${CC}-${KIND}/${slug}.png`,
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
          r.title =
            (await page.locator("h1").first().innerText().catch(() => "")) ||
            (await page.locator("title").innerText().catch(() => ""));

          r.metaDescription =
            (await page.locator('meta[name="description"]').getAttribute("content").catch(() => "")) ?? "";
          r.metaKeywords =
            (await page.locator('meta[name="keywords"]').getAttribute("content").catch(() => "")) ?? "";
          r.publishedDate =
            (await page.locator('meta[property="article:published_time"]').getAttribute("content").catch(() => "")) ?? "";
          r.modifiedDate =
            (await page.locator('meta[property="article:modified_time"]').getAttribute("content").catch(() => "")) ?? "";
          r.author =
            (await page.locator('meta[name="author"]').getAttribute("content").catch(() => "")) ??
            (await page.locator('meta[property="article:author"]').getAttribute("content").catch(() => "")) ?? "";
          r.category =
            (await page.locator('meta[property="article:section"]').getAttribute("content").catch(() => "")) ?? "";

          const tagEls = await page.locator('meta[property="article:tag"]').all().catch(() => []);
          for (const t of tagEls) {
            const v = await t.getAttribute("content").catch(() => "");
            if (v) r.tags.push(v);
          }

          r.heroImage =
            (await page.locator('meta[property="og:image"]').getAttribute("content").catch(() => "")) ?? "";
          if (r.heroImage) {
            r.heroImageAlt =
              (await page.locator('meta[property="og:image:alt"]').getAttribute("content").catch(() => "")) ?? "";
          }
          if (!r.heroImage) {
            const imgChain = [
              ".entry-content img",
              "article img",
              'div[data-elementor-type="wp-post"] img',
              'main img',
            ];
            for (const sel of imgChain) {
              const img = page.locator(sel).first();
              const src = (await img.getAttribute("src").catch(() => "")) ?? "";
              if (src) {
                r.heroImage = src;
                r.heroImageAlt = (await img.getAttribute("alt").catch(() => "")) ?? "";
                break;
              }
            }
          }
          if (r.heroImage.startsWith("//")) r.heroImage = `https:${r.heroImage}`;

          r.bodyHTML = (await page.locator("body").innerHTML().catch(() => "")) ?? "";
          r.bodyText = (await page.locator("body").innerText().catch(() => "")) ?? "";
        }

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

      if (r.bodyHTML.length > 250000) r.bodyHTML = r.bodyHTML.slice(0, 250000);
      if (r.bodyText.length > 60000) r.bodyText = r.bodyText.slice(0, 60000);

      results.push(r);
      fs.writeFileSync(REPORT_PATH, JSON.stringify(results, null, 2));
      console.log(`  [${r.status}] ${CC}/${KIND}/${slug} body=${r.bodyText.length}c img=${r.heroImage ? "Y" : "N"}`);
    });
  }
});
