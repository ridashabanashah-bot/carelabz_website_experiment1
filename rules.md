# Carelabs Country Site Rules

Authoritative playbook for building any country site (`/ae/`, `/sa/`, `/eg/`, `/jp/`, …) on this repo. Read this top-to-bottom before touching a new country build.

Two kinds of rules in this document:

- **🔒 UNIVERSAL** — binding on every country. Do not deviate.
- **🎨 PER-COUNTRY** — must vary across countries. Each country gets its own design, fonts, exact color shades, layout treatment.

The `/ae/` build (commits `7b3740d` → `1f08575`) is the **first reference implementation**. New countries copy the structure, but never the visual identity, font choice, or layout patterns verbatim.

---

## 0. TL;DR — spinning up a new country `/{cc}/`

1. Clone the AE folder structure: `cp -r src/app/ae src/app/{cc}` (then redo all the visuals — see §3)
2. Add an entry in `src/lib/countries-config.ts` (use the AE entry as a schema reference, not a copy)
3. Add **a new font pairing** in `src/app/layout.tsx` — see §3
4. Add **a new color palette** in `tailwind.config.ts` — must include a blue + an orange accent — see §3
5. Build a unique homepage layout — must NOT mirror the AE layout exactly
6. Set up Strapi `region={cc}` content (pages, blog, services) — see §6
7. Run the WP→Strapi migration pipeline if there's an existing WordPress site to harvest — see §7
8. Run the QA suite — see §8
9. Push to **both** `origin main` AND `company main`

---

## 1. 🔒 Tech stack — non-negotiable

| Layer | Choice |
|---|---|
| Framework | Next.js 14 App Router |
| Styling | Tailwind CSS v3 (no v4 `@theme` syntax, no `size-*` classes) |
| Icons | Lucide React only — no emoji icons, no shadcn/ui, no custom icon components |
| CMS | Strapi v5 Cloud at `https://rational-cheese-8e8c4f80ea.strapiapp.com` |
| Hosting | Vercel — auto-deploys from `company` remote |
| Source | Two remotes — push to both: `origin` (ridashabanashah-bot) AND `company` (carelabz) |
| TypeScript | Strict mode. No `any`. Use `unknown` with narrowing. |
| Images | `next/image` with `fill` + `sizes` + `object-cover` — never `<img>` |

Every page **must** include `export const dynamic = "force-dynamic"`. Strapi is fetched at request time. If Strapi is unreachable, render a graceful fallback message — never break the build.

Strapi default pagination is 25/page. **Always loop with `pageSize=100`** (`getServicesByRegion`, `getBlogPosts`, etc.) or you will silently hide content.

When PUTing repeatable component arrays in Strapi v5, **strip nested `id` from each item** or you'll get `Some of the provided components ... are not related to the entity`.

---

## 2. 🔒 Brand voice — universal across countries

Brand name is **always "Carelabs"** — capital C only. Never "CareLAbz", "CARELABS", "Care Labs", "carelabs". Domain `carelabz.com` and `info@carelabz.com` are the only places the original `z` spelling is allowed.

### Tone (binding)

- **Authoritative** — earned through expertise, not claimed
- **Precise** — exact numbers, specific standards, named methodologies
- **Confident** — straightforward language, no hedging
- **Not salesy** — no pressure, no emotional triggers

### Forbidden phrases — strip on sight

- ❌ "First draft in 2 weeks" / "Final inside 4" / any time-frame promise
- ❌ "Within 24 hours" / "within one business day" / "respond within"
- ❌ "Get back to you within X" / "engineering team will get back"
- ❌ "Quick turnaround" / "fast service" / "same-day" / "rapid"
- ❌ "By the Numbers" stats sections — no "50+ countries / 1000+ projects / X+ years"
- ❌ "Innovative" / "disruption" / "game-changing" / "next-generation" / "revolutionary"
- ❌ "AI-powered" / "machine learning" (unless specific and relevant)
- ❌ "Synergy" / "leverage" / "optimize" (when used vaguely)
- ❌ "We're passionate about" / "We love" / "Our team is obsessed with"
- ❌ "Best-in-class" / "world-class" / "industry-leading" without proof

### Replacement copy

- Time-frame CTA → **"Tell us about your project."**
- Form success → **"Thank you for reaching out. Our team will be in touch."**
- Contact subtext → no time-frame; describe what to send, not when you'll reply

### Writing rules (from CLAUDE.md)

- Lead with the problem, then the solution
- Specific numbers + standards (IEEE 1584, NFPA 70E, OSHA, NEC, DEWA, IEC, country-specific code)
- One exclamation point maximum per page
- Define jargon when first used
- Break complex topics into structured lists

---

## 3. 🎨 Per-country: visual identity must be different

Every country site looks distinct — **don't reuse AE's design**. The only universal visual constraints:

### 🔒 Color palette — universal rule

Every country palette **must include**:

1. **A shade of blue** as the primary brand color (any shade — pick one that fits the country)
2. **An orange accent** for CTAs, eyebrows, highlights

Beyond those two requirements, everything else is open. Choose a tertiary, neutrals, dark mode shade as you see fit per country.

**Example — AE used:**

| Role | Hex | Tailwind |
|---|---|---|
| Primary blue (mid) | `#2575B6` | custom |
| Dark blue (heroes) | `#094D76` | custom |
| Orange accent | `#F15C30` | custom |
| Light gray (sections) | `#F2F2F4` | custom |
| Footer dark | `gray-900` | built-in |

For `/sa/`, `/eg/`, etc. **pick different shades** — e.g. teal-blue + amber-orange, or royal-blue + coral-orange. Document the choice in `tailwind.config.ts` under a country-prefixed namespace (e.g. `sa: { ... }`).

### 🎨 Per-country: font pairing must differ

Each country gets its **own font pair** loaded via `next/font/google` in `src/app/layout.tsx`. Constraints:

- **Display font** — high-impact for headings (sans-serif condensed, serif display, or geometric — pick what fits)
- **Body font** — readable for paragraphs (humanist sans, neutral sans, or modern serif)
- Both must be **Google Fonts** (free, latin subset, `display: swap`)
- Both must be added as CSS variables (`--font-{name}`) and exposed via Tailwind's `fontFamily` extend

**Existing pairings already in use — do not reuse:**

| Country code | Display font | Body font |
|---|---|---|
| `ae` | Anton | Inter |
| `ne` (NE block) | Fraunces | Syne |
| `mx`/`uk`/etc. (legacy) | Montserrat | Poppins |
| `us` (legacy) | (custom Geist) | (custom Geist) |

**Fresh pairings for new countries — pick one per country (examples, not exhaustive):**

- `Bebas Neue` + `Manrope`
- `Archivo Black` + `Nunito`
- `Oswald` + `Source Sans Pro`
- `League Gothic` + `Mulish`
- `Tinos` + `IBM Plex Sans`
- `DM Serif Display` + `DM Sans`
- `Playfair Display` + `Lato`
- `Cormorant Garamond` + `Open Sans`

### 🎨 Per-country: layout / hero treatment must differ

Don't copy the AE homepage section ordering verbatim. The AE shape is:
1. Hero with rotating word over control-room image
2. Trust bar (9 standards)
3. Services horizontal list
4. About + Values 2x2
5. Process gap-px grid
6. Industries marquee
7. Insights cards
8. FAQ accordion
9. CTA banner
10. Footer

For new countries, **rearrange, replace, or redesign** sections. Examples of acceptable variations:

- Split-hero with image-right (instead of full-bleed background)
- Bento-grid services instead of horizontal list
- Tabbed industries (instead of marquee)
- Stats band — **not allowed (forbidden by §2)**, so substitute with logos / certifications strip
- Testimonial wall (if real testimonials exist)
- Vertical timeline for process

The only **layout invariants**:

- Navbar has 3 primary links + 1 orange CTA (call it Get a Quote / Request a Quote / similar — see §5.1)
- Floating Email + WhatsApp widget on every page (right edge fixed) — see §5.4
- Footer has 4 sections: brand+socials / company / contact / category links — see §5.5
- Trust bar appears somewhere on the homepage (standards relevant to that country) — see §5.6

---

## 4. 🔒 SEO-critical fields — never mutate

The following Strapi fields are **read-only after initial set**. Don't write to them in any backfill or cleanup script. Existing values were set with deliberate keyword research:

- `metaTitle`
- `metaDescription`
- `seoKeywords`
- `slug` (after publish)
- JSON-LD `name`, `headline`, `description` outputs

When you need to write a render-time fix (e.g. clean up an ALL-CAPS title), **wrap the value in a render helper** like `cleanServiceTitle()` instead of editing the source field. The visible text is cleaned, the SEO `<meta>` tag stays untouched.

If a metaDescription contains visible `...` and bothers a user, strip the trailing ellipsis at render via `cleanDisplayDescription()` — never edit the Strapi field.

---

## 5. Page rules — apply to every country

### 5.1 🔒 Navbar

- 3 primary text links + 1 orange CTA on the right
- Default 3 links: **About / Services / Contact** (label can be region-localized: "About Us", "Get in Touch", etc.)
- CTA label: **Get a Quote** or **Request a Quote** — never "Buy Now", never "Sign Up"
- Logo on the left (Carelabs SVG, ~40-48px tall)
- Background: transparent on top, solid (white-ish) with `backdrop-blur shadow-sm` on scroll
- Floating widget mounts inside the navbar component so it persists every page

🎨 **Per country:** layout direction (logo-left vs logo-center), nav text color, hover treatment, scroll trigger threshold are flexible.

### 5.2 🔒 Hero — invariants

- Must include a **rotating keyword animation** somewhere in the headline (gives the brand its motion signature)
- Must use the country's primary blue background OR a country-relevant photo (e.g. local landmark, industrial setting) with the primary blue as overlay color at ~85% opacity
- Must have one orange CTA + one ghost/outline secondary CTA
- Must use the display font for the H1
- Animations stagger via `animate-fade-in-up` + `animation-delay-{100..700}` utilities (see §9.2)

🎨 **Per country:** the hero image content, the rotating word list, the headline copy, the layout (centered vs split), the height (90vh, 80vh, 100vh).

### 5.3 🔒 Services architecture — required structure

- `/{cc}/services/` — 4 category tiles with hover dropdowns showing first 12 services + "View all N →"
- `/{cc}/services/category/[category]/` — full list of every service in that category
- `/{cc}/services/[slug]/` — service detail page
- 4 categories: **Testing / Calibration / Inspection / Study & Analysis** (these are the Carelabs business lines and apply universally)
- Slug→category map lives in `src/lib/{cc}-service-categories.ts` — see AE for shape

🎨 **Per country:** tile visual style (image background vs solid color vs illustration), hover transition, mobile accordion vs link behavior.

### 5.4 🔒 Floating contact widget

Right-edge fixed pill visible on every page. Two buttons stacked:

1. Email — `mailto:info@carelabz.com?subject=CL%20Inquiry`
2. WhatsApp — `https://wa.me/{whatsappNumber}?text=...`

Country-specific WhatsApp number stored in `countries-config.ts` `whatsappNumber` field.

🎨 **Per country:** widget colors, icon style, hover effect, button shape are flexible. The two channels are fixed.

### 5.5 🔒 Footer — required structure

Top row, 3 columns:

| Column | Content |
|---|---|
| Brand | Logo + 1-line description + **4 social icons** (LinkedIn / Facebook / Instagram / X) |
| Company | About / Insights / Case Studies / Contact links |
| Contact | Email / phone / address (address links to Google Maps share URL when set) |

Below: row of 4 service category links → `/{cc}/services/category/{slug}/` + "All services →" shortcut.

Bottom row: copyright must use **`{new Date().getFullYear()}`** so it auto-rolls every January 1.

Tagline below copyright (e.g. "Engineered for the UAE.") is country-localized.

🎨 **Per country:** footer color (dark gray-900 default for AE; another country can use deep navy or charcoal), social icon treatment, divider styles.

### 5.6 🔒 Trust bar — country-specific standards

Must include local + international standards relevant to that country. Pattern: 6-12 entries, no descriptions, responsive grid that fits all on one row at desktop.

| Country | Required minimum |
|---|---|
| AE | DEWA + IEEE 1584/242/1547 + NFPA 70E + IEC 61482/61936/60479 + Abu Dhabi DoE |
| US | NFPA 70E + IEEE 1584/1547 + OSHA (1910 Subpart S) + NEC + ANSI |
| UK | BS 7671 + IET Wiring Regs + HSE + IEEE 1584 + IEC 60364 |
| SA | SASO + IEEE 1584 + IEC 60364 + NFPA 70E (research the actual SA standards) |
| Generic fallback | Always include IEEE 1584, NFPA 70E, IEC 60364 + at least one country-specific code |

Source: `countries-config.ts` `standards[]` field, surfaced via Strapi `home-pages.trustBadges` array.

### 5.7 🔒 Insights (blog) and Case Studies — required pattern

Index page split into two sections:

1. **Latest** — top 3 entries as full-image cards with category eyebrow, title, **publish date** (blog only), Read more arrow
2. **Archive** — every other entry as **compact title-only row** — no thumbnail, no excerpt, no date. Hover slides arrow in, tints title primary blue.

Sort by `publishedDate` desc.

🎨 **Per country:** card aspect ratio, image treatment, hover effect.

### 5.8 🔒 Contact page

Required sections in order:

1. Hero (form-introduction)
2. Two-column: contact info sidebar (email / phone / address) on left, contact form on right
3. **Google Maps iframe embed** below the form section (legacy `?output=embed` URL works without API key — store in `googleMapsEmbed` field of `countries-config.ts`)
4. Footer

Country-specific coordinates resolve via the share URL → embed pattern. AE used `25.2879068, 55.4064871`.

### 5.9 🔒 About page

- Split hero with image-right (or country-specific layout)
- Mission section
- 2x2 values grid with `border-l-2` accent in primary blue, hover changes border to orange
- **No stats section** (forbidden by §2)
- Optional certifications strip
- CTA banner

---

## 6. 🔒 Strapi integration — universal

### 6.1 Content types per region

Every country uses the same content types, filtered by `region={cc}`:

| Content type | Endpoint | Min fields |
|---|---|---|
| HomePage | `/api/home-pages` | metaTitle, metaDescription, heroHeadline, heroSubtext, heroImage, services[], industries[], insights[], faqs[], trustBadges[], footerEmail, footerPhone, footerAddress, footerDescription |
| ServicePage | `/api/service-pages` | slug, title, metaTitle, metaDescription, eyebrow, heroImagePath, body, features[], processSteps[], safetyBullets[], faqs[], reportsBullets[], etc. (see AE schema) |
| BlogPost | `/api/blog-posts` | slug, title, metaTitle, metaDescription, body, excerpt, author, category, tags[], publishedDate, heroImage |
| CaseStudy | `/api/case-studies` | slug, title, body, industry, client, results[], challenge, solution |
| AboutPage | `/api/about-pages` | heroHeadline, missionBody, valuesHeading, values[], certifications[] |
| ContactPage | `/api/contact-pages` | heroHeadline, heroSubtext, formHeading, formSubtext |

### 6.2 Pagination — always

```ts
async function fetchAll<T>(url: string): Promise<T[]> {
  const all: T[] = [];
  let page = 1;
  while (true) {
    const res = await fetch(`${url}&pagination[page]=${page}&pagination[pageSize]=100`, ...);
    const json = await res.json();
    const batch = json.data ?? [];
    all.push(...batch);
    if (batch.length < 100) break;
    page += 1;
  }
  return all;
}
```

Strapi's default 25-per-page silently hides content past the first page. Every helper in `src/lib/strapi*.ts` must paginate.

### 6.3 Image hosting

Hero images, service heroes, blog heroes, case-study heroes — **upload to Strapi media library**, never reference the WordPress source URL directly:

```python
files = {"files": (filename, open(local_path, "rb"), "image/jpeg")}
r = requests.post(f"{STRAPI}/api/upload", headers=AUTH, files=files)
url = r.json()[0]["url"]  # write this URL back into the entry's heroImage field
```

Local cache: `data/{cc}-blog-hero-cache/` so re-runs don't re-download.

### 6.4 Repeatable components — strip ids on PUT

```python
def strip_ids(items):
    return [{k: v for k, v in item.items() if k != "id"} for item in items]
```

Required when updating arrays like `industries[]`, `insights[]`, `faqs[]`, `trustBadges[]`, `processSteps[]`, etc.

---

## 7. 🔒 WP → Strapi migration pipeline (per country)

For any country that has an existing WordPress site, run this 5-step pipeline. Reuse the AE scripts as templates.

### Step 1 — discover URLs

```
scripts/{cc}-wp-blog-discover.py     # uses /wp-json/wp/v2/posts
scripts/{cc}-wp-services-canonical.txt  # client-supplied URL list
scripts/{cc}-discover-missing-services.py  # diff vs current Strapi
```

### Step 2 — Playwright scrape

```
tests/{cc}-wp-blog-scrape.spec.ts
tests/{cc}-wp-service-scrape.spec.ts
```

Per URL:
- Take **full-page screenshot** to `tests/screenshots/wp-{type}/{slug}.png` (proof of source)
- Extract DOM: `h1`, `meta[name=description]`, `meta[property=og:image]`, `meta[property=article:published_time]`, `meta[property=article:tag]`, `.entry-content` innerHTML
- Save to `data/wp-{type}-scrape-report.json`

### Step 3 — shape into Strapi payloads

```
scripts/{cc}-shape-scraped-blogs.py
scripts/{cc}-shape-scraped-services.py
```

- Convert HTML → markdown via `markdownify`
- Strip WP-specific clutter (`.sharedaddy`, `.jp-relatedposts`, scripts, styles, duplicate H1)
- Run cleanup (see §8)
- Build payload matching content type schema
- Per-slug JSON to `data/wp-{type}-extracts/{slug}.json`

### Step 4 — upload hero images

```
scripts/{cc}-blog-upload-hero-images.py
```

- Idempotent: dedupe via `/api/upload/files` filename lookup
- Replace external URL in payload with `https://*.media.strapiapp.com/...`

### Step 5 — POST/UPDATE

```
scripts/{cc}-post-scraped-blogs.py
scripts/{cc}-post-scraped-services.py
```

- Existing slugs: only enrich body / author / publishedDate / heroImage / tags / category. **Never touch metaTitle / metaDescription / seoKeywords on existing entries.**
- Body comparison threshold: only overwrite if WP body is **>1.3× longer** than current Strapi body
- New slugs: full POST + publish via `/actions/publish`
- Flags supported: `--dry-run`, `--update-only`, `--create-only`, `--force-update`
- Always run `--dry-run` first, review, then live

---

## 8. 🔒 Content cleanup standards

When importing or updating any content, run these cleaners. They operate on **the visible field only**, never on `metaTitle/metaDescription/seoKeywords`:

### Markdown artifacts

- Remove empty bold (`****`, `** **`)
- Collapse triple-stars (`***` → `**`)
- Fix glued bold (`**word**Other` → `word Other`)
- Strip orphan `*` at line start
- Strip lone `*` between non-spaces (`tests.*Dynamic` → `tests.Dynamic`)
- Strip `**` from markdown table rows (markdown can't bold across `|` cells)
- Strip `**` around tab-separated content

### HTML entities

Decode: `&amp; &nbsp; &rsquo; &lsquo; &rdquo; &ldquo; &mdash; &ndash; &hellip; &#8217; &#8220; &#8221;`

### Migration artifacts

- `[email protected]` → `info@carelabz.com`
- `/cdn-cgi/l/email-protection...` → `mailto:info@carelabz.com`
- `nullinfo@` → `info@`, `nullmailto:` → `mailto:`

### Whitespace

- Collapse 2+ non-newline whitespace → single space
- Collapse 3+ newlines → 2 newlines

### Title casing

ALL-CAPS titles → Title Case. **Preserve known acronyms** (case-sensitive lookup):
`DEWA, NFPA, IEEE, OSHA, IEC, ETAP, ISO, ANSI, MV, LV, ELV, HV, AC, DC, UAE, USA, UK, EU, RCD, PFC, PSC, MCC, GFCI, OFC, PAT, ATS, FAT, SAT, VFD, CT, VT, HVAC, PLC, SCADA, PV` — extend per country (e.g. add `KSA, SASO` for SA, `JIS` for JP).

Brand suffix strip:
- `(\s*[|–—-]\s*Care\s*[Ll]ab[sz](?:\.com|\.me)?\s*$)` — drop
- `(\s*[|–—-]\s*Carelabs\s+(?:UAE|Dubai|country)\s*$)` — drop

### Ellipses

- Trailing `...` or `…` → `.`
- Mid-text → ` — `

---

## 9. Component primitives — port from AE, restyle per country

### 9.1 Required components

Every country site implements these — file paths use the country code prefix:

| Component | File | Purpose |
|---|---|---|
| ScrollReveal | `src/components/scroll-reveal.tsx` | IntersectionObserver fade-in-up wrapper. Already exists, country-agnostic — **reuse as-is** |
| SectionHeading | `src/components/section-heading.tsx` | eyebrow + title + description pattern. Country-agnostic — reuse |
| RotatingWord | `src/components/rotating-word.tsx` | Hero keyword cycler. Country-agnostic — reuse |
| `{cc}Navbar` | `src/components/{cc}-navbar.tsx` | Per-country styling, must follow §5.1 invariants |
| `{cc}Footer` | `src/components/{cc}-footer.tsx` | Per-country styling, must follow §5.5 invariants |
| `{cc}ContactWidget` | `src/components/{cc}-contact-widget.tsx` | Per-country colors, must follow §5.4 invariants |
| `{cc}CategoryTile` | `src/components/{cc}-category-tile.tsx` | Per-country hover style, must follow §5.3 invariants |
| `cleanServiceTitle` helper | `src/lib/clean-service-title.ts` | Country-agnostic — reuse, extend ACRONYMS set per country |

### 9.2 Animation utilities

Add to `src/app/globals.css` once per project:

```css
@keyframes fadeInUp {
  from { opacity: 0; transform: translateY(30px); }
  to { opacity: 1; transform: translateY(0); }
}
.animate-fade-in-up {
  animation: fadeInUp 0.6s cubic-bezier(0,0.55,0.45,1) forwards;
  opacity: 0;
}
.animation-delay-100 { animation-delay: 100ms; }
.animation-delay-200 { animation-delay: 200ms; }
/* … through 700 */
@media (prefers-reduced-motion: reduce) {
  .animate-fade-in-up { animation: none; opacity: 1; }
}
```

### 9.3 Fluid typography

```css
.text-display-hero { font-size: clamp(2.5rem, 4vw + 1.5rem, 5rem); line-height: 1.05; }
.text-display-lg   { font-size: clamp(2rem, 3vw + 1rem, 3.5rem);    line-height: 1.10; }
.text-display-md   { font-size: clamp(1.5rem, 2vw + 0.75rem, 2.5rem); line-height: 1.15; }
```

🎨 **Per country:** override the clamp values to match the chosen display font's character width (Anton is condensed, Bebas Neue is more condensed, Playfair Display is wide — adjust accordingly).

### 9.4 Adaptive grid columns

When rendering a list of N items in a `gap-px` grid, pick column count by divisibility to avoid empty cells:

```ts
function gridColsClass(count: number): string {
  if (count % 4 === 0) return "md:grid-cols-2 lg:grid-cols-4";
  if (count % 3 === 0) return "md:grid-cols-3 lg:grid-cols-3";
  if (count % 2 === 0) return "md:grid-cols-2 lg:grid-cols-2";
  return "md:grid-cols-2 lg:grid-cols-4";  // accept orphan
}
```

All possible class strings must appear as literals (above) so Tailwind JIT picks them up.

---

## 10. 🔒 QA + verification

Every country must have these test specs (templated from AE):

| Spec | Purpose | Tolerance |
|---|---|---|
| `tests/{cc}-full-qa.spec.ts` | Crawl every URL, screenshot, scan for issues | Logs to `data/{cc}-qa-report.json` |
| `tests/{cc}-post-fix-verify.spec.ts` | Zero-tolerance regex check | No `**`, no `...`, no Cloudflare blob, no `nullinfo@`, no dead-domain links |
| `tests/{cc}-link-audit.spec.ts` | Footer category hrefs resolve | All 4 category URLs return 200 |
| `tests/{cc}-content-quality.spec.ts` | Spot-check formatting | No `&entity;` visible, no markdown tables broken |

Discovery script: `scripts/{cc}-full-qa.py` — paginates through Strapi to get current slug list, writes `data/{cc}-all-urls.json`.

### Cache flake handling

Vercel edge cache can hold stale HTML for ~30s after a Strapi PUT. Verify failures with a direct curl + `Cache-Control: no-cache`. If clean, the failure was a flake.

### Verify-spec exemption list

Things that look like content artifacts but aren't:

- Math formulas (`K * Q`, lines containing `=`) — exempt from asterisk check
- Form labels ending with ` *` (required field marker) — exempt
- UI placeholders matching `^(Select|Choose|Pick|Loading|Searching)\b.*\.{3}$` — exempt from ellipsis check
- Anchor pagination text (`1 2 3 ...`) — exempt from ellipsis check

---

## 11. 🔒 Git workflow

```bash
# After every commit:
git push origin main && git push company main
```

Vercel auto-deploys from the **company** remote. Origin is your personal mirror.

Commit message style (conventional commits):
- `feat(ae): ...` — new functionality
- `fix(ae): ...` — bug fix
- `redesign(ae): ...` — visual / UX rework
- `qa(ae): ...` — test additions
- `docs(ae): ...` — documentation
- `chore(ae): ...` — tooling / config

Every commit ends with:

```
Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
```

---

## 12. 🔒 Anti-patterns — never do these

- ❌ Use `<img>` tags. Always `next/image` with fill + sizes
- ❌ Hardcode service titles or descriptions in page components — must be Strapi-driven (with fallback strings only when Strapi is unreachable)
- ❌ Mutate `metaTitle / metaDescription / seoKeywords` of existing Strapi entries
- ❌ Render full text from a metaDescription that ends with `...` — strip via `cleanDisplayDescription()` for visible rendering
- ❌ Promise specific response times anywhere on the site
- ❌ Add a stats section ("By the Numbers") on any page
- ❌ Fetch from Strapi without `pageSize=100` pagination — first page only is a silent bug
- ❌ Push to Strapi without stripping nested `id` from repeatable components
- ❌ Use Tailwind v4 syntax (`@theme`, `size-*`) — repo is v3
- ❌ Skip the `cleanServiceTitle()` wrapper at render — Strapi entries can drift
- ❌ Reuse the AE color palette or fonts on a different country site
- ❌ Use a different brand mark than the SVG at `/images/logo/carelabs-logo.svg`
- ❌ Add a Strapi schema field via API token (it can write content but not change schemas — needs admin access)
- ❌ Create documentation files (`.md`) unless explicitly requested
- ❌ Mark a task complete when tests fail or build is broken

---

## 13. Adapting this playbook for `/{cc}/`

Concrete steps to add a new country:

1. **`src/lib/countries-config.ts`** — add a new entry. Required fields:
   ```ts
   {{cc}}: {
     cc: "{{cc}}",
     countryName: "...",
     hreflang: "en-{{CC}}",
     servicesIndexPath: "/{{cc}}/services/",
     serviceDetailPattern: "/{{cc}}/services/{slug}/",
     blogIndexPath: "/{{cc}}/blog/",
     blogDetailPattern: "/{{cc}}/blog/{slug}/",
     aboutPath: "/{{cc}}/about/",
     contactPath: "/{{cc}}/contact/",
     caseStudyPath: "/{{cc}}/case-studies/",
     address: "...",
     phone: "+...",
     email: "info@carelabz.com",
     footerDescription: "...",
     services: [/* 6 nav-dropdown entries */],
     standards: [/* country-specific standards */],
     primaryStandard: "...",
     localCodeName: "...",
     localAuthority: "...",
     googleMapsUrl: "https://maps.app.goo.gl/...",
     googleMapsEmbed: "https://maps.google.com/maps?q=...&output=embed",
     whatsappNumber: "...",  // E.164 digits
     socials: { linkedin: "...", facebook: "...", instagram: "...", twitter: "..." },
   },
   ```

2. **`src/app/layout.tsx`** — add the country's font pair:
   ```ts
   const newDisplay = NewDisplay({ subsets: ["latin"], weight: "400", variable: "--font-{{cc}}-display" });
   const newBody    = NewBody({ subsets: ["latin"], variable: "--font-{{cc}}-body" });
   // Apply variables to body className
   ```

3. **`tailwind.config.ts`** — add the country's palette and font family:
   ```ts
   colors: {
     {{cc}}: {
       blue: "#XXXXXX",         // primary blue
       "dark-blue": "#XXXXXX",
       orange: "#XXXXXX",       // orange accent
       "light-gray": "#XXXXXX",
     },
   },
   fontFamily: {
     "{{cc}}-display": ["var(--font-{{cc}}-display)", "..."],
     "{{cc}}-body":    ["var(--font-{{cc}}-body)", "..."],
   },
   ```

4. **`src/app/{{cc}}/`** — create the page tree:
   - `page.tsx` (homepage — design from scratch, do NOT clone AE)
   - `about/page.tsx`, `contact/page.tsx`, `blog/page.tsx`, `blog/[slug]/page.tsx`, `case-studies/page.tsx`, `case-studies/[slug]/page.tsx`, `services/page.tsx`, `services/category/[category]/page.tsx`, `services/[slug]/page.tsx`

5. **`src/components/`** — copy AE components, restyle per country:
   - `{{cc}}-navbar.tsx`, `{{cc}}-footer.tsx`, `{{cc}}-contact-widget.tsx`, `{{cc}}-category-tile.tsx`
   - Import shared primitives unchanged: `ScrollReveal`, `SectionHeading`, `RotatingWord`

6. **`src/lib/{{cc}}-service-categories.ts`** — country-specific slug→category map.

7. **Strapi** — populate region={{cc}} entries (HomePage, About, Contact, services, blogs).

8. **Migration scripts (if WP source exists)** — copy AE scripts, rename to `{{cc}}-*.py`, point at country WP URL, run pipeline (§7).

9. **`next.config.mjs`** — add 301 redirects from old WP URLs if needed.

10. **`src/app/sitemap.ts`** — add country routes.

11. **QA suite** — copy AE test specs, rename, point at country routes.

12. **`tests/screenshots/{{cc}}/`** — capture every page.

13. **Push to both remotes** (§11).

---

## 14. Reference — AE deployment

The first reference build:
- Live: `https://carelabz-website-experiment1-ivory.vercel.app/ae/`
- 211 pages (3 core + 1 services landing + 4 category + 100 service detail + 1 blog index + 100+ blog posts + 1 case studies index + 1+ case study details)
- Full URL inventory in `data/ae-review-urls.md`
- Color palette: `#2575B6` blue / `#094D76` dark blue / `#F15C30` orange
- Fonts: Anton (display) + Inter (body)

**Do not** clone the AE design verbatim for another country. Use it only as a structural reference for what content goes where and which invariants apply.

---

## 15. When in doubt

- Read CLAUDE.md (project root) — that's the foundational tech-stack contract
- Check the AE pages in `src/app/ae/` for working examples of every pattern
- Check `data/ae-review-urls.md` for the full live URL list to compare against
- Ask before deviating from any 🔒 rule. Per-country variation (🎨) is encouraged.

---

_Last updated when AE shipped (commit `1f08575`). Keep this file in sync as new universal patterns emerge._
