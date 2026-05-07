# Claude Code Prompt — Playwright QA: UAE Site Content Verification

Copy everything below the line into Claude Code.

---

## Task: Use Playwright to compare every UAE page's content against the original WordPress site

Read `CLAUDE.md` before starting.

**Goal:** Visit each page on the new Vercel UAE site and the corresponding WordPress page on carelabz.com. Extract all visible text content from both. Compare them and report any mismatches, missing content, or truncated text.

---

## Setup

```bash
npm exec playwright test -- --version  # verify Playwright works
```

Create the test file at `tests/ae-content-qa.spec.ts`.

**Two sites to compare:**

| Site | Base URL |
|------|----------|
| NEW (Vercel) | `https://carelabz-website-experiment1-ivory.vercel.app` |
| OLD (WordPress) | `https://carelabz.com` |

---

## The Test Script

Create `tests/ae-content-qa.spec.ts`:

```typescript
import { test, expect } from "@playwright/test";

// ─── Configuration ───────────────────────────────────────────
const NEW_BASE = "https://carelabz-website-experiment1-ivory.vercel.app";
const OLD_BASE = "https://carelabz.com";

// Map: NEW path → OLD path
// Service pages: new site uses /ae/services/[slug-ae]/, old site uses /[slug]/
const SERVICE_PAGES: { newSlug: string; oldSlug: string; label: string }[] = [
  { newSlug: "arc-flash-study-analysis-ae", oldSlug: "arc-flash-study-analysis", label: "Arc Flash Study Analysis" },
  { newSlug: "short-circuit-study-analysis-ae", oldSlug: "short-circuit-study-analysis", label: "Short Circuit Study" },
  { newSlug: "load-flow-analysis-ae", oldSlug: "load-flow-analysis", label: "Load Flow Analysis" },
  { newSlug: "relay-coordination-study-and-analysis-ae", oldSlug: "relay-coordination-study-and-analysis", label: "Relay Coordination Study" },
  { newSlug: "electrical-thermography-inspection-ae", oldSlug: "electrical-thermography-inspection", label: "Thermographic Inspection" },
  { newSlug: "circuit-breaker-testing-ae", oldSlug: "circuit-breaker-testing", label: "Circuit Breaker Testing" },
  { newSlug: "electric-motor-testing-ae", oldSlug: "electric-motor-testing", label: "Motor Testing" },
  { newSlug: "cable-testing-ae", oldSlug: "cable-testing", label: "Cable Testing" },
  { newSlug: "earth-fault-loop-impedence-test-ae", oldSlug: "earth-fault-loop-impedence-test", label: "Earth Fault Loop Test" },
  { newSlug: "insulation-resistance-test-service-ae", oldSlug: "insulation-resistance-test-service", label: "Insulation Resistance Test" },
  { newSlug: "polarity-test-service-ae", oldSlug: "polarity-test-service", label: "Polarity Test" },
  { newSlug: "contact-resistance-testing-service-ae", oldSlug: "contact-resistance-testing-service", label: "Contact Resistance Test" },
  { newSlug: "continuity-testing-ae", oldSlug: "continuity-testing", label: "Continuity Testing" },
  { newSlug: "generator-load-bank-testing-ae", oldSlug: "generator-load-bank-testing", label: "Generator Load Bank Testing" },
  { newSlug: "harmonic-study-analysis-ae", oldSlug: "harmonic-study-analysis", label: "Harmonic Study" },
  { newSlug: "power-quality-study-analysis-ae", oldSlug: "power-quality-study-analysis", label: "Power Quality Study" },
  { newSlug: "voltage-drop-study-analysis-ae", oldSlug: "voltage-drop-study-analysis", label: "Voltage Drop Study" },
  { newSlug: "energy-auditing-service-ae", oldSlug: "energy-auditing-service", label: "Energy Audit" },
  { newSlug: "factory-acceptance-testing-services-ae", oldSlug: "factory-acceptance-testing-services", label: "Factory Acceptance Testing" },
  { newSlug: "protection-relay-testing-services-ae", oldSlug: "protection-relay-testing-services", label: "Protection Relay Testing" },
];

// Blog posts: new site uses /ae/blog/[slug-ae]/, old site uses /[slug]/
const BLOG_PAGES: { newSlug: string; oldSlug: string; label: string }[] = [
  { newSlug: "megger-test-performed-ae", oldSlug: "megger-test-performed", label: "Megger Test (17.7k clicks)" },
  { newSlug: "what-contact-resistance-test-why-contact-resistance-testing-done-ae", oldSlug: "what-contact-resistance-test-why-contact-resistance-testing-done", label: "Contact Resistance Test Blog" },
  { newSlug: "about-earth-fault-loop-impedence-test-ae", oldSlug: "about-earth-fault-loop-impedence-test", label: "Earth Fault Loop Blog" },
  { newSlug: "what-polarity-test-why-conduct-polarity-test-ae", oldSlug: "what-polarity-test-why-conduct-polarity-test", label: "Polarity Test Blog" },
  { newSlug: "learn-how-insulation-resistance-test-done-ae", oldSlug: "learn-how-insulation-resistance-test-done", label: "Insulation Resistance Blog" },
  { newSlug: "what-short-circuit-analysis-done-why-ae", oldSlug: "what-short-circuit-analysis-done-why", label: "Short Circuit Analysis Blog" },
  { newSlug: "what-cable-testing-how-cable-testing-done-ae", oldSlug: "what-cable-testing-how-cable-testing-done", label: "Cable Testing Blog" },
  { newSlug: "what-circuit-breaker-testing-how-circuit-breaker-testing-done-ae", oldSlug: "what-circuit-breaker-testing-how-circuit-breaker-testing-done", label: "Circuit Breaker Testing Blog" },
  { newSlug: "what-is-electric-motor-testing-and-why-is-it-done-ae", oldSlug: "what-is-electric-motor-testing-and-why-is-it-done", label: "Motor Testing Blog" },
  { newSlug: "what-why-load-flow-analysis-power-flow-analysis-done-ae", oldSlug: "what-why-load-flow-analysis-power-flow-analysis-done", label: "Load Flow Analysis Blog" },
];

// Static pages
const STATIC_PAGES: { newPath: string; oldPath: string; label: string }[] = [
  { newPath: "/ae/", oldPath: "/", label: "Homepage" },
  { newPath: "/ae/about/", oldPath: "/about-carelabs/", label: "About Page" },
  { newPath: "/ae/contact/", oldPath: "/contact-us/", label: "Contact Page" },
];

// ─── Helper: extract all meaningful text from a page ─────────
async function extractPageText(page: any, url: string): Promise<{
  title: string;
  h1: string;
  headings: string[];
  bodyText: string;
  metaDescription: string;
}> {
  await page.goto(url, { waitUntil: "networkidle", timeout: 30000 });

  // Wait for content to render
  await page.waitForTimeout(2000);

  const result = await page.evaluate(() => {
    const title = document.title || "";
    const h1El = document.querySelector("h1");
    const h1 = h1El ? h1El.textContent?.trim() || "" : "";

    // Get all headings
    const headings = Array.from(document.querySelectorAll("h2, h3"))
      .map((el) => el.textContent?.trim() || "")
      .filter((t) => t.length > 0);

    // Get meta description
    const metaEl = document.querySelector('meta[name="description"]');
    const metaDescription = metaEl ? metaEl.getAttribute("content") || "" : "";

    // Get main body text — exclude nav, footer, header
    const mainEl = document.querySelector("main") || document.querySelector("article") || document.body;
    const clone = mainEl.cloneNode(true) as HTMLElement;

    // Remove nav, footer, header, script, style from the clone
    clone.querySelectorAll("nav, footer, header, script, style, noscript").forEach((el) => el.remove());

    const bodyText = clone.textContent?.replace(/\s+/g, " ").trim() || "";

    return { title, h1, headings, bodyText, metaDescription };
  });

  return result;
}

// ─── Helper: normalize text for comparison ───────────────────
function normalize(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/['']/g, "'")
    .replace(/[""]/g, '"')
    .replace(/&amp;/g, "&")
    .replace(/&nbsp;/g, " ")
    .replace(/\u00a0/g, " ")
    .toLowerCase()
    .trim();
}

// ─── Helper: find common content between old and new ─────────
function findMissingContent(oldText: string, newText: string): {
  matchPercentage: number;
  missingSentences: string[];
} {
  // Split old text into sentences
  const oldSentences = oldText
    .split(/[.!?]+/)
    .map((s) => s.trim())
    .filter((s) => s.length > 20); // Only meaningful sentences

  const normalizedNew = normalize(newText);
  const missingSentences: string[] = [];
  let matchCount = 0;

  for (const sentence of oldSentences) {
    const normalizedSentence = normalize(sentence);
    if (normalizedSentence.length < 15) continue;

    // Check if the first 40 chars of the sentence appear in new text
    const searchChunk = normalizedSentence.substring(0, 40);
    if (normalizedNew.includes(searchChunk)) {
      matchCount++;
    } else {
      missingSentences.push(sentence.substring(0, 120) + (sentence.length > 120 ? "..." : ""));
    }
  }

  const total = oldSentences.filter((s) => normalize(s).length >= 15).length;
  const matchPercentage = total > 0 ? Math.round((matchCount / total) * 100) : 100;

  return { matchPercentage, missingSentences };
}

// ─── Tests ───────────────────────────────────────────────────

test.describe("UAE Content QA — New vs WordPress", () => {
  test.setTimeout(120000); // 2 min per test

  // Test static pages
  for (const pg of STATIC_PAGES) {
    test(`Static: ${pg.label}`, async ({ page }) => {
      console.log(`\n━━━ ${pg.label} ━━━`);

      // Fetch old page
      console.log(`  OLD: ${OLD_BASE}${pg.oldPath}`);
      const oldContent = await extractPageText(page, `${OLD_BASE}${pg.oldPath}`);

      // Fetch new page
      console.log(`  NEW: ${NEW_BASE}${pg.newPath}`);
      const newContent = await extractPageText(page, `${NEW_BASE}${pg.newPath}`);

      // Compare
      console.log(`  Old H1: "${oldContent.h1}"`);
      console.log(`  New H1: "${newContent.h1}"`);

      const comparison = findMissingContent(oldContent.bodyText, newContent.bodyText);
      console.log(`  Content match: ${comparison.matchPercentage}%`);

      if (comparison.missingSentences.length > 0) {
        console.log(`  ⚠️  Missing sentences (${comparison.missingSentences.length}):`);
        comparison.missingSentences.slice(0, 5).forEach((s, i) => {
          console.log(`    ${i + 1}. "${s}"`);
        });
      }

      // Verify new page loaded (not a 404 or error)
      expect(newContent.h1.length).toBeGreaterThan(0);
      expect(newContent.bodyText.length).toBeGreaterThan(50);
    });
  }

  // Test first 20 service pages
  for (const svc of SERVICE_PAGES) {
    test(`Service: ${svc.label}`, async ({ page }) => {
      console.log(`\n━━━ Service: ${svc.label} ━━━`);

      const oldUrl = `${OLD_BASE}/${svc.oldSlug}/`;
      const newUrl = `${NEW_BASE}/ae/services/${svc.newSlug}/`;

      console.log(`  OLD: ${oldUrl}`);
      const oldContent = await extractPageText(page, oldUrl);

      console.log(`  NEW: ${newUrl}`);
      const newContent = await extractPageText(page, newUrl);

      console.log(`  Old H1: "${oldContent.h1.substring(0, 80)}"`);
      console.log(`  New H1: "${newContent.h1.substring(0, 80)}"`);
      console.log(`  Old body length: ${oldContent.bodyText.length}`);
      console.log(`  New body length: ${newContent.bodyText.length}`);

      const comparison = findMissingContent(oldContent.bodyText, newContent.bodyText);
      console.log(`  Content match: ${comparison.matchPercentage}%`);

      if (comparison.missingSentences.length > 0) {
        console.log(`  ⚠️  Missing (${comparison.missingSentences.length}):`);
        comparison.missingSentences.slice(0, 5).forEach((s, i) => {
          console.log(`    ${i + 1}. "${s}"`);
        });
      }

      // Assertions
      expect(newContent.bodyText.length, `${svc.label}: new page has no body content`).toBeGreaterThan(50);

      // Flag if match is below 30% — content was likely truncated or missing
      if (comparison.matchPercentage < 30) {
        console.log(`  ❌ LOW MATCH — only ${comparison.matchPercentage}% of WP content found on new site`);
      }
    });
  }

  // Test first 10 blog posts
  for (const blog of BLOG_PAGES) {
    test(`Blog: ${blog.label}`, async ({ page }) => {
      console.log(`\n━━━ Blog: ${blog.label} ━━━`);

      const oldUrl = `${OLD_BASE}/${blog.oldSlug}/`;
      const newUrl = `${NEW_BASE}/ae/blog/${blog.newSlug}/`;

      console.log(`  OLD: ${oldUrl}`);
      const oldContent = await extractPageText(page, oldUrl);

      console.log(`  NEW: ${newUrl}`);
      const newContent = await extractPageText(page, newUrl);

      console.log(`  Old H1: "${oldContent.h1.substring(0, 80)}"`);
      console.log(`  New H1: "${newContent.h1.substring(0, 80)}"`);
      console.log(`  Old body length: ${oldContent.bodyText.length}`);
      console.log(`  New body length: ${newContent.bodyText.length}`);

      const comparison = findMissingContent(oldContent.bodyText, newContent.bodyText);
      console.log(`  Content match: ${comparison.matchPercentage}%`);

      if (comparison.missingSentences.length > 0) {
        console.log(`  ⚠️  Missing (${comparison.missingSentences.length}):`);
        comparison.missingSentences.slice(0, 5).forEach((s, i) => {
          console.log(`    ${i + 1}. "${s}"`);
        });
      }

      expect(newContent.bodyText.length, `${blog.label}: new page has no body content`).toBeGreaterThan(50);

      if (comparison.matchPercentage < 30) {
        console.log(`  ❌ LOW MATCH — only ${comparison.matchPercentage}% of WP content found on new site`);
      }
    });
  }
});
```

---

## Playwright Config

Create `playwright.config.ts` in the project root (if it doesn't exist):

```typescript
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 120000,
  retries: 1,
  use: {
    headless: true,
    viewport: { width: 1280, height: 720 },
    actionTimeout: 15000,
    navigationTimeout: 30000,
  },
  reporter: [
    ["list"],
    ["html", { outputFolder: "tests/qa-report", open: "never" }],
  ],
  outputDir: "tests/results",
});
```

---

## Run the tests

```bash
# Run all QA tests
npx playwright test tests/ae-content-qa.spec.ts --reporter=list

# If you want just the top-traffic pages first:
npx playwright test tests/ae-content-qa.spec.ts -g "Megger|Homepage|Arc Flash" --reporter=list
```

---

## After tests complete

1. **Read the console output.** Each page shows:
   - Old vs New H1 comparison
   - Body text length comparison
   - Content match percentage
   - Specific missing sentences (first 5)

2. **Generate a summary report.** After all tests run, create `tests/AE-QA-REPORT.md` with:

   ```
   | Page | Type | Old Body Len | New Body Len | Match % | Missing Sentences | Status |
   ```

   - ✅ `PASS` = match ≥ 60% and page loads with content
   - ⚠️ `PARTIAL` = match 30-59% (content truncated or reformatted)
   - ❌ `FAIL` = match < 30% or page returns no content

3. **For any ❌ FAIL pages**, investigate:
   - Is the Strapi entry missing? (check slug)
   - Was the body truncated at 5000/8000 chars during migration?
   - Is the slug mapping wrong? (WP slug doesn't match Strapi slug)

4. **Save the report** to `tests/AE-QA-REPORT.md`

---

## Notes

- The WordPress site may have dynamic content (sliders, forms, ads) that won't exist on the new site — this is expected. Focus on the core body text, headings, and meta descriptions.
- The new site's body was extracted from WP via `markdownify` and may have minor formatting differences (e.g., missing bold, different list formatting) — this is fine. We're checking that the WORDS are there, not the formatting.
- Some WP pages are very long (10,000+ chars). The migration script capped service bodies at 5,000 chars and blog bodies at 8,000 chars. Any content beyond those limits will show as "missing" — flag these for manual review but they're not bugs.
- The test uses `waitUntil: "networkidle"` to ensure Strapi data loads before extracting text. If pages timeout, increase the timeout or use `waitUntil: "domcontentloaded"` instead.
