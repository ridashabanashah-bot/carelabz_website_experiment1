# Claude Code Prompt — Fix 8 Broken Links on UAE Site

Copy everything below the line into Claude Code.

---

## Task: Fix all 8 broken links found during QA of the AE site

Read `CLAUDE.md` before starting.

**No new branch needed — commit directly to `main`.**

---

## Overview

A link audit found 8 broken links across the UAE site. They fall into two categories:

- **Code fix (Issues 1–4):** Footer service links are hardcoded in `src/lib/countries-config.ts` with wrong slugs
- **Strapi data fix (Issues 5–8):** CTA links, malformed email, and dead links baked into Strapi CMS content

---

## Part A — Code Fix: Footer service links in countries-config.ts

**File:** `src/lib/countries-config.ts` — the `ae` config object, `services` array (around lines 1106–1112)

### Current (broken):

```ts
services: [
  { label: "Arc Flash Study", href: "/ae/services/arc-flash-study/" },
  { label: "Short Circuit Analysis", href: "/ae/services/short-circuit-analysis/" },
  { label: "Load Flow Analysis", href: "/ae/services/load-flow-analysis/" },
  { label: "Relay Coordination Study", href: "/ae/services/relay-coordination-study/" },
  { label: "Power System Protection", href: "/ae/services/power-system-protection-coordination-study/" },
  { label: "Cable Testing", href: "/ae/services/cable-testing-services/" },
],
```

### Replacement (correct slugs):

```ts
services: [
  { label: "Arc Flash Study", href: "/ae/services/arc-flash-study-analysis-ae/" },
  { label: "Short Circuit Analysis", href: "/ae/services/short-circuit-study-analysis-ae/" },
  { label: "Load Flow Analysis", href: "/ae/services/load-flow-analysis-ae/" },
  { label: "Relay Coordination Study", href: "/ae/services/relay-coordination-study-and-analysis-ae/" },
  { label: "Power System Protection", href: "/ae/services/protection-coordination-study/" },
  { label: "Cable Testing", href: "/ae/services/cable-testing/" },
],
```

**Before applying**, verify every slug exists in Strapi:

```bash
source .env.local
BASE="https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
AUTH="Authorization: Bearer $STRAPI_API_TOKEN"

for SLUG in arc-flash-study-analysis-ae short-circuit-study-analysis-ae load-flow-analysis-ae relay-coordination-study-and-analysis-ae protection-coordination-study cable-testing; do
  COUNT=$(curl -s -H "$AUTH" "$BASE/service-pages?filters[slug][\$eq]=$SLUG&filters[region][\$eq]=ae" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])")
  echo "$SLUG → $COUNT entries"
done
```

If any slug returns 0, list all AE slugs and find the correct one:

```bash
curl -s -H "$AUTH" "$BASE/service-pages?filters[region][\$eq]=ae&pagination[pageSize]=100&fields[0]=slug&fields[1]=title" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in sorted(data, key=lambda x: x['slug']):
    print(f'{d[\"slug\"]:55s} {d[\"title\"][:60]}')"
```

Then update the `href` values in countries-config.ts to match the actual slugs.

---

## Part B — Strapi Data Fix: `/ae/contact-us/` → `/ae/contact/`

The old WordPress URL `/ae/contact-us/` appears as CTA links inside Strapi content for:
- The AE About page
- Multiple AE service pages (in their CTA sections)

### Step 1: Fix the AE About page CTA

```bash
source .env.local
BASE="https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
AUTH="Authorization: Bearer $STRAPI_API_TOKEN"

# Find the about page
ABOUT=$(curl -s -H "$AUTH" "$BASE/about-pages?filters[region][\$eq]=ae")
echo "$ABOUT" | python3 -c "
import sys,json
d = json.load(sys.stdin)['data'][0]
print(f'documentId: {d[\"documentId\"]}')
# Print all fields that contain contact-us
import json as j
text = j.dumps(d)
if 'contact-us' in text:
    print('Contains contact-us — needs fix')
    # Show which fields
    for k,v in d.items():
        if isinstance(v, str) and 'contact-us' in v:
            print(f'  Field: {k} = {v}')
"
```

Then update every field that contains `/ae/contact-us/` to `/ae/contact/`:

```bash
# Example — adjust field names based on what Step 1 finds:
ABOUT_DOC_ID="<paste documentId from above>"

curl -X PUT \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  "$BASE/about-pages/$ABOUT_DOC_ID" \
  -d '{
    "data": {
      "ctaButtonHref": "/ae/contact/"
    }
  }'
```

### Step 2: Fix service pages that link to `/ae/contact-us/`

```bash
# Find all AE service pages, check which ones contain contact-us
curl -s -H "$AUTH" "$BASE/service-pages?filters[region][\$eq]=ae&pagination[pageSize]=100" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in data:
    text = json.dumps(d)
    if 'contact-us' in text:
        fields = []
        for k,v in d.items():
            if isinstance(v, str) and 'contact-us' in v:
                fields.append(k)
        print(f'{d[\"documentId\"]:40s} {d[\"slug\"]:50s} fields: {fields}')
"
```

Then for each service page found, PUT the corrected field values. Example:

```bash
# For each documentId found above:
curl -X PUT \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  "$BASE/service-pages/<documentId>" \
  -d '{
    "data": {
      "ctaPrimaryHref": "/ae/contact/",
      "ctaSecondaryHref": "/ae/contact/"
    }
  }'
```

**Important:** Check which field names actually contain `contact-us` — they may be `ctaPrimaryHref`, `ctaButtonHref`, `heroCtaHref`, or embedded in rich text `body` content. Adjust the PUT payload accordingly.

If `contact-us` appears inside a rich text `body` field, do a string replace:

```bash
# For body fields containing /ae/contact-us/
curl -s -H "$AUTH" "$BASE/service-pages/<documentId>" | python3 -c "
import sys,json
d = json.load(sys.stdin)['data']
body = d.get('body','')
new_body = body.replace('/ae/contact-us/', '/ae/contact/')
print(json.dumps({'data':{'body': new_body}}))" | \
curl -X PUT \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  "$BASE/service-pages/<documentId>" \
  -d @-
```

---

## Part C — Strapi Data Fix: Malformed email `nullinfo@carelabz.com`

This is a `null` value being concatenated before the email address somewhere in Strapi content. The footer email is hardcoded correctly in `ae-footer.tsx`, so this is likely in a Strapi content field (service page body, blog post body, or about page body).

### Find the malformed email:

```bash
# Search all AE content types for "nullinfo" or "null" near email
for TYPE in service-pages blog-posts about-pages contact-pages home-pages case-studies; do
  echo "=== $TYPE ==="
  curl -s -H "$AUTH" "$BASE/$TYPE?filters[region][\$eq]=ae&pagination[pageSize]=100" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in data:
    text = json.dumps(d)
    if 'nullinfo@' in text or 'nullmailto' in text or 'null' in text and 'carelabz.com' in text:
        # Find which fields
        for k,v in d.items():
            if isinstance(v, str) and ('nullinfo' in v or ('null' in v and 'carelabz' in v)):
                print(f'{d.get(\"slug\",d.get(\"documentId\",\"?\"))}: field={k}')
                # Show context
                idx = v.find('null')
                print(f'  ...{v[max(0,idx-20):idx+40]}...')
" 2>/dev/null
done
```

Then fix the field by replacing `nullinfo@carelabz.com` with `info@carelabz.com` (or `nullmailto:` with `mailto:`).

**Likely root cause:** When WordPress content was scraped, Cloudflare email obfuscation returned `null` for the email address, and the migration script concatenated `null` + `info@carelabz.com`. Fix the affected Strapi entry with a PUT request.

---

## Part D — Strapi Data Fix: Cloudflare email protection link in blog post

A blog post contains a link to `/cdn-cgi/l/email-protection/` which is a Cloudflare artifact from the WordPress scrape.

### Find it:

```bash
curl -s -H "$AUTH" "$BASE/blog-posts?filters[region][\$eq]=ae&pagination[pageSize]=100" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in data:
    text = json.dumps(d)
    if 'cdn-cgi' in text or 'email-protection' in text:
        for k,v in d.items():
            if isinstance(v, str) and 'cdn-cgi' in v:
                print(f'slug: {d[\"slug\"]}')
                print(f'documentId: {d[\"documentId\"]}')
                print(f'field: {k}')
                idx = v.find('cdn-cgi')
                print(f'context: ...{v[max(0,idx-30):idx+50]}...')
"
```

### Fix it:

Replace the Cloudflare link with the actual email `mailto:info@carelabz.com` (or remove the broken link entirely):

```bash
DOC_ID="<documentId from above>"
FIELD="<field name from above>"

# Get current body, replace the cloudflare link
curl -s -H "$AUTH" "$BASE/blog-posts/$DOC_ID" | python3 -c "
import sys,json,re
d = json.load(sys.stdin)['data']
body = d['$FIELD']
# Replace /cdn-cgi/l/email-protection links with mailto:info@carelabz.com
fixed = re.sub(r'/cdn-cgi/l/email-protection[^\"]*', 'mailto:info@carelabz.com', body)
print(json.dumps({'data':{'$FIELD': fixed}}))" | \
curl -X PUT \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  "$BASE/blog-posts/$DOC_ID" \
  -d @-
```

---

## Part E — Strapi Data Fix: Dead `carelabs.me` link in Megger Test blog

A blog post about Megger Testing links to `https://carelabs.me/megger-test/` — that domain is dead.

### Find it:

```bash
curl -s -H "$AUTH" "$BASE/blog-posts?filters[region][\$eq]=ae&pagination[pageSize]=100" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in data:
    text = json.dumps(d)
    if 'carelabs.me' in text:
        for k,v in d.items():
            if isinstance(v, str) and 'carelabs.me' in v:
                print(f'slug: {d[\"slug\"]}')
                print(f'documentId: {d[\"documentId\"]}')
                print(f'field: {k}')
"
```

### Fix it:

Replace `https://carelabs.me/megger-test/` with the internal link to the equivalent service page on the new site. Find the correct slug first:

```bash
# Check if there's a megger test service page
curl -s -H "$AUTH" "$BASE/service-pages?filters[region][\$eq]=ae&filters[slug][\$containsi]=megger&fields[0]=slug&fields[1]=title" | python3 -c "
import sys,json
data = json.load(sys.stdin)['data']
for d in data:
    print(f'{d[\"slug\"]:50s} {d[\"title\"]}')"
```

Then update the blog post body:

```bash
DOC_ID="<documentId>"
# Replace https://carelabs.me/megger-test/ with /ae/services/<correct-megger-slug>/
curl -s -H "$AUTH" "$BASE/blog-posts/$DOC_ID" | python3 -c "
import sys,json
d = json.load(sys.stdin)['data']
body = d['body']
fixed = body.replace('https://carelabs.me/megger-test/', '/ae/services/<correct-megger-slug>/')
print(json.dumps({'data':{'body': fixed}}))" | \
curl -X PUT \
  -H "$AUTH" \
  -H "Content-Type: application/json" \
  "$BASE/blog-posts/$DOC_ID" \
  -d @-
```

---

## Verification with Playwright

After all fixes are applied, run a Playwright link checker to confirm all 8 issues are resolved:

```bash
npx playwright test --config=playwright.config.ts tests/ae-link-audit.spec.ts
```

Create this test file first:

**File:** `tests/ae-link-audit.spec.ts`

```ts
import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

// Issues 1–4: Footer service links should resolve (not 404)
const FOOTER_LINKS = [
  "/ae/services/arc-flash-study-analysis-ae/",
  "/ae/services/short-circuit-study-analysis-ae/",
  "/ae/services/load-flow-analysis-ae/",
  "/ae/services/relay-coordination-study-and-analysis-ae/",
  "/ae/services/protection-coordination-study/",
  "/ae/services/cable-testing/",
];

test.describe("AE Broken Link Fixes", () => {
  // Issues 1–4: Footer links
  for (const path of FOOTER_LINKS) {
    test(`Footer link ${path} should not 404`, async ({ page }) => {
      const res = await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      expect(res?.status()).not.toBe(404);
    });
  }

  // Issue 5: /ae/contact-us/ should not appear anywhere
  test("No links to /ae/contact-us/ on about page", async ({ page }) => {
    await page.goto(`${BASE}/ae/about/`, { waitUntil: "domcontentloaded" });
    const badLinks = await page.locator('a[href*="contact-us"]').count();
    expect(badLinks).toBe(0);
  });

  test("No links to /ae/contact-us/ on service pages", async ({ page }) => {
    await page.goto(`${BASE}/ae/services/arc-flash-study-analysis-ae/`, { waitUntil: "domcontentloaded" });
    const badLinks = await page.locator('a[href*="contact-us"]').count();
    expect(badLinks).toBe(0);
  });

  // Issue 6: No malformed email links
  test("No nullinfo@ email links on homepage", async ({ page }) => {
    await page.goto(`${BASE}/ae/`, { waitUntil: "domcontentloaded" });
    const badMailto = await page.locator('a[href*="nullinfo"]').count();
    const nullMailto = await page.locator('a[href*="nullmailto"]').count();
    expect(badMailto + nullMailto).toBe(0);
  });

  // Issue 7: No Cloudflare email protection links
  test("No /cdn-cgi/ links in blog posts", async ({ page }) => {
    // Check the Trakhees blog post specifically
    const res = await page.goto(`${BASE}/ae/blog/`, { waitUntil: "domcontentloaded" });
    const cfLinks = await page.locator('a[href*="cdn-cgi"]').count();
    expect(cfLinks).toBe(0);
  });

  // Issue 8: No dead carelabs.me links
  test("No carelabs.me links in Megger Test blog", async ({ page }) => {
    // Navigate to blog index, find megger post
    await page.goto(`${BASE}/ae/blog/`, { waitUntil: "domcontentloaded" });
    const deadLinks = await page.locator('a[href*="carelabs.me"]').count();
    expect(deadLinks).toBe(0);
  });

  // Bonus: Verify footer renders correct service hrefs
  test("Footer service links have correct slugs", async ({ page }) => {
    await page.goto(`${BASE}/ae/`, { waitUntil: "domcontentloaded" });
    const footer = page.locator("footer");
    for (const path of FOOTER_LINKS) {
      const link = footer.locator(`a[href="${path}"]`);
      await expect(link).toBeVisible();
    }
  });
});
```

If you don't have a `playwright.config.ts` yet:

```ts
// playwright.config.ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./tests",
  timeout: 30000,
  use: {
    baseURL: "https://carelabz-website-experiment1-ivory.vercel.app",
  },
});
```

---

## Final Verification Checklist

1. `npx tsc --noEmit` — zero errors
2. `npm run build` — all AE routes compile
3. Playwright tests pass: `npx playwright test tests/ae-link-audit.spec.ts`
4. Manual spot-check: visit `/ae/` → scroll to footer → click each service link
5. Commit: `fix(ae): correct 8 broken links — footer slugs, CTA hrefs, malformed email, dead links`
6. Push: `git push origin main && git push company main`

---

## Summary Table

| # | Issue | Where to fix | Fix type |
|---|-------|-------------|----------|
| 1 | `/ae/services/short-circuit-analysis/` 404 | `countries-config.ts` line ~1108 | Code — change slug |
| 2 | `/ae/services/relay-coordination-study/` 404 | `countries-config.ts` line ~1110 | Code — change slug |
| 3 | `/ae/services/power-system-protection-coordination-study/` 404 | `countries-config.ts` line ~1111 | Code — change slug |
| 4 | `/ae/services/cable-testing-services/` 404 | `countries-config.ts` line ~1112 | Code — change slug |
| 5 | `/ae/contact-us/` 404 | Strapi: about page + service pages | Strapi PUT — change href fields |
| 6 | `nullinfo@carelabz.com` malformed | Strapi: content body field(s) | Strapi PUT — remove `null` prefix |
| 7 | `/cdn-cgi/l/email-protection/` broken | Strapi: Trakhees blog post body | Strapi PUT — replace with mailto |
| 8 | `https://carelabs.me/megger-test/` dead | Strapi: Megger Test blog post body | Strapi PUT — replace with internal link |

**No new branch needed — this is a data fix + one config file change.**
