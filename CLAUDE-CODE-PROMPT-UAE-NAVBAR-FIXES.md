# Claude Code Prompt — UAE Navbar & Homepage Fixes

Copy everything below the line into Claude Code.

---

## Task: 5 design fixes for the UAE (AE) site

Read `CLAUDE.md` before starting.

**No new branch needed — commit directly to `main`.**

---

## Fix 1: Remove the announcement ticker from ALL AE pages

The dismissible "Trusted for DEWA compliance across the United Arab Emirates" banner must be removed from every AE page.

**In every file under `src/app/ae/`** (homepage, about, contact, blog, blog/[slug], services, services/[slug], case-studies, case-studies/[slug]):

1. Delete the import line: `import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";`
2. Delete the JSX usage: `<AEAnnouncementTicker countryName={...} standards={...} />`

**Files to check:**
- `src/app/ae/page.tsx`
- `src/app/ae/about/page.tsx`
- `src/app/ae/contact/page.tsx`
- `src/app/ae/blog/page.tsx`
- `src/app/ae/blog/[slug]/page.tsx`
- `src/app/ae/services/page.tsx`
- `src/app/ae/services/[slug]/page.tsx`
- `src/app/ae/case-studies/page.tsx`
- `src/app/ae/case-studies/[slug]/page.tsx`

Do NOT delete the component file itself (`src/components/ae-announcement-ticker.tsx`) — just remove all usages.

---

## Fix 2: Change the manifesto text on the homepage

**File:** `src/app/ae/page.tsx`

Find the MANIFESTO section (section 5). Replace:

```tsx
We don&apos;t deliver reports.
```
```tsx
We deliver certainty.
```

With:

```tsx
Your Safety.
```
```tsx
Engineered.
```

Keep the same JSX structure, classes, and styling — only change the text content.

---

## Fix 3: Make the navbar logo bigger

**File:** `src/components/ae-navbar.tsx`

Find the `<Image>` tag for the Carelabs logo. Change:

```tsx
className="h-8 w-auto"
```

To:

```tsx
className="h-10 w-auto"
```

This applies to the desktop logo only. If there's a separate mobile logo, make it `h-9 w-auto`.

---

## Fix 4: Simplify the navbar — only About Us, Services, Contact Us

**File:** `src/components/ae-navbar.tsx`

The desktop nav (`hidden lg:flex`) should contain ONLY these items in this order:

1. **About Us** — plain link to `config.aboutPath`
2. **Services** — dropdown with service list (keep the existing dropdown behavior)
3. **Contact Us** — orange CTA button to `config.contactPath`

**Remove completely:**
- The "Home" link
- The "Insights" link (was linking to `config.blogIndexPath`)
- The "Case Studies" link (was linking to `config.caseStudyPath`)

**Update the mobile menu** to match — only show:
1. About Us
2. Services
3. Contact Us (orange button)

Remove Home, Insights, and Case Studies from the mobile menu too.

**Update CTA button text** from "Contact" to "Contact Us".
**Update About link text** from "About" to "About Us".

---

## Fix 5: Verify no Insights/Case Studies links leak elsewhere

Grep all AE page files for any remaining nav references to blog or case studies in headers/navbars. The blog and case study PAGES still exist (users can reach them via direct URL or from the homepage insights section) — we're only removing them from the navigation.

---

## Verification

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings  
3. `npm run build` — all AE routes compile
4. `grep -rn "AEAnnouncementTicker" src/app/ae/` — must return ZERO results
5. `grep -rn "Insights\|Case Studies" src/components/ae-navbar.tsx` — must return ZERO results
6. `grep -rn "We deliver certainty\|don.*t deliver reports" src/app/ae/page.tsx` — must return ZERO results
7. `grep -n "h-8" src/components/ae-navbar.tsx` — must return ZERO results (logo should be h-10)
8. Commit: `fix(ae): remove ticker, simplify navbar, update manifesto text`
9. Push: `git push origin main && git push company main`
