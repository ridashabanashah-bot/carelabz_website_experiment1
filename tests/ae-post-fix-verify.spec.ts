import { test, expect } from "@playwright/test";
import * as fs from "fs";
import * as path from "path";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

let AE_URLS: string[] = [];
try {
  AE_URLS = JSON.parse(
    fs.readFileSync(path.join(__dirname, "..", "data", "ae-all-urls.json"), "utf-8")
  );
} catch {
  AE_URLS = ["/ae/", "/ae/services/", "/ae/blog/", "/ae/about/", "/ae/contact/"];
}

test.describe("AE Post-Fix Verification — Zero Tolerance", () => {
  test.setTimeout(600000);

  for (const urlPath of AE_URLS) {
    test(`Clean: ${urlPath}`, async ({ page }) => {
      const res = await page.goto(`${BASE}${urlPath}`, {
        waitUntil: "domcontentloaded",
        timeout: 25000,
      });

      expect(
        res?.status(),
        `${urlPath} returned ${res?.status()}`
      ).toBeLessThan(400);

      const bodyText = await page.locator("body").innerText().catch(() => "");
      const fullHTML = await page.content();

      // No stray asterisks — but allow lines containing '=' (math/formula lines)
      // and lines starting with '* ' that are bullet lists
      const asteriskLines = bodyText
        .split("\n")
        .map((l) => l.trim())
        .filter(Boolean)
        .filter((line) => {
          if (/^[-•]\s/.test(line)) return false; // bullet
          if (line === "*") return false;
          if (line.includes("=")) return false; // math/formula
          // Form labels with required indicator (e.g. "Full Name *")
          if (/^[A-Za-z][A-Za-z0-9 ()/'-]{0,40}\s\*$/.test(line)) return false;
          return /(?:^|\s)\*{1,3}[^*]|[^*]\*{1,3}(?:\s|$)/.test(line);
        });
      expect(
        asteriskLines.length,
        `Stray asterisks on ${urlPath}: ${asteriskLines[0]?.slice(0, 100)}`
      ).toBe(0);

      // No ellipses indicating truncated content
      const ellipsisLines = bodyText
        .split("\n")
        .map((l) => l.trim())
        .filter((line) =>
          (line.includes("...") || line.includes("…")) && line.length > 5
        )
        .filter((line) => !/^\d[\d\s.]+$/.test(line))
        // Exempt UI placeholders (e.g. "Select a service...")
        .filter((line) => !/^(?:Select|Choose|Pick|Loading|Searching)\b.*\.{3}$/i.test(line));
      expect(
        ellipsisLines.length,
        `Truncated content on ${urlPath}: ${ellipsisLines[0]?.slice(0, 100)}`
      ).toBe(0);

      // No markdown headers visible as text
      const mdHeaders = bodyText
        .split("\n")
        .filter((line) => /^\s*#{1,4}\s+\w/.test(line.trim()));
      expect(
        mdHeaders.length,
        `Markdown headers on ${urlPath}`
      ).toBe(0);

      // No unrendered HTML entities
      expect(bodyText).not.toMatch(
        /&(?:amp|nbsp|rsquo|ldquo|rdquo|hellip|mdash|ndash|#\d{3,5});/
      );

      // No Cloudflare artifacts
      expect(fullHTML).not.toContain("/cdn-cgi/l/email-protection");
      expect(bodyText).not.toContain("[email protected]");

      // No null emails
      expect(fullHTML).not.toContain("nullinfo@");
      expect(fullHTML).not.toContain("nullmailto:");

      // No dead carelabs.me links
      const deadLinks = await page.locator('a[href*="carelabs.me"]').count();
      expect(deadLinks, `Dead carelabs.me links on ${urlPath}`).toBe(0);
    });
  }
});
