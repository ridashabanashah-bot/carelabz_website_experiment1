# Claude Code Prompt — Brazil Site Bug Fixes

Copy everything below the line into Claude Code.

---

## Task: Fix 5 bugs on the Brazil website

**Branch:** `fix/br-site-bugs`

Read `CLAUDE.md` before starting.

**Strapi credentials (from `.env.local`):**
- URL: `https://rational-cheese-8e8c4f80ea.strapiapp.com`
- API Token: read from `STRAPI_API_TOKEN` in `.env.local`

---

### BUG 0 — Fix duplicate service TITLES in Strapi via API

All 5 Brazil service entries in Strapi have the same `title` field ("Arc Flash Analysis That Goes the Extra Mile"). Update each one via the Strapi REST API.

**Step 1:** Query all BR services to get their `documentId` and current `slug`:
```bash
curl -s 'https://rational-cheese-8e8c4f80ea.strapiapp.com/api/service-pages?filters[region][$eq]=br&fields[0]=title&fields[1]=slug&fields[2]=documentId' \
  -H "Authorization: Bearer $STRAPI_API_TOKEN"
```

**Step 2:** For each service, update the `title` field via PUT request using the `documentId`. Map slugs to correct titles:

| Slug (contains) | Correct Title |
|-----------------|---------------|
| `arc-flash` | Arc Flash Study |
| `harmonic` | Harmonic Study & Analysis |
| `motor-start` | Motor Start Analysis |
| `power-system-study` | Power System Study & Analysis |
| `power-quality` | Power Quality Analysis |

For each service, run:
```bash
curl -X PUT "https://rational-cheese-8e8c4f80ea.strapiapp.com/api/service-pages/{documentId}" \
  -H "Authorization: Bearer $STRAPI_API_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"data": {"title": "CORRECT TITLE HERE"}}'
```

**Step 3:** Verify by re-querying the services — all 5 should now have unique titles.

---

### BUG 1 — Contact form "Service of Interest" dropdown shows duplicate titles

**File:** `src/app/br/contact-us/page.tsx`

Now that Strapi titles are fixed (Bug 0), the dropdown should show correct titles automatically since it maps `s.title`. However, as a defensive fallback, also add deduplication:

```ts
const serviceOptions = services.length > 0
  ? services.map((s) => ({ title: s.title, slug: s.slug }))
  : config.services.map((s) => ({ title: s.label, slug: s.href }));
```

This uses Strapi data when available (now with correct titles), and falls back to `config.services` labels if Strapi returns empty. Keep the "Other / General Enquiry" option at the end.

---

### BUG 2 — Blog articles showing truncated content `[...]` and gibberish titles

**Files:** `src/app/br/blogs/page.tsx` and `src/app/br/[slug]/page.tsx`

**Problem A — Titles:** Some blog post titles from Strapi are raw meta titles like "Load Flow & Power System Analysis Brazil | Carelabs" instead of clean article titles. On the blog index page, strip " | Carelabs" and " | CareLabs" from the end of any blog title before displaying it:

```ts
function cleanTitle(raw: string): string {
  return raw.replace(/\s*\|\s*Care[Ll]abs\s*$/, "").trim();
}
```

Apply `cleanTitle()` to every `post.title` rendered on the blog index page (featured card, side cards, and "More Articles" list).

**Problem B — Excerpts:** Blog excerpts contain `[...]` or `[…]` truncation markers from WordPress migration. Clean these up:

```ts
function cleanExcerpt(raw: string): string {
  return raw.replace(/\s*\[…?\]\s*$/, "").replace(/\s*\[\.{3}\]\s*$/, "").trim();
}
```

Apply `cleanExcerpt()` to every `post.excerpt` rendered on the blog index page.

Also apply both `cleanTitle()` and `cleanExcerpt()` in `src/app/br/[slug]/page.tsx` for the blog detail view.

---

### BUG 3 — Remove date column from "More Articles" list

**File:** `src/app/br/blogs/page.tsx`

In the "More Articles" section (the `older.map(...)` list around line 246), remove the date column:

Find and remove this element from each list item:
```tsx
<span className="font-condensed text-sm text-orange-500 shrink-0 w-24 uppercase tracking-wider">
  {formatDate(postDate(post))}
</span>
```

Keep dates on the featured post and 2 side posts (the top 3 latest blogs) — those are already showing dates correctly.

---

### BUG 4 — Service "View Details" links return 404

**Files:** `src/app/br/[slug]/page.tsx`, `src/app/br/page.tsx`, `src/app/br/services/page.tsx`

**Root cause:** The `[slug]/page.tsx` appends `-br` to the URL slug before querying Strapi (line ~703: `getServicePageBySlug(\`${params.slug}-${CC}\`)`). But the homepage and services page generate URLs by REMOVING `-br` from the Strapi slug. This works IF and ONLY IF Strapi slugs end in `-br`. If they don't, the roundtrip breaks.

**Fix with a fallback approach** — in `src/app/br/[slug]/page.tsx`, try both slug formats:

Replace the single service fetch:
```ts
const service = await getServicePageBySlug(`${params.slug}-${CC}`);
```

With a fallback chain:
```ts
let service = await getServicePageBySlug(`${params.slug}-${CC}`);
if (!service) {
  service = await getServicePageBySlug(params.slug);
}
```

This way it first tries `arc-flash-study-br` (the expected format), and if that returns null, it tries `arc-flash-study` (direct slug). This handles both slug conventions without breaking anything.

Apply the same fallback pattern for blog post fetching in the same file if it also appends the country code.

---

### BUG 5 — Truncated Brazil config in countries-config.ts

**File:** `src/lib/countries-config.ts`

The `br:` entry at the end of the file is truncated — it cuts off at `blogDetailPattern:` with no value. Complete it with the full config:

```ts
  br: {
    cc: "br",
    countryName: "Brazil",
    countryNameLocative: "Brazil",
    hreflang: "en-BR",
    dialCodeCountryIso2: "BR",
    servicesIndexPath: "/br/services/",
    serviceDetailPattern: "/br/{slug}/",
    blogIndexPath: "/br/blogs/",
    blogDetailPattern: "/br/{slug}/",
    aboutPath: "/br/about-us/",
    contactPath: "/br/contact-us/",
    caseStudyPath: "/br/case-studies/",
    address: "São Paulo, Brazil",
    phone: "+55 (11) 0000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers NR-10 arc flash studies, ABNT NBR 5410 compliance, and full power system engineering services across Brazil.",
    services: [
      { label: "Arc Flash Study", href: "/br/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/br/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/br/motor-start-analysis/" },
      { label: "Power System Study", href: "/br/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/br/power-quality-analysis/" },
    ],
    standards: ["NR-10", "ABNT NBR 5410", "IEEE 1584", "IEC 60909", "ETAP"],
    primaryStandard: "NR-10",
    localCodeName: "ABNT NBR 5410 (Brazilian Electrical Installations)",
    localAuthority: "Ministério do Trabalho",
  },
```

Make sure the file ends with the proper closing `};` for the config object and any export wrapper.

---

### AFTER ALL FIXES:

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings  
3. `npm run build` — must succeed
4. Verify Strapi titles updated by querying: `curl -s 'https://rational-cheese-8e8c4f80ea.strapiapp.com/api/service-pages?filters[region][$eq]=br&fields[0]=title&fields[1]=slug' -H "Authorization: Bearer $STRAPI_API_TOKEN"`
5. Commit: `fix: update Strapi BR service titles, fix contact form, clean blog content, remove article dates, fix service 404s, complete BR config`
6. Merge to main, push to both remotes: `git push origin main && git push company main`
