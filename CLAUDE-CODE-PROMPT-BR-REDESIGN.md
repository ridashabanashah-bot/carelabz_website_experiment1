# Claude Code Prompt — Brazil Homepage Redesign

Copy everything below the line into Claude Code.

---

## Task: Redesign the Brazil homepage (`src/app/br/page.tsx`) and its SA components

**Branch:** `feature/br-homepage-redesign`

This is a full visual redesign of the Brazil homepage inspired by three premium B2B sites (BBN International, Weaver, Aleia). The page stays data-driven from Strapi — do NOT hardcode content. All existing Strapi fields and fallbacks remain. You are only changing layout, styling, typography, and section structure.

Read `CLAUDE.md` before starting — follow all brand rules.

---

### STEP 0 — Add Fonts

In `src/app/layout.tsx`, add two new Google fonts alongside the existing ones:

```ts
import { Montserrat, Poppins, Barlow_Condensed, Playfair_Display } from "next/font/google";

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});
```

Add both variables to the `<body>` className alongside the existing font variables.

In `tailwind.config.ts`, extend `fontFamily`:
```ts
fontFamily: {
  serif: ["var(--font-montserrat)", "system-ui", "sans-serif"],
  display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
  body: ["var(--font-poppins)", "system-ui", "sans-serif"],
  condensed: ["var(--font-barlow-condensed)", "system-ui", "sans-serif"],
  accent: ["var(--font-playfair)", "Georgia", "serif"],
}
```

---

### STEP 1 — Redesign the HERO (BBN-style typographic hero)

**Replace** the current hero section (section with geometric circles and watermark) with:

- **Full-viewport height**, navy `#0B1A2F` background (no images, no circles, no dots)
- Content centered both horizontally and vertically
- **Headline**: Use `data.heroHeadline` (from Strapi). Display it as:
  - `font-condensed font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-[0.95] tracking-tight`
  - Render as a single flowing string — do NOT split into one-word-per-line blocks
  - The country name ("Brazil") at the end should be on its own line in orange `#F97316`: `<span className="text-orange-500 block">{COUNTRY_NAME}</span>`
- **Sub-copy**: `data.heroSubtext` below the headline
  - `font-body text-lg text-white/70 max-w-2xl mx-auto mt-8 text-center`
- **Single CTA button** centered below:
  - Orange `#F97316` pill button, white text, `font-condensed font-bold uppercase tracking-wide`
  - `px-10 py-4 rounded-full text-base hover:scale-105 hover:bg-orange-600 transition-all`
  - Uses `data.heroPrimaryCtaText` and `data.heroPrimaryCtaHref`
- **Optional**: Add a very subtle background texture — a faint circuit-board or grid pattern at 3-5% opacity using a CSS pseudo-element or SVG. If too complex, skip it; plain navy is fine.
- Remove the secondary "About Us" CTA from the hero — move it to the nav instead
- Remove the trust badges from the hero — they move to the new Trust Bar section below

---

### STEP 2 — New TRUST BAR / STATS section (BBN-style counters)

**Add a new section** immediately after the hero. Navy `#0B1A2F` background (slightly lighter shade `#0F2440` to differentiate from hero), or use `#1E293B`.

**Row 1 — Three stat counters** in a centered 3-column grid (`grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto`):

Use these stats (or pull from Strapi if fields exist — otherwise hardcode as fallbacks):
- `15+` / "Anos de Experiência"
- `200+` / "Projetos Concluídos"
- `100%` / "Conformidade NR-10"

Each stat:
- Number: `font-condensed font-extrabold text-7xl md:text-8xl text-orange-500`
- Label: `font-body text-base text-white/60 mt-2`
- Center-aligned within each column

**Row 2 — Standards badges** below the stats (`mt-12`):

Use `trustBadgesForHero` array (the Strapi trust badges that were previously in the hero). Display as a single horizontal row:
- Container: `flex flex-wrap lg:flex-nowrap justify-center gap-4`
- Each badge: `inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 hover:bg-white/15 hover:scale-[1.02] transition-all`
- Checkmark icon: `CheckCircle2` in orange, `w-4 h-4`
- Badge text: `text-sm font-semibold text-white font-body`

---

### STEP 3 — Redesign SERVICES section (Weaver-style folder-tab cards)

**Replace** the current numbered editorial list with a horizontal scrollable card carousel.

- Section background: off-white `#F8FAFC`
- Section heading: Use `home?.servicesHeading` fallback "Our Services"
  - Style the heading with font-mixing: first part in `font-condensed font-extrabold uppercase text-[#0B1A2F]`, last word in `font-accent italic text-orange-500` (e.g., if heading is "Our Core Services" → "OUR CORE" condensed + "*Services*" italic serif)
  - `text-3xl md:text-5xl mb-12`
- Sub-heading: `home?.servicesSubtext` in `font-body text-lg text-gray-600 max-w-2xl`

**Card carousel** — horizontal scroll with snap:
- Container: `flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide` (add `scrollbar-hide` utility to globals.css: `.scrollbar-hide::-webkit-scrollbar { display: none; } .scrollbar-hide { -ms-overflow-style: none; scrollbar-width: none; }`)
- Each card: `snap-start shrink-0 w-[280px] sm:w-[320px] rounded-2xl rounded-tr-none overflow-hidden` (the `rounded-tr-none` creates the folder-tab cutout effect)
- Card height: `min-h-[380px] flex flex-col`
- **First/featured card**: `bg-[#0B1A2F] text-white` — active card styling
- **Other cards**: `bg-white border border-gray-200 text-[#0B1A2F]` — inactive card styling
- Card internal structure:
  - Top: category/icon area with padding `p-6 pb-0`
  - Middle: title `font-condensed font-bold text-xl uppercase mt-4 px-6`
  - Body: description `font-body text-sm leading-relaxed mt-3 px-6 flex-grow` (use the service description)
  - Footer: "Ver Detalhes →" link `px-6 pb-6 mt-auto`, `font-condensed font-semibold text-orange-500 hover:text-orange-400`

Data source: Use `servicesToShow` array (already computed from Strapi services or service pages). Map each service to a card.

---

### STEP 4 — Redesign "HOW IT WORKS" (Aleia-style numbered editorial flow)

**Replace** the current intro/manifesto section with a new process section.

- Full-width section, white background
- Section label: small uppercase tag `font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4` — text: "COMO FUNCIONA" (or from Strapi if available)
- Large editorial heading: `font-condensed font-extrabold text-4xl md:text-6xl text-[#0B1A2F] max-w-4xl`
  - Example: "From messy *power systems* to total *compliance*." — with italic serif words using `font-accent italic`

**Four-step horizontal flow** (`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16`):

Use `data.processSteps` if available from Strapi, otherwise use these fallback steps:
1. "Diagnóstico" — "Comprehensive analysis of your electrical infrastructure and current compliance status."
2. "Análise" — "Detailed power system studies including arc flash, short circuit, and load flow analysis."
3. "Relatório" — "Complete technical documentation with findings, risk assessments, and actionable recommendations."
4. "Conformidade" — "Full regulatory compliance with NR-10, IEEE 1584, and ABNT NBR 5410 standards."

Each step:
- Step number: `font-condensed font-extrabold text-6xl text-orange-500/20` (large, faded number)
- Title: `font-condensed font-bold text-xl text-[#0B1A2F] uppercase mt-2`
- Description: `font-body text-sm text-gray-600 leading-relaxed mt-3`
- A thin orange top border on each card: `border-t-2 border-orange-500 pt-6`

---

### STEP 5 — Redesign INDUSTRIES section

Keep the marquee scrolling concept but make it bolder:

- Navy `#0B1A2F` background, full-width
- Section label: "INDÚSTRIAS QUE ATENDEMOS" centered, `font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-8`
- Replace the simple marquee text with a **large-type marquee**:
  - Each industry name: `font-condensed font-extrabold text-4xl md:text-6xl uppercase text-white/10` with a dot separator `·` between them in `text-orange-500`
  - The marquee scrolls horizontally using the existing `marquee` animation
  - Below the marquee: a centered grid of industry names in smaller readable text
  - `grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 mt-8 max-w-5xl mx-auto`
  - Each: `text-center font-body text-sm text-white/70`

---

### STEP 6 — Redesign INSIGHTS / BLOG section (Weaver-style cards)

Keep the current data source (Strapi blog posts / insights) but restyle the cards:

- White background
- Section heading with font-mixing: "Latest *Insights*" — "LATEST" in `font-condensed font-extrabold uppercase`, "*Insights*" in `font-accent italic text-orange-500`
- `text-3xl md:text-5xl mb-12`

Card layout: `grid grid-cols-1 md:grid-cols-3 gap-6`

Each insight card:
- `rounded-2xl rounded-tr-none overflow-hidden` (matching the folder-tab style from services)
- Image at top if available (`relative h-48 overflow-hidden`)
- Category label: `font-condensed text-xs uppercase tracking-wider text-orange-500 mt-4 px-6`
- Title: `font-condensed font-bold text-lg text-[#0B1A2F] mt-2 px-6`
- Description: `font-body text-sm text-gray-600 mt-2 px-6 line-clamp-3`
- "Read More →" link at bottom: `px-6 pb-6 mt-4 font-condensed font-semibold text-orange-500`

---

### STEP 7 — Redesign CTA BANNER (fix the text overlap + make it stronger)

**Replace** the current split orange/navy CTA with a cleaner full-width design:

- Full-width section with a gradient background: `bg-gradient-to-r from-orange-500 to-[#0B1A2F]`
- `py-24 lg:py-32 relative overflow-hidden`
- Content centered: `max-w-4xl mx-auto text-center px-6`
- Heading: Use `data.ctaLeadText + " " + data.ctaTailText` as a single string
  - `font-condensed font-extrabold text-4xl md:text-6xl text-white uppercase`
- Sub-copy below (if Strapi provides `ctaBannerSubtext`):
  - `font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto`
- CTA button below the text (NOT overlapping):
  - `mt-10 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide`
  - Uses `data.ctaButtonText` and `data.ctaButtonHref`

This completely eliminates the text-behind-button problem.

---

### STEP 8 — Redesign FOOTER (BBN-style orange footer)

**Replace** the current `SAFooter` component in `src/components/sa-footer.tsx` with a bold orange footer:

**Top section** — full-width orange `#F97316` background:
- `py-16 lg:py-20 px-6 lg:px-12`
- **3-column grid** at desktop: `grid grid-cols-1 md:grid-cols-3 gap-12 max-w-[1400px] mx-auto`
  - **Column 1**: Carelabs logo (use white version or add `brightness-0 invert` filter on the existing logo), tagline "Test | Calibrate | Inspect | Certify" in white, `resolvedAddress` below in `text-white/80`
  - **Column 2**: Navigation links in white — Services, About, Industries, Insights, Contact — vertical list, `font-body text-base text-white hover:text-white/80 transition-colors`, `space-y-3`
  - **Column 3**: CTA section — heading "Pronto para proteger sua equipe?" in `font-condensed font-bold text-2xl text-white`, then a navy button: `bg-[#0B1A2F] text-white font-condensed font-bold uppercase px-8 py-3 rounded-full hover:bg-[#162a45] transition-colors mt-4 inline-flex items-center gap-2` — text: "Fale Conosco →"

**Bottom bar** — navy `#0B1A2F` strip:
- `py-4 px-6 lg:px-12`
- `flex flex-col md:flex-row items-center justify-between max-w-[1400px] mx-auto gap-4`
- Left: `© 2026 Carelabs. Todos os direitos reservados.` in `text-white/60 text-sm font-body`
- Center: Standard certification names in small text: `NR-10 · IEEE 1584 · ABNT NBR 5410` in `text-white/40 text-xs font-condensed uppercase tracking-wider`
- Right: Social/contact icons (LinkedIn, WhatsApp or email) in `text-white/60 hover:text-white`

Keep the SAFooter props interface the same so it doesn't break other pages. The redesign should be backward compatible.

---

### STEP 9 — Redesign NAVBAR (transparent on hero, solid on scroll)

**Update** `src/components/sa-navbar.tsx`:

- **Default state** (at top of page): Transparent background, white text, white logo (use `brightness-0 invert` filter)
  - `bg-transparent text-white`
- **Scrolled state**: Solid navy `#0B1A2F` background, white text
  - Add a scroll listener (use `useEffect` + `useState` for `isScrolled`) that triggers at `scrollY > 50`
  - `bg-[#0B1A2F] shadow-lg text-white transition-colors duration-300`
- **Desktop nav links** visible at `lg:` breakpoint — show: Serviços (dropdown), About, Industries, Insights
  - Link style: `font-condensed text-sm uppercase tracking-wider text-white/80 hover:text-orange-500 transition-colors`
- **CTA button** in nav (right side): "Solicitar Proposta"
  - `bg-orange-500 text-white font-condensed font-bold text-sm uppercase px-6 py-2.5 rounded-full hover:bg-orange-600 transition-colors`
- **Mobile menu**: Keep existing hamburger logic. Update colors to match navy/orange palette.
- Make the navbar `fixed top-0 left-0 right-0 z-50` instead of static, and add `pt-[72px]` or similar spacing to the page content so it doesn't hide behind the fixed nav.

---

### STEP 10 — Global color consistency

Search and replace all hardcoded Brazil colors in `src/app/br/page.tsx`:
- `#094d76` → `#0B1A2F` (use the actual brand navy)
- `#2575B6` → `#0B1A2F` (consolidate to brand navy)
- `#F15C30` → `#F97316` (use the actual brand orange, Tailwind `orange-500`)
- `#f2f2f4` → `#F8FAFC` (use brand off-white)

Make sure all sections use the brand palette from `CLAUDE.md` — Navy `#0B1A2F`, Orange `#F97316`, Off-white `#F8FAFC`, Slate `#1E293B`.

---

### STEP 11 — Keep the ANNOUNCEMENT TICKER

Keep the `SAAnnouncementTicker` at the very top. No changes needed — it's already a good trust signal. Just make sure it sits above the new fixed navbar (z-index consideration). If it conflicts with the fixed nav, make the ticker part of the fixed header block.

---

### STEP 12 — Keep the FAQ section

Keep the existing FAQ accordion section. Just update its heading typography:
- Heading: `font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase`
- Make sure the accordion card styles use brand colors, not the old `#094d76`

---

### FINAL CHECKS

After all changes:

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — must succeed
4. Verify no hardcoded content was added — all text comes from Strapi fields or existing fallback strings
5. Verify SAFooter and SANavbar still work for other country pages (props interface unchanged)
6. Verify the page is responsive: test mental model at 375px, 768px, 1024px, 1440px breakpoints

**Commit:** `feat: redesign Brazil homepage — BBN/Weaver/Aleia-inspired layout with new typography, stats bar, folder-tab cards, gradient CTA, and orange footer`

**Push:** `git push origin feature/br-homepage-redesign && git push company feature/br-homepage-redesign`
