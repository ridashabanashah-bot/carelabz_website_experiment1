# Claude Code Prompt — NE Homepage: Nobl.io Layout Replica

Copy everything below the line into Claude Code.

---

## Task: Replicate Nobl.io's exact homepage layout for all NE country homepages

**Branch:** `redesign/ne-nobl-homepage`

Read `CLAUDE.md` before starting.

**Reference:** Nobl.io — a B2B consulting firm. Their homepage has these exact sections in order:

1. **HERO** — Flat background, CENTERED massive serif headline (2 lines), small gray sans sub-copy centered below, NO button, NO image, NO shapes. The headline IS the product. Entire viewport.
2. **BRAND STATEMENT BLOCK** — Full-width solid color block (Nobl uses deep red). Single white serif sentence describing what the company does. Hard color transition from hero.
3. **SERVICES/CAPABILITIES** — Clean rows listing what they offer, on a neutral background
4. **METHODOLOGY** — Dark panels showing process steps with accent-color numbers
5. **FEATURE/HIGHLIGHT** — A single featured piece of content
6. **CTA** — "Let's Talk." — one serif heading + one pill button. Nothing else. On a neutral background.
7. **FOOTER** — Dark, minimal, serif statement left + link columns right

**CRITICAL:** Only edit NE homepage files. Do NOT touch SA/US/AE files, and do NOT touch non-homepage NE pages (about, contact, services, blogs, slug, case-studies).

**Files to edit:**
- `src/app/uk/page.tsx`
- `src/app/ie/page.tsx`
- `src/app/se/page.tsx`
- `src/app/no/page.tsx`
- `src/app/dk/page.tsx`
- `src/app/fi/page.tsx`

Use NE colors: `#1A3650` (primary), `#F0EBE1` (sand), `#F9F7F3` (warm white), `#243E54` (slate), `#4A7C9B` (mid-blue), `#F97316` (orange).
Use NE fonts: `font-ne-display`, `font-ne-accent`, `font-ne-body`, `font-ne-nav`.

---

## REPLACE the entire JSX return (keep generateMetadata, jsonLd, imports, data fetching)

Delete everything inside `return ( ... )` and replace with the following. This is the COMPLETE page layout. Do not add anything extra. Do not keep any old sections. Do not add geometric circles, split layouts, or decorative shapes.

### Imports needed:

```tsx
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
```

### Complete JSX:

```tsx
return (
  <>
    <JsonLd data={jsonLdData} />
    <NEAnnouncementTicker countryName={config.countryName} standards={config.standards} />
    <NENavbar config={config} />

    {/* ═══════ 1 · HERO — Nobl: centered statement, full viewport ═══════ */}
    <section className="min-h-screen flex items-center justify-center bg-[#1A3650] px-6">
      <div className="text-center max-w-5xl py-24">
        <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] text-white leading-[0.92]">
          {page.heroHeadline ?? "Electrical Safety Demands Certainty."}
        </h1>
        <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-6">
          {config.countryName}.
        </p>
        {page.heroSubtext && (
          <p className="font-ne-body text-base md:text-lg text-white/35 mt-10 max-w-2xl mx-auto leading-relaxed">
            {page.heroSubtext}
          </p>
        )}
      </div>
    </section>

    {/* ═══════ 2 · BRAND STATEMENT — Nobl's red block → our orange block ═══════ */}
    <section className="bg-[#F97316] py-14 lg:py-20 px-6">
      <div className="max-w-5xl mx-auto text-center">
        <p className="font-ne-display font-black text-2xl md:text-3xl lg:text-4xl text-white leading-snug">
          We&apos;re Carelabs. We protect people and facilities through rigorous power system engineering.
        </p>
      </div>
    </section>

    {/* ═══════ 3 · SERVICES — stacked rows on sand ═══════ */}
    {page.services && page.services.length > 0 && (
      <section className="bg-[#F0EBE1] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] mb-4 block">
              Capabilities
            </span>
            <h2 className="font-ne-display font-black text-3xl md:text-5xl text-[#1A3650] leading-[0.95]">
              What We Do
            </h2>
          </div>
          <div className="divide-y divide-[#1A3650]/10">
            {page.services.slice(0, 6).map((service, i) => (
              <Link
                key={service.href}
                href={service.href}
                className="group flex items-center justify-between py-7 gap-6"
              >
                <div className="flex items-center gap-6">
                  <span className="font-ne-display font-black text-3xl text-[#1A3650]/10 w-12 shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-ne-display font-black text-xl md:text-2xl text-[#1A3650] uppercase group-hover:text-[#F97316] transition-colors">
                    {service.title}
                  </h3>
                </div>
                <ArrowRight className="w-5 h-5 text-[#1A3650]/15 group-hover:text-[#F97316] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href={config.servicesIndexPath}
              className="font-ne-nav text-sm uppercase tracking-[0.15em] text-[#F97316] hover:text-orange-600 inline-flex items-center gap-2 transition-colors"
            >
              View All Services <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    )}

    {/* ═══════ 4 · MANIFESTO — Nobl's single sentence viewport ═══════ */}
    <section className="bg-[#1A3650] flex items-center justify-center px-6 py-28 lg:py-40">
      <div className="text-center max-w-4xl">
        <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-7xl text-white leading-[0.92]">
          We don&apos;t deliver reports.
        </h2>
        <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-5">
          We deliver safety.
        </p>
      </div>
    </section>

    {/* ═══════ 5 · METHODOLOGY — Nobl's dark panels ═══════ */}
    <section className="bg-[#243E54] py-20 lg:py-28">
      <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
        <div className="text-center mb-16">
          <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-4 block">
            Methodology
          </span>
          <h2 className="font-ne-display font-black text-3xl md:text-5xl text-white leading-[0.95]">
            How We Work
          </h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#4A7C9B]/20">
          {(page.processSteps ?? [
            { title: "Discovery", description: "Deep-dive into your electrical infrastructure and compliance posture." },
            { title: "Analysis", description: "Arc flash, short circuit, load flow — the full IEEE 1584 study suite." },
            { title: "Reporting", description: "Actionable documentation with risk scores, labels, and remediation steps." },
            { title: "Compliance", description: `Full alignment with ${config.primaryStandard} and international standards.` },
          ]).map((step: { title: string; description: string }, i: number) => (
            <div key={i} className="bg-[#243E54] p-8">
              <span className="font-ne-display font-black text-5xl text-[#F97316]/15 block">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3 className="font-ne-display font-black text-xl text-white uppercase mt-6">
                {step.title}
              </h3>
              <p className="font-ne-body text-sm text-white/40 mt-4 leading-relaxed">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ═══════ 6 · INDUSTRIES MARQUEE ═══════ */}
    {page.industries && page.industries.length > 0 && (
      <section className="bg-[#F9F7F3] py-12 overflow-hidden">
        <div className="relative">
          <div className="animate-marquee whitespace-nowrap">
            {[...Array(2)].map((_, dupe) => (
              <span key={dupe} className="inline-block">
                {page.industries!.map((industry, i) => (
                  <span
                    key={`${dupe}-${i}`}
                    className="inline-block mx-8 font-ne-display font-black text-6xl md:text-8xl uppercase text-[#1A3650]/[0.06]"
                  >
                    {industry.name}
                    <span className="text-[#F97316]/20 mx-8">·</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>
    )}

    {/* ═══════ 7 · INSIGHTS — Nobl's editorial list ═══════ */}
    {page.insights && page.insights.length > 0 && (
      <section className="bg-[#F0EBE1] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] mb-4 block">
              Insights
            </span>
            <h2 className="font-ne-display font-black text-3xl md:text-5xl text-[#1A3650] leading-[0.95]">
              From the Blog
            </h2>
          </div>
          <div className="divide-y divide-[#1A3650]/10">
            {page.insights.slice(0, 5).map((insight, i) => (
              <Link
                key={i}
                href={insight.href}
                className="group flex items-center justify-between py-6 gap-6"
              >
                <h3 className="font-ne-display font-bold text-lg md:text-xl text-[#1A3650] group-hover:text-[#F97316] transition-colors">
                  {cleanTitle(insight.title)}
                </h3>
                <ArrowRight className="w-5 h-5 text-[#1A3650]/15 group-hover:text-[#F97316] transition-colors shrink-0" />
              </Link>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href={config.blogIndexPath}
              className="font-ne-nav text-sm uppercase tracking-[0.15em] text-[#F97316] hover:text-orange-600 inline-flex items-center gap-2 transition-colors"
            >
              Read All Articles <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    )}

    {/* ═══════ 8 · FAQ ═══════ */}
    {page.faqs && page.faqs.length > 0 && (
      <section className="bg-[#F9F7F3] py-16 lg:py-24">
        <div className="max-w-3xl mx-auto px-6 lg:px-12">
          <div className="text-center mb-12">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] mb-4 block">
              FAQ
            </span>
            <h2 className="font-ne-display font-black text-3xl md:text-4xl text-[#1A3650]">
              Common Questions
            </h2>
          </div>
          {page.faqs.map((faq, i) => (
            <details key={i} className="group border-b border-[#1A3650]/10 py-5">
              <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ne-display font-bold text-base md:text-lg text-[#1A3650]">
                <span>{faq.question}</span>
                <Plus className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
              </summary>
              <p className="font-ne-body text-base text-[#1A3650]/50 mt-3 leading-relaxed">
                {faq.answer}
              </p>
            </details>
          ))}
        </div>
      </section>
    )}

    {/* ═══════ 9 · CTA — Nobl's "Let's Talk." ═══════ */}
    <section className="bg-[#F0EBE1] py-28 lg:py-40 px-6">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="font-ne-display font-black text-5xl md:text-6xl lg:text-7xl text-[#1A3650] leading-[0.92]">
          Let&apos;s Talk.
        </h2>
        <div className="mt-12">
          <Link
            href={page.ctaBannerPrimaryHref ?? config.contactPath}
            className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 rounded-full transition-colors"
          >
            Contact Us
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>

    <NEFooter config={config} />
  </>
);
```

---

## KEY DIFFERENCES from previous NE layout (READ CAREFULLY):

1. **Hero is CENTERED**, not left-aligned. Text-center on everything. `justify-center` on the section.
2. **Hero has NO CTA button**. The statement is enough. Nobl doesn't put a button in the hero — the confidence of the statement draws you in. The CTA lives at the bottom of the page.
3. **Hero is `min-h-screen`** — takes the full viewport. No `min-h-[85vh]`.
4. **Hero has NO geometric shapes** — no circles, no decorative elements. Delete them completely. Remove any `<div>` with circles/borders that's `aria-hidden="true"`. Keep ONLY the subtle grid texture.
5. **Brand statement block (Section 2)** is CENTERED text, not left-aligned.
6. **Services section is on sand** `#F0EBE1`, not alternating rows. Simple line-separated list.
7. **Manifesto section is CENTERED**, not left-aligned.
8. **Methodology section heading is CENTERED**.
9. **Insights section is on SAND** (warm, like Nobl's cream), not on dark background.
10. **CTA uses "Let's Talk."** as a single giant heading — not "Let's talk about" + "your facility" on two lines. Just "Let's Talk." — Nobl's exact pattern.
11. **CTA button is `rounded-full`** — a pill button, Nobl's style. This is the ONE exception to the "no rounded corners" rule.
12. **No `uppercase` on FAQ questions** — Nobl uses sentence case for FAQ, not screaming caps.

---

## Apply to all 6 NE countries

Copy the exact same layout to ie/page.tsx, se/page.tsx, no/page.tsx, dk/page.tsx, fi/page.tsx. Only change `CC` and `config` per country.

Make sure the `cleanTitle()` function is present in each file.

---

## Verification

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all routes compile
4. **Visual check**: Grep for `geometric\|circle\|col-span-2\|col-span-3\|lg:col-span` in NE homepage files — must return ZERO results (no split layouts or geometric shapes)
5. Commit: `redesign: replicate Nobl.io centered-statement layout for all NE homepages`
6. Merge + push: `git checkout main && git merge redesign/ne-nobl-homepage && git push origin main && git push company main`
