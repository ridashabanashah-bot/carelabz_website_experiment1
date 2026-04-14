# Carelabs Website Rebuild — Claude Code Project Context

**Read this file before taking any action in this repo.**

---

## Project Overview

Migrating **carelabz.com** from WordPress to a fully headless stack:

| Layer | Tool | Version |
|-------|------|---------|
| Frontend | Next.js App Router | 14 |
| Styling | Tailwind CSS | 3.x |
| Icons | Lucide React | latest |
| CMS | Strapi | v5 (Cloud) |
| Hosting (FE) | Vercel | auto-deploy on push |
| Source Control | GitHub | two remotes |

## Repositories

| Remote | URL |
|--------|-----|
| `origin` | github.com/ridashabanashah-bot/carelabz_website_experiment1 |
| `company` | github.com/carelabz/carelabz-website-experiment1 |
| CMS `origin` | github.com/ridashabanashah-bot/carelabz-cms |
| CMS `company` | github.com/carelabz/carelabz-cms |

**Git rule:** Always push to BOTH remotes: `git push origin main && git push company main`

## Live URLs

- **Vercel:** https://carelabz-website-experiment1-ivory.vercel.app
- **Strapi Cloud:** https://rational-cheese-8e8c4f80ea.strapiapp.com
- **Strapi API Token:** in `.env.local` as `STRAPI_API_TOKEN`

---

## Brand Identity

### Colors (DO NOT deviate)

| Name | Hex | Tailwind class |
|------|-----|---------------|
| Navy | `#0B1A2F` | `bg-navy`, `text-navy` |
| Orange | `#F97316` | `bg-orange-500`, `text-orange-500` |
| Off-White | `#F8FAFC` | `bg-offWhite` |
| Slate Card | `#1E293B` | `bg-slateCard` |

These are defined in `tailwind.config.ts` under `theme.extend.colors`.

### Company Name

**Always "Carelabs"** — capital C only. Never "CareLAbz", "CARELABS", "Care Labs", or "carelabs".

Exception: the domain `carelabz.com` and email `info@carelabz.com` use the original spelling with z.

### Logo

- File: `/images/logo/carelabs-logo.png` (866x288, transparent PNG)
- Blue "care" + orange "labs" wordmark
- Tagline: "Test | Calibrate | Inspect | Certify"

---

## Brand Voice Guidelines

Source: Carelabz Brand Voice Skill (audit/skills/carelabz-brand-voice)

### Tone Attributes

1. **Authoritative** — Earned through deep expertise, not claimed. Backed by specific technical knowledge and client results. Never defensive or apologetic about complexity.

2. **Precise** — Exact numbers over ranges. Specific methodologies over generic descriptions. Technical accuracy is non-negotiable. Define terms when necessary.

3. **Confident** — Straightforward language without hedging. "We solve X" not "We help you explore solutions for X." Clear about what Carelabs does and doesn't do.

4. **Not Salesy** — No pressure language. Benefits emerge from explaining the work, not from persuasion. Assumes buyer intelligence. Focuses on outcomes, not emotional triggers.

### Writing Rules

- Lead with the problem, then the solution
- Be specific with numbers and standards (IEEE 1584, NFPA 70E, OSHA, NEC, DEWA, IEC)
- Never use jargon without explanation
- Never oversell — no "revolutionary", "game-changing", "cutting-edge"
- No vague claims — "industry-leading" requires proof
- No exclamation points (one per page maximum)
- Break complex topics into clear sections with structured lists
- Technical depth shows expertise — don't oversimplify

### Delete on Sight

- "Innovative", "disruption", "game-changing", "next-generation"
- "AI-powered", "machine learning" (unless specific and relevant)
- "Synergy", "leverage", "optimize" (when used vaguely)
- "We're passionate about", "We love", "Our team is obsessed with"
- "Best-in-class", "world-class" (without proof)

---

## Technical Rules

### Content

- **Zero hardcoded content** — everything from Strapi CMS
- Every page uses `export const dynamic = "force-dynamic"` (Strapi is fetched at request time)
- If Strapi is unreachable, show a graceful fallback message
- All `??` null coalescing fallbacks for Strapi fields

### Images

- All images use `next/image` with `fill` and `sizes` props
- Never use `<img>` tags directly
- Compress all JPGs to under 150KB
- OG images at 1200x630

### Components

- Lucide React for ALL icons — no emoji icons, no custom SVG icons
- Existing shared components: `StickyNavbar`, `FaqAccordion`, `MobileNav`, `JsonLd`
- Tailwind v3 only — no v4 `@theme` syntax, no `size-*` classes (use `w-* h-*`)
- No shadcn/ui — plain Tailwind + Lucide

### TypeScript

- Strict mode
- No `any` types — use `unknown` with narrowing
- All Strapi interfaces in `src/lib/strapi*.ts`

---

## URL Structure

```
/[country-code]/                          — regional homepage
/[country-code]/services/                 — services index
/[country-code]/services/[category]/      — category index
/[country-code]/services/[category]/[slug]/ — individual service
/[country-code]/blog/                     — blog index
/[country-code]/blog/[slug]/              — individual blog post
/[country-code]/case-studies/             — case studies index
/[country-code]/case-studies/[slug]/      — individual case study
/[country-code]/about/                    — about page
/[country-code]/contact/                  — contact page
```

Active country codes: `us`, `ae` (more coming)

All URLs use trailing slashes (`trailingSlash: true` in next.config.mjs).

---

## Strapi Content Types

| Content Type | API Endpoint | Fields |
|-------------|-------------|--------|
| ServicePage | `/api/service-pages` | 46+ fields |
| HomePage | `/api/home-pages` | 34 fields |
| BlogPost | `/api/blog-posts` | 16 fields |
| CaseStudy | `/api/case-studies` | 18 fields |
| AboutPage | `/api/about-pages` | 20 fields |
| ContactPage | `/api/contact-pages` | 12 fields |

All content types use `region` field to filter by country (e.g., `filters[region][$eq]=us`).

---

## SEO Rules

- Every page MUST have: unique metaTitle (50-60 chars), metaDescription (150-160 chars), canonical URL, OG image
- JSON-LD schemas: Service, FAQPage, LocalBusiness, BreadcrumbList, HowTo (where applicable), Organization (in layout)
- hreflang tags for multi-region pages
- Sitemap at `src/app/sitemap.ts`
- robots.txt at `src/app/robots.ts` — allow `/`, disallow `/api/`, `/admin/`
- All FAQ answers: 50-80 words, natural AEO-friendly phrasing
- Keywords array from Strapi `seoKeywords` field

---

## Regional Standards Reference

| Region | Standards |
|--------|----------|
| UAE | DEWA, IEEE 1584, NFPA 70E, IEC 61482, IEC 60364 |
| USA | NFPA 70E, IEEE 1584, OSHA (1910 Subpart S), NEC, ANSI |
| UK | BS 7671, IET Wiring Regulations, HSE |

---

## Common Tasks

### Adding a new service page
1. Create entry in Strapi (ServicePage content type, set region)
2. The dynamic route picks it up automatically
3. Add 301 redirect in `next.config.mjs` if old WordPress URL exists

### Adding a new country
1. Create homepage entry in Strapi (HomePage, set region to new country code)
2. Create route folder `src/app/[country-code]/`
3. Add hreflang entries to layout
4. Add sitemap entries

### Deploying
1. Commit changes
2. Push to both remotes: `git push origin main && git push company main`
3. Vercel auto-deploys from company remote
