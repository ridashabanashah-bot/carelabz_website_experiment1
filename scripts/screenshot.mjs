#!/usr/bin/env node
/**
 * Ad-hoc screenshot helper.
 *
 * Usage:
 *   node scripts/screenshot.mjs <url> [outFile] [--full] [--mobile]
 *
 * Examples:
 *   node scripts/screenshot.mjs https://carelabz-website-experiment1-ivory.vercel.app/ae/ ae-home.png
 *   node scripts/screenshot.mjs https://carelabz.com/ae/services/ services.png --full
 *   node scripts/screenshot.mjs https://carelabz.com/ae/contact/ contact-mobile.png --mobile
 *
 * Output goes to ./screenshots/ (created if missing).
 */
import { chromium, devices } from "playwright";
import { mkdirSync } from "node:fs";
import { join, dirname } from "node:path";

const args = process.argv.slice(2);
const url = args.find((a) => /^https?:\/\//.test(a));
if (!url) {
  console.error("Usage: node scripts/screenshot.mjs <url> [outFile] [--full] [--mobile]");
  process.exit(1);
}
const out =
  args.find((a) => a.endsWith(".png") || a.endsWith(".jpg")) ||
  `screenshot-${Date.now()}.png`;
const fullPage = args.includes("--full");
const mobile = args.includes("--mobile");

const outPath = join("screenshots", out);
mkdirSync(dirname(outPath), { recursive: true });

const browser = await chromium.launch();
const context = await browser.newContext(
  mobile
    ? devices["iPhone 14 Pro"]
    : { viewport: { width: 1440, height: 900 } }
);
const page = await context.newPage();
console.log(`-> ${url}`);
await page.goto(url, { waitUntil: "networkidle", timeout: 45000 });
await page.waitForTimeout(1500);
await page.screenshot({ path: outPath, fullPage });
console.log(`saved ${outPath}`);
await browser.close();
