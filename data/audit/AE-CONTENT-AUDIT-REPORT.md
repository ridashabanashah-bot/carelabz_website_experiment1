# UAE (`ae`) Strapi Content Audit Report

_Generated: 2026-04-26_  
_Branch: `audit/ae-content-check`_  
_Source: Strapi Cloud `region=ae` filtered queries; Search Console reference list inlined from prompt (`data/search-console/Pages.csv` not present in repo)_

---

## 1. Summary Dashboard

```
Home pages:      0        MISSING
Service pages:   9        (0 with empty body)
Blog posts:      0        MISSING
Case studies:    1
About page:      0        MISSING
Contact page:    0        MISSING
```

## 2. Content Health Matrix

| # | Type | Title | Slug | Body | MetaT | MetaD | FAQs | Steps | Hero |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| 1 | service | Arc Flash Study & Analysis in Dubai, UAE | arc-flash-study | OK (209) | OK | OK | 10 | 6 | OK |
| 2 | service | Arc Flash Study & Analysis in Dubai, UAE | arc-flash-study-ae | OK (1242) | OK | OK | 10 | 6 | OK |
| 3 | service | Thermographic Inspection Services in Dubai, UAE | thermographic-inspection-ae | OK (1259) | OK | OK | 10 | 6 | OK |
| 4 | service | Protection Coordination Study in Dubai, UAE | protection-coordination-study-ae | OK (1248) | OK | OK | 10 | 6 | OK |
| 5 | service | MCC & Switchgear Assessment in Dubai, UAE | mcc-switchgear-assessment-ae | OK (1255) | OK | OK | 10 | 6 | OK |
| 6 | service | LV Panel Inspection Services in Dubai, UAE | lv-panel-inspection-ae | OK (1300) | OK | OK | 10 | 6 | OK |
| 7 | service | Power Quality Study Services in Dubai, UAE | power-quality-study-ae | OK (1277) | OK | OK | 10 | 6 | OK |
| 8 | service | Electrical Safety Audit Services in Dubai, UAE | electrical-safety-audit-ae | OK (1290) | OK | OK | 10 | 6 | OK |
| 9 | service | Compliance-as-a-Service (CaaS) in Dubai, UAE | compliance-as-a-service-ae | OK (1267) | OK | OK | 10 | 6 | OK |
| 10 | case-study | Coca-Cola Abu Dhabi: Arc Flash Study for Industrial Bottling... | coca-cola-abu-dhabi-arc-flash-study | OK (2276) | OK | OK | - | - | OK |

## 3. WordPress Artifact Cleanup

_None found. All titles are clean (no `| Carelabs`, `Archives`, `Author at` suffixes)._

**Slug-naming inconsistency** — service entries without the `-ae` regional suffix expected by `src/app/ae/[slug]/page.tsx`'s fallback chain:

- `arc-flash-study` — likely duplicate of `arc-flash-study-ae` (pre-cleanup leftover; consider unpublishing or deleting to avoid serving the shorter ~209-char body version)

## 4. Search Console Gap Analysis (top 13 traffic pages)

> `data/search-console/Pages.csv` was not present in the repo. The 13 critical pages explicitly listed in the audit prompt are used as the reference set.

| Rank | URL Path | Clicks | Strapi Match? | Body Empty? | Content Type |
| --- | --- | --- | --- | --- | --- |
| 1 | /megger-test-performed/ | 17,755 | NO | YES | - |
| 2 | /contact-resistance-test/ | 6,020 | NO | YES | - |
| 3 | /earth-fault-loop-impedance-test/ | 5,389 | NO | YES | - |
| 4 | /polarity-test/ | 4,715 | NO | YES | - |
| 5 | /low-voltage-switchgear/ | 3,651 | NO | YES | - |
| 6 | /insulation-resistance-test/ | 2,898 | NO | YES | - |
| 7 | /arc-flash-analysis/ | 2,822 | NO | YES | - |
| 8 | /power-system-protection-coordination-study/ | 2,736 | NO | YES | - |
| 9 | /motor-testing-services/ | 2,372 | NO | YES | - |
| 10 | /short-circuit-analysis-study/ | 2,102 | NO | YES | - |
| 11 | /cable-testing-services/ | 1,930 | NO | YES | - |
| 12 | /breaker-testing-services/ | 1,686 | NO | YES | - |
| 13 | / | 1,324 | NO | YES | - |

## 5. Migration Priority List

All 13 reference pages ranked by Search Console clicks. P0 = top 10 must-have-before-go-live; P1 = remaining 3.

| Priority | Rank | URL Path | Clicks | Status |
| --- | --- | --- | --- | --- |
| P0 | 1 | /megger-test-performed/ | 17,755 | MISSING — create or migrate from WP |
| P0 | 2 | /contact-resistance-test/ | 6,020 | MISSING — create or migrate from WP |
| P0 | 3 | /earth-fault-loop-impedance-test/ | 5,389 | MISSING — create or migrate from WP |
| P0 | 4 | /polarity-test/ | 4,715 | MISSING — create or migrate from WP |
| P0 | 5 | /low-voltage-switchgear/ | 3,651 | MISSING — create or migrate from WP |
| P0 | 6 | /insulation-resistance-test/ | 2,898 | MISSING — create or migrate from WP |
| P0 | 7 | /arc-flash-analysis/ | 2,822 | MISSING — create or migrate from WP |
| P0 | 8 | /power-system-protection-coordination-study/ | 2,736 | MISSING — create or migrate from WP |
| P0 | 9 | /motor-testing-services/ | 2,372 | MISSING — create or migrate from WP |
| P0 | 10 | /short-circuit-analysis-study/ | 2,102 | MISSING — create or migrate from WP |
| P1 | 11 | /cable-testing-services/ | 1,930 | MISSING — create or migrate from WP |
| P1 | 12 | /breaker-testing-services/ | 1,686 | MISSING — create or migrate from WP |
| P1 | 13 | / | 1,324 | MISSING — create or migrate from WP |

## 6. Action Items

### Content to CREATE (does not exist in Strapi)

- **HomePage** for `region=ae` — site cannot render `/ae/` without it
- **BlogPost** entries — 0 posts in Strapi; the entire UAE blog index would be empty
- **AboutPage** for `region=ae`
- **ContactPage** for `region=ae`

Plus, missing service pages from Search Console top-13 (each is a high-traffic WP URL with no Strapi match):

- `/megger-test-performed/` — 17,755 clicks/period — needs new ServicePage entry
- `/contact-resistance-test/` — 6,020 clicks/period — needs new ServicePage entry
- `/earth-fault-loop-impedance-test/` — 5,389 clicks/period — needs new ServicePage entry
- `/polarity-test/` — 4,715 clicks/period — needs new ServicePage entry
- `/low-voltage-switchgear/` — 3,651 clicks/period — needs new ServicePage entry
- `/insulation-resistance-test/` — 2,898 clicks/period — needs new ServicePage entry
- `/arc-flash-analysis/` — 2,822 clicks/period — needs new ServicePage entry
- `/power-system-protection-coordination-study/` — 2,736 clicks/period — needs new ServicePage entry
- `/motor-testing-services/` — 2,372 clicks/period — needs new ServicePage entry
- `/short-circuit-analysis-study/` — 2,102 clicks/period — needs new ServicePage entry
- `/cable-testing-services/` — 1,930 clicks/period — needs new ServicePage entry
- `/breaker-testing-services/` — 1,686 clicks/period — needs new ServicePage entry

### Content to FIX (exists but incomplete)

- **[service]** `arc-flash-study` — body very short (209 chars) — likely placeholder or duplicate

### Content to CLEAN

- **[service]** `arc-flash-study` — unpublish/delete to avoid serving stale ~209-char body (canonical entry is `arc-flash-study-ae`)

### 301 redirects needed (WordPress URL → new URL)

The 13 top-traffic URLs above are all live on the legacy WP site at the listed paths. Once UAE Strapi pages exist at `/ae/<slug>/`, add 301 redirects in `next.config.mjs`:

```js
// inside redirects(), add a UAE block
...pair("/megger-test-performed", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/contact-resistance-test", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/earth-fault-loop-impedance-test", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/polarity-test", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/low-voltage-switchgear", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/insulation-resistance-test", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/arc-flash-analysis", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/power-system-protection-coordination-study", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/motor-testing-services", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/short-circuit-analysis-study", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/cable-testing-services", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
...pair("/breaker-testing-services", "/ae/contact-us/  // TODO: replace once Strapi entry exists"),
```

---

## Notes

- Strapi token sourced from `.env.local`; 6 endpoints fetched via Python `urllib` (curl bash globbing mangles Strapi's `[$eq]` filter syntax).
- All raw API responses saved as `data/audit/ae-*.json`.
- `data/search-console/Pages.csv` does not exist in the repo — analysis falls back to the 13 critical pages explicitly listed in the audit prompt.
