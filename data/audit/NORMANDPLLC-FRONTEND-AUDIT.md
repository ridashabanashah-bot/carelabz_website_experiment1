# normandpllc.com — Frontend Design Audit

Source: live HTML + 3 stylesheets (`global.min.css`, `content.min.css`, `plugin/style.css`) pulled 2026-04-26.
Stack confirmed via raw markup, not guessed.

---

## 1. Tech Stack (verified)

| Layer | Tool |
|---|---|
| CMS | WordPress (custom theme `normand`, custom plugin `normand`) |
| Hosting | Pantheon (`live-normand.pantheonsite.io` for media) |
| Theme structure | Block-based — custom Gutenberg blocks: `wp-block-normand-banner`, `wp-block-normand-services`, `wp-block-normand-heading`, `wp-block-normand-case-studies` |
| Forms | Gravity Forms |
| SEO | Rank Math (Article + Organization + WebSite + WebPage + Person + ImageObject schema) |
| Smooth scroll | Locomotive Scroll 4.1.3 (CDN: jsdelivr) |
| Animation | GSAP 3.6.0 + ScrollTrigger + ScrollToPlugin (cdnjs) |
| Custom JS | `preloader.min.js`, `navigation.min.js`, `page-header.min.js`, `gsap-defaults.min.js`, `locomotive-init.min.js` |
| Image format | PNG (no WebP/AVIF served) |
| Lazy load | Native `loading="lazy"` |
| Build credit | "Website by ultramodern" (footer) |

No Tailwind, no React, no framework JS. Hand-rolled WP theme with GSAP-driven motion.

---

## 2. Color Tokens (verbatim from CSS custom props)

```
--color-theme-primary:    #fc5a2b   /* signature orange-red — the brand */
--color-theme-black:      #010101   /* near-pure black for text */
--color-theme-secondary:  #f2f2f2   /* light grey section bg */
--color-theme-grey:       #ccc      /* dividers, muted */
--color-theme-white:      #fff      /* main bg */
--color-theme-red:        #f03      /* secondary accent */
--color-link:             #fc5a2b
--color-link-active:      #fc5a2b
--color-link-visited:     #ccc
--color-highlight:        #fff9c0   /* pale yellow text-highlight */
--color-quote-border:     #000
--color-quote-citation:   #666
--color-menu-items-grey:  grey
--color-nav-toggle-grey:  #b3b3b3
--border-color-dark:      #000
--border-color-light:     #ccc
--global-font-color:      #000
```

Palette is deliberately minimal: black + white + one orange + one grey. No gradients used by the theme. Primary `#fc5a2b` carries everything — link color, logo fill, button accent, scroll arrow.

---

## 3. Typography (verbatim)

### Self-hosted, served from `/wp-content/themes/normand/assets/fonts/` as woff2 + woff + otf:

| Family | Role | Format |
|---|---|---|
| `Knockout` | Display headlines (H1/H2 banner titles, section heads) | woff2 + woff + otf |
| `Knockout-Full` | Wider Knockout cut for emphasis | woff2 + woff + otf |
| `Gotham-Medium` | Body default (`--global-font-family`) | woff2 + woff + otf |
| `Gotham-Book` | Body alternate / lighter passages | woff2 + woff + otf |

> Knockout (Hoefler) is a tall condensed sans — gives the display its newspaper-headline / movie-poster feel.
> Gotham (Frere-Jones) is the geometric humanist body face. Both are paid Hoefler&Co fonts, self-hosted as woff2 — no Google/Adobe Fonts.

### Type tokens

```
--global-font-family:    "Gotham-Medium",serif
--highlight-font-family: "Knockout",sans-serif
--global-font-size:      14    /* unitless; used in calc() to drive rem scale */
--global-font-line-height: 1.7
--heading-line-height:    1.1

--font-size-small:   calc(var(--global-font-size)/16*1rem)   /* ~0.875rem */
--font-size-regular: calc(14/var(--global-font-size)*1rem)   /* 1rem */
--font-size-large:   calc(36/var(--global-font-size)*1rem)
--font-size-larger:  calc(48/var(--global-font-size)*1rem)
```

### Fluid display sizes (clamp via `vw`-locked calc)

Hero / large H2 use viewport-locked fluid scaling:

```
font-size: calc(48px + (1200vw - 4500px)/1065);   /* 48px → 60px between 375vw and 1440vw */
font-size: calc(75px + (6500vw - 24375px)/1065);  /* very large display */
font-size: calc(60px + (9000vw - 33750px)/1065);
font-size: calc(50px + (10000vw - 37500px)/1065);
font-size: calc(28px + (1200vw - 4500px)/1065);   /* sub-display */
font-size: calc(18px + (200vw - 750px)/1065);     /* lede / lead-in */
font-size: calc(14px + (400vw - 1500px)/1065);    /* body fluid */
```

Pattern: every type ramp is fluid against viewport, no media-query breakpoints for sizing — pure `calc(base + Δvw)`.

---

## 4. Spacing & Layout

```
--content-width-static: 45rem    /* ~720px */
--content-width: 45rem | 55rem | 67rem  /* 720 / 880 / 1072 — responsive */
```

Three nested content widths, switched by viewport. No 12-col grid — uses CSS grid `frow` (case-studies table) and 3-column flex (services). Sections use `alignfull` (WP block convention) to break out of content width.

Vertical rhythm: section padding ~60-80px desktop. Body text margins generous (`--global-font-line-height:1.7`).

---

## 5. Motion / Easing

```
--transition-duration:       250ms
--transition-timing-function: cubic-bezier(0,0.55,0.45,1)   /* easeOutCirc-ish — fast start, soft end */
```

GSAP-driven reveals everywhere. Class signals:
- `normand-st-reveal` — generic scroll-triggered fade/translate
- `normand-st-reveal-right` — directional from-right reveal
- `normand-st-reveal-img` — image-specific reveal (likely mask-clip)
- `banner-img-reveal`, `banner-logo-reveal` — hero entrance choreography

Custom cursor: `.cursor`, `.cursor__inner`, `.cursor__inner__small` — JS-tracked element following pointer (likely scaled on link hover).

Locomotive Scroll wraps the body — gives the buttery momentum scroll. ScrollTrigger pins/triggers GSAP timelines off scroll position.

Hero rotator (verbatim DOM):
```html
<h2 class="banner-title">We Are
  <span class="rotator">
    <span class="rotation-text-1">Results</span>
    <span class="rotation-text-2">Confidence</span>
    <span class="rotation-text-3">Advocacy</span>
    <span class="rotation-text-4">Victory</span>
    <span>Results</span>
  </span>
</h2>
```
Cycles 4 words then lands on "Results" — likely GSAP timeline with `yPercent` swap.

---

## 6. Hero (verbatim)

```html
<header class="wp-block-normand-banner alignfull normand-banner">
  <figure class="banner-img-reveal">
    <img class="banner-img" src=".../Ed-Normand-Hero-Headshot-730x730.png" alt="Ed Normand Headshot"/>
  </figure>
  <div class="banner-wrap">
    <div class="text-wrap">
      <a href="/contact-us/" class="contact-link">Contact US</a>
      <div class="banner-logo-reveal"><svg ...inline Normand wordmark, fill:#fc5a2b /></svg></div>
      <p class="banner-subtitle">Experts in <span>Class Action</span></p>
      <h2 class="banner-title">We Are<span class="rotator">...</span></h2>
      <div class="scroll-indicator">
        <span>scroll down</span>
        <svg viewBox="0 0 448 512">...orange chevron, fill:#fc5a2b...</svg>
      </div>
    </div>
  </div>
</header>
```

Hero structure: large headshot (730×730 PNG) on one side, inline SVG wordmark + subtitle + rotating headline + scroll arrow on the other. Single-screen, no fold tricks. "Contact US" is one of two CTAs anywhere on the page (the other is the footer form).

---

## 7. Page Section Order (block-by-block)

1. `wp-block-normand-banner` — hero (above)
2. `wp-block-normand-services` — 3-card services grid
   - subtitle "Our Services" + h2 "We Are Class Action" + 3 service rows alternating image/text (Privacy, Consumer Protection, Insurance)
3. `wp-block-normand-heading` (style: secondary) — "Case Studies" / "We Are Strategy"
4. `normand-case-studies` — table-grid of cases with `Status / Name / Date / Practice Areas / View` columns
5. Testimonials (3 col)
6. Featured team grid (4-up: `first-` / `second-` / `third-` / `fourth-` / `fifth-featured-team-member`) — hardcoded indexed classes, not loop-rendered
7. General team grid
8. Press features (logo wall — 10+ outlets)
9. News & Articles cards
10. Contact / Gravity Form

Footer: contact links (`address-link`, `email-link contact-link`, `fax-link contact-link`), Facebook/Instagram/LinkedIn icons, "Website by ultramodern" credit.

---

## 8. Components — Distinctive Patterns

| Component | Pattern |
|---|---|
| Section heading | Eyebrow `<p>` (small Knockout, orange) + huge `<h2>` (Knockout, fluid) — `subtitle + title` pair |
| Service card | Image (470×336) on left/right alternating + 1-paragraph + `Learn More` text-link (`role="button" class="secondary"`) — no card chrome, no shadow, no border |
| Case study row | CSS-grid table-style — `frow` rows for `status / name / date / practice-areas / view` |
| Team card | Indexed class names (`first-team-img`, `first-team-name`, `first-team-role`, `first-team-body`) — not loop-templated; bespoke per slot |
| Press logos | Single row logo wall, monochrome |
| Buttons | `<a role="button" class="secondary">` — text-link with role flag, not visual button. Underline + orange |
| Form | Gravity Forms — First/Last/Email/Phone/dropdown/SMS-consent/honeypot/captcha |
| Cursor | Custom JS cursor with inner/outer rings |
| Scroll | Locomotive momentum scroll wrapping body |
| Reveals | GSAP ScrollTrigger via `.normand-st-reveal*` classes |

---

## 9. Hero / Section Copy (verbatim)

- Title tag: `Experts in Class Action - Normand - We Are Results`
- Meta description: `Normand PLLC attorneys represent consumers around the world in important and often unprecedented complex class actions.`
- Hero subtitle: `Experts in Class Action`
- Hero headline: `We Are` → rotates `Results / Confidence / Advocacy / Victory / Results`
- Section 2 subtitle: `Our Services` / title: `We Are Class Action`
- Section 3 subtitle: `Case Studies` / title: `We Are Strategy`
- Recurring formula: every section eyebrow is the topic, every H2 is `We Are [Noun]` — locked rhetorical structure throughout the page.

---

## 10. SEO / Schema

- Rank Math plugin emits one combined `application/ld+json` graph: `Organization`, `WebSite`, `WebPage`, `ImageObject`, `Person` (Edmund Normand), `Article` (the homepage itself, treated as Article — debatable choice).
- OG image: `/wp-content/uploads/2021/06/social-share-1200x630-1.jpg`
- Canonical, Twitter card (summary_large_image), all standard meta present.

---

## 11. Distinct Visual Character (art-director read)

**Editorial brutalist meets plaintiff-firm.** Knockout in giant fluid display sizes gives every section a movie-poster H2 — `We Are Results` reads more campaign-headline than law-firm-tagline. Black-on-white discipline, single orange (`#fc5a2b`) doing all the work of color hierarchy. No gradients, no shadows, no rounded cards — content sits on flat planes. Locomotive's sticky-momentum scroll plus GSAP scroll-reveals make the page feel cinematic without animation gimmickry. The custom cursor + tightly-controlled type ramp signals "we paid an agency" — this is not a Divi/Elementor build. Photography is plainspoken (founder headshot, gavel + credit-card stock for service cards). The rhetorical loop (every H2 starts `We Are __`) is the signature voice device.

If rebuilding: replicate the **type system** (Knockout display + Gotham body + fluid `calc(px + vw)` ramps), the **single-accent color discipline**, the **eyebrow + huge-headline section pattern**, and the **scroll reveal + smooth scroll** combo. Drop the indexed `first-/second-/third-` team class structure (use a loop). Swap PNG hero for WebP/AVIF.

---

## 12. Replication Cheat-Sheet for a Next.js + Tailwind Rebuild

```ts
// tailwind.config.ts extend
colors: {
  brand: '#fc5a2b',
  ink:   '#010101',
  paper: '#ffffff',
  mute:  '#f2f2f2',
  rule:  '#cccccc',
  cite:  '#666666',
  hi:    '#fff9c0',
}
fontFamily: {
  display: ['Knockout', 'sans-serif'],   // license required from Hoefler — substitute: League Gothic, Anton (free)
  body:    ['Gotham-Medium', 'serif'],   // license required — substitute: Inter, Montserrat (free)
}
fontSize: {
  // fluid via clamp() — Tailwind plugin or arbitrary values
  hero:  'clamp(48px, 4vw + 32px, 96px)',
  h2:    'clamp(36px, 3vw + 24px, 72px)',
  body:  'clamp(14px, 0.4vw + 12px, 18px)',
}
transitionTimingFunction: {
  brand: 'cubic-bezier(0, 0.55, 0.45, 1)',
}
```

Motion stack to match: `gsap` + `gsap/ScrollTrigger` + `lenis` (modern Locomotive successor) + custom cursor component. Section pattern: `<section><Eyebrow>Topic</Eyebrow><Display>We Are X</Display>...</section>`.

License watch: Knockout & Gotham are commercial Hoefler&Co — buy a webfont license or substitute. Free Knockout-likes: **League Gothic**, **Anton**, **Bebas Neue**. Free Gotham-likes: **Inter**, **Montserrat**, **Proxima Nova alternatives**.

---

## 13. Things to Avoid Copying

- Indexed `first-/second-/third-team-member` class names — not maintainable.
- Inline SVG wordmark with hard-coded fill `#fc5a2b` — externalize as a token-driven component.
- Self-hosted PNG hero (730×730) — should be WebP or AVIF with `next/image`.
- Article schema on homepage — `WebPage` is correct; `Article` misuses Rank Math defaults.
- Locomotive Scroll 4.x — abandoned upstream; use Lenis instead for the same momentum feel.
