import { test } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";
const SCREENSHOT_DIR = path.join(__dirname, "screenshots", "ae");
const REPORT_PATH = path.join(__dirname, "..", "data", "ae-qa-report.json");

let AE_URLS: string[] = [];
try {
  const raw = fs.readFileSync(
    path.join(__dirname, "..", "data", "ae-all-urls.json"),
    "utf-8"
  );
  AE_URLS = JSON.parse(raw);
} catch {
  AE_URLS = ["/ae/"];
}

interface QAIssue {
  url: string;
  type: string;
  text: string;
  context: string;
}

const allIssues: QAIssue[] = [];

fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
fs.mkdirSync(path.dirname(REPORT_PATH), { recursive: true });

test.describe("AE Full Site QA", () => {
  test.describe.configure({ mode: "serial" });

  for (const urlPath of AE_URLS) {
    test(`QA: ${urlPath}`, async ({ page }) => {
      test.setTimeout(60000);
      const pageIssues: QAIssue[] = [];

      let res;
      try {
        res = await page.goto(`${BASE}${urlPath}`, {
          waitUntil: "domcontentloaded",
          timeout: 30000,
        });
      } catch {
        pageIssues.push({
          url: urlPath,
          type: "TIMEOUT",
          text: "Navigation timeout",
          context: "Page failed to load within 30s",
        });
        allIssues.push(...pageIssues);
        fs.writeFileSync(REPORT_PATH, JSON.stringify(allIssues, null, 2));
        return;
      }

      const status = res?.status() ?? 0;
      if (status >= 400) {
        pageIssues.push({
          url: urlPath,
          type: "HTTP_ERROR",
          text: `Status ${status}`,
          context: "Page returned error status",
        });
      }

      const screenshotName =
        urlPath
          .replace(/^\/ae\/?/, "")
          .replace(/\/$/, "")
          .replace(/\//g, "_") || "homepage";
      try {
        await page.screenshot({
          path: path.join(SCREENSHOT_DIR, `${screenshotName}.png`),
          fullPage: true,
          timeout: 20000,
        });
      } catch {
        // fullPage screenshot can fail on very tall pages — fall back to viewport only
        await page
          .screenshot({
            path: path.join(SCREENSHOT_DIR, `${screenshotName}.png`),
            fullPage: false,
          })
          .catch(() => {});
      }

      const bodyText = await page
        .locator("body")
        .innerText()
        .catch(() => "");
      const fullHTML = await page.content().catch(() => "");

      // Ellipsis lines
      const lines = bodyText.split("\n");
      for (const line of lines) {
        const trimmed = line.trim();
        if (
          (trimmed.includes("...") || trimmed.includes("…")) &&
          trimmed.length > 5
        ) {
          if (/^\d[\d\s.]+$/.test(trimmed)) continue; // pagination "1 2 3 ..."
          pageIssues.push({
            url: urlPath,
            type: "ELLIPSIS",
            text: trimmed.slice(0, 200),
            context: "Likely truncated content",
          });
        }
      }

      // Stray asterisks
      for (const line of lines) {
        const trimmed = line.trim();
        if (/^[-•]\s/.test(trimmed)) continue;
        if (trimmed === "*") continue;
        if (/(?:^|\s)\*{1,3}[^*]|[^*]\*{1,3}(?:\s|$)/.test(trimmed)) {
          pageIssues.push({
            url: urlPath,
            type: "ASTERISK",
            text: trimmed.slice(0, 200),
            context: "Stray asterisk(s) visible in rendered text",
          });
        }
      }

      // Markdown headers
      for (const line of lines) {
        if (/^\s*#{1,4}\s+\w/.test(line.trim())) {
          pageIssues.push({
            url: urlPath,
            type: "MARKDOWN_HEADER",
            text: line.trim().slice(0, 200),
            context: "Markdown header visible as text",
          });
        }
      }

      // HTML entities
      const entityMatches = bodyText.match(
        /&(?:amp|nbsp|rsquo|ldquo|rdquo|hellip|mdash|ndash|lt|gt|#\d{3,5});/g
      );
      if (entityMatches) {
        for (const m of entityMatches) {
          pageIssues.push({
            url: urlPath,
            type: "HTML_ENTITY",
            text: m,
            context: "Unrendered HTML entity in text",
          });
        }
      }

      // Cloudflare artifacts
      if (
        bodyText.includes("[email protected]") ||
        fullHTML.includes("/cdn-cgi/l/email-protection")
      ) {
        pageIssues.push({
          url: urlPath,
          type: "CLOUDFLARE_ARTIFACT",
          text: "Cloudflare email protection artifact",
          context: "From WordPress scrape",
        });
      }

      // null email
      if (fullHTML.includes("nullinfo@") || fullHTML.includes("nullmailto:")) {
        pageIssues.push({
          url: urlPath,
          type: "NULL_EMAIL",
          text: "null-prefixed email",
          context: "Malformed migration email",
        });
      }

      // Empty page
      if (bodyText.trim().length < 50 && status < 400) {
        pageIssues.push({
          url: urlPath,
          type: "EMPTY_PAGE",
          text: `Only ${bodyText.trim().length} chars`,
          context: "Page nearly empty",
        });
      }

      allIssues.push(...pageIssues);
      fs.writeFileSync(REPORT_PATH, JSON.stringify(allIssues, null, 2));

      if (pageIssues.length > 0) {
        console.log(`\n[${urlPath}] ${pageIssues.length} issues`);
        for (const issue of pageIssues.slice(0, 5)) {
          console.log(`  [${issue.type}] ${issue.text.slice(0, 100)}`);
        }
      }
    });
  }
});
