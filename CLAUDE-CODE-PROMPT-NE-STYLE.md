# Claude Code Prompt — NE Complete Style Overhaul (Colors + Fonts)

Copy everything below the line into Claude Code.

---

## Task: Apply Nordic color palette + Fraunces/Syne fonts to all NE pages

**Branch:** `style/ne-complete-restyle`

Read `CLAUDE.md` before starting.

**This prompt combines two changes:**
1. Nordic blue + sand color palette (replacing SA's navy/gray)
2. Fraunces + Syne font system (replacing SA's Barlow Condensed/Poppins/Playfair Display)

**CRITICAL: Only edit NE files. Do NOT touch ANY SA, US, or AE files.**

NE scope:
- `src/app/layout.tsx` (add font imports only — don't remove existing fonts)
- `tailwind.config.ts` (add NE font families — don't remove existing ones)
- `src/components/ne-navbar.tsx`
- `src/components/ne-footer.tsx`
- `src/components/ne-announcement-ticker.tsx`
- `src/app/uk/` (all files)
- `src/app/ie/` (all files)
- `src/app/se/` (all files)
- `src/app/no/` (all files)
- `src/app/dk/` (all files)
- `src/app/fi/` (all files)

---

## PART 1 — Font Setup

### 1A — Add Fraunces + Syne to layout.tsx

In `src/app/layout.tsx`, add these imports alongside the existing font imports (do NOT remove Barlow/Poppins/Playfair — SA still uses them):

```ts
import {
  Montserrat,
  Poppins,
  Barlow_Condensed,
  Playfair_Display,
  Fraunces,
  Syne,
} from "next/font/google";
```

Add the font instances after the existing ones:

```ts
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});
```

Add the CSS variables to the `<body>` className string:

```ts
${fraunces.variable} ${syne.variable}
```

### 1B — Add NE font families to tailwind.config.ts

In `tailwind.config.ts` under `theme.extend.fontFamily`, add these new entries (keep existing ones for SA):

```ts
// NE fonts (Fraunces + Syne)
"ne-display": ["var(--font-fraunces)", "Georgia", "serif"],
"ne-accent": ["var(--font-fraunces)", "Georgia", "serif"],
"ne-body": ["var(--font-syne)", "system-ui", "sans-serif"],
"ne-nav": ["var(--font-syne)", "system-ui", "sans-serif"],
```

Also add the NE color tokens under `theme.extend.colors`:

```ts
// Northern Europe palette
nordicBlue: "#1A3650",
nordicMid: "#4A7C9B",
sand: "#DDD5C5",
sandLight: "#F0EBE1",
warmWhite: "#F9F7F3",
nordicSlate: "#243E54",
```

---

## PART 2 — Font Class Swap in All NE Files

In EVERY NE file (42 pages + 3 components), perform these class name replacements:

| Find | Replace with | What changes |
|------|-------------|-------------|
| `font-condensed` | `font-ne-display` | Headings: Barlow Condensed → Fraunces |
| `font-accent` | `font-ne-accent` | Italic accent words: Playfair → Fraunces italic |
| `font-body` | `font-ne-body` | Body text: Poppins → Syne |

**Important nuances:**

1. **Headings with `font-condensed font-extrabold uppercase`**: Change to `font-ne-display font-black uppercase`. Fraunces looks best at `font-black` (900 weight) for big display headings, not `font-extrabold` (800).

2. **Accent italic spans** (the orange italic words like "Precision." or country names): These currently use `font-accent italic font-normal normal-case`. Change to `font-ne-accent italic font-normal normal-case`. Fraunces italic is the accent font — same family, italic style.

3. **Nav/label text** with `font-condensed text-xs uppercase tracking-[0.2em]` or similar small tracked text: Change to `font-ne-nav text-xs uppercase tracking-[0.18em]`. Syne needs slightly less letter-spacing than Barlow Condensed because it's naturally wider.

4. **Body paragraphs** with `font-body`: Change to `font-ne-body`.

5. **Font sizes on display headings**: Fraunces is optically larger than Barlow Condensed at the same font size. Reduce hero heading sizes slightly:
   - `text-8xl` → `text-7xl`
   - `text-7xl` → `text-6xl`
   - Keep `text-5xl` and below as-is
   
   Only apply this size reduction to the main hero `<h1>` on each page, not to all headings.

6. **Remove `tracking-tight`** from headings that use `font-ne-display`. Fraunces has good built-in spacing; Barlow Condensed needed `tracking-tight` because it's a condensed font but Fraunces is not condensed. Find any `font-ne-display ... tracking-tight` and remove the `tracking-tight` class.

7. **CTA button text**: Buttons currently use `font-condensed font-bold text-sm uppercase tracking-[0.15em]`. Change to `font-ne-nav font-semibold text-sm uppercase tracking-[0.1em]`. Syne buttons look better at `font-semibold` and tighter tracking.

---

## PART 3 — Color Palette Swap in All NE Files

In EVERY NE file (42 pages + 3 components), perform these color replacements:

### 3A — Bulk find-and-replace

| Find | Replace with | What it is |
|------|-------------|------------|
| `#0B1A2F` | `#1A3650` | Primary dark (hero, navbar, footer, dark sections, CTA buttons, headings) |
| `#F8FAFC` | `#F0EBE1` | Light section background (cool gray → warm sand) |
| `#1E293B` | `#243E54` | Slate card / image placeholder bg |

### 3B — White backgrounds → warm white

Find every `bg-white` in NE files and replace with `bg-[#F9F7F3]`.

Do NOT replace `bg-white` in SA files, US files, or shared components.

### 3C — Divider colors in dark sections

Find `divide-white/10` in NE pages (insights sections, FAQ sections on navy bg) and replace with `divide-[#4A7C9B]/20`.

### 3D — Navbar dropdown refinements

In `ne-navbar.tsx`, after the bulk `#0B1A2F` → `#1A3650` replacement, also update:
- `border-white/10` on the dropdown container → `border-[#4A7C9B]/20`
- `hover:bg-white/5` on dropdown links → `hover:bg-[#4A7C9B]/10`

### 3E — Geometric hero circles

In each NE homepage (uk/page.tsx, ie/page.tsx, etc.), find the concentric circle elements in the hero. Change the middle circle:
- `border border-white/10` → `border border-[#4A7C9B]/30`

---

## PART 4 — NE Component Updates

### 4A — ne-navbar.tsx

After font + color swaps above, also:
- Logo text classes: any `font-condensed` → `font-ne-nav`
- Nav link classes: `font-condensed text-[13px]` → `font-ne-nav text-[12px]`
- Mobile menu links: same swap
- CTA button: `font-condensed font-bold` → `font-ne-nav font-semibold`

### 4B — ne-footer.tsx

- All heading/label classes: `font-condensed` → `font-ne-nav`
- Body text: `font-body` → `font-ne-body`
- Watermark text: `font-condensed` → `font-ne-display`
- Newsletter input placeholder: ensure it uses `font-ne-body`

### 4C — ne-announcement-ticker.tsx

- Ticker text: `font-condensed` → `font-ne-nav`
- Background: `#0B1A2F` → `#1A3650`

---

## PART 5 — Verification

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all 42 NE routes + all SA/US/AE routes must build successfully

4. **Font grep check**: Run `grep -r "font-condensed\|font-accent\|font-body" src/app/uk src/app/ie src/app/se src/app/no src/app/dk src/app/fi src/components/ne-*.tsx` — must return ZERO results (no old SA font classes in NE files)

5. **Color grep check**: Run `grep -r "#0B1A2F" src/app/uk src/app/ie src/app/se src/app/no src/app/dk src/app/fi src/components/ne-*.tsx` — must return ZERO results

6. **SA untouched check**: Run `grep -r "font-condensed" src/app/br/page.tsx | head -3` — must still find results (SA files use old font classes)

7. Commit: `style: apply Nordic blue + sand palette and Fraunces + Syne fonts to all NE pages`
8. Merge to main, push both: `git checkout main && git merge style/ne-complete-restyle && git push origin main && git push company main`
