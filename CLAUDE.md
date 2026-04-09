# CareLAbz Website Migration — Claude Code Briefing

This file auto-loads when Claude Code opens this project. It contains everything Claude needs to understand the project without being re-explained.

## Project Overview

We are rebuilding carelabz.com from WordPress to a modern headless CMS stack. This is a phased migration:

- **Phase 1 (current):** Migrate a single page as an experiment
- **Phase 2:** Migrate all pages for one country (AE — United Arab Emirates)
- **Phase 3:** Roll out to all 50 countries

## The Experiment (Phase 1)

Migrating one URL to prove the stack works end-to-end:

| | URL |
|---|---|
| **Old (WordPress)** | `carelabz.com/arc-flash-study-analysis/` |
| **New (Next.js)** | `carelabz.com/ae/services/study-analysis/arc-flash-study/` |
| **301 Redirect** | Old → New (configured in `next.config.mjs`) |

## Tech Stack

| Layer | Technology | Version |
|---|---|---|
| Frontend | Next.js (App Router) | 14.2.35 |
| Language | TypeScript | ^5 |
| Styling | Tailwind CSS | ^3.4.1 |
| CMS | Strapi 5 | 5.42.0 |
| CMS Database | PostgreSQL (Railway) / SQLite (local dev) |
| Hosting | Vercel (auto-deploys on git push to `main`) |
| Code | GitHub (`ridashabanashah-bot/carelabz_website_experiment1`) |
| CMS Hosting | Railway |

## URL Structure

The site serves multiple countries. The URL pattern is:

```
carelabz.com/{country-slug}/services/{category-slug}/{service-slug}/
```

For Phase 1, the only active country slug is `ae` (UAE).

Future country slugs will include: `us`, `uk`, `sa`, `qa`, `kw`, `bh`, `om`, `eg`, `jo`, `lb`, `in`, `pk`, etc. (50 total).

## Project Structure

```
website_rebuild_project/          ← Next.js frontend (root)
├── src/
│   ├── app/
│   │   ├── layout.tsx            ← Root layout
│   │   ├── page.tsx              ← Homepage
│   │   └── ae/services/study-analysis/arc-flash-study/
│   │       └── page.tsx          ← The migrated page (server component)
│   ├── lib/
│   │   └── strapi.ts             ← Strapi API client with TypeScript types
│   └── styles/
│       └── globals.css
├── next.config.mjs               ← Redirects (301 old→new) + Next.js config
├── .env.local                    ← NEXT_PUBLIC_STRAPI_URL, STRAPI_API_TOKEN
│
├── carelabz-cms/                 ← Strapi 5 CMS (separate app)
│   └── src/
│       ├── api/service-page/     ← ServicePage collection type
│       │   └── content-types/service-page/schema.json
│       └── components/shared/    ← Reusable Strapi components
│           └── faq-item.json     ← FAQ question/answer pair
│
└── skills/                       ← Claude skills for this project
    ├── wp-content-extraction/
    ├── strapi5-content-modeling/
    ├── nextjs-strapi-integration/
    ├── seo-redirect-management/
    ├── vercel-deployment/
    └── content-migration-pipeline/
```

## Strapi Content Model

### ServicePage (collection type)

| Field | Type | Notes |
|---|---|---|
| `title` | String (required) | Page heading |
| `slug` | UID → title (required) | URL identifier |
| `body` | Rich Text (required) | Main page content (HTML) |
| `metaTitle` | String (required) | Browser tab / SEO title |
| `metaDescription` | Text (required) | Meta description tag |
| `faqs` | Component (repeatable) → `shared.faq-item` | FAQ section |

### shared.faq-item (component)

| Field | Type |
|---|---|
| `question` | String (required) |
| `answer` | Text (required) |

## Strapi 5 API Notes

- **Response format:** Strapi 5 returns flat data — fields are directly on the object, NOT nested under `data.attributes` like Strapi 4. The `strapi.ts` client handles both formats as a safety fallback.
- **Populate:** Strapi 5 does NOT include relations/components by default. Always use `?populate=faqs` (or `populate=*`).
- **Draft & Publish:** Content must be explicitly published to appear in API responses.
- **API endpoint:** `GET /api/service-pages?filters[slug][$eq]=arc-flash-study&populate=faqs`

## Environment Variables

### Next.js Frontend (`.env.local` — never committed)
```
NEXT_PUBLIC_STRAPI_URL=<Railway Strapi URL or http://localhost:1337>
STRAPI_API_TOKEN=<Read-only API token from Strapi admin>
```

### Vercel (set in dashboard, not in code)
Same variables as above, plus:
```
NEXT_PUBLIC_SITE_URL=https://carelabz.com
REVALIDATION_SECRET=<random string for webhook revalidation>
```

## Key Commands

```bash
# Frontend (from project root)
npm run dev          # Start Next.js dev server (localhost:3000)
npm run build        # Production build (also runs type checking)
npm run lint         # ESLint

# CMS (from carelabz-cms/)
cd carelabz-cms
npm run develop      # Start Strapi dev server (localhost:1337)
npm run build        # Build Strapi admin panel
```

## Rules for Claude

1. **Always use TypeScript** — no `.js` files in `src/`.
2. **Server components by default** — only add `'use client'` when you need interactivity (onClick, useState, etc.).
3. **Fetch from Strapi using `src/lib/strapi.ts`** — don't create ad-hoc fetch calls.
4. **Never commit `.env.local`** — it's in `.gitignore`.
5. **301 redirects go in `next.config.mjs`** — not in `vercel.json`.
6. **Tailwind CSS only** — no inline styles, no CSS modules, no styled-components on the frontend.
7. **Test the build before pushing** — run `npm run build` to catch TypeScript errors.
8. **Strapi schema changes must be committed** — the `schema.json` files in `carelabz-cms/src/` are version-controlled.
9. **ISR revalidation is 60 seconds** — set in the `strapi.ts` fetch client via `next: { revalidate: 60 }`.
