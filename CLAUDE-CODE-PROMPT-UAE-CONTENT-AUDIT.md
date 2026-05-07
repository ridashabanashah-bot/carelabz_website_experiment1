# Claude Code Prompt — UAE (AE) Strapi Content Audit

Copy everything below the line into Claude Code.

---

## Task: Audit all Strapi content for the UAE (`ae`) region

**Branch:** `audit/ae-content-check`

Read `CLAUDE.md` before starting.

**Goal:** Query every Strapi content type filtered by `region=ae`, check completeness, identify gaps, and cross-reference with Google Search Console top pages so we know exactly what needs to be created, fixed, or migrated before the UAE site can go live.

---

## Step 1: Query Strapi for all AE content

Use `curl` to hit the Strapi Cloud API. Base URL and token are in `.env.local`.

```bash
source .env.local
BASE="https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
AUTH="Authorization: Bearer $STRAPI_API_TOKEN"
```

Fetch each content type filtered by `region=ae`:

```bash
# Home page
curl -s -H "$AUTH" "$BASE/home-pages?filters[region][\$eq]=ae&populate=*" | jq '.' > data/audit/ae-home.json

# Service pages
curl -s -H "$AUTH" "$BASE/service-pages?filters[region][\$eq]=ae&populate=*&pagination[pageSize]=100" | jq '.' > data/audit/ae-services.json

# Blog posts
curl -s -H "$AUTH" "$BASE/blog-posts?filters[region][\$eq]=ae&populate=*&pagination[pageSize]=100" | jq '.' > data/audit/ae-blogs.json

# Case studies
curl -s -H "$AUTH" "$BASE/case-studies?filters[region][\$eq]=ae&populate=*&pagination[pageSize]=100" | jq '.' > data/audit/ae-case-studies.json

# About page
curl -s -H "$AUTH" "$BASE/about-pages?filters[region][\$eq]=ae&populate=*" | jq '.' > data/audit/ae-about.json

# Contact page
curl -s -H "$AUTH" "$BASE/contact-pages?filters[region][\$eq]=ae&populate=*" | jq '.' > data/audit/ae-contact.json
```

Create the output directory first: `mkdir -p data/audit`

---

## Step 2: Analyze each content type

For each content type, check:

### Home Page (`ae-home.json`)
- Does it exist? (total count > 0)
- Fields populated: heroHeadline, heroSubtext, metaTitle, metaDescription, ogImage
- Services array: how many items? Each has title + href?
- Industries array: populated?
- Insights array: populated?
- FAQs: how many? Each has question + answer?
- CTA banner fields: all present?
- Footer fields: footerEmail populated?

### Service Pages (`ae-services.json`)
- Total count of service pages
- For each: list title, slug, region
- Check for EMPTY or missing fields: body (critical — many WordPress imports have empty body), metaTitle, metaDescription
- Check for WordPress artifact titles (containing "| Carelabs", "| CareLabs", "Archives", "Author at")
- Check for missing hero images
- List services with NO body content (these need content migration)
- List services with no FAQs
- List services with no process steps

### Blog Posts (`ae-blogs.json`)
- Total count
- For each: list title, slug, publishedDate
- Check for empty body content
- Check for WordPress artifact titles
- Check for missing category
- Check for missing excerpt
- Cross-reference with Search Console top pages (Step 3)

### Case Studies (`ae-case-studies.json`)
- Total count
- For each: list title, slug
- Check for empty body, missing results array

### About Page (`ae-about.json`)
- Does it exist?
- Team array: populated?
- Values array: populated?
- Stats array: populated?

### Contact Page (`ae-contact.json`)
- Does it exist?
- Email field populated?
- Form heading present?

---

## Step 3: Cross-reference with Search Console data

Read `data/search-console/Pages.csv` (the top-performing pages by clicks).

For EACH of the top 50 pages by clicks:
1. Extract the URL path (e.g., `/megger-test-performed/`)
2. Check if a matching Strapi entry exists (by slug match)
3. Flag any top-traffic page that has NO Strapi content or EMPTY body

Output a table:

```
| Rank | URL Path | Clicks | Impressions | Strapi Match? | Body Empty? | Content Type |
```

**Critical pages to check** (from Search Console analysis):
- `/megger-test-performed/` — 17,755 clicks
- `/contact-resistance-test/` — 6,020 clicks
- `/earth-fault-loop-impedance-test/` — 5,389 clicks
- `/polarity-test/` — 4,715 clicks
- `/low-voltage-switchgear/` — 3,651 clicks
- `/insulation-resistance-test/` — 2,898 clicks
- `/arc-flash-analysis/` — 2,822 clicks
- `/power-system-protection-coordination-study/` — 2,736 clicks
- `/motor-testing-services/` — 2,372 clicks
- `/short-circuit-analysis-study/` — 2,102 clicks
- `/cable-testing-services/` — 1,930 clicks
- `/breaker-testing-services/` — 1,686 clicks
- `/` (homepage) — 1,324 clicks

---

## Step 4: Generate the audit report

Save a markdown report to `data/audit/AE-CONTENT-AUDIT-REPORT.md` with these sections:

### 1. Summary Dashboard
```
Total Home Pages:     X
Total Service Pages:  X (Y with empty body)
Total Blog Posts:     X (Y with empty body)
Total Case Studies:   X
About Page:           exists / missing
Contact Page:         exists / missing
```

### 2. Content Health Matrix
For each service page and blog post, a row showing:
- Title
- Slug
- Body: ✅ has content / ❌ empty
- Meta Title: ✅ / ❌
- Meta Description: ✅ / ❌
- FAQs: count or ❌
- Hero Image: ✅ / ❌

### 3. WordPress Artifact Cleanup
List all entries with titles that need cleaning (contain "|", "Archives", "Author at", etc.)

### 4. Search Console Gap Analysis
The table from Step 3 — top 50 pages with Strapi match status.

### 5. Migration Priority List
Ordered by Search Console clicks (highest first):
- **P0 (Critical)**: Top 10 traffic pages — must have complete Strapi content before go-live
- **P1 (High)**: Pages 11-30 — need content but can be phased
- **P2 (Medium)**: Pages 31-50 — migrate after P0/P1
- **P3 (Low)**: Remaining pages with < 100 clicks

### 6. Action Items
Concrete list of what needs to happen:
- Content to CREATE (doesn't exist in Strapi)
- Content to FIX (exists but incomplete)
- Content to CLEAN (WordPress artifacts in titles/slugs)
- 301 redirects needed (WordPress URL → new URL mapping)

---

## Step 5: Verify

1. Confirm all JSON files saved to `data/audit/`
2. Confirm report saved to `data/audit/AE-CONTENT-AUDIT-REPORT.md`
3. Print the Summary Dashboard to terminal
4. Print the top 10 Search Console gap analysis rows to terminal

**Do NOT commit** — this is an analysis branch. We'll use the report to plan migration.

---

## Notes

- The Strapi API token is in `.env.local` — source it before running curl commands
- Use `jq` for JSON processing — it's available
- If pagination is needed (>25 items), use `pagination[pageSize]=100` or loop with `pagination[page]=N`
- Region code for UAE is `ae` (lowercase)
- Some blog posts may have been bulk-imported from WordPress with empty body fields — this is expected and the audit should surface these
