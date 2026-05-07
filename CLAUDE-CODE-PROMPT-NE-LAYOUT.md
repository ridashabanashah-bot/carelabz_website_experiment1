# Claude Code Prompt — NE Layout Overhaul (Inspo-Driven)

Copy everything below the line into Claude Code.

---

## Task: Completely redesign NE page layouts to match inspiration site patterns

**Branch:** `redesign/ne-layouts`

Read `CLAUDE.md` before starting.

**Problem:** The NE pages now have the right colors (Nordic blue `#1A3650`, sand `#F0EBE1`, warm white `#F9F7F3`) and the right fonts (Fraunces + Syne), but the LAYOUTS are still generic grids that look like any template site. The inspiration sites (Nobl.io, Aleia.io, Align Pilates, Pilates Collective) use fundamentally different compositional moves:

- **Nobl:** Full-viewport single-sentence sections. One statement per section. No cards. No grids. Massive confidence.
- **Aleia:** Full-width color-block bands with hard transitions. Each section is a solid color with one bold statement.
- **Align Pilates:** Alternating warm backgrounds with tracked-caps eyebrows + serif headings + generous whitespace. Photography-first cards with zero borders/shadows.
- **Pilates Collective:** Cinematic full-bleed sections. Giant marquee text. Pill buttons.

**CRITICAL: Only edit NE files. Do NOT touch SA/US/AE files.**

Use NE colors throughout: `#1A3650` (primary), `#F0EBE1` (sand), `#F9F7F3` (warm white), `#243E54` (slate), `#4A7C9B` (mid-blue), `#F97316` (orange).

Use NE font classes: `font-ne-display` (Fraunces), `font-ne-accent` (Fraunces italic), `font-ne-body` (Syne), `font-ne-nav` (Syne).

---

## STEP 1 — UK Homepage Layout Overhaul

**File:** `src/app/uk/page.tsx`

Completely rewrite the page body. Keep the existing `generateMetadata()`, jsonLd logic, and data fetching. Replace the JSX return with these sections:

### Section 1 — STATEMENT HERO (Nobl-inspired)

No split layout. No geometric shapes. No image. Just a massive statement that owns the entire viewport. This is Nobl's core move — let the words be the product.

```tsx
<section className="relative min-h-[85vh] flex items-center bg-[#1A3650] overflow-hidden">
  {/* Subtle grid texture */}
  <div
    className="absolute inset-0 opacity-[0.03]"
    aria-hidden="true"
    style={{
      backgroundImage: "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
      backgroundSize: "80px 80px",
    }}
  />
  <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 py-32">
    <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.95]">
      {page.heroHeadline ?? "Electrical Safety Demands"}
      <br />
      <span className="font-ne-accent italic font-normal text-[#F97316]">
        {config.countryName}.
      </span>
    </h1>
    {page.heroSubtext && (
      <p className="font-ne-body text-base text-white/40 mt-10 max-w-lg leading-relaxed">
        {page.heroSubtext}
      </p>
    )}
    <div className="mt-12">
      <Link
        href={page.heroPrimaryCtaHref ?? config.contactPath}
        className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-4 transition-colors"
      >
        {page.heroPrimaryCtaText ?? "Request a Study"}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>
```

### Section 2 — STATEMENT BAND (Aleia-inspired)

A full-width orange color-block with a single bold sentence. Hard color transition from the hero. No padding, no container — just a statement.

```tsx
<section className="bg-[#F97316] py-8 lg:py-10">
  <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
    <p className="font-ne-display font-black text-xl md:text-2xl lg:text-3xl text-white uppercase leading-tight tracking-tight">
      {config.primaryStandard} · IEEE 1584 · Arc Flash Studies · Power System Engineering · {config.countryName}
    </p>
  </div>
</section>
```

### Section 3 — SERVICES as stacked full-width rows (NOT a grid)

Each service is its own row stretching the full width, alternating between warm-white and sand backgrounds. This is Align's alternating rhythm applied to services — no cards, no grid, no shadows. Each service "owns" its row.

```tsx
{page.services && page.services.length > 0 && (
  <section>
    {page.services.slice(0, 6).map((service, i) => (
      <Link
        key={service.href}
        href={service.href}
        className={`group block ${i % 2 === 0 ? "bg-[#F9F7F3]" : "bg-[#F0EBE1]"}`}
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="flex items-start gap-8 flex-1 min-w-0">
            <span className="font-ne-display font-black text-5xl lg:text-6xl text-[#1A3650]/[0.08] leading-none shrink-0">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div>
              <h2 className="font-ne-display font-black text-2xl lg:text-3xl text-[#1A3650] uppercase leading-tight group-hover:text-[#F97316] transition-colors">
                {service.title}
              </h2>
              {service.description && (
                <p className="font-ne-body text-sm text-[#1A3650]/50 mt-3 max-w-xl leading-relaxed">
                  {service.description}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity">
              Explore
            </span>
            <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-[#F97316] transition-colors" />
          </div>
        </div>
      </Link>
    ))}
  </section>
)}
```

### Section 4 — SINGLE-SENTENCE VIEWPORT (Nobl's signature move)

Nobl lets a single sentence own an entire viewport. This is the manifesto section — no pills, no badges, no stats. Just one confident statement on a dark background.

```tsx
<section className="bg-[#1A3650] min-h-[60vh] flex items-center px-6">
  <div className="max-w-[1000px] mx-auto">
    <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95]">
      We don&apos;t deliver reports.
    </h2>
    <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-4 leading-[1.05]">
      We deliver safety.
    </p>
  </div>
</section>
```

### Section 5 — PROCESS / METHODOLOGY (Nobl's dark methodology panels)

Nobl shows methodology in dark panels side-by-side. For Carelabs, show the 4-step process as large numbered blocks on a dark background — not cards, just text blocks separated by vertical dividers.

```tsx
<section className="bg-[#243E54] py-20 lg:py-28">
  <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
    <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-8 block">
      How We Work
    </span>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#4A7C9B]/20">
      {(page.processSteps ?? [
        { title: "Discovery", description: "Deep-dive into your electrical infrastructure and compliance posture." },
        { title: "Analysis", description: "Arc flash, short circuit, load flow — the full IEEE 1584 study suite." },
        { title: "Reporting", description: "Actionable documentation with risk scores, labels, and remediation steps." },
        { title: "Compliance", description: `Full alignment with ${config.primaryStandard} and international standards.` },
      ]).map((step: { title: string; description: string }, i: number) => (
        <div key={i} className="py-8 lg:py-0 lg:px-8 first:lg:pl-0 last:lg:pr-0">
          <span className="font-ne-display font-black text-4xl text-[#F97316]/20">
            {String(i + 1).padStart(2, "0")}
          </span>
          <h3 className="font-ne-display font-black text-xl text-white uppercase mt-4">
            {step.title}
          </h3>
          <p className="font-ne-body text-sm text-white/40 mt-3 leading-relaxed">
            {step.description}
          </p>
        </div>
      ))}
    </div>
  </div>
</section>
```

### Section 6 — INDUSTRIES MARQUEE (Pilates Collective giant scroll text)

Keep the existing marquee animation but remove any heading above it. The marquee IS the section — no wrapper heading needed. Just a raw ticker of industry names flowing by. Sand background.

```tsx
{page.industries && page.industries.length > 0 && (
  <section className="bg-[#F0EBE1] py-10 overflow-hidden">
    <div className="relative">
      <div className="animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, dupe) => (
          <span key={dupe} className="inline-block">
            {page.industries!.map((industry, i) => (
              <span
                key={`${dupe}-${i}`}
                className="inline-block mx-6 font-ne-display font-black text-5xl md:text-7xl uppercase text-[#1A3650]/[0.07] tracking-tight"
              >
                {industry.name}
                <span className="text-[#F97316]/30 mx-6">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  </section>
)}
```

### Section 7 — INSIGHTS / BLOG (editorial line-list on dark background)

Not cards. Not a grid. A simple list of article titles as links, stacked vertically on a dark background. Each row is a border-separated line with title left, arrow right. Nobl's editorial index style.

```tsx
{page.insights && page.insights.length > 0 && (
  <section className="bg-[#1A3650] py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="flex items-end justify-between mb-12">
        <div>
          <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-4 block">
            From the Blog
          </span>
          <h2 className="font-ne-display font-black text-3xl md:text-4xl text-white uppercase">
            Latest Insights
          </h2>
        </div>
        <Link
          href={config.blogIndexPath}
          className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] hover:text-[#F97316]/70 inline-flex items-center gap-2 transition-colors"
        >
          View All <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
      <div className="divide-y divide-[#4A7C9B]/20">
        {page.insights.slice(0, 5).map((insight, i) => (
          <Link
            key={i}
            href={insight.href}
            className="group flex items-center justify-between py-6 gap-6"
          >
            <h3 className="font-ne-display font-bold text-lg md:text-xl text-white uppercase group-hover:text-[#F97316] transition-colors">
              {insight.title}
            </h3>
            <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#F97316] transition-colors shrink-0" />
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
```

### Section 8 — FAQ (on sand, left-aligned)

```tsx
{page.faqs && page.faqs.length > 0 && (
  <section className="bg-[#F0EBE1] py-16 lg:py-24">
    <div className="max-w-3xl mx-auto px-6 lg:px-12">
      <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-3 block">
        FAQ
      </span>
      <h2 className="font-ne-display font-black text-3xl md:text-4xl text-[#1A3650] uppercase mb-10">
        Common Questions
      </h2>
      {page.faqs.map((faq, i) => (
        <details key={i} className="group border-b border-[#1A3650]/10 py-5">
          <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ne-display font-bold text-base md:text-lg text-[#1A3650] uppercase">
            <span>{faq.question}</span>
            <Plus className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
          </summary>
          <p className="font-ne-body text-base text-[#1A3650]/60 mt-3 leading-relaxed">
            {faq.answer}
          </p>
        </details>
      ))}
    </div>
  </section>
)}
```

### Section 9 — FINAL CTA (Nobl's "Let's Talk" — one sentence, one button)

```tsx
<section className="bg-[#1A3650] py-24 lg:py-32 px-6">
  <div className="max-w-[1000px] mx-auto">
    <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
      {page.ctaBannerHeading ?? "Let\u2019s talk about"}
    </h2>
    <p className="font-ne-accent italic text-3xl md:text-4xl text-[#F97316] mt-3">
      your facility.
    </p>
    <div className="mt-12">
      <Link
        href={page.ctaBannerPrimaryHref ?? config.contactPath}
        className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
      >
        {page.ctaBannerPrimaryCtaText ?? "Get in Touch"}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>
```

### Trust Bar — REMOVE IT

The trust bar with standards is now handled by the orange STATEMENT BAND (Section 2) which lists the standards inline. Remove the old trust bar section entirely.

---

## STEP 2 — Other UK pages: apply NE layout patterns

Apply these layout principles to each page. The key rules:

### Global NE layout rules:
1. **No card grids** — use stacked full-width rows or line-separated lists
2. **No `rounded-2xl`** — sharp edges everywhere
3. **No shadow hover** — use color-shift hover (`group-hover:text-[#F97316]`) and arrow reveals
4. **Alternate section backgrounds** — cycle through `#1A3650`, `#F0EBE1`, `#F9F7F3`, `#243E54` for visual rhythm
5. **Full-width sections** — every section spans edge-to-edge, content contained by `max-w-[1400px]`
6. **One statement per section** — each section has a clear single purpose
7. **Generous vertical padding** — `py-20 lg:py-28` minimum on content sections

### 2A — `src/app/uk/our-services/page.tsx`
- Hero: Statement-style (left-aligned, dark background, just text)
- Services: Full-width alternating rows (same as homepage Section 3)
- CTA: Single sentence + single button

### 2B — `src/app/uk/about-us/page.tsx`
- Hero: Statement-style
- Content: Alternating full-width bands (dark/sand/warm-white)
- Values/mission: Each value gets its own full-width row (not a grid of cards)
- Team section: If present, simple names + titles in a 2-column text list, no photo cards

### 2C — `src/app/uk/contact-us/page.tsx`
- Hero: Compact statement
- Layout: Two-column — left side has contact info stacked vertically (phone, email, address as simple text blocks), right side has the form
- Form fields: Bottom-border-only inputs (no full box borders)
- Submit button: Orange, sharp corners

### 2D — `src/app/uk/blogs/page.tsx`
- Hero: Statement-style ("From the Blog" with Fraunces)
- Articles: Stacked editorial line-list (title left, category + date right, border-bottom between each). NO image cards. NO image placeholders. Pure text index.
- Each row is a Link with hover → title turns orange

### 2E — `src/app/uk/[slug]/page.tsx`
- Service detail / blog detail: Standard prose layout
- Related posts: Line-list (not cards)
- Breadcrumb-style nav at top

### 2F — `src/app/uk/case-studies/page.tsx`
- Keep "Coming Soon" but style with statement layout

---

## STEP 3 — Clone UK layouts to IE, SE, NO, DK, FI

Copy the redesigned UK page layouts to all 5 other NE countries. Only difference per country:
- `const CC = "ie"` / `"se"` / etc.
- `const config = COUNTRY_CONFIGS[CC]`

---

## STEP 4 — Verification

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all 42 NE routes + SA/US/AE routes compile
4. Commit: `redesign: overhaul NE layouts with Nobl statement sections, Aleia color bands, Align alternating rows`
5. Merge to main, push both: `git checkout main && git merge redesign/ne-layouts && git push origin main && git push company main`
