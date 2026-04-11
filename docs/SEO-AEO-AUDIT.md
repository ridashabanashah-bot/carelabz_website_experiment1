# v0 Export — SEO & AEO Audit

**Audited:** `v0-export/` (arc-flash-study page for `carelabz.com/ae/services/study-analysis/arc-flash-study/`)
**Audit date:** 2026-04-10
**Verdict:** Solid visual scaffold, but **not production-ready for SEO/AEO**. Roughly 20 issues ranging from build-breaking (Tailwind version mismatch) to critical (missing OG image, hreflang, Speakable schema) to polish (breadcrumb UI).

---

## 1. BLOCKING / BUILD-BREAKING ISSUES

These will stop the page from even running when integrated into the existing Next.js project.

### 1.1 Tailwind v4 syntax in a Tailwind v3 project
`v0-export/app/globals.css` uses Tailwind **v4** directives:
```css
@import 'tailwindcss';
@import 'tw-animate-css';
@custom-variant dark (&:is(.dark *));
@utility bg-navy { ... }
@theme inline { ... }
```
The project is on `tailwindcss: ^3.4.1` (see `package.json`). **None of this works in v3.** Must convert to:
- `@tailwind base; @tailwind components; @tailwind utilities;`
- Move `bg-navy`, `text-navy`, `bg-off-white`, `bg-slate-card` into `tailwind.config.ts` under `theme.extend.colors`.
- Delete the `@theme inline` block, the `oklch()` CSS variables, and the shadcn dark-mode scaffolding (not used here).
- Drop `tw-animate-css` (not needed; native Tailwind handles the transitions in use).

### 1.2 shadcn/ui components not installed
`components.json` and `components/ui/*.tsx` (50+ files) assume shadcn/ui is installed. The actual page (`app/page.tsx`) only uses **three** custom components (`StickyNavbar`, `FAQAccordion`, `JsonLd`) and zero shadcn primitives. **Delete the entire `components/ui/` folder** on integration — dead weight that will bloat the bundle and trip TypeScript.

### 1.3 Duplicate `hooks/` and `components/ui/use-*` files
Same hooks exist in two places. Pick one location (`src/hooks/`) and delete the other.

### 1.4 `@vercel/analytics` import not in `package.json`
`app/layout.tsx` imports `@vercel/analytics/next` but it's missing from dependencies. Either `npm install @vercel/analytics` or remove the import.

---

## 2. CRITICAL SEO ISSUES

### 2.1 No `metadataBase`
Without this, all relative URLs in OG tags resolve to `localhost` in production.
**Fix:** Add to `src/app/layout.tsx`:
```ts
export const metadata: Metadata = {
  metadataBase: new URL("https://carelabz.com"),
  // ...
}
```

### 2.2 No `og:image` or `twitter:image`
Social previews will render as blank cards. The page ships with `public/images/hero-arc-flash.jpg` — use it or a dedicated 1200×630 OG variant.
**Fix:** In `generateMetadata()`:
```ts
openGraph: {
  images: [{
    url: "/og/arc-flash-study.jpg",
    width: 1200,
    height: 630,
    alt: "Arc Flash Study & Analysis in Dubai, UAE",
  }],
},
twitter: {
  card: "summary_large_image",
  images: ["/og/arc-flash-study.jpg"],
},
```
Then create a dedicated `public/og/arc-flash-study.jpg` sized 1200×630.

### 2.3 No `hreflang` alternates
The employer's SEO blueprint requires hreflang for all 50 countries with `x-default = /ae/`. This is completely absent.
**Fix:** In `generateMetadata()`:
```ts
alternates: {
  canonical: PAGE_URL,
  languages: {
    "en-AE": "https://carelabz.com/ae/services/study-analysis/arc-flash-study/",
    "en-US": "https://carelabz.com/us/services/study-analysis/arc-flash-study/",
    // ... all 50 countries
    "x-default": "https://carelabz.com/ae/services/study-analysis/arc-flash-study/",
  },
},
```
For Phase 1 just ship `en-AE` + `x-default`. Phase 2 builds out the full map from `countries-config.ts`.

### 2.4 Trailing slash mismatch
`PAGE_URL` in `app/page.tsx` = `https://carelabz.com/ae/services/study-analysis/arc-flash-study` (no trailing slash).
The 301 redirect in `next.config.mjs` targets the trailing-slash variant.
Canonical, redirect destination, and JSON-LD `url` must all match **exactly** or Google treats them as separate URLs.
**Fix:** Pick one style (trailing slash matches the existing redirect + WordPress convention) and apply everywhere.

### 2.5 Missing `robots` directives in metadata
No explicit `robots` field in `generateMetadata`. For a production service page you want:
```ts
robots: {
  index: true,
  follow: true,
  googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
},
```
`max-snippet: -1` + `max-image-preview: large` are **critical for AEO** — they let Google and AI overviews pull long-form text and large images from your page.

### 2.6 No author / publisher metadata
E-E-A-T (Experience, Expertise, Authoritativeness, Trust) is weak. Add:
```ts
authors: [{ name: "CareLAbz Engineering Team", url: "https://carelabz.com/about" }],
creator: "CareLAbz",
publisher: "CareLAbz",
```

### 2.7 Sitemap not updated
`src/app/sitemap.ts` still lists the old hand-built arc-flash URL. Must regenerate on integration so the new URL is present with `priority: 0.9` and `changeFrequency: "monthly"`.

### 2.8 No breadcrumb UI
Breadcrumbs exist in the JSON-LD but not visually on the page. Google rewards a visible breadcrumb component that matches the schema. Add a `<nav aria-label="Breadcrumb">` above the hero.

### 2.9 Image alts are generic
Several alts are function-of-the-image rather than keyword-rich:
- `"Engineer performing electrical safety assessment"` → `"CareLAbz engineer performing on-site arc flash data collection at a Dubai industrial facility"`
- `"Arc flash study engineering report documentation"` → `"Sample arc flash study report showing IEEE 1584 incident energy calculations and NFPA 70E PPE labels"`
- Industry cards have no location/context — add `"UAE"` or `"Dubai"` where relevant.

### 2.10 Industry image filename assumption will break
Line 669 of `app/page.tsx`:
```ts
src={`/images/industries/${card.name.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}.jpg`}
```
`"Oil & Gas"` → `oil-&-gas.jpg` then replaces `&` → `oil-and-gas.jpg`. Works here but fragile — if someone adds a card like `"AI/ML"` it silently 404s. Move filenames into the data object:
```ts
{ name: "Oil & Gas", slug: "oil-and-gas", imageAlt: "..." }
```

### 2.11 Insights card filename generation is even more fragile
Line 704: `card.title.toLowerCase().replace(/\s+/g, "-").slice(0, 30)` — this is guaranteed to break when titles change. Same fix: explicit `image` field on each card.

### 2.12 No `lang` attribute beyond `"en"`
`app/layout.tsx` has `<html lang="en">`. For the UAE page this should be `lang="en-AE"`. Phase 2 this becomes dynamic per country.

---

## 3. CRITICAL AEO (ANSWER ENGINE OPTIMIZATION) ISSUES

AEO = making your page the thing ChatGPT, Perplexity, Gemini, Claude, and Google AI Overviews quote when someone asks a question. This is where the v0 export is weakest.

### 3.1 Missing Speakable schema
Speakable tells voice assistants and AI overviews which parts of the page to read aloud / summarize. Add to the Service JSON-LD:
```ts
speakable: {
  "@type": "SpeakableSpecification",
  cssSelector: ["h1", ".hero-subtext", ".faq-answer"],
},
```
Then add matching `className` hooks in the JSX.

### 3.2 FAQ answers are too short for AEO
Answer engines favor answers that are:
- **40–80 words** for the first paragraph (direct answer)
- Followed by supporting detail
- Using natural phrasing that mirrors how people ask questions

Current FAQ #2 ("How long does an arc flash study take in Dubai?") is 47 words — good. FAQ #4 ("How much does...") deflects instead of answering — **bad for AEO**. Give a number range ("typically AED 15,000–80,000 depending on facility size") then invite contact.

### 3.3 No `HowTo` schema for the 6-step process
The `RiskAssessmentSection` is literally a 6-step how-to. Add:
```ts
const howToJsonLd = {
  "@context": "https://schema.org",
  "@type": "HowTo",
  name: "How an Arc Flash Study Is Performed",
  totalTime: "P2W",
  step: data.riskAssessment.steps.map((s, i) => ({
    "@type": "HowToStep",
    position: i + 1,
    name: s.title,
    text: s.description,
  })),
}
```
Google AI Overviews love HowTo schemas — they often quote them verbatim.

### 3.4 Service JSON-LD is anemic
Current Service schema is missing:
- `serviceType`: `"Arc Flash Hazard Analysis"`
- `provider.address` (PostalAddress)
- `provider.telephone`
- `provider.logo`
- `offers` with `availability` and `priceCurrency`
- `aggregateRating` (once you have reviews — placeholder for now)
- `hasOfferCatalog` listing related services
- `audience` (`"BusinessAudience"` with `audienceType: "Industrial facility managers"`)

### 3.5 No "definitional answer" block
Answer engines look for a sentence that directly defines the topic, ideally right after the H1. Add a short bold lede paragraph:
> **An arc flash study is an engineering analysis that calculates the incident energy released during an electrical arc fault, so workers can be protected with the correct PPE and equipment boundaries.** CareLAbz performs IEEE 1584-compliant arc flash studies across Dubai and the UAE...

This is the exact sentence Perplexity/ChatGPT will lift into their answer.

### 3.6 No entity linking via `sameAs`
Mention key entities (IEEE 1584, NFPA 70E, DEWA, ETAP) and link them to their Wikipedia / official pages inline using `<a>` tags. Entity graph connections boost AEO retrieval. Add an `Organization` JSON-LD with:
```ts
sameAs: [
  "https://www.linkedin.com/company/carelabz",
  "https://www.facebook.com/carelabz",
  "https://en.wikipedia.org/wiki/Arc_flash",
],
```

### 3.7 No `QAPage` wrapper on the FAQ
FAQPage schema is good but pairing it with a `QAPage` on dedicated question pages is even better for Phase 2. For Phase 1 keep FAQPage.

### 3.8 No "last updated" visible date
AEO engines penalize stale content. Add a visible `<time dateTime="2026-04-10">Last updated April 2026</time>` near the H1 and mirror it in the JSON-LD with `dateModified`.

### 3.9 No direct answer in the meta description
Current: `"Expert arc flash study and analysis services in Dubai UAE. ETAP-based assessments, hazard analysis and compliance for industrial facilities."`
Better (AEO-optimized): `"CareLAbz delivers IEEE 1584 arc flash studies in Dubai and across the UAE. ETAP modelling, DEWA-compliant reports, PPE labelling, and incident energy mitigation — typical turnaround 2–6 weeks."`
Contains specifics (standards, timeframes, deliverables) that directly answer search intent.

### 3.10 Missing "People Also Ask" coverage
The 6 FAQs are good but don't cover the top PAA questions for the keyword. Missing high-intent queries:
- "Is an arc flash study legally required in the UAE?"
- "What is the difference between arc flash and short circuit analysis?"
- "How often should an arc flash study be updated?" (answer: every 5 years or after any system change)
- "Who performs arc flash studies in Dubai?"
Add these 4 to reach 10 FAQs total.

---

## 4. ACCESSIBILITY / TECHNICAL GAPS

### 4.1 `<main>` wraps everything but navbar is outside
Good. But the breadcrumb should live inside `<main>` before the `<h1>`.

### 4.2 No skip-to-content link
Add `<a href="#main-content" className="sr-only focus:not-sr-only">Skip to content</a>` at the top of `<body>`.

### 4.3 FAQ accordion missing `role="region"`
Each open answer panel should be `role="region"` with a label. Minor A11y polish.

### 4.4 Insights cards don't have `aria-labelledby`
Articles with linked titles should use `aria-labelledby` pointing at the `<h3>`.

### 4.5 No focus indicator on the sticky navbar scroll state
When the navbar transitions from transparent to navy, focus ring offset changes and disappears visually. Test with Tab key.

---

## 5. PERFORMANCE / CORE WEB VITALS

### 5.1 Hero image is 116KB — OK but should be AVIF
Serve `hero-arc-flash.avif` alongside the jpg, or let `next/image` handle it. It's already using `next/image` with `priority` — good.

### 5.2 Industry images aren't lazy-loaded
They use `next/image` with `fill` which defaults to lazy. Good. But the 8 images total ~1.4MB — compress them to <100KB each before ship.

### 5.3 No `loading="eager"` on the hero image
Actually `priority` handles this. OK.

### 5.4 Missing `sizes` attribute on fill images
All `<Image fill>` usages are missing `sizes="(max-width: 768px) 100vw, 50vw"`. Without it Next.js serves oversized images on mobile. **Every fill image needs a sizes prop.**

---

## 6. STRAPI INTEGRATION GAPS

The whole `PAGE_DATA` constant is hardcoded. It needs to come from Strapi. Gaps:

### 6.1 Current ServicePage schema can't hold this structure
Existing `service-page.schema.json` has: `title`, `slug`, `body`, `metaTitle`, `metaDescription`, `faqs`. This v0 page needs **~40 more fields** (hero, trust badges, features, process steps, industries, insights, etc.).

**Decision point:** Either
- **(a)** Extend the current `service-page` content type with all these as components (fast but throwaway), OR
- **(b)** Skip Strapi integration of the new sections for Phase 1 — keep them hardcoded in the page, Strapi only serves `title`, `body`, `faqs`, `metaTitle`, `metaDescription` — then in Phase 2 model everything against the employer's `strapi-schemas.zip` (Country + Service + dynamic zones).

**Recommendation: (b)**. Don't build throwaway schemas. Keep the v0 data hardcoded as `PAGE_DATA` for Phase 1, fetch only the fields that already exist in Strapi (title, body, faqs, meta), and merge them into `PAGE_DATA` at render time. Phase 2 rebuilds the whole model properly.

### 6.2 `body` from Strapi is unused
v0 has no `<div dangerouslySetInnerHTML>` or rich-text renderer anywhere. If the Strapi `body` field has content, it's currently invisible. Either render it in a dedicated section or drop the field for Phase 1.

---

## SUMMARY TABLE

| Category | Issue count | Severity |
|---|---|---|
| Build-breaking (Tailwind v4, shadcn) | 4 | 🔴 Must fix before integration |
| SEO critical | 12 | 🔴 Must fix before production |
| AEO critical | 10 | 🟠 Must fix for Phase 1 sign-off |
| Accessibility | 5 | 🟡 Nice-to-have for Phase 1 |
| Performance | 4 | 🟡 Nice-to-have for Phase 1 |
| Strapi integration | 2 | 🟠 Decision needed |
| **Total** | **37** | |

Next file: **`CLAUDE-CODE-HANDOFF.md`** — the exact prompt to paste into Claude Code so it fixes all of these and integrates the v0 export into the existing project.
