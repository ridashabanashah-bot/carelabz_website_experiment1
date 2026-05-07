# Claude Code Prompt — Apply v0 Design System to All AE Pages

Copy everything below the line into Claude Code.

---

## Task: Redesign all AE pages with new animations, layout patterns, fonts, and brand colors from the v0 design

Read `CLAUDE.md` before starting.

**Create a new branch:** `redesign/ae-v0-design-system`

---

## Important: What This Prompt Does NOT Do

- Does NOT add shadcn/ui — the existing project uses plain Tailwind + Lucide (per CLAUDE.md)
- Does NOT use Tailwind v4 `@theme` syntax — the project uses Tailwind v3
- Does NOT hardcode content — all dynamic content still comes from Strapi
- Does NOT change the Strapi data layer or fetch functions
- Does NOT touch non-AE pages (US, BR, NE regions are unaffected)

---

## Overview of Changes

The v0 design introduces these improvements to adopt across all AE pages:

1. **New font pairing:** Anton (display/headings) + Inter (body) — replacing DM Serif Display + Inter
2. **Updated brand colors** from the official brand guidelines PDF (replacing the old dark-navy palette)
3. **ScrollReveal animation component** — IntersectionObserver-based fade-in-up on scroll
4. **Hero rotating word animation** — cycling keyword in the headline
5. **Staggered entrance animations** — cascading delays for hero elements
6. **Hover micro-interactions** — scale, color shift, arrow slide on cards/links
7. **New layout patterns** — horizontal service list, gap-px grid cards, value cards with left border accent
8. **Fluid typography** — clamp()-based responsive heading sizes
9. **Section heading component** — reusable eyebrow + title + description pattern

---

## Step 1: Add Anton Font

**File:** `src/app/ae/layout.tsx` (or whichever layout wraps AE pages)

Add the Anton font import alongside Inter:

```tsx
import { Inter, Anton } from "next/font/google";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

const anton = Anton({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-anton",
});
```

Apply both font variables to the `<body>` or wrapping `<div>`:

```tsx
<div className={`${inter.variable} ${anton.variable} font-sans antialiased`}>
```

---

## Step 2: Update Tailwind Config

**File:** `tailwind.config.ts`

Add/update these entries under `theme.extend`:

```ts
fontFamily: {
  sans: ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  display: ['var(--font-anton)', 'Anton', 'sans-serif'],
  // Keep existing ae-body, ae-nav, ae-display if other pages reference them
  'ae-body': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  'ae-nav': ['var(--font-inter)', 'Inter', 'system-ui', 'sans-serif'],
  'ae-display': ['var(--font-anton)', 'Anton', 'sans-serif'],
},
colors: {
  // Keep existing colors, add/update brand colors from guidelines
  brand: {
    blue: '#2575B6',
    orange: '#F15C30',
    'dark-blue': '#094D76',
    gray: '#9C9B9A',
    'light-gray': '#F2F2F4',
  },
  // Keep existing navy, orange-500, offWhite, slateCard for other regions
},
```

**Note:** Do NOT remove existing color definitions used by SA/US/NE pages. Add the `brand` namespace alongside them.

---

## Step 3: Add Global CSS Animations

**File:** Add to the project's global CSS (or `src/app/ae/globals.css` if scoped):

```css
/* Fluid Typography */
.text-display-hero {
  font-size: clamp(2.5rem, 4vw + 1.5rem, 5rem);
  line-height: 1.05;
}

.text-display-lg {
  font-size: clamp(2rem, 3vw + 1rem, 3.5rem);
  line-height: 1.1;
}

.text-display-md {
  font-size: clamp(1.5rem, 2vw + 0.75rem, 2.5rem);
  line-height: 1.15;
}

/* Hero entrance animation */
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0, 0.55, 0.45, 1) forwards;
  opacity: 0; /* Start invisible, animation fills forward */
}

/* Staggered delays for hero elements */
.animation-delay-100 { animation-delay: 100ms; }
.animation-delay-200 { animation-delay: 200ms; }
.animation-delay-300 { animation-delay: 300ms; }
.animation-delay-400 { animation-delay: 400ms; }
.animation-delay-500 { animation-delay: 500ms; }

/* Smooth scroll */
html {
  scroll-behavior: smooth;
}
```

---

## Step 4: Create the ScrollReveal Component

**File:** `src/components/scroll-reveal.tsx`

This is the core animation primitive — wraps any element and fades it in when it scrolls into view.

```tsx
"use client";

import { useEffect, useRef, type ReactNode } from "react";

interface ScrollRevealProps {
  children: ReactNode;
  className?: string;
  delay?: number;
}

export function ScrollReveal({ children, className = "", delay = 0 }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Respect prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) {
      el.style.opacity = "1";
      el.style.transform = "none";
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("is-visible");
            }, delay);
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: "0px 0px -50px 0px",
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div
      ref={ref}
      className={`opacity-0 translate-y-8 transition-all duration-700 ease-[cubic-bezier(0,0.55,0.45,1)] [&.is-visible]:opacity-100 [&.is-visible]:translate-y-0 ${className}`}
    >
      {children}
    </div>
  );
}
```

**Best practice notes:**
- Uses `IntersectionObserver` (no scroll event listeners — better performance)
- `unobserve` after first intersection (animate once, not on every scroll)
- Respects `prefers-reduced-motion` for accessibility
- Single `transition-all duration-700` with a custom easing curve
- No external dependencies

---

## Step 5: Create the SectionHeading Component

**File:** `src/components/section-heading.tsx`

Reusable pattern across all sections:

```tsx
import { ScrollReveal } from "@/components/scroll-reveal";

interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description?: string;
  centered?: boolean;
  dark?: boolean;
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  centered = true,
  dark = false,
}: SectionHeadingProps) {
  return (
    <div className={centered ? "mx-auto max-w-3xl text-center" : ""}>
      <ScrollReveal>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
          {eyebrow}
        </p>
      </ScrollReveal>
      <ScrollReveal delay={100}>
        <h2
          className={`font-display mt-3 text-display-lg uppercase tracking-tight ${
            dark ? "text-white" : "text-gray-900"
          }`}
        >
          {title}
        </h2>
      </ScrollReveal>
      {description && (
        <ScrollReveal delay={200}>
          <p
            className={`mt-5 text-lg leading-relaxed ${
              dark ? "text-white/70" : "text-gray-500"
            }`}
          >
            {description}
          </p>
        </ScrollReveal>
      )}
    </div>
  );
}
```

---

## Step 6: Redesign the AE Homepage

**File:** `src/app/ae/page.tsx`

Rebuild the homepage with these sections. All content MUST still come from Strapi (use the existing `getHomePage("ae")` fetch). The layout and animation patterns change, but the data source stays the same.

### Section 1 — Hero

Key features to implement:
- Dark Blue `#094D76` background with subtle SVG grid pattern overlay at 3% opacity
- Rotating word animation cycling through keywords (from Strapi `heroHeadline` or fallback array: `["Safety", "Precision", "Compliance", "Excellence"]`)
- Staggered `.animate-fade-in-up` with `.animation-delay-*` classes on: eyebrow → headline → subtext → CTAs → stats
- Stats row at bottom with border-top divider (50+ Countries, 1000+ Projects, 15+ Years)
- Scroll indicator with bouncing chevron at bottom center
- `min-h-[90vh]` hero height
- CTA buttons: primary orange `#F15C30` with `hover:scale-[1.02]`, secondary ghost/outline with `border-white/20`

### Section 2 — Trust Bar

- Clean white background with bottom border
- Standards displayed as large `font-display` text with small description underneath
- `hover:-translate-y-1` micro-interaction on each standard
- Wrapped in `ScrollReveal`

### Section 3 — Services

- Light gray `#F2F2F4` background
- **Horizontal list layout** (NOT cards) — each service is a full-width row with border-top
- Columns: number (orange `01`, `02`...) → title (font-display, uppercase) → description → arrow
- Arrow icon starts at `opacity-0`, slides right on hover: `group-hover:translate-x-2 group-hover:opacity-100`
- Title changes to blue `#2575B6` on hover
- Each row wrapped in `ScrollReveal` with staggered delays (`index * 50`)
- Data from Strapi `page.services` array

### Section 4 — About / Values

- Two-column grid: left = brand story + stats, right = values grid
- Left column: eyebrow → headline → two paragraphs → stats row (3-col with `font-display` numbers in blue)
- Right column: 2x2 grid of value cards with `border-l-2 border-[#2575B6]` that changes to orange on hover
- Each value card has `bg-[#F2F2F4]` background
- Data from Strapi about fields or fallbacks

### Section 5 — Process / Methodology

- Light gray background
- 4-column grid with `gap-px bg-gray-200` trick (1px gap creates subtle grid lines)
- Each step card: large faded number (`text-[#F15C30]/20 text-6xl`), title, description
- Cards have `bg-white` and `hover:bg-white` transition
- Data from Strapi `page.methodology` or `processSteps`

### Section 6 — Blog / Insights

- White background
- Header row: left = eyebrow + title, right = "All Articles" link with arrow slide
- 3-column grid with `gap-px bg-gray-200` trick
- Each article card: category tag (blue) + date → title → excerpt → "Read More" with arrow
- Hover: background shifts to light gray, title turns blue
- Data from Strapi `page.insights` (latest 3 blog posts)

### Section 7 — FAQ

- Light gray background
- Centered max-w-3xl accordion
- Each item: `bg-white px-8`, no border radius, clean edges
- Question text in `font-display uppercase` that turns blue when open
- Smooth expand/collapse animation (use the existing `FaqAccordion` component or rebuild)
- Data from Strapi `page.faqs`

### Section 8 — CTA Banner

- Dark Blue `#094D76` background
- Centered text: eyebrow → headline → description → two buttons
- Same button styles as hero (primary orange, secondary ghost)
- All wrapped in `ScrollReveal` with staggered delays

### Section 9 — Footer

- Dark background (`text-white` on `bg-gray-900` or `#094D76`)
- 4-column: logo + tagline + LinkedIn icon, services links, company links, contact info
- Column headings: `text-xs uppercase tracking-[0.2em] text-white/40`
- Links: `text-white/60 hover:text-white`
- LinkedIn icon in bordered square: `hover:border-[#F15C30] hover:text-[#F15C30]`
- Copyright bar with border-top

---

## Step 7: Apply Same Patterns to All Other AE Pages

Use the same animation and layout primitives across all pages:

### Services Index (`src/app/ae/services/page.tsx`)
- Use `SectionHeading` for the hero
- Wrap each service card in `ScrollReveal` with staggered delays
- Apply the horizontal list layout from the homepage services section
- Add `group` hover states with arrow slide and title color change

### Service Detail (`src/app/ae/services/[slug]/page.tsx`)
- Hero: dark blue background with `animate-fade-in-up` on breadcrumb → eyebrow → title → description → CTA
- Body sections: wrap each in `ScrollReveal`
- Features grid: use the `border-l-2` value card pattern
- Process steps: use the `gap-px` grid pattern
- FAQ: centered accordion with `font-display` questions
- CTA banner: same as homepage

### Blog Index (`src/app/ae/blog/page.tsx`)
- `SectionHeading` hero
- Blog cards in 3-column `gap-px` grid (same as homepage insights)
- Each card wrapped in `ScrollReveal`
- Hover: bg shift + title color change + arrow slide

### Blog Detail (`src/app/ae/blog/[slug]/page.tsx`)
- Dark blue hero with `animate-fade-in-up` entrance
- Body content: wrap in `ScrollReveal`
- Related articles at bottom: use the `gap-px` grid cards

### About (`src/app/ae/about/page.tsx`)
- Hero with `animate-fade-in-up` staggered entrance
- Values section: 2x2 grid with `border-l-2` cards
- Stats: `font-display` large numbers in blue
- All sections wrapped in `ScrollReveal`

### Contact (`src/app/ae/contact/page.tsx`)
- Dark blue hero with `animate-fade-in-up`
- Contact info cards with `border-l-2` accent
- Form section wrapped in `ScrollReveal`

### Case Studies Index + Detail
- Same patterns as blog (grid cards, `ScrollReveal`, hover states)

---

## Step 8: Update AE Navbar

**File:** `src/components/ae-navbar.tsx`

Update to match the v0 design:

- **Transparent on top, solid on scroll:** Start `bg-transparent` with white text, transition to `bg-white/95 backdrop-blur shadow-sm` with dark text on scroll
- **Logo:** Use the Carelabs logo image (not text) — already exists
- **Nav text:** When transparent: `text-white/80 hover:text-white`. When scrolled: `text-gray-700 hover:text-gray-900`
- **Contact CTA:** Always orange `#F15C30` with `hover:scale-[1.02]` and uppercase tracking
- **Services dropdown:** Clean dropdown with service links (no need for shadcn DropdownMenu — keep the existing hover-based dropdown)
- **Transition:** `transition-all duration-300` on the header

---

## Step 9: Update AE Footer

**File:** `src/components/ae-footer.tsx`

Rebuild to match the v0 4-column layout:

- Dark background (use `bg-gray-900` or `bg-[#094D76]`)
- Column 1: Logo image + `config.footerDescription` + LinkedIn icon in bordered square
- Column 2: Services links from `config.services`
- Column 3: Company links (About, Blog, Case Studies, Contact)
- Column 4: Contact info with Lucide icons (Mail, Phone, MapPin)
- Column headings: `text-xs font-semibold uppercase tracking-[0.2em] text-white/40`
- Links: `text-sm text-white/60 hover:text-white transition-colors`
- Copyright bar: `border-t border-white/10` with centered text

---

## Performance Best Practices (MUST follow)

1. **`ScrollReveal` is a client component** — use it only for wrapping individual elements, not entire pages. Page components remain server components.
2. **No scroll event listeners** — the `ScrollReveal` uses `IntersectionObserver` which is passive and efficient.
3. **`prefers-reduced-motion` respected** — the `ScrollReveal` component checks this and skips animations if the user prefers reduced motion.
4. **No layout shift (CLS)** — elements start with `opacity-0 translate-y-8` which doesn't affect layout. No `height: 0` or `display: none` that would cause reflow.
5. **Fonts loaded via `next/font`** — Anton and Inter are optimized with font-display: swap and preloaded.
6. **Images still use `next/image`** — no `<img>` tags.
7. **CSS animations over JS animations** — the `fadeInUp` keyframe runs on the compositor thread (opacity + transform only).
8. **`will-change` NOT needed** — the animations are simple enough that the browser handles them without hints. Adding `will-change` to many elements hurts memory.
9. **Keep `force-dynamic`** — all pages still fetch from Strapi at request time.

---

## Verification Checklist

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all AE routes compile
4. Verify Anton font loads on AE pages (check Network tab for `Anton` woff2)
5. Verify `ScrollReveal` animates on scroll (elements fade in as you scroll down)
6. Verify hero rotating word cycles through keywords
7. Verify navbar goes from transparent → solid on scroll
8. Verify service list rows have hover arrow slide effect
9. Verify `prefers-reduced-motion` disables animations (test in browser devtools)
10. Verify non-AE pages (US, NE) are unaffected
11. Run Playwright: `npx playwright test tests/ae-content-quality.spec.ts` — all pass
12. Commit: `redesign(ae): apply v0 design system — animations, layout, fonts, brand colors`
13. Push: `git push origin redesign/ae-v0-design-system`

**Do NOT push to main yet** — this is a design branch for review.

---

## Summary of Animation Effects

| Animation | Where Used | Implementation |
|-----------|-----------|---------------|
| `fadeInUp` (0.6s) | Hero elements | CSS `@keyframes` + `.animate-fade-in-up` class |
| Staggered delays | Hero eyebrow → title → text → CTAs → stats | `.animation-delay-100` through `-500` |
| `ScrollReveal` | Every section below the fold | IntersectionObserver + `opacity-0 translate-y-8` → visible |
| Rotating word | Hero headline | `setInterval` cycling through array, `translate-y-full` exit / `translate-y-0` enter |
| Hover scale | CTA buttons | `hover:scale-[1.02]` with `transition-all duration-300` |
| Arrow slide | Service rows, blog cards, links | `opacity-0 group-hover:opacity-100 group-hover:translate-x-2` |
| Title color shift | Service rows, blog cards | `group-hover:text-[#2575B6]` |
| Border color shift | Value cards | `border-l-2 border-[#2575B6] hover:border-[#F15C30]` |
| Trust bar lift | Standards items | `hover:-translate-y-1` |
| Navbar transition | Header | `bg-transparent` → `bg-white/95 backdrop-blur shadow-sm` on scroll |
| Scroll indicator | Hero bottom | `animate-bounce` on ChevronDown icon |
| FAQ open state | Accordion triggers | `[data-state=open]:text-[#2575B6]` |

## Summary of Layout Patterns

| Pattern | Where Used | Key CSS |
|---------|-----------|---------|
| Horizontal service list | Homepage services, services index | Full-width rows with `border-t`, columns via flex |
| gap-px grid | Process steps, blog cards | `grid gap-px bg-gray-200` with `bg-white` children |
| border-l accent cards | Values, features | `border-l-2 border-[#2575B6]` cards in 2x2 grid |
| Split two-column | About section | `grid lg:grid-cols-2 gap-24` |
| Centered narrow section | FAQ, CTA | `mx-auto max-w-3xl text-center` |
| Stats row | Hero, about section | `grid grid-cols-3 gap-8 border-t pt-12` with `font-display` numbers |
| Fluid typography | All headings | `clamp()` in `.text-display-hero`, `-lg`, `-md` |
