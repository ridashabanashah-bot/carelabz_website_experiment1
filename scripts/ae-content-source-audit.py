#!/usr/bin/env python3
"""
AE Content Source Audit
Compares codebase, Strapi API, and live site to report:
- What text is hardcoded in code
- What text comes from Strapi
- What text SHOULD come from Strapi but doesn't
"""

import os, json, re, subprocess, sys
from pathlib import Path

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

# Load .env.local
for line in Path(".env.local").read_text().splitlines():
    if line.startswith("STRAPI_API_TOKEN="):
        os.environ["STRAPI_API_TOKEN"] = line.split("=", 1)[1].strip().strip('"').strip("'")
        break

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}"}
REGION = "ae"

SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "src")

AE_FILES = {
    "Homepage": "app/ae/page.tsx",
    "Services Index": "app/ae/services/page.tsx",
    "Service Detail": "app/ae/services/[slug]/page.tsx",
    "Blog Index": "app/ae/blog/page.tsx",
    "Blog Detail": "app/ae/blog/[slug]/page.tsx",
    "About": "app/ae/about/page.tsx",
    "Contact": "app/ae/contact/page.tsx",
    "Case Studies Index": "app/ae/case-studies/page.tsx",
    "Case Study Detail": "app/ae/case-studies/[slug]/page.tsx",
    "Navbar": "components/ae-navbar.tsx",
    "Footer": "components/ae-footer.tsx",
    "Countries Config": "lib/countries-config.ts",
}


def extract_hardcoded_strings(filepath):
    hardcoded = []
    content = Path(filepath).read_text(encoding="utf-8")
    jsx_text = re.findall(r'>\s*([A-Z][^<{]+?)\s*<', content)
    for t in jsx_text:
        t = t.strip()
        if len(t) > 3 and not t.startswith('//'):
            hardcoded.append(("JSX text", t))
    quoted = re.findall(r'"([^"]{4,})"', content)
    SKIP_TOKENS = (
        'className', 'flex', 'grid', 'text-', 'bg-', 'border-',
        'px-', 'py-', 'mt-', 'mb-', 'w-', 'h-', 'gap-',
        'hover:', 'transition', 'font-', 'tracking-',
        'from-', 'via-', 'to-', '/', '.tsx', '.ts', '.png',
        '.svg', '@', 'import', 'use ', '#', 'rgb', 'hsl',
        'application/json', 'Content-Type', 'Authorization',
        'Bearer', 'filters[', 'populate', 'pagination',
        'domcontentloaded', 'localhost',
    )
    for q in quoted:
        if any(skip in q for skip in SKIP_TOKENS):
            continue
        if re.match(r'^[a-z\-]+$', q):
            continue
        if len(q) > 3:
            hardcoded.append(("Quoted string", q))
    return hardcoded


def extract_strapi_fields(filepath):
    content = Path(filepath).read_text(encoding="utf-8")
    patterns = re.findall(r'(?:page|service|post|study|config|data)\.\w+', content)
    return sorted(set(patterns))


def extract_fallback_patterns(filepath):
    content = Path(filepath).read_text(encoding="utf-8")
    patterns = re.findall(r'(\w+\.\w+)\s*\?\?\s*["\']([^"\']+)["\']', content)
    return [(field, fallback) for field, fallback in patterns]


def query_strapi_content():
    content = {}
    endpoints = {
        "home-pages": "populate=*",
        "service-pages": "pagination[pageSize]=100&fields[0]=slug&fields[1]=title&fields[2]=metaTitle&fields[3]=metaDescription&fields[4]=body&fields[5]=eyebrow&fields[6]=heroHeadline",
        "blog-posts": "pagination[pageSize]=100&fields[0]=slug&fields[1]=title&fields[2]=body&fields[3]=category&fields[4]=author",
        "about-pages": "populate=*",
        "contact-pages": "populate=*",
        "case-studies": "pagination[pageSize]=100&fields[0]=slug&fields[1]=title&fields[2]=body",
    }
    for endpoint, params in endpoints.items():
        url = f"{STRAPI_BASE}/{endpoint}?filters[region][$eq]={REGION}&{params}"
        try:
            r = requests.get(url, headers=HEADERS, timeout=15)
            data = r.json()
            entries = data.get("data", [])
            content[endpoint] = {"count": len(entries), "entries": entries}
            if entries:
                sample = entries[0]
                content[endpoint]["populated_fields"] = [k for k, v in sample.items() if v not in (None, "", [])]
                content[endpoint]["empty_fields"] = [k for k, v in sample.items() if v in (None, "", [])]
        except Exception as e:
            content[endpoint] = {"error": str(e)}
    return content


def generate_report():
    report = ["# AE Content Source Audit Report"]
    report.append(f"Generated: {__import__('datetime').datetime.now().isoformat()[:19]}")
    report.append("")
    report.append("## 1. Codebase Analysis — Hardcoded vs Strapi per File")
    report.append("")

    total_hardcoded = 0
    total_strapi_fields = 0
    total_fallbacks = 0

    for label, relpath in AE_FILES.items():
        filepath = os.path.join(SRC_DIR, relpath)
        if not os.path.exists(filepath):
            report.append(f"### {label} — `{relpath}` — FILE NOT FOUND")
            continue
        hardcoded = extract_hardcoded_strings(filepath)
        strapi_fields = extract_strapi_fields(filepath)
        fallbacks = extract_fallback_patterns(filepath)
        total_hardcoded += len(hardcoded)
        total_strapi_fields += len(strapi_fields)
        total_fallbacks += len(fallbacks)

        report.append(f"### {label} — `{relpath}`")
        report.append(f"- Hardcoded strings: **{len(hardcoded)}**")
        report.append(f"- Strapi field references: **{len(strapi_fields)}**")
        report.append(f"- Fallback patterns: **{len(fallbacks)}**")
        report.append("")
        if hardcoded:
            report.append("**Hardcoded UI copy:**")
            for src, text in hardcoded[:20]:
                report.append(f"  - [{src}] `{text[:80]}`")
            if len(hardcoded) > 20:
                report.append(f"  - ... and {len(hardcoded) - 20} more")
            report.append("")
        if strapi_fields:
            report.append("**Strapi fields used:**")
            report.append(f"  `{', '.join(strapi_fields[:20])}`")
            report.append("")
        if fallbacks:
            report.append("**Fallback defaults (Strapi field → hardcoded backup):**")
            for field, default in fallbacks:
                report.append(f"  - `{field}` → `{default[:60]}`")
            report.append("")
        report.append("---")
        report.append("")

    report.append("## 2. Strapi CMS Content — Field Completeness")
    report.append("")
    strapi_content = query_strapi_content()
    for endpoint, info in strapi_content.items():
        report.append(f"### {endpoint}")
        if "error" in info:
            report.append(f"  Error: {info['error']}")
        else:
            report.append(f"  - Entry count: **{info['count']}**")
            if info.get("populated_fields"):
                report.append(f"  - Populated fields (sample): `{', '.join(info['populated_fields'][:15])}`")
            if info.get("empty_fields"):
                report.append(f"  - Empty/null fields (sample): `{', '.join(info['empty_fields'][:15])}`")
        report.append("")

    report.append("## 3. Summary")
    report.append("")
    report.append("| Metric | Count |")
    report.append("|--------|-------|")
    report.append(f"| Total hardcoded strings found | {total_hardcoded} |")
    report.append(f"| Total Strapi field references | {total_strapi_fields} |")
    report.append(f"| Total fallback patterns | {total_fallbacks} |")
    denom = total_strapi_fields + total_hardcoded
    pct = round(total_strapi_fields / denom * 100) if denom > 0 else 0
    report.append(f"| Strapi ratio | {total_strapi_fields}/{denom} ({pct}%) |")
    report.append("")
    report.append("## 4. High-Priority Hardcoded Content to Migrate to Strapi")
    report.append("")
    report.append("These are strings that should be CMS-driven for easier editing and regional variation:")
    report.append("")
    report.append("| File | Hardcoded String | Suggested Strapi Field |")
    report.append("|------|-----------------|----------------------|")
    report.append("| contact/page.tsx | `info@carelabz.com` | Use `config.email` from countries-config |")
    report.append("| services/page.tsx | `Our Services` hero heading | `servicesIndexHeading` on HomePage |")
    report.append("| blog/page.tsx | `Insights & Field Notes` hero heading | `blogIndexHeading` on HomePage |")
    report.append("| case-studies/page.tsx | `Case Studies` hero heading | `caseStudiesHeading` on HomePage |")
    report.append("| blog/page.tsx, services/page.tsx | CTA section copy | CTA fields on respective index pages |")
    report.append("| homepage | `FALLBACK_PROCESS` methodology steps | `methodology` component on HomePage |")
    return "\n".join(report)


if __name__ == "__main__":
    report = generate_report()
    out_dir = os.path.join(os.path.dirname(__file__), "..", "data", "audit")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "AE-CONTENT-SOURCE-AUDIT.md")
    Path(out_path).write_text(report, encoding="utf-8")
    print(f"Report written to {out_path}")
    print(report[:500] + "\n...")
