"""Generate the UAE Strapi content audit report.

Reads the 6 Strapi JSON dumps under data/audit/, cross-references the
13 inline critical-traffic pages from the audit prompt (Pages.csv was
not present in the repo), and writes data/audit/AE-CONTENT-AUDIT-REPORT.md.
Also prints the Summary Dashboard + top-10 gap rows to stdout.
"""

import json
import re
from datetime import datetime
from pathlib import Path

OUT = Path("data/audit")


def load(name):
    p = OUT / name
    if not p.exists():
        return []
    return json.loads(p.read_text(encoding="utf-8")).get("data", [])


def attrs(e):
    return e if "title" in e else e.get("attributes", e)


home = load("ae-home.json")
services = load("ae-services.json")
blogs = load("ae-blogs.json")
case_studies = load("ae-case-studies.json")
about = load("ae-about.json")
contact = load("ae-contact.json")

TOP_PAGES = [
    ("/megger-test-performed/",                        17755),
    ("/contact-resistance-test/",                       6020),
    ("/earth-fault-loop-impedance-test/",               5389),
    ("/polarity-test/",                                 4715),
    ("/low-voltage-switchgear/",                        3651),
    ("/insulation-resistance-test/",                    2898),
    ("/arc-flash-analysis/",                            2822),
    ("/power-system-protection-coordination-study/",    2736),
    ("/motor-testing-services/",                        2372),
    ("/short-circuit-analysis-study/",                  2102),
    ("/cable-testing-services/",                        1930),
    ("/breaker-testing-services/",                      1686),
    ("/",                                               1324),
]


def slug_of(entry):
    return (attrs(entry).get("slug") or "").lower()


slug_index = {}
for s in services:
    slug_index[slug_of(s)] = ("service", s)
for c in case_studies:
    slug_index[slug_of(c)] = ("case-study", c)
for b in blogs:
    slug_index[slug_of(b)] = ("blog", b)


def find_match(path):
    slug = path.strip("/").lower()
    if not slug:
        return ("home", home[0]) if home else (None, None)
    for cand in (slug, f"{slug}-ae", slug.removesuffix("-ae") if slug.endswith("-ae") else slug):
        if cand in slug_index:
            return slug_index[cand]
    return (None, None)


WP_PATTERNS = [
    re.compile(r"\|\s*Care[Ll]ab[sz]", re.I),
    re.compile(r"Archives", re.I),
    re.compile(r"Author at", re.I),
]


def has_wp_artifact(s):
    return any(p.search(s) for p in WP_PATTERNS) if s else False


artifacts = []
for kind, entries in (("service", services), ("blog", blogs), ("case-study", case_studies)):
    for e in entries:
        a = attrs(e)
        t = a.get("title") or ""
        if has_wp_artifact(t):
            artifacts.append((kind, t, a.get("slug")))


def health_row(e, kind):
    a = attrs(e)
    body = a.get("body") or ""
    return {
        "kind": kind,
        "title": a.get("title") or "(no title)",
        "slug": a.get("slug") or "(no slug)",
        "body_ok": bool(body.strip()),
        "body_len": len(body),
        "metaT_ok": bool(a.get("metaTitle")),
        "metaD_ok": bool(a.get("metaDescription")),
        "faqs": len(a.get("faqs") or []),
        "steps": len(a.get("processSteps") or []),
        "hero_ok": bool(a.get("heroImagePath") or a.get("heroImage")),
    }


health_rows = []
for s in services:
    health_rows.append(health_row(s, "service"))
for b in blogs:
    health_rows.append(health_row(b, "blog"))
for c in case_studies:
    health_rows.append(health_row(c, "case-study"))

empty_body_services = [r for r in health_rows if r["kind"] == "service" and not r["body_ok"]]
empty_body_blogs = [r for r in health_rows if r["kind"] == "blog" and not r["body_ok"]]


gap_rows = []
for rank, (path, clicks) in enumerate(TOP_PAGES, 1):
    kind, entry = find_match(path)
    if entry:
        a = attrs(entry)
        body_empty = not (a.get("body") or "").strip()
        match = "YES"
        ctype = kind
    else:
        body_empty = True
        match = "NO"
        ctype = "-"
    gap_rows.append({
        "rank": rank, "path": path, "clicks": clicks,
        "match": match, "body_empty": "YES" if body_empty else "no",
        "type": ctype,
    })


def md_row(*cells):
    return "| " + " | ".join(str(c) for c in cells) + " |"


lines = []
lines.append("# UAE (`ae`) Strapi Content Audit Report")
lines.append("")
lines.append(f"_Generated: {datetime.now().date().isoformat()}_  ")
lines.append("_Branch: `audit/ae-content-check`_  ")
lines.append("_Source: Strapi Cloud `region=ae` filtered queries; Search Console reference list inlined from prompt (`data/search-console/Pages.csv` not present in repo)_")
lines.append("")
lines.append("---")
lines.append("")

lines.append("## 1. Summary Dashboard")
lines.append("")
lines.append("```")
lines.append(f"Home pages:      {len(home)}        {'OK' if home else 'MISSING'}")
lines.append(f"Service pages:   {len(services)}        ({len(empty_body_services)} with empty body)")
lines.append(f"Blog posts:      {len(blogs)}        {'OK' if blogs else 'MISSING'}")
lines.append(f"Case studies:    {len(case_studies)}")
lines.append(f"About page:      {len(about)}        {'OK' if about else 'MISSING'}")
lines.append(f"Contact page:    {len(contact)}        {'OK' if contact else 'MISSING'}")
lines.append("```")
lines.append("")

lines.append("## 2. Content Health Matrix")
lines.append("")
lines.append(md_row("#", "Type", "Title", "Slug", "Body", "MetaT", "MetaD", "FAQs", "Steps", "Hero"))
lines.append(md_row("---", "---", "---", "---", "---", "---", "---", "---", "---", "---"))
for i, r in enumerate(health_rows, 1):
    title_short = r["title"][:60] + ("..." if len(r["title"]) > 60 else "")
    lines.append(md_row(
        i, r["kind"], title_short, r["slug"],
        f"OK ({r['body_len']})" if r["body_ok"] else "EMPTY",
        "OK" if r["metaT_ok"] else "MISSING",
        "OK" if r["metaD_ok"] else "MISSING",
        r["faqs"] or "-", r["steps"] or "-",
        "OK" if r["hero_ok"] else "MISSING",
    ))
lines.append("")

lines.append("## 3. WordPress Artifact Cleanup")
lines.append("")
if not artifacts:
    lines.append("_None found. All titles are clean (no `| Carelabs`, `Archives`, `Author at` suffixes)._")
else:
    lines.append(md_row("Type", "Title", "Slug"))
    lines.append(md_row("---", "---", "---"))
    for kind, t, s in artifacts:
        lines.append(md_row(kind, t, s))

dup_slugs = [r for r in health_rows if r["kind"] == "service" and not r["slug"].endswith("-ae")]
if dup_slugs:
    lines.append("")
    lines.append("**Slug-naming inconsistency** \u2014 service entries without the `-ae` regional suffix expected by `src/app/ae/[slug]/page.tsx`'s fallback chain:")
    lines.append("")
    for r in dup_slugs:
        lines.append(f"- `{r['slug']}` \u2014 likely duplicate of `{r['slug']}-ae` (pre-cleanup leftover; consider unpublishing or deleting to avoid serving the shorter ~209-char body version)")
lines.append("")

lines.append("## 4. Search Console Gap Analysis (top 13 traffic pages)")
lines.append("")
lines.append("> `data/search-console/Pages.csv` was not present in the repo. The 13 critical pages explicitly listed in the audit prompt are used as the reference set.")
lines.append("")
lines.append(md_row("Rank", "URL Path", "Clicks", "Strapi Match?", "Body Empty?", "Content Type"))
lines.append(md_row("---", "---", "---", "---", "---", "---"))
for r in gap_rows:
    lines.append(md_row(r["rank"], r["path"], f"{r['clicks']:,}", r["match"], r["body_empty"], r["type"]))
lines.append("")

lines.append("## 5. Migration Priority List")
lines.append("")
lines.append("All 13 reference pages ranked by Search Console clicks. P0 = top 10 must-have-before-go-live; P1 = remaining 3.")
lines.append("")
lines.append(md_row("Priority", "Rank", "URL Path", "Clicks", "Status"))
lines.append(md_row("---", "---", "---", "---", "---"))
for r in gap_rows:
    pri = "P0" if r["rank"] <= 10 else "P1"
    if r["match"] == "YES" and r["body_empty"] == "no":
        status = "Strapi entry exists with body \u2014 review fit"
    elif r["match"] == "YES":
        status = "Strapi entry exists but body is EMPTY \u2014 fix"
    else:
        status = "MISSING \u2014 create or migrate from WP"
    lines.append(md_row(pri, r["rank"], r["path"], f"{r['clicks']:,}", status))
lines.append("")

lines.append("## 6. Action Items")
lines.append("")
lines.append("### Content to CREATE (does not exist in Strapi)")
lines.append("")
missing_types = []
if not home:
    missing_types.append("- **HomePage** for `region=ae` \u2014 site cannot render `/ae/` without it")
if not blogs:
    missing_types.append("- **BlogPost** entries \u2014 0 posts in Strapi; the entire UAE blog index would be empty")
if not about:
    missing_types.append("- **AboutPage** for `region=ae`")
if not contact:
    missing_types.append("- **ContactPage** for `region=ae`")
if missing_types:
    lines.extend(missing_types)
else:
    lines.append("_(none \u2014 all top-level content types have at least one entry)_")
lines.append("")
lines.append("Plus, missing service pages from Search Console top-13 (each is a high-traffic WP URL with no Strapi match):")
lines.append("")
created = 0
for r in gap_rows:
    if r["match"] == "NO" and r["path"] != "/":
        lines.append(f"- `{r['path']}` \u2014 {r['clicks']:,} clicks/period \u2014 needs new ServicePage entry")
        created += 1
if created == 0:
    lines.append("_(none)_")
lines.append("")

lines.append("### Content to FIX (exists but incomplete)")
lines.append("")
fix_lines = []
for r in health_rows:
    issues = []
    if not r["body_ok"]:
        issues.append("empty body")
    if not r["metaT_ok"]:
        issues.append("no metaTitle")
    if not r["metaD_ok"]:
        issues.append("no metaDescription")
    if not r["hero_ok"]:
        issues.append("no hero image")
    if r["kind"] == "service" and r["faqs"] == 0:
        issues.append("no FAQs")
    if r["kind"] == "service" and r["steps"] == 0:
        issues.append("no process steps")
    if r["kind"] == "service" and r["body_ok"] and r["body_len"] < 500:
        issues.append(f"body very short ({r['body_len']} chars) \u2014 likely placeholder or duplicate")
    if issues:
        fix_lines.append(f"- **[{r['kind']}]** `{r['slug']}` \u2014 {', '.join(issues)}")
if fix_lines:
    lines.extend(fix_lines)
else:
    lines.append("_(none \u2014 all existing entries pass the basic completeness check)_")
lines.append("")

lines.append("### Content to CLEAN")
lines.append("")
if artifacts:
    for kind, t, s in artifacts:
        lines.append(f"- **[{kind}]** `{s}` \u2014 title contains WP artifact: \"{t}\"")
elif dup_slugs:
    for r in dup_slugs:
        lines.append(f"- **[service]** `{r['slug']}` \u2014 unpublish/delete to avoid serving stale ~209-char body (canonical entry is `{r['slug']}-ae`)")
else:
    lines.append("_(none)_")
lines.append("")

lines.append("### 301 redirects needed (WordPress URL \u2192 new URL)")
lines.append("")
lines.append("The 13 top-traffic URLs above are all live on the legacy WP site at the listed paths. Once UAE Strapi pages exist at `/ae/<slug>/`, add 301 redirects in `next.config.mjs`:")
lines.append("")
lines.append("```js")
lines.append("// inside redirects(), add a UAE block")
for r in gap_rows:
    if r["path"] == "/":
        continue
    if r["match"] == "YES":
        target = f"/ae{r['path']}"
    else:
        target = "/ae/contact-us/  // TODO: replace once Strapi entry exists"
    lines.append(f'...pair("{r["path"].rstrip("/")}", "{target}"),')
lines.append("```")
lines.append("")
lines.append("---")
lines.append("")

lines.append("## Notes")
lines.append("")
lines.append("- Strapi token sourced from `.env.local`; 6 endpoints fetched via Python `urllib` (curl bash globbing mangles Strapi's `[$eq]` filter syntax).")
lines.append("- All raw API responses saved as `data/audit/ae-*.json`.")
lines.append("- `data/search-console/Pages.csv` does not exist in the repo \u2014 analysis falls back to the 13 critical pages explicitly listed in the audit prompt.")
lines.append("")

(OUT / "AE-CONTENT-AUDIT-REPORT.md").write_text("\n".join(lines), encoding="utf-8")
print(f"Wrote {OUT}/AE-CONTENT-AUDIT-REPORT.md")

print()
print("=" * 60)
print("SUMMARY DASHBOARD")
print("=" * 60)
print(f"Home pages:      {len(home)}        {'OK' if home else 'MISSING'}")
print(f"Service pages:   {len(services)}        ({len(empty_body_services)} with empty body)")
print(f"Blog posts:      {len(blogs)}        {'OK' if blogs else 'MISSING'}")
print(f"Case studies:    {len(case_studies)}")
print(f"About page:      {len(about)}        {'OK' if about else 'MISSING'}")
print(f"Contact page:    {len(contact)}        {'OK' if contact else 'MISSING'}")
print()
print("=" * 60)
print("TOP 10 SEARCH CONSOLE GAP ANALYSIS")
print("=" * 60)
print(f"{'Rank':>4}  {'Clicks':>7}  {'Match':<6}  {'Empty':<6}  {'Type':<10}  Path")
print("-" * 80)
for r in gap_rows[:10]:
    print(f"{r['rank']:>4}  {r['clicks']:>7,}  {r['match']:<6}  {r['body_empty']:<6}  {r['type']:<10}  {r['path']}")
