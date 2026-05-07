# Claude Code Prompt — NE Nordic Blue + Sand Color Palette

Copy everything below the line into Claude Code.

---

## Task: Replace all NE page/component colors with Nordic blue + sand palette

**Branch:** `style/ne-color-palette`

Read `CLAUDE.md` before starting.

**Goal:** The NE pages currently use the same navy `#0B1A2F` and cool gray `#F8FAFC` as the SA pages. Replace them with a distinct Nordic palette so the two regions look different at a glance.

**CRITICAL: Do NOT touch ANY files outside the NE scope.** Only edit files in these locations:
- `src/components/ne-navbar.tsx`
- `src/components/ne-footer.tsx`
- `src/components/ne-announcement-ticker.tsx`
- `src/app/uk/` (all files)
- `src/app/ie/` (all files)
- `src/app/se/` (all files)
- `src/app/no/` (all files)
- `src/app/dk/` (all files)
- `src/app/fi/` (all files)

Never edit files in `src/app/br/`, `src/app/co/`, `src/app/cl/`, `src/app/ar/`, `src/app/pe/`, `src/app/us/`, `src/app/ae/`, or any `sa-*.tsx` component.

---

## COLOR MAP — find and replace

Perform these exact color substitutions across ALL NE files listed above:

| Find | Replace with | What it is |
|------|-------------|------------|
| `#0B1A2F` | `#1A3650` | Primary dark (hero bg, navbar, footer, dark sections, CTA buttons, text headings) |
| `#F8FAFC` | `#F0EBE1` | Light section background (off-white → warm sand) |
| `#1E293B` | `#243E54` | Slate card / image placeholder bg (slightly lighter than primary) |

### Additional refinements after the bulk replace:

**1. Add mid-blue accent color `#4A7C9B`**

In each NE homepage file (uk/page.tsx, ie/page.tsx, etc.), find the geometric circle elements in the hero section. Change the middle circle's border color:

```
border border-white/10  →  border border-[#4A7C9B]/30
```

This adds a mid-blue tone that doesn't exist in SA.

**2. Warm up white backgrounds**

In section backgrounds that use plain `bg-white`, change to `bg-[#F9F7F3]` (warm off-white). This applies to:
- Services sections
- Blog/insights sections on white bg
- Final CTA sections
- Any other `bg-white` on NE pages

Do this ONLY in NE page files and NE components. Find every `bg-white` in the NE files and replace with `bg-[#F9F7F3]`.

**3. Warm up text colors**

Where headings use `text-[#0B1A2F]` (which you already replaced to `text-[#1A3650]` in step 1), that's correct — keep it.

But also update muted text references:
- `text-[#0B1A2F]/10` → `text-[#1A3650]/10`
- `text-[#0B1A2F]/40` → `text-[#1A3650]/40`
- `text-[#0B1A2F]/50` → `text-[#1A3650]/50`
- `border-[#0B1A2F]/5` → `border-[#1A3650]/5`
- `border-[#0B1A2F]/10` → `border-[#1A3650]/10`

These should all be caught by the bulk `#0B1A2F` → `#1A3650` replacement, but verify no instances were missed.

**4. Sand-toned dividers**

Find any `divide-white/10` in navy sections (insights, FAQ) and change to `divide-[#4A7C9B]/20` — gives a subtle blue tint to dividers instead of pure white.

**5. Navbar dropdown background**

In `ne-navbar.tsx`, the services dropdown uses `bg-[#0B1A2F]` (now `#1A3650` after replacement). Also update:
- `border-white/10` on the dropdown → `border-[#4A7C9B]/20`
- `hover:bg-white/5` on dropdown links → `hover:bg-[#4A7C9B]/10`

**6. Footer watermark**

In `ne-footer.tsx`, if there's a large "CARELABS" watermark text, keep its opacity low but update its color reference to match the new palette.

---

## Tailwind config — add NE colors (optional but recommended)

In `tailwind.config.ts`, add NE-specific colors under `theme.extend.colors` so future edits are easier:

```ts
// Northern Europe palette
nordicBlue: "#1A3650",
nordicMid: "#4A7C9B",
sand: "#DDD5C5",
sandLight: "#F0EBE1",
warmWhite: "#F9F7F3",
nordicSlate: "#243E54",
```

This is for reference only — the actual pages use hardcoded hex values (Tailwind arbitrary values like `bg-[#1A3650]`), so adding these to the config is optional. Do NOT refactor existing code to use these class names — just add them to the config for documentation.

---

## VERIFICATION

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all 42 NE routes build successfully
4. **Grep check**: Run `grep -r "#0B1A2F" src/app/uk src/app/ie src/app/se src/app/no src/app/dk src/app/fi src/components/ne-*.tsx` — must return ZERO results (no old navy color remaining in NE files)
5. **Grep check**: Run `grep -r "#0B1A2F" src/app/br src/app/us src/components/sa-*.tsx | head -5` — must still find results (SA files untouched)
6. Commit: `style: apply Nordic blue + sand color palette to all NE pages and components`
7. Merge to main, push both: `git checkout main && git merge style/ne-color-palette && git push origin main && git push company main`
