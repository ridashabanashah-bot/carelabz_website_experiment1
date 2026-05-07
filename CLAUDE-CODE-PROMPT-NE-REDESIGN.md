# Claude Code Prompt — NE Design Overhaul

Copy everything below the line into Claude Code.

---

## Task: Redesign all Northern Europe pages to be visually distinct from South America

**Branch:** `redesign/ne-pages`

Read `CLAUDE.md` before starting.

**Problem:** The NE pages (UK, IE, SE, NO, DK, FI) currently look identical to the SA pages (BR, CO, CL, AR, PE). They share the same layout patterns: centered hero, rounded-2xl shadow-lift cards, gradient dots, identical section rhythm. The NE region needs a distinct editorial/magazine design language.

**Scope:** Edit all 6 NE country page files + the 3 NE components. Do NOT touch any SA files or components.

---

## DESIGN SYSTEM — NE vs SA differences

| Element | SA (Brazil etc.) | NE (UK etc.) — NEW |
|---------|-----------------|-------------------|
| **Hero** | Centered text, full-viewport navy | **Split layout** — text LEFT (60%), abstract geometric pattern RIGHT (40%). Not full viewport — `py-28 lg:py-36` |
| **Service cards** | `rounded-2xl` with shadow-lift hover, navy placeholder image block on top | **Flat borderless cards** — no background color, no shadow. Just a thin `border-b border-[#0B1A2F]/10` bottom divider. Number + title + description + arrow. Stacked vertically in 2 columns, editorial list style |
| **CTA sections** | Gradient `bg-gradient-to-r from-orange-500 to-[#0B1A2F]` or navy with centered text | **Clean single-line CTA** — navy `bg-[#0B1A2F]` with a single sentence in white, small orange link underneath. `py-16` not `py-24`. Understated, not shouting |
| **Blog/insight cards** | `rounded-2xl` with image placeholder, shadow hover | **Horizontal editorial rows** — no card wrapper, just text. Title left, category + date right, separated by a border-bottom line. Magazine index style |
| **Industries** | Marquee animation + text grid below | **Marquee only** — remove the text `<ul>` grid entirely |
| **Manifesto** | Navy centered with pill badges | **Asymmetric quote** — text-left aligned, larger font, no pill badges. Single strong statement |
| **Trust bar** | Horizontal pill badges with CheckCircle | **Inline text** — "Certified to IEEE 1584 · BS 7671 · IEC 61482" as a single line of spaced text, no pills, no icons. `font-condensed text-xs tracking-[0.25em] text-[#0B1A2F]/50` |
| **Section backgrounds** | Alternating white / `#F8FAFC` | **More contrast** — alternate between white and full navy `#0B1A2F` sections. Use off-white `#F8FAFC` sparingly |
| **FAQ** | Off-white background, centered | **Navy background**, white text, left-aligned. Orange `+` icon stays |

---

## STEP 0 — NENavbar redesign

**File:** `src/components/ne-navbar.tsx`

Make the NE navbar visually different from SA:

1. **Add a thin orange top-line**: Before the nav element, add a `<div className="h-[2px] bg-orange-500" />` — a thin accent stripe at the very top of the page (sits above the navbar, below the announcement ticker).

2. **CTA button style**: Change from `rounded-full` pill to `rounded-none` sharp rectangle. This is a key visual differentiator — SA uses rounded pills, NE uses sharp edges.

3. **Logo size**: Reduce from `h-8` to `h-7` for a more refined feel.

4. **Nav link style**: Change link opacity from `text-white/70` to `text-white/90` and font size from `text-[13px]` to `text-[12px]`.

---

## STEP 1 — UK Homepage redesign

**File:** `src/app/uk/page.tsx`

Rewrite the page body (keep metadata/generateMetadata/jsonLd as-is). Apply these section changes:

### 1A — Hero: Split layout

Replace the centered full-viewport hero with a split layout:

```tsx
<section className="relative bg-[#0B1A2F] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
  {/* Subtle grid texture */}
  <div
    className="absolute inset-0 opacity-[0.03]"
    aria-hidden="true"
    style={{
      backgroundImage:
        "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
      backgroundSize: "60px 60px",
    }}
  />
  <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
      {/* Text — 3 cols */}
      <div className="lg:col-span-3">
        {page.heroEyebrow && (
          <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
            {page.heroEyebrow}
          </span>
        )}
        <h1 className="font-condensed font-extrabold text-5xl sm:text-6xl md:text-7xl uppercase text-white leading-[0.95] tracking-tight">
          {page.heroHeadline ?? "Electrical Safety"}<br />
          <span className="font-accent italic font-normal normal-case text-orange-500">
            Demands Precision.
          </span>
        </h1>
        {page.heroSubtext && (
          <p className="font-body text-lg text-white/50 mt-8 max-w-xl leading-relaxed">
            {page.heroSubtext}
          </p>
        )}
        <div className="mt-10">
          <Link
            href={page.heroPrimaryCtaHref ?? config.contactPath}
            className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 transition-colors"
          >
            {page.heroPrimaryCtaText ?? "Request a Study"}
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
      {/* Right — abstract geometric element */}
      <div className="hidden lg:block lg:col-span-2 relative h-80" aria-hidden="true">
        <div className="absolute top-0 right-0 w-64 h-64 border border-orange-500/20 rounded-full" />
        <div className="absolute top-12 right-12 w-48 h-48 border border-white/10 rounded-full" />
        <div className="absolute bottom-0 right-8 w-32 h-32 bg-orange-500/10 rounded-full" />
        <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-orange-500 rounded-full" />
      </div>
    </div>
  </div>
</section>
```

### 1B — Trust bar: Inline text, no pills

```tsx
<div className="bg-white py-6 px-6 border-b border-[#0B1A2F]/5">
  <p className="text-center font-condensed text-xs uppercase tracking-[0.25em] text-[#0B1A2F]/40">
    {config.standards.slice(0, 5).join("  ·  ")}
  </p>
</div>
```

### 1C — Services: Editorial numbered list in 2 columns

Replace the 3-column card grid with flat editorial rows:

```tsx
{page.services && page.services.length > 0 && (
  <section className="bg-white py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
        <div>
          <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
            What We Do
          </span>
          <h2 className="font-condensed font-extrabold text-4xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
            Our Services
          </h2>
        </div>
        <Link
          href={config.servicesIndexPath}
          className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 hover:text-orange-600 inline-flex items-center gap-2 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        {page.services.slice(0, 6).map((service, i) => (
          <Link
            key={service.href}
            href={service.href}
            className="group flex items-start gap-6 py-8 px-4 border-b border-[#0B1A2F]/10 hover:bg-[#F8FAFC] transition-colors"
          >
            <span className="font-condensed font-extrabold text-3xl text-[#0B1A2F]/10 leading-none shrink-0 w-12">
              {String(i + 1).padStart(2, "0")}
            </span>
            <div className="flex-1 min-w-0">
              <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] tracking-tight group-hover:text-orange-500 transition-colors">
                {service.title}
              </h3>
              {service.description && (
                <p className="font-body text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
                  {service.description}
                </p>
              )}
            </div>
            <ArrowRight className="w-5 h-5 text-[#0B1A2F]/20 group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
```

### 1D — Manifesto: Asymmetric left-aligned, no pill badges

```tsx
<section className="bg-[#0B1A2F] py-20 lg:py-28 px-6">
  <div className="max-w-[1400px] mx-auto lg:px-12">
    <div className="max-w-3xl">
      <span className="font-condensed text-xs uppercase tracking-[0.25em] text-orange-500/60 mb-6 block">
        Our Promise
      </span>
      <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
        We don&apos;t deliver reports.
      </h2>
      <p className="font-accent italic text-3xl md:text-4xl text-orange-500 mt-4">
        We deliver safety.
      </p>
    </div>
  </div>
</section>
```

### 1E — Industries: Remove text grid, keep marquee only

Delete the `<div className="max-w-[1400px]..."><ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5...">` block entirely. Also remove the `"Industries We Serve"` heading duplication — keep only ONE instance above the marquee. Remove the `{page.industriesHeading && ...}` duplicate h2. The section should be JUST the eyebrow label + marquee animation:

```tsx
{page.industries && page.industries.length > 0 && (
  <section className="bg-[#F8FAFC] py-16 overflow-hidden">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
      <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
        Industries We Serve
      </span>
    </div>
    <div className="relative overflow-hidden">
      <div className="animate-marquee whitespace-nowrap">
        {[...Array(2)].map((_, dupe) => (
          <span key={dupe} className="inline-block">
            {page.industries!.map((industry, i) => (
              <span
                key={`${dupe}-${i}`}
                className="inline-block mx-6 font-condensed font-extrabold text-5xl md:text-7xl uppercase text-[#0B1A2F]/[0.08] tracking-tight"
              >
                {industry.name}
                <span className="text-orange-500/40 mx-6">·</span>
              </span>
            ))}
          </span>
        ))}
      </div>
    </div>
  </section>
)}
```

### 1F — Insights/Blog: Horizontal editorial rows (not cards)

Replace the 3-column card grid with editorial line items. Also add `cleanTitle()` and `cleanExcerpt()` helpers at the top of the file (same as BR):

```tsx
function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(/\s*-\s*Carelabs\s*(UK|United Kingdom|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i, "")
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .trim();
}

function cleanExcerpt(raw: string): string {
  return raw.replace(/\s*\[…?\]\s*$/, "").replace(/\s*\[\.{3}\]\s*$/, "").trim();
}
```

Replace the insights section:

```tsx
{page.insights && page.insights.length > 0 && (
  <section className="bg-[#0B1A2F] py-20 lg:py-28">
    <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
      <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
        <div>
          <span className="font-condensed text-xs uppercase tracking-[0.25em] text-orange-500/60 mb-4 block">
            Latest
          </span>
          <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-white leading-[0.95]">
            Insights &amp; Field Notes
          </h2>
        </div>
        <Link
          href={config.blogIndexPath}
          className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 hover:text-orange-400 inline-flex items-center gap-2 transition-colors"
        >
          View All <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="divide-y divide-white/10">
        {page.insights.slice(0, 5).map((insight, i) => (
          <Link
            key={i}
            href={insight.href}
            className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 hover:pl-2 transition-all"
          >
            <h3 className="font-condensed font-bold text-lg uppercase text-white tracking-tight group-hover:text-orange-500 transition-colors">
              {cleanTitle(insight.title)}
            </h3>
            <div className="flex items-center gap-6 shrink-0">
              {insight.category && (
                <span className="font-condensed text-xs uppercase tracking-[0.2em] text-white/30">
                  {insight.category}
                </span>
              )}
              <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  </section>
)}
```

### 1G — FAQ: Navy background, left-aligned

Change the FAQ section background from off-white to navy with white text:

```tsx
{page.faqs && page.faqs.length > 0 && (
  <section className="bg-[#0B1A2F] py-16 lg:py-24 border-t border-white/5">
    <div className="max-w-3xl mx-auto px-6">
      <div className="mb-10">
        <span className="font-condensed text-xs uppercase tracking-[0.25em] text-orange-500/60 mb-3 block">
          FAQ
        </span>
        <h2 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-white leading-[0.95]">
          Common Questions
        </h2>
      </div>
      <div>
        {page.faqs.map((faq, i) => (
          <details
            key={i}
            className="group border-b border-white/10 py-5"
          >
            <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-condensed font-bold text-base md:text-lg uppercase text-white/90 tracking-tight">
              <span>{faq.question}</span>
              <Plus className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
            </summary>
            <p className="font-body text-base text-white/60 mt-3 leading-relaxed">
              {faq.answer}
            </p>
          </details>
        ))}
      </div>
    </div>
  </section>
)}
```

### 1H — Final CTA: Single-line, understated

```tsx
<section className="bg-white py-20 lg:py-24 px-6">
  <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
    <h2 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-[#0B1A2F] leading-tight">
      {page.ctaBannerHeading ?? "Ready to protect your facility?"}
    </h2>
    <div className="mt-8">
      <Link
        href={page.ctaBannerPrimaryHref ?? config.contactPath}
        className="inline-flex items-center gap-2 bg-[#0B1A2F] hover:bg-[#162a47] text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-10 py-4 transition-colors"
      >
        {page.ctaBannerPrimaryCtaText ?? "Get in Touch"}
        <ArrowRight className="w-4 h-4" />
      </Link>
    </div>
  </div>
</section>
```

Note: The final CTA button uses navy background (`bg-[#0B1A2F]`) with sharp corners (no `rounded-*`), NOT orange. This is a key NE differentiator — SA uses orange pills, NE uses sharp navy rectangles.

---

## STEP 2 — Apply the same design patterns to all other UK pages

Apply the NE design language to these files. The key rules:

**Global NE rules (apply to EVERY NE page):**
- **No `rounded-2xl` cards** — use flat items with `border-b` dividers
- **No shadow-lift hover** — use `hover:bg-[#F8FAFC]` or `hover:pl-2` subtle shifts
- **No dot-pattern placeholders** in image areas — use solid `bg-[#1E293B]` or `bg-[#0B1A2F]`
- **CTA buttons**: `bg-[#0B1A2F]` navy rectangles (no rounded-full, no orange bg). Exception: the hero CTA can stay orange
- **Section eyebrows**: `text-orange-500/60` (more muted than SA's full `text-orange-500`)
- **Hero style**: All pages use the LEFT-ALIGNED text style (not centered). Use `pt-32 pb-20 lg:pt-40 lg:pb-28` (not full viewport `min-h-screen`)
- **Add `cleanTitle()` and `cleanExcerpt()`** to any page that renders blog post data

### 2A — `src/app/uk/our-services/page.tsx`
- Hero: Left-aligned text (not centered)
- Service cards: Numbered flat list with border-bottom dividers (same as homepage 1C pattern)
- CTA: Navy rectangle button, white section background

### 2B — `src/app/uk/about-us/page.tsx`
- Hero: Left-aligned
- Content sections: Alternate white and navy backgrounds (not white/off-white)
- Team/stats: Use border-bottom dividers not cards

### 2C — `src/app/uk/contact-us/page.tsx`
- Hero: Left-aligned, shorter
- Form section: Clean white background, form fields with `border-b` bottom borders only (not full border boxes)
- Submit button: Navy rectangle

### 2D — `src/app/uk/blogs/page.tsx`
- Hero: Left-aligned
- Featured articles: **Horizontal editorial rows** (not 3-column cards). Each article is a row with title left, category + date right, separated by `border-b border-[#0B1A2F]/10`. Use `cleanTitle()` on all titles
- Remove image placeholders entirely — this is text-only editorial listing
- Archive section: Same row style, slightly lighter text

### 2E — `src/app/uk/[slug]/page.tsx`
- Hero: Left-aligned
- Service/blog content: Normal prose layout
- Apply `cleanTitle()` and `cleanExcerpt()` where rendering blog data
- Related posts: Horizontal rows (not cards)
- CTA: Navy rectangle

### 2F — `src/app/uk/case-studies/page.tsx`
- Keep the "Coming Soon" placeholder but style it with NE patterns (left-aligned text, navy CTA)

---

## STEP 3 — Clone UK changes to IE, SE, NO, DK, FI

Copy the exact same design patterns from the UK pages to all 5 other NE countries. The only differences per country are:

- `const CC = "ie"` / `"se"` / `"no"` / `"dk"` / `"fi"`
- `const config = COUNTRY_CONFIGS[CC]`
- The `cleanTitle()` regex should include that country's name variations

Affected directories:
- `src/app/ie/` (7 files)
- `src/app/se/` (7 files)
- `src/app/no/` (7 files)
- `src/app/dk/` (7 files)
- `src/app/fi/` (7 files)

---

## STEP 4 — NEFooter update

**File:** `src/components/ne-footer.tsx`

Make the footer visually distinct from SA:

1. **Newsletter input**: Change from `rounded-full` to sharp corners (no border-radius)
2. **"Join" button**: Change from rounded to sharp rectangle
3. **Add a thin orange top-line**: `<div className="h-[2px] bg-orange-500" />` at the very top of the footer (mirrors the navbar accent)
4. **Link hover**: Change hover from `text-orange-500` to `text-white` with an underline (`hover:underline hover:text-white`)

---

## AFTER ALL CHANGES:

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all 42 NE routes must build, SA routes untouched
4. Commit: `redesign: overhaul NE pages with editorial flat design — split hero, line dividers, navy CTAs`
5. Merge to main, push both: `git checkout main && git merge redesign/ne-pages && git push origin main && git push company main`
