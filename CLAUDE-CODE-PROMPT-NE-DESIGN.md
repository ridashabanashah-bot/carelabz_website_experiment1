# Claude Code Prompt — Northern Europe Design System + UK Build

Copy everything below the line into Claude Code.

---

## Task: Build the Northern Europe design system and create all UK pages

**Branch:** `feature/ne-design-uk`

Read `CLAUDE.md` and `data/design-inspiration-analysis.md` before starting.

This is a NEW design system for Northern European countries — distinct from the SA folder-tab design. The NE design is inspired by Nobl (editorial confidence, single-sentence viewports, heavy serif on cream), Align Pilates (warm alternating sections, tracked caps, photography-led cards, elegant footer), and Pilates Collective (cinematic B&W marquee, pill buttons).

**The feel: editorial, confident, warm-premium, restrained.**

---

## STEP 0 — Countries config + NE components

### 0a. Add 6 NE countries to `src/lib/countries-config.ts`

Add entries for: uk, ie, se, no, dk, fi. Use the values from `data/ne-content-audit.md` Appendix B:

```ts
uk: {
  cc: "uk",
  countryName: "United Kingdom",
  countryNameLocative: "the United Kingdom",
  hreflang: "en-GB",
  dialCodeCountryIso2: "GB",
  servicesIndexPath: "/uk/services/",
  serviceDetailPattern: "/uk/{slug}/",
  blogIndexPath: "/uk/blogs/",
  blogDetailPattern: "/uk/{slug}/",
  aboutPath: "/uk/about-us/",
  contactPath: "/uk/contact-us/",
  caseStudyPath: "/uk/case-studies/",
  address: "London, United Kingdom",
  phone: "+44 (0) 000 000 0000",
  email: "info@carelabz.com",
  footerDescription: "Carelabs delivers BS 7671 arc flash studies, IET Wiring Regulations compliance, and full power system engineering services across the United Kingdom.",
  services: [
    { label: "Arc Flash Study", href: "/uk/arc-flash-study/" },
    { label: "Harmonic Study & Analysis", href: "/uk/harmonic-study-and-analysis/" },
    { label: "Motor Start Analysis", href: "/uk/motor-start-analysis/" },
    { label: "Power System Study", href: "/uk/power-system-study-and-analysis/" },
    { label: "Power Quality Analysis", href: "/uk/power-quality-analysis/" },
  ],
  standards: ["BS 7671", "IET Wiring Regulations", "IEEE 1584", "IEC 60909", "ETAP"],
  primaryStandard: "BS 7671",
  localCodeName: "BS 7671 (IET Wiring Regulations)",
  localAuthority: "HSE (Health and Safety Executive)",
},
```

Do the same for IE (I.S. 10101 / HSA), SE (SS 436 40 00 / Elsäkerhetsverket), NO (NEK 400 / DSB), DK (DS/HD 60364 / Sikkerhedsstyrelsen), FI (SFS 6000 / Tukes). Use the city lists from the content audit:
- IE: Dublin, Cork, Limerick, Galway, Waterford
- SE: Stockholm, Gothenburg, Malmö, Uppsala
- NO: Oslo, Bergen, Trondheim, Stavanger
- DK: Copenhagen, Aarhus, Odense, Aalborg
- FI: Helsinki, Vantaa, Espoo, Tampere

### 0b. Create NE shared components

Create these NEW components (do NOT modify the SA components):

- `src/components/ne-navbar.tsx` — Northern Europe navbar
- `src/components/ne-footer.tsx` — Northern Europe footer
- `src/components/ne-announcement-ticker.tsx` — Northern Europe ticker

Details for each below in the design sections.

---

## DESIGN SYSTEM — The NE Visual Language

### Color usage rules

- **Navy `#0B1A2F`**: Hero backgrounds, dark sections (max 2 dark sections per page), footer, navbar on scroll
- **Off-white `#F8FAFC`**: Alternating light sections (the Align rhythm — navy → off-white → white → off-white → navy)
- **Pure white `#FFFFFF`**: Alternating with off-white for section variety
- **Orange `#F97316`**: CTAs, eyebrow labels, hover accents ONLY. Rule: orange appears no more than 4-5 times per page. It's a jewel punch, not wallpaper.
- **Slate `#1E293B`**: One secondary dark section per page max (e.g., safety section on service pages)
- **NO gradients.** Hard colour-band transitions between sections (the Nobl/Aleia approach).

### Typography rules

5 type roles only:

1. **Display heading**: `font-condensed font-extrabold uppercase tracking-tight` (Barlow Condensed 800). Used for hero headlines and viewport-owning statements. Size: `text-5xl md:text-6xl lg:text-7xl xl:text-8xl`. Line-height: `leading-[0.95]`.

2. **Section heading**: `font-condensed font-bold uppercase` (Barlow Condensed 700). Size: `text-3xl md:text-4xl lg:text-5xl`. Used for section titles.

3. **Accent word**: `font-accent italic font-normal normal-case` (Playfair Display italic). Dropped inline into display or section headings for one key word — the country name, or an emotional word like "Certainty", "Safety", "Compliance". Always `text-orange-500`.

4. **Eyebrow / label**: `font-condensed text-xs uppercase tracking-[0.2em] font-semibold` (Barlow Condensed). Used above section headings. Always `text-orange-500` on light backgrounds, `text-orange-400` on dark.

5. **Body / nav / UI**: `font-body` (Poppins 400/500). Size: `text-base` or `text-lg`. Line-height: `leading-relaxed` (1.625).

### Button rules

- **Primary CTA**: `bg-orange-500 text-white font-condensed font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full hover:bg-orange-600 transition-colors`
- **Secondary CTA**: `border-2 border-white text-white font-condensed font-bold uppercase tracking-wider text-sm px-8 py-3.5 rounded-full hover:bg-white hover:text-[#0B1A2F] transition-colors` (on dark backgrounds)
- **Ghost CTA**: `border border-[#0B1A2F] text-[#0B1A2F] font-condensed font-semibold uppercase tracking-wider text-sm px-6 py-3 rounded-full hover:bg-[#0B1A2F] hover:text-white transition-colors` (on light backgrounds)

### Card rules (Align-inspired, NO folder-tab)

- No `rounded-tr-none` (that's SA). NE cards use uniform `rounded-xl` or `rounded-2xl`.
- No shadows by default. `hover:shadow-lg transition-shadow` on interactive cards only.
- No borders unless the card is on a white-on-white section — then `border border-gray-100`.
- Image hover: `group-hover:scale-105 transition-transform duration-500` on the image container.

---

## STEP 1 — NE Navbar (`src/components/ne-navbar.tsx`)

"use client" component. Nobl-inspired: clean, tracked caps, editorial.

**Structure:**
- `fixed top-0 left-0 right-0 z-50`
- Default: `bg-[#0B1A2F]` solid navy always (no transparent state — cleaner for multi-page consistency)
- On scroll past 50px: add `shadow-md` via `useEffect` + `useState`
- Height: `h-16 lg:h-[72px]`

**Layout**: `max-w-[1400px] mx-auto px-6 lg:px-12 flex items-center justify-between`

**Left**: Carelabs logo — white version (`brightness-0 invert` filter on the existing SVG), `h-8 w-auto`

**Centre (desktop lg+)**: Nav links in a row:
- `SERVICES` (dropdown), `ABOUT`, `CONTACT`
- Style: `font-condensed text-[13px] uppercase tracking-[0.2em] text-white/70 hover:text-orange-500 transition-colors`
- Dropdown for services: navy `bg-[#0B1A2F]` panel, `border border-white/10`, service links in same font style

**Right**: CTA pill `REQUEST A QUOTE` — `bg-orange-500 text-white font-condensed font-bold text-xs uppercase tracking-[0.15em] px-6 py-2.5 rounded-full hover:bg-orange-600`

**Mobile**: Hamburger menu icon (`Menu` / `X` from Lucide). Full-screen navy overlay with centered stacked links.

**Thin underline**: Add a `border-b border-white/10` to the entire navbar for the Nobl-style divider.

---

## STEP 2 — NE Homepage (`src/app/uk/page.tsx`)

### Section 1 — Hero (Nobl-confidence)

- Full viewport height: `min-h-screen flex items-center justify-center`
- Navy `#0B1A2F` background
- Grid-dot texture at 4% opacity (reuse the SA pattern)
- Content centered, `text-center max-w-5xl mx-auto px-6`

**Headline**: One powerful statement from Strapi `heroHeadline`. Render with font-mixing:
- Main text: `font-condensed font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-[0.95] tracking-tight`
- Country name on its own line: `font-accent italic font-normal normal-case text-orange-500`
- Example rendering: "ELECTRICAL SAFETY DEMANDS" (condensed caps) + "*Certainty.*" (Playfair italic orange)

**Sub-copy**: `font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto`

**Single CTA**: Orange pill, centered, `mt-10`

**Scroll indicator**: `SCROLL ↓` label at bottom center, `font-condensed text-xs uppercase tracking-[0.3em] text-white/30 absolute bottom-8` with a subtle bounce animation

### Section 2 — Trust bar

- Off-white `#F8FAFC` background, `py-12`
- Standards badges in a centered horizontal row
- Each badge: `font-condensed text-sm uppercase tracking-wider text-[#0B1A2F]/60 border border-[#0B1A2F]/10 px-5 py-2 rounded-full`
- Checkmark icon: `text-orange-500 w-4 h-4`
- No stats counters (that's SA). NE is more restrained.

### Section 3 — Services (Align-rhythm, photography cards)

- White background, `py-20 lg:py-28`
- Eyebrow: `font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4` — "OUR SERVICES"
- Section heading with font-mix: "COMPREHENSIVE ELECTRICAL *Safety*" — last word in Playfair italic orange
- `text-3xl md:text-5xl font-condensed font-extrabold uppercase text-[#0B1A2F] leading-[0.95]`

**Service cards**: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16`

Each card (Link wrapping the whole card):
- `group rounded-2xl overflow-hidden bg-[#F8FAFC] hover:shadow-lg transition-all duration-300`
- **Image area** (top): `relative h-52 overflow-hidden bg-[#0B1A2F]` — use a subtle grid-dot pattern or solid navy since we don't have real photos. On image: `group-hover:scale-105 transition-transform duration-500`
- **Content area**: `p-6`
  - Eyebrow: `font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold` — e.g., "IEEE 1584 · {PRIMARY STANDARD}"
  - Title: `font-condensed font-bold text-xl uppercase text-[#0B1A2F] mt-2 group-hover:text-orange-500 transition-colors`
  - Description: `font-body text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3`
  - Link indicator: `font-condensed text-sm uppercase tracking-wider text-orange-500 mt-4 inline-flex items-center gap-2` — "LEARN MORE →"

### Section 4 — Manifesto / single-statement (Nobl one-sentence viewport)

- Navy `#0B1A2F` background, `py-24 lg:py-32`
- One enormous statement centered:
  - `font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95] text-center max-w-4xl mx-auto px-6`
  - Example: "WE DON'T DELIVER REPORTS. WE DELIVER *Safety.*" — with Playfair italic orange on "Safety."
- Below: three credential pills in a row
  - `font-condensed text-xs uppercase tracking-[0.2em] text-white/50 border border-white/10 px-4 py-2 rounded-full`
  - "IEEE CERTIFIED" · "50+ COUNTRIES" · "25+ YEARS"
- Optional: SVG sine wave / electrical waveform line animation. A thin orange `stroke-orange-500 stroke-[1.5px]` path that draws on scroll using CSS `stroke-dasharray` + `stroke-dashoffset` animation. If too complex, skip — the section is strong without it.

### Section 5 — Industries marquee (Pilates Collective-style)

- Off-white `#F8FAFC` background, `py-16`
- Eyebrow centered: "INDUSTRIES WE SERVE"
- Giant scrolling marquee: industry names in `font-condensed font-extrabold text-5xl md:text-7xl uppercase text-[#0B1A2F]/8` with orange `·` separators
- Uses the existing `marquee` CSS animation
- Below: small readable grid of industry names, `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4`, `font-body text-sm text-[#0B1A2F]/50 text-center`

### Section 6 — Insights / Blog (Align card rhythm)

- White background, `py-20 lg:py-28`
- Eyebrow + heading: "LATEST *Insights*"
- `grid grid-cols-1 md:grid-cols-3 gap-8`
- Each blog card:
  - `group rounded-2xl overflow-hidden bg-[#F8FAFC]`
  - Image placeholder top: `h-48 bg-[#1E293B]` with grid-dot pattern
  - Content `p-6`:
    - Category: `font-condensed text-xs uppercase tracking-[0.2em] text-orange-500`
    - Title: `font-condensed font-bold text-lg text-[#0B1A2F] uppercase mt-2 group-hover:text-orange-500`
    - Excerpt: `font-body text-sm text-gray-600 mt-2 line-clamp-3`
    - "READ MORE →" link at bottom

### Section 7 — FAQ accordion (if Strapi provides FAQs)

- Off-white background, `py-16 lg:py-24`
- Heading: "FREQUENTLY ASKED *Questions*"
- Use `<details>/<summary>` elements
- Each item: `border-b border-[#0B1A2F]/10 py-5`
- Question: `font-condensed font-bold text-lg text-[#0B1A2F] uppercase cursor-pointer`
- Answer: `font-body text-base text-gray-600 mt-3 leading-relaxed`
- Open indicator: orange `+` that rotates to `×`

### Section 8 — CTA (Nobl single-sentence)

- Navy `#0B1A2F` background, `py-24 lg:py-32`
- One heading centered: "READY TO SCHEDULE A *Study?*" — Playfair italic orange on last word
  - `font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]`
- One orange pill CTA below, `mt-10`
- No sub-copy. No decorative. Restraint is the point.

---

## STEP 3 — NE Footer (`src/components/ne-footer.tsx`)

Align-inspired: navy, 4-column, tracked caps, elegant.

**Top section**: Navy `#0B1A2F`, `py-16 lg:py-20 px-6 lg:px-12`

`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 max-w-[1400px] mx-auto`

**Column 1 — NAVIGATE**:
- Heading: `font-condensed text-sm uppercase tracking-[0.2em] text-white font-semibold mb-6` with `border-b border-white/10 pb-3`
- Links: Home, Services, About, Contact — `font-body text-sm text-white/50 hover:text-white hover:underline transition-colors`, `space-y-3`

**Column 2 — SERVICES**:
- Same heading style
- Links: service labels from config — `font-body text-sm text-white/50 hover:text-white hover:underline`

**Column 3 — CONTACT**:
- Same heading style
- Phone, Email, Address from props/config — `font-body text-sm text-white/60`, each with a Lucide icon `w-4 h-4 text-orange-500` inline

**Column 4 — STAY CONNECTED**:
- Same heading style
- Newsletter blurb: `font-body text-sm text-white/50 mb-4`
- Email input + pill submit: `flex gap-2` — input `bg-transparent border border-white/20 rounded-full px-4 py-2 text-white text-sm font-body placeholder:text-white/30 focus:border-orange-500 outline-none flex-1` + submit `bg-orange-500 text-white font-condensed font-bold text-xs uppercase px-5 py-2 rounded-full hover:bg-orange-600`

**Bottom bar**: `border-t border-white/10 mt-12 pt-6`
- `flex flex-col md:flex-row items-center justify-between max-w-[1400px] mx-auto gap-4`
- Left: `© 2026 Carelabs. All rights reserved.` — `font-body text-xs text-white/30`
- Centre: Standards — `font-condensed text-xs uppercase tracking-[0.15em] text-white/20` — "BS 7671 · IEEE 1584 · IET"
- Right: LinkedIn icon — `text-white/30 hover:text-white`

**Watermark**: `CARELABS` in giant condensed type at 3% opacity, bottom of footer (reuse existing watermark pattern)

---

## STEP 4 — NE Announcement Ticker (`src/components/ne-announcement-ticker.tsx`)

Same concept as SA but styled for NE:
- Navy `#0B1A2F` background (same as navbar, visually merges)
- `py-1.5` height (slimmer than SA)
- Text: `font-condensed text-xs uppercase tracking-[0.2em] text-white/40`
- Orange dots as separators
- Content: "Carelabs — {Country} Power System Engineering · {standards}"

---

## STEP 5 — Create all UK pages

Create 7 pages under `src/app/uk/`:

### 5a. `src/app/uk/page.tsx` — Homepage
Full implementation as described in Step 2. Use `NEAnnouncementTicker`, `NENavbar`, `NEFooter`. All data from Strapi `getHomePage("uk")` + `getServicesByRegion("uk")` + `getBlogPosts("uk")`. `export const dynamic = "force-dynamic"`.

### 5b. `src/app/uk/about-us/page.tsx` — About
- Navy hero with heading "ABOUT *Carelabs*"
- Off-white mission section: eyebrow "OUR MISSION" + body from Strapi
- White values section: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8` — rounded-2xl cards (NOT folder-tab), each with Lucide icon, title, description
- Navy certifications section: badges row
- Navy CTA section (Nobl-style single sentence)

### 5c. `src/app/uk/contact-us/page.tsx` — Contact
- Navy hero "GET IN *Touch*"
- Off-white section with 2-column grid:
  - Left: form card `rounded-2xl bg-white p-8` — inputs with `rounded-full` borders, labels in tracked caps, orange pill submit
  - Right: contact details card `rounded-2xl bg-[#0B1A2F] p-8 text-white` — phone, email, address with Lucide icons
- Navy CTA section

### 5d. `src/app/uk/services/page.tsx` — Services index
- Navy hero "OUR *Services*"
- Off-white grid of service cards (same style as homepage Section 3 but all visible, not limited to 3)
- Navy CTA section

### 5e. `src/app/uk/[slug]/page.tsx` — Dynamic service/blog detail
- **Service view**: Navy hero with eyebrow + title. Off-white features grid (rounded-2xl cards). White process steps (4-col with thin orange top border). Slate `#1E293B` safety section. Off-white FAQ accordion. Navy CTA.
- **Blog view**: Navy hero with category pill + title + date. White article body with `prose` styling. Navy CTA.
- Include the slug fallback chain: try `slug-uk` then `slug` for Strapi queries.

### 5f. `src/app/uk/blogs/page.tsx` — Blog index
- Navy hero "FROM THE *Blog*"
- Off-white featured card (3/5 cols, navy bg) + 2 side cards
- White "MORE ARTICLES" list (no dates on older articles, per SA design decision)
- Apply `cleanTitle()` and `cleanExcerpt()` helpers
- Navy CTA section

### 5g. `src/app/uk/case-studies/page.tsx` — Case studies placeholder
- Navy hero "CASE *Studies*"
- Off-white centered card with ClipboardList icon, coming soon message, orange CTA pill
- Navy CTA section

---

## STEP 6 — Clone to IE, SE, NO, DK, FI

Once UK is built and working, clone the 7 page files for each remaining NE country. For each:
- Change `CC`, `COUNTRY_NAME`, `HREFLANG` constants
- Point to the correct country config
- All other logic stays identical — Strapi queries use the CC to filter by region

---

## STEP 7 — Verify

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — must succeed, all 42 NE routes (7 × 6) should build
4. Verify NE components don't affect SA pages (SA still uses SANavbar/SAFooter/SAAnnouncementTicker)
5. Verify no SA colors (`#094d76`, `#F15C30`) appear in NE files

**Commit:** `feat: Northern Europe design system — Nobl/Align-inspired layout with NE navbar, footer, ticker + 42 pages across UK/IE/SE/NO/DK/FI`

**Push:** `git push origin feature/ne-design-uk && git push company feature/ne-design-uk`

Then merge to main and push: `git checkout main && git merge feature/ne-design-uk && git push origin main && git push company main`
