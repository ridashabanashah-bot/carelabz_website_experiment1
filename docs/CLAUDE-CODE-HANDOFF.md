# Claude Code Handoff — v0 Integration + SEO/AEO Hardening

**What this is:** The exact prompt to paste into Claude Code (in the project root). It tells Claude Code to take the v0 export at `v0-export/`, integrate it into the existing Next.js 14 / Tailwind 3 project, and fix all 37 SEO/AEO issues flagged in `SEO-AEO-AUDIT.md`.

**Before you run this:** Confirm you're on a clean git branch. Recommended:
```bash
git checkout -b feat/arc-flash-v0-integration
```

---

## THE PROMPT — paste everything below into Claude Code

> I have a v0 export sitting at `v0-export/` in this project root. It's a redesigned arc-flash-study page. I also have an audit at `v0-export/SEO-AEO-AUDIT.md` listing 37 issues. I need you to integrate the v0 design into our existing Next.js 14 + Tailwind 3 project at `src/app/ae/services/study-analysis/arc-flash-study/page.tsx` and fix every issue in the audit. Read `v0-export/SEO-AEO-AUDIT.md` before you start — it has the full context.
>
> **Phase A — Read and plan.** First read `CLAUDE.md`, `v0-export/SEO-AEO-AUDIT.md`, `v0-export/app/page.tsx`, `v0-export/app/layout.tsx`, `v0-export/app/globals.css`, `v0-export/components/sticky-navbar.tsx`, `v0-export/components/faq-accordion.tsx`, `v0-export/components/mobile-nav.tsx`, `v0-export/components/json-ld.tsx`, the current `src/app/ae/services/study-analysis/arc-flash-study/page.tsx`, `src/app/layout.tsx`, `src/lib/strapi.ts`, `src/app/sitemap.ts`, `src/app/robots.ts`, `next.config.mjs`, `tailwind.config.ts`, and `package.json`. Then tell me your integration plan before you write any code.
>
> **Phase B — Convert v0 from Tailwind 4 to Tailwind 3.** The v0 export uses Tailwind v4 syntax (`@import 'tailwindcss'`, `@custom-variant`, `@utility`, `@theme inline`). Our project is on Tailwind 3.4.1. You must:
> 1. Port the color utilities (`bg-navy #0B1A2F`, `text-navy`, `bg-off-white #F8FAFC`, `bg-slate-card #1E293B`) into `tailwind.config.ts` under `theme.extend.colors` as named colors (`navy`, `offWhite`, `slateCard`) and update every JSX usage from `bg-navy` to `bg-navy` (works as named color), `text-navy` to `text-navy`, etc.
> 2. Do NOT copy `v0-export/app/globals.css` into `src/styles/globals.css`. Keep the existing Tailwind v3 globals file as-is. Discard the oklch variables, the dark-mode scaffolding, the `@theme inline` block, and `tw-animate-css` entirely.
> 3. Install `@tailwindcss/typography` if not already installed, so prose blocks render correctly.
> 4. Verify nothing in the v0 page.tsx uses `size-*` (Tailwind v4 only) — if it does, convert to `w-* h-*`.
>
> **Phase C — Move components.** Copy the three actually-used custom components into `src/components/`:
> - `v0-export/components/sticky-navbar.tsx` → `src/components/StickyNavbar.tsx`
> - `v0-export/components/faq-accordion.tsx` → `src/components/FAQAccordion.tsx`
> - `v0-export/components/mobile-nav.tsx` → `src/components/MobileNav.tsx`
> - `v0-export/components/json-ld.tsx` → `src/components/JsonLd.tsx` (we may already have one — merge, don't duplicate).
>
> **Do NOT copy** `v0-export/components/ui/*` (shadcn, unused), `v0-export/hooks/*` (unused), `v0-export/components.json`, `v0-export/package.json`, `v0-export/tsconfig.json`, `v0-export/next.config.mjs`, or `v0-export/postcss.config.mjs`. These would overwrite the real project config.
>
> **Phase D — Move images.** Copy everything under `v0-export/public/` into the real `public/` folder, keeping paths identical. Also create a new `public/og/arc-flash-study.jpg` sized 1200×630 — for now copy `public/images/hero-arc-flash.jpg` to that path; I'll replace it with a real OG image later. Before copying, compress every JPG over 150KB using `sharp-cli` or similar so the total footprint of `public/images/` stays under 1MB.
>
> **Phase E — Replace the arc-flash page.** Take `v0-export/app/page.tsx` and adapt it as `src/app/ae/services/study-analysis/arc-flash-study/page.tsx`. Requirements:
> 1. Server component (no `'use client'` at the top). The FAQ accordion and sticky navbar and mobile nav stay as client components in `src/components/`.
> 2. Fetch existing Strapi data via `getServicePageBySlug("arc-flash-study")` from `src/lib/strapi.ts`. Merge the Strapi response into `PAGE_DATA` like this: Strapi's `metaTitle`, `metaDescription`, `title` (as the hero headline), and `faqs` override the hardcoded values; everything else stays hardcoded for Phase 1. Do not try to store hero/features/industries/insights in Strapi yet — that's Phase 2 against the employer's real schemas.
> 3. Fix the industry and insights image filename generation. Move filenames into the data object as an explicit `image` field, e.g. `{ name: "Oil & Gas", image: "/images/industries/oil-and-gas.jpg", imageAlt: "..." }`. Same for insights cards.
> 4. Add `sizes="(max-width: 768px) 100vw, 50vw"` to every `<Image fill>` usage.
>
> **Phase F — Fix all 12 SEO issues from the audit.** Specifically:
> 1. Add `metadataBase: new URL("https://carelabz.com")` to `src/app/layout.tsx`.
> 2. Add `og:image` 1200×630 and `twitter:image` pointing at `/og/arc-flash-study.jpg`.
> 3. Add `alternates.languages` with `en-AE` and `x-default` (just those two for Phase 1).
> 4. Normalize `PAGE_URL` to use a **trailing slash** everywhere: canonical, JSON-LD `url`, breadcrumb items, sitemap entry, and redirect destination in `next.config.mjs`. All must match byte-for-byte.
> 5. Add `robots: { index: true, follow: true, googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 } }` to `generateMetadata`.
> 6. Add `authors`, `creator`, `publisher` fields to metadata.
> 7. Update `src/app/sitemap.ts` to include the new URL with `priority: 0.9`, `changeFrequency: "monthly"`, `lastModified: new Date()`.
> 8. Add a visible breadcrumb nav component (`<nav aria-label="Breadcrumb">`) above the hero H1 that matches the BreadcrumbList JSON-LD exactly.
> 9. Rewrite image alts to be keyword-rich (see audit §2.9 for specific replacements).
> 10. Change `<html lang="en">` to `<html lang="en-AE">` in `src/app/layout.tsx`.
> 11. Fix the trailing slash mismatch between redirect and canonical in `next.config.mjs`.
> 12. Write a better meta description: `"CareLAbz delivers IEEE 1584 arc flash studies in Dubai and across the UAE. ETAP modelling, DEWA-compliant reports, PPE labelling, and incident energy mitigation — typical turnaround 2–6 weeks."`
>
> **Phase G — Fix all 10 AEO issues from the audit.** Specifically:
> 1. Add `speakable: { "@type": "SpeakableSpecification", cssSelector: ["h1", ".hero-subtext", ".faq-answer"] }` to the Service JSON-LD. Add `className="hero-subtext"` to the hero paragraph and `className="faq-answer"` to the FAQ answer `<p>` tags.
> 2. Rewrite FAQ #4 ("How much does an arc flash study cost") to include an actual price range: `"Arc flash studies in the UAE typically range from AED 15,000 for a small single-substation facility to AED 80,000+ for large multi-building industrial sites. The cost depends on panel count, substation count, and electrical distribution complexity. CareLAbz provides a free scoping call and a fixed-fee proposal — contact us for a quote tailored to your facility."`
> 3. Add a HowTo JSON-LD block next to the existing Service/FAQ/LocalBusiness/Breadcrumb schemas, built from the 6 process steps. Include `totalTime: "P2W"` and `tool: ["ETAP software", "Fluke power quality analyzer", "Infrared thermography camera"]`.
> 4. Expand the Service JSON-LD to include: `serviceType: "Arc Flash Hazard Analysis"`, full `provider` with PostalAddress, telephone, and logo, `audience: { "@type": "BusinessAudience", audienceType: "Industrial facility managers" }`, `hasOfferCatalog` with 3 related services (Short Circuit Analysis, Coordination Study, Load Flow Analysis).
> 5. Add a bold definitional lede paragraph immediately under the H1: `"**An arc flash study is an engineering analysis that calculates the incident energy released during an electrical arc fault, so workers can be protected with the correct PPE and equipment boundaries.** CareLAbz performs IEEE 1584-compliant arc flash studies across Dubai and the UAE, delivering DEWA-ready reports, equipment labels, and remediation recommendations."` Give it `className="hero-subtext"`.
> 6. Add an Organization JSON-LD at the layout level (not page level) with `sameAs` pointing at LinkedIn, Facebook, Twitter, and `https://en.wikipedia.org/wiki/Arc_flash`.
> 7. Add `dateModified: new Date().toISOString()` and `datePublished: "2026-04-10"` to the Service JSON-LD, and render a visible `<time dateTime="2026-04-10">Last updated April 2026</time>` below the hero subtext.
> 8. Update the meta description per Phase F.12 (same item).
> 9. Expand FAQs from 6 to 10. Add these 4 new questions (write AEO-optimized answers 50–80 words each): (a) `"Is an arc flash study legally required in the UAE?"` (b) `"What is the difference between arc flash and short circuit analysis?"` (c) `"How often should an arc flash study be updated?"` — answer: every 5 years or after any significant system modification per NFPA 70E. (d) `"Who performs arc flash studies in Dubai?"` — answer should mention CareLAbz by name and reference the engineering credentials.
> 10. Link key entities inline in the body: IEEE 1584 → `https://standards.ieee.org/ieee/1584/`, NFPA 70E → `https://www.nfpa.org/codes-and-standards/nfpa-70e`, DEWA → `https://www.dewa.gov.ae/`, ETAP → `https://etap.com/`. Use `rel="noopener"` on all external links.
>
> **Phase H — Fix accessibility gaps.** Add a skip-to-content link, `role="region"` on FAQ panels, `aria-labelledby` on insights cards, and verify keyboard focus works on the sticky navbar scroll transition.
>
> **Phase I — Clean up.** After everything works:
> 1. Delete the `v0-export/` folder entirely (we don't want two copies of the same files in the repo — keep the audit and handoff markdowns by moving them to `docs/` first).
> 2. Move `v0-export/SEO-AEO-AUDIT.md` and `v0-export/CLAUDE-CODE-HANDOFF.md` to `docs/` before deleting `v0-export/`.
> 3. Run `npm run build` and fix any TypeScript, ESLint, or build errors.
> 4. Run `npm run lint` and fix warnings.
> 5. Start dev server (`npm run dev`) and load the page at `http://localhost:3000/ae/services/study-analysis/arc-flash-study/`. Take a screenshot if you can. Verify: hero loads, all 10 FAQs expand, all 6 process cards render, all 8 industry images load, navbar transitions on scroll.
> 6. Verify the 301 redirect: hit `http://localhost:3000/arc-flash-study-analysis/` and confirm it 301s to the new URL with trailing slash.
> 7. View source on the built page and confirm: exactly one `<h1>`, exactly 5 JSON-LD blocks (Service, FAQPage, LocalBusiness, BreadcrumbList, HowTo), canonical and og:url match trailing slash, meta description is the new one, `<html lang="en-AE">`.
> 8. Run `curl -sS http://localhost:3000/sitemap.xml` and confirm the new URL is present.
> 9. Commit with a detailed message listing every Phase (A–I) that was completed. Push. Wait for Vercel. Report the Vercel URL.
>
> **Rules:**
> - Use TypeScript everywhere. No `any`.
> - Server components by default.
> - Tailwind utilities only. No inline styles.
> - Every `next/image fill` MUST have a `sizes` prop.
> - Do not add shadcn/ui. Do not add `tw-animate-css`. Do not add `@vercel/analytics` (we'll add it separately).
> - Do not touch `carelabz-cms/` — Strapi schema stays frozen for Phase 1.
> - If you hit an issue you can't resolve, STOP and ask me. Don't guess.
>
> Acknowledge this prompt by listing the files you plan to create, modify, and delete, then wait for me to say "go" before writing any code.

---

## WHY YOU WANT CLAUDE CODE TO DO THIS AND NOT ME

- **File volume.** This touches ~15 files with ~200 specific changes. Claude Code can batch-edit in the repo; I'd eat a lot of tokens here running one Edit at a time.
- **Build verification.** Claude Code can run `npm run build` and iterate on errors. I can't directly run your project toolchain in this session.
- **Git integration.** Claude Code commits and pushes. I'd just hand you a diff.
- **Screenshots.** Claude Code can take a screenshot of the rendered page and verify it visually matches v0.

## WHAT YOU SHOULD WATCH FOR

When Claude Code comes back with its plan (end of Phase A), check:
1. Does it plan to delete `components/ui/` (shadcn)? It should.
2. Does it plan to keep `carelabz-cms/` untouched? It should.
3. Does it acknowledge the Tailwind v4 → v3 conversion? If not, push back.
4. Does it plan to delete `v0-export/` at the end after moving the docs? It should.
5. Does it mention the trailing-slash canonical issue? Critical — if it doesn't, remind it.

If all five are green, say "go". If any are red, ask Claude Code to revise the plan first.
