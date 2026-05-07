# Claude Code Prompt — Apply BR Design System to All Brazil Pages

Copy everything below the line into Claude Code.

---

## Task: Restyle all Brazil pages to match the redesigned BR homepage

**Branch:** `feature/br-full-site-redesign`

The Brazil homepage (`src/app/br/page.tsx`) has been redesigned with a new design system: navy `#0B1A2F` backgrounds, `font-condensed` (Barlow Condensed) for headings, `font-accent` (Playfair Display italic) for accent words, `font-body` (Poppins) for body text, orange `#F97316` accents, folder-tab cards (`rounded-2xl rounded-tr-none`), and off-white `#F8FAFC` light sections.

Read `CLAUDE.md` before starting. Apply this design system consistently to all remaining BR pages. Keep all Strapi data fetching and fallback logic intact — you are only changing layout and styling, not data sources.

**Design system reference (from homepage):**
- Navy: `#0B1A2F` (hero backgrounds, dark sections)
- Orange: `#F97316` / `orange-500` (accents, CTAs, icons)
- Off-white: `#F8FAFC` (light section backgrounds)
- Slate: `#1E293B` (secondary dark sections)
- Headings: `font-condensed font-extrabold uppercase text-[#0B1A2F]` (or `text-white` on dark)
- Accent words in headings: `font-accent italic text-orange-500`
- Body text: `font-body`
- Cards: `rounded-2xl rounded-tr-none` (folder-tab style)
- Buttons: `font-condensed font-bold uppercase tracking-wide rounded-full`
- Primary CTA: `bg-orange-500 text-white hover:bg-orange-600`
- Secondary CTA: `border-2 border-[#0B1A2F] text-[#0B1A2F] hover:bg-[#0B1A2F] hover:text-white`
- Section labels: `font-condensed text-xs uppercase tracking-[0.15em] text-orange-500`
- Container: `max-w-[1400px] mx-auto px-6 lg:px-12`

**Global color replacement** — In every file you touch, replace ALL old hardcoded colors:
- `#094d76` → `#0B1A2F`
- `#2575B6` → `#0B1A2F`
- `#F15C30` → `#F97316` (or use Tailwind `orange-500`)
- `#f2f2f4` → `#F8FAFC`
- `#9c9b9a` → `gray-500`

---

### PAGE 1 — About Us (`src/app/br/about-us/page.tsx`)

**Hero section:**
- Full-width navy `#0B1A2F` background, `py-20 lg:py-28`
- Centered content, no gradient — plain navy
- Page title: `font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white`
- Use font-mixing if the title allows — e.g., "About *Carelabs*" where "Carelabs" is `font-accent italic text-orange-500`
- Sub-copy: `font-body text-lg text-white/70 max-w-2xl mx-auto mt-6 text-center`
- No CTA button in hero

**Mission section:**
- Off-white `#F8FAFC` background, `py-16 lg:py-24`
- Section label: `font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4`
- Heading: `font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase`
- Body: `font-body text-lg text-gray-600 leading-relaxed max-w-3xl`

**Values section:**
- White background, `py-16 lg:py-24`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6`
- Each value card: folder-tab style `rounded-2xl rounded-tr-none bg-[#F8FAFC] p-8 border border-gray-100`
- Icon: Lucide icon in `text-orange-500 w-8 h-8 mb-4`
- Title: `font-condensed font-bold text-lg uppercase text-[#0B1A2F] mt-2`
- Description: `font-body text-sm text-gray-600 mt-3 leading-relaxed`

**Certifications section:**
- Navy `#0B1A2F` background, `py-16`
- Heading: `font-condensed font-extrabold text-2xl md:text-3xl text-white uppercase text-center mb-8`
- Badges: horizontal flex centered, same style as homepage trust badges: `bg-white/10 border border-white/20 rounded-full px-5 py-2.5 text-white font-body text-sm`

**CTA section:**
- Replace the old split orange/navy CTA with the homepage gradient style:
- `bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 text-center`
- Heading: `font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase`
- Button below: white pill with navy text, `mt-8`

---

### PAGE 2 — Contact Us (`src/app/br/contact-us/page.tsx`)

**Hero section:**
- Navy `#0B1A2F` background, `py-16 lg:py-24`
- Title: `font-condensed font-extrabold text-4xl md:text-5xl uppercase text-white text-center`
- Sub-copy: `font-body text-lg text-white/70 mt-4 text-center max-w-2xl mx-auto`

**Form + Contact info section:**
- Off-white `#F8FAFC` background, `py-16 lg:py-24`
- Two-column layout: `grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1400px] mx-auto px-6 lg:px-12`
- **Left column — Form:**
  - Card: `bg-white rounded-2xl rounded-tr-none p-8 shadow-lg` (folder-tab card)
  - Form heading: `font-condensed font-bold text-2xl text-[#0B1A2F] uppercase mb-6`
  - Input fields: `border border-gray-200 rounded-lg px-4 py-3 font-body text-sm focus:border-orange-500 focus:ring-1 focus:ring-orange-500 outline-none transition-colors w-full`
  - Labels: `font-condensed text-sm uppercase tracking-wider text-[#0B1A2F] mb-1 block`
  - Submit button: `bg-orange-500 text-white font-condensed font-bold uppercase px-8 py-3 rounded-full hover:bg-orange-600 transition-colors w-full mt-4`
- **Right column — Contact details:**
  - Card: `bg-[#0B1A2F] rounded-2xl rounded-tr-none p-8 text-white`
  - Each contact item: icon in `text-orange-500 w-5 h-5`, label in `font-condensed text-xs uppercase tracking-wider text-white/50`, value in `font-body text-base text-white mt-1`
  - Items: Phone, Email, Address, Office Hours (from Strapi or fallbacks)
  - Spacing: `space-y-8`

**Map embed (if present):**
- Wrap in `rounded-2xl overflow-hidden mt-12 max-w-[1400px] mx-auto px-6 lg:px-12`

**CTA section:**
- Same gradient style as other pages: `bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 text-center`

---

### PAGE 3 — Services Index (`src/app/br/services/page.tsx`)

**Hero section:**
- Navy `#0B1A2F` background, `py-20 lg:py-28`
- Title: `font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white text-center`
- Font-mix the heading if possible — e.g., "Our *Services*" with italic accent
- Sub-copy: `font-body text-lg text-white/70 mt-6 text-center max-w-2xl mx-auto`

**Services grid:**
- Off-white `#F8FAFC` background, `py-16 lg:py-24`
- Grid: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-[1400px] mx-auto px-6 lg:px-12`
- Each service card: folder-tab style `rounded-2xl rounded-tr-none overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-shadow`
  - Number badge at top-left: `font-condensed font-extrabold text-5xl text-orange-500/15 absolute top-4 right-4` (e.g., "01", "02")
  - Content padding: `p-6 pt-4 relative`
  - Title: `font-condensed font-bold text-xl text-[#0B1A2F] uppercase mt-2`
  - Description: `font-body text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3`
  - Link: `font-condensed font-semibold text-orange-500 hover:text-orange-600 mt-4 inline-flex items-center gap-1` → "Learn More →"
  - Make the entire card a clickable Link wrapping the content

**CTA section:**
- Gradient style: `bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 text-center`

---

### PAGE 4 — Service/Blog Detail (`src/app/br/[slug]/page.tsx`)

This is the dynamic catch-all route for both individual services and blog posts. Restyle both views:

**For SERVICE detail view:**

**Hero:**
- Navy `#0B1A2F` background, `py-16 lg:py-24`
- Eyebrow (if available): `font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4`
- Title: `font-condensed font-extrabold text-3xl md:text-4xl lg:text-5xl uppercase text-white`
- Sub-description: `font-body text-lg text-white/70 mt-6 max-w-3xl`
- Trust badges row if available: same as homepage style

**Features section (if present):**
- Off-white background
- Grid of feature cards: `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6`
- Each card: folder-tab `rounded-2xl rounded-tr-none bg-white p-6 border border-gray-100`
- Icon: `text-orange-500 w-6 h-6`
- Title: `font-condensed font-bold text-base uppercase text-[#0B1A2F] mt-3`
- Description: `font-body text-sm text-gray-600 mt-2`

**Process steps (if present):**
- White background
- Same 4-column layout as homepage "How It Works": `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8`
- Step number: `font-condensed font-extrabold text-6xl text-orange-500/20`
- Title: `font-condensed font-bold text-lg text-[#0B1A2F] uppercase`
- Description: `font-body text-sm text-gray-600`
- Orange top border: `border-t-2 border-orange-500 pt-6`

**Safety section (if present):**
- Navy `#1E293B` background
- Bullet items with orange checkmark icons
- Text in white

**FAQ accordion (if present):**
- Off-white background, same accordion style as homepage

**CTA:** gradient style as above

**For BLOG POST detail view:**

**Hero:**
- Navy `#0B1A2F` background, `py-16 lg:py-24`
- Category badge: `font-condensed text-xs uppercase tracking-[0.15em] bg-orange-500 text-white px-3 py-1 rounded-full inline-block mb-4`
- Title: `font-condensed font-extrabold text-3xl md:text-4xl text-white`
- Date + author: `font-body text-sm text-white/60 mt-4`

**Article body:**
- White background, `py-12 lg:py-16`
- Content container: `max-w-3xl mx-auto px-6 prose prose-lg`
- Style the prose: `font-body text-gray-700 leading-relaxed`
- Headings within prose: `font-condensed font-bold text-[#0B1A2F] uppercase`
- Links: `text-orange-500 hover:text-orange-600`

**Related posts (if any):**
- Off-white background
- Folder-tab cards in a 3-column grid

---

### PAGE 5 — Blog Index (`src/app/br/blogs/page.tsx`)

**Hero section:**
- Navy `#0B1A2F` background, `py-20 lg:py-28`
- Title: `font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white text-center`
- Font-mix: "Latest *Insights*" with italic serif accent
- Sub-copy: `font-body text-lg text-white/70 mt-6 text-center max-w-2xl mx-auto`

**Featured article section:**
- Off-white `#F8FAFC` background, `py-16`
- Two-column layout: `grid grid-cols-1 lg:grid-cols-5 gap-8`
  - Featured (left, `lg:col-span-3`): folder-tab card `rounded-2xl rounded-tr-none bg-[#0B1A2F] p-8 text-white` with category badge, large title (`font-condensed font-bold text-2xl`), excerpt, "Read More →" in orange
  - Side articles (right, `lg:col-span-2`): stacked folder-tab cards `space-y-4`, each card `rounded-2xl rounded-tr-none bg-white p-6 border border-gray-100`

**More articles section:**
- White background, `py-16`
- Section heading: `font-condensed font-extrabold text-2xl text-[#0B1A2F] uppercase mb-8`
- List layout — each article row:
  - `flex items-start gap-6 py-6 border-b border-gray-100 hover:bg-[#F8FAFC] transition-colors px-4 rounded-lg`
  - Date: `font-condensed text-sm text-orange-500 shrink-0 w-24`
  - Title: `font-condensed font-bold text-lg text-[#0B1A2F] hover:text-orange-500`
  - Excerpt: `font-body text-sm text-gray-600 mt-1 line-clamp-2`

**CTA:** gradient style

---

### PAGE 6 — Case Studies (`src/app/br/case-studies/page.tsx`)

This is currently a placeholder. Restyle it to match:

**Hero:**
- Navy `#0B1A2F` background, `py-20 lg:py-28`
- Title: `font-condensed font-extrabold text-4xl md:text-5xl uppercase text-white text-center`
- Sub-copy: `font-body text-lg text-white/70 mt-6 text-center max-w-2xl mx-auto`

**Coming soon section:**
- Off-white `#F8FAFC` background, `py-24`
- Centered folder-tab card: `max-w-2xl mx-auto rounded-2xl rounded-tr-none bg-white p-12 text-center border border-gray-100`
- Icon: `ClipboardList` from Lucide in `text-orange-500 w-12 h-12 mx-auto mb-6`
- Heading: `font-condensed font-bold text-2xl text-[#0B1A2F] uppercase`
- Body: `font-body text-gray-600 mt-4 max-w-md mx-auto`
- CTA: orange pill button linking to contact page

**CTA:** gradient style

---

### FINAL CHECKS

After all pages are restyled:

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — must succeed
4. Verify every page still fetches from Strapi — no new hardcoded business content
5. Verify all pages use the SANavbar and SAFooter (already restyled)
6. Verify no old colors remain (`#094d76`, `#2575B6`, `#F15C30`, `#f2f2f4`) in any BR page file

**Commit:** `feat: apply BR design system to all Brazil pages — about, contact, services, blog, case studies`

**Push:** `git push origin feature/br-full-site-redesign && git push company feature/br-full-site-redesign`

Then merge to main and push: `git checkout main && git merge feature/br-full-site-redesign && git push origin main && git push company main`
