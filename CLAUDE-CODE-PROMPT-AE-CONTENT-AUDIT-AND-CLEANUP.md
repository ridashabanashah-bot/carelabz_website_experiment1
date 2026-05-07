# Claude Code Prompt — AE Content Audit & Strapi Cleanup

Copy everything below the line into Claude Code.

---

## Task: Audit hardcoded vs Strapi content + clean up Strapi formatting issues

Read `CLAUDE.md` before starting.

**No new branch needed — commit directly to `main`.**

This prompt has two parts:

- **Part 1:** Generate a report showing exactly what is hardcoded vs fetched from Strapi on every AE page
- **Part 2:** Scan all Strapi content for the AE region and fix formatting issues (stray `**`, `##`, broken markdown, encoding artifacts)

---

## Part 1 — Hardcoded vs Strapi Audit

### Step 1A: Build the audit script

Create `scripts/ae-content-source-audit.py` that:

1. Reads every AE page file from the codebase
2. Queries every AE entry from Strapi
3. Compares what's rendered on the live Vercel site vs what's in Strapi
4. Produces a report

```python
#!/usr/bin/env python3
"""
AE Content Source Audit
Compares codebase, Strapi API, and live site to report:
- What text is hardcoded in code
- What text comes from Strapi
- What text SHOULD come from Strapi but doesn't
"""

import os, json, re, subprocess, sys

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

# --- Config ---
STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}"}
REGION = "ae"

SRC_DIR = os.path.join(os.path.dirname(__file__), "..", "src")

# --- Files to audit ---
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
    """Extract quoted strings from JSX that look like UI copy (not CSS classes, imports, etc.)"""
    hardcoded = []
    with open(filepath, 'r') as f:
        content = f.read()

    # Find strings in JSX text content (between > and <)
    jsx_text = re.findall(r'>\s*([A-Z][^<{]+?)\s*<', content)
    for t in jsx_text:
        t = t.strip()
        if len(t) > 3 and not t.startswith('//'):
            hardcoded.append(("JSX text", t))

    # Find quoted strings that look like copy (not CSS, paths, or code)
    quoted = re.findall(r'"([^"]{4,})"', content)
    for q in quoted:
        # Skip CSS classes, paths, imports, attributes
        if any(skip in q for skip in ['className', 'flex', 'grid', 'text-', 'bg-', 'border-',
                                        'px-', 'py-', 'mt-', 'mb-', 'w-', 'h-', 'gap-',
                                        'hover:', 'transition', 'font-', 'tracking-',
                                        'from-', 'via-', 'to-', '/', '.tsx', '.ts', '.png',
                                        '.svg', '@', 'import', 'use ', '#', 'rgb', 'hsl',
                                        'application/json', 'Content-Type', 'Authorization',
                                        'Bearer', 'filters[', 'populate', 'pagination',
                                        'domcontentloaded', 'localhost']):
            continue
        if re.match(r'^[a-z\-]+$', q):  # skip lowercase-only (likely CSS or slugs)
            continue
        if len(q) > 3:
            hardcoded.append(("Quoted string", q))

    return hardcoded

def extract_strapi_fields(filepath):
    """Find all references to Strapi data fields (page.*, service.*, post.*, study.*, config.*)"""
    fields = []
    with open(filepath, 'r') as f:
        content = f.read()

    # Match patterns like page.heroHeadline, service.title, post.body, config.services
    patterns = re.findall(r'(?:page|service|post|study|config|data)\.\w+', content)
    fields = list(set(patterns))
    return sorted(fields)

def extract_fallback_patterns(filepath):
    """Find ?? fallback patterns (Strapi field with hardcoded default)"""
    fallbacks = []
    with open(filepath, 'r') as f:
        content = f.read()

    # Match: something.field ?? "fallback text"
    patterns = re.findall(r'(\w+\.\w+)\s*\?\?\s*["\']([^"\']+)["\']', content)
    for field, fallback in patterns:
        fallbacks.append((field, fallback))

    return fallbacks

def query_strapi_content():
    """Fetch all AE content from Strapi to see what fields are populated"""
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
            content[endpoint] = {
                "count": len(entries),
                "entries": entries,
            }

            # Check field completeness
            if entries:
                sample = entries[0]
                populated = [k for k, v in sample.items() if v is not None and v != "" and v != []]
                empty = [k for k, v in sample.items() if v is None or v == "" or v == []]
                content[endpoint]["populated_fields"] = populated
                content[endpoint]["empty_fields"] = empty
        except Exception as e:
            content[endpoint] = {"error": str(e)}

    return content

def generate_report():
    """Generate the full audit report"""
    report = []
    report.append("# AE Content Source Audit Report")
    report.append(f"Generated: {__import__('datetime').datetime.now().isoformat()[:19]}")
    report.append("")

    # --- Section 1: Code Analysis ---
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
        report.append(f"- Fallback patterns (field ?? default): **{len(fallbacks)}**")
        report.append("")

        if hardcoded:
            report.append("**Hardcoded UI copy:**")
            for src, text in hardcoded[:20]:  # cap at 20
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

    # --- Section 2: Strapi Content ---
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

    # --- Section 3: Summary ---
    report.append("## 3. Summary")
    report.append("")
    report.append(f"| Metric | Count |")
    report.append(f"|--------|-------|")
    report.append(f"| Total hardcoded strings found | {total_hardcoded} |")
    report.append(f"| Total Strapi field references | {total_strapi_fields} |")
    report.append(f"| Total fallback patterns | {total_fallbacks} |")
    report.append(f"| Strapi ratio | {total_strapi_fields}/{total_strapi_fields + total_hardcoded} ({round(total_strapi_fields/(total_strapi_fields+total_hardcoded)*100) if (total_strapi_fields+total_hardcoded) > 0 else 0}%) |")
    report.append("")

    # --- Section 4: Recommendations ---
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
    with open(out_path, "w") as f:
        f.write(report)
    print(f"Report written to {out_path}")
    print(report[:500] + "\n...")
```

### Step 1B: Run the audit

```bash
source .env.local
python3 scripts/ae-content-source-audit.py
```

Review the output at `data/audit/AE-CONTENT-SOURCE-AUDIT.md`.

---

## Part 2 — Strapi Content Cleanup

WordPress content was scraped via BeautifulSoup + markdownify. The migration left formatting artifacts in Strapi body fields. Find and fix all of them.

### Step 2A: Build the content cleaner

Create `scripts/ae-strapi-content-cleanup.py`:

```python
#!/usr/bin/env python3
"""
AE Strapi Content Cleanup
Scans all AE content in Strapi for formatting issues and fixes them via PUT.

Issues to fix:
1. Stray ** (bold markdown) that shouldn't be there
2. Stray ## or ### headers inside body text
3. Stray * (italic markdown) mid-sentence
4. Double spaces
5. Broken/orphaned markdown links [text](url) where url is empty or #
6. HTML entities that should be decoded (&amp; &nbsp; &rsquo; etc.)
7. Cloudflare email obfuscation artifacts
8. Trailing/leading whitespace in fields
9. Broken line breaks (literal \n or \\n in text)
10. Empty bold/italic markers (** ** or * *)
"""

import os, json, re, sys, subprocess, time

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

# --- Config ---
STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json",
}
REGION = "ae"
DRY_RUN = "--dry-run" in sys.argv  # Pass --dry-run to preview without saving

# Content types and their text fields to clean
CONTENT_TYPES = {
    "service-pages": [
        "title", "eyebrow", "heroHeadline", "heroSubtext",
        "definitionalLede", "body",
        "ctaBannerHeading", "ctaBannerBody", "ctaBannerPrimaryText", "ctaBannerSecondaryText",
        "safetyHeading", "safetyBody", "safetyEyebrow",
        "processHeading", "featuresHeading", "faqSectionHeading",
        "metaTitle", "metaDescription",
    ],
    "blog-posts": [
        "title", "body", "excerpt", "category", "author",
        "metaTitle", "metaDescription",
    ],
    "about-pages": [
        "heroHeadline", "heroSubtext",
        "missionHeading", "missionBody",
        "valuesHeading",
        "ctaBannerHeading", "ctaBannerSubtext", "ctaBannerPrimaryText",
        "metaTitle", "metaDescription",
    ],
    "contact-pages": [
        "heroHeadline", "heroSubtext",
        "formHeading", "formSubtext",
        "metaTitle", "metaDescription",
    ],
    "home-pages": [
        "heroHeadline", "heroSubtext",
        "heroPrimaryCtaText", "heroSecondaryCtaText",
        "ctaBannerHeading", "ctaBannerBody",
        "metaTitle", "metaDescription",
    ],
    "case-studies": [
        "title", "body", "excerpt", "challenge", "solution",
        "metaTitle", "metaDescription",
    ],
}

# --- Cleaning functions ---

def clean_text(text, field_name=""):
    """Apply all cleaning rules to a text field. Returns (cleaned_text, list_of_changes)."""
    if not text or not isinstance(text, str):
        return text, []

    original = text
    changes = []

    # 1. Empty bold/italic markers: "** **", "* *", "****", "**  **"
    cleaned = re.sub(r'\*{2}\s*\*{2}', '', text)
    if cleaned != text:
        changes.append("Removed empty bold markers (**** or ** **)")
        text = cleaned

    cleaned = re.sub(r'(?<!\*)\*\s+\*(?!\*)', '', text)
    if cleaned != text:
        changes.append("Removed empty italic markers (* *)")
        text = cleaned

    # 2. Orphaned bold markers — ** at start/end of line with no matching pair
    # Fix lines that start with ** but don't close it (or vice versa)
    lines = text.split('\n')
    fixed_lines = []
    for line in lines:
        count = line.count('**')
        if count == 1:
            # Single ** with no pair — likely artifact
            fixed_line = line.replace('**', '')
            if fixed_line != line:
                changes.append(f"Removed orphaned ** in: {line[:60]}")
                line = fixed_line
        fixed_lines.append(line)
    text = '\n'.join(fixed_lines)

    # 3. Stray italic * mid-sentence (not part of a list or bold)
    # Match a lone * surrounded by word chars (not ** or * at line start)
    cleaned = re.sub(r'(?<=\w)\*(?=\w)', '', text)
    if cleaned != text:
        changes.append("Removed stray italic * between words")
        text = cleaned

    # 4. Fix ## or ### that appear mid-paragraph (not at start of line)
    # If ## appears after text on the same line, it's likely an artifact
    cleaned = re.sub(r'(?<=\w) #{2,3} (?=\w)', ' — ', text)
    if cleaned != text:
        changes.append("Replaced mid-line ## with dash")
        text = cleaned

    # 5. Double/triple spaces → single space (but preserve newlines)
    cleaned = re.sub(r'[^\S\n]{2,}', ' ', text)
    if cleaned != text:
        changes.append("Collapsed multiple spaces")
        text = cleaned

    # 6. HTML entities
    html_entities = {
        '&amp;': '&',
        '&nbsp;': ' ',
        '&rsquo;': "'",
        '&lsquo;': "'",
        '&rdquo;': '"',
        '&ldquo;': '"',
        '&mdash;': '—',
        '&ndash;': '–',
        '&hellip;': '…',
        '&bull;': '•',
        '&lt;': '<',
        '&gt;': '>',
        '&#8217;': "'",
        '&#8216;': "'",
        '&#8220;': '"',
        '&#8221;': '"',
        '&#8211;': '–',
        '&#8212;': '—',
        '&#160;': ' ',
    }
    for entity, replacement in html_entities.items():
        if entity in text:
            text = text.replace(entity, replacement)
            changes.append(f"Decoded HTML entity: {entity}")

    # 7. Cloudflare email protection artifacts
    if '/cdn-cgi/l/email-protection' in text:
        text = re.sub(
            r'\[email\s*protected\]\(/cdn-cgi/l/email-protection[^)]*\)',
            'info@carelabz.com',
            text
        )
        text = re.sub(r'/cdn-cgi/l/email-protection[^\s"\'<)]*', 'mailto:info@carelabz.com', text)
        changes.append("Replaced Cloudflare email protection artifact")

    # 8. null prefix on email
    if 'nullinfo@' in text or 'nullmailto:' in text:
        text = text.replace('nullinfo@carelabz.com', 'info@carelabz.com')
        text = text.replace('nullmailto:', 'mailto:')
        changes.append("Fixed null-prefixed email")

    # 9. Broken markdown links — [text]() or [text](#) or [](url)
    cleaned = re.sub(r'\[([^\]]+)\]\(\s*#?\s*\)', r'\1', text)  # [text]() → text
    if cleaned != text:
        changes.append("Removed broken markdown links with empty href")
        text = cleaned

    cleaned = re.sub(r'\[\]\(([^)]+)\)', r'\1', text)  # [](url) → url
    if cleaned != text:
        changes.append("Removed markdown links with empty text")
        text = cleaned

    # 10. Dead carelabs.me links
    if 'carelabs.me' in text:
        # Replace with carelabz.com equivalent or just the path
        text = re.sub(r'https?://carelabs\.me(/[^\s"\'<)]*)?', r'/ae/services\1', text)
        changes.append("Replaced dead carelabs.me domain")

    # 11. Strip leading/trailing whitespace
    stripped = text.strip()
    if stripped != text:
        changes.append("Trimmed leading/trailing whitespace")
        text = stripped

    # 12. Fix literal \n (escaped newlines as text, not actual newlines)
    if '\\n' in text:
        text = text.replace('\\n', '\n')
        changes.append("Converted literal \\n to actual newlines")

    # 13. Remove excessive blank lines (3+ → 2)
    cleaned = re.sub(r'\n{3,}', '\n\n', text)
    if cleaned != text:
        changes.append("Reduced excessive blank lines")
        text = cleaned

    return text, changes


def clean_json_field(value, field_name=""):
    """Clean a field that might be a string, list, or nested object."""
    if isinstance(value, str):
        return clean_text(value, field_name)
    elif isinstance(value, list):
        all_changes = []
        cleaned_list = []
        for i, item in enumerate(value):
            if isinstance(item, dict):
                cleaned_item, item_changes = clean_dict(item, f"{field_name}[{i}]")
                cleaned_list.append(cleaned_item)
                all_changes.extend(item_changes)
            elif isinstance(item, str):
                cleaned, changes = clean_text(item, f"{field_name}[{i}]")
                cleaned_list.append(cleaned)
                all_changes.extend(changes)
            else:
                cleaned_list.append(item)
        return cleaned_list, all_changes
    return value, []


def clean_dict(d, prefix=""):
    """Recursively clean all string values in a dict."""
    all_changes = []
    cleaned = {}
    for k, v in d.items():
        cleaned_v, changes = clean_json_field(v, f"{prefix}.{k}")
        cleaned[k] = cleaned_v
        for c in changes:
            all_changes.append(f"{prefix}.{k}: {c}")
    return cleaned, all_changes


def process_content_type(content_type, fields):
    """Fetch all AE entries for a content type, clean them, PUT back."""
    print(f"\n{'='*60}")
    print(f"Processing: {content_type}")
    print(f"{'='*60}")

    # Fetch all entries
    url = f"{STRAPI_BASE}/{content_type}?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*"
    try:
        r = requests.get(url, headers=HEADERS, timeout=30)
        data = r.json()
    except Exception as e:
        print(f"  ERROR fetching {content_type}: {e}")
        return 0, 0

    entries = data.get("data", [])
    print(f"  Found {len(entries)} entries")

    total_fixes = 0
    entries_fixed = 0

    for entry in entries:
        doc_id = entry.get("documentId", entry.get("id", "?"))
        slug = entry.get("slug", entry.get("title", doc_id))

        # Build update payload with only the fields that changed
        update_data = {}
        entry_changes = []

        for field in fields:
            value = entry.get(field)
            if value is None:
                continue

            cleaned, changes = clean_json_field(value, field)
            if changes:
                update_data[field] = cleaned
                entry_changes.extend(changes)

        # Also check nested JSON fields (features, processSteps, faqs, etc.)
        for key in ["features", "processSteps", "faqs", "safetyBullets", "trustBadges",
                     "services", "industries", "insights", "values", "stats", "certifications",
                     "results", "tags"]:
            value = entry.get(key)
            if value and isinstance(value, (list, dict)):
                cleaned, changes = clean_json_field(value, key)
                if changes:
                    update_data[key] = cleaned
                    entry_changes.extend(changes)

        if entry_changes:
            entries_fixed += 1
            total_fixes += len(entry_changes)
            print(f"\n  [{slug}] — {len(entry_changes)} fixes:")
            for c in entry_changes:
                print(f"    - {c}")

            if not DRY_RUN:
                # PUT the cleaned data
                put_url = f"{STRAPI_BASE}/{content_type}/{doc_id}"
                try:
                    r = requests.put(put_url, headers=HEADERS, json={"data": update_data}, timeout=15)
                    if r.status_code == 200:
                        print(f"    ✓ Updated successfully")
                    else:
                        print(f"    ✗ PUT failed: {r.status_code} — {r.text[:200]}")
                except Exception as e:
                    print(f"    ✗ PUT error: {e}")
                time.sleep(0.3)  # rate limit
            else:
                print(f"    [DRY RUN] Would update {len(update_data)} fields")

    return entries_fixed, total_fixes


def main():
    if DRY_RUN:
        print("=" * 60)
        print("DRY RUN MODE — no changes will be saved to Strapi")
        print("=" * 60)
    else:
        print("=" * 60)
        print("LIVE MODE — changes will be saved to Strapi")
        print("=" * 60)

    grand_entries = 0
    grand_fixes = 0

    for content_type, fields in CONTENT_TYPES.items():
        entries_fixed, total_fixes = process_content_type(content_type, fields)
        grand_entries += entries_fixed
        grand_fixes += total_fixes

    print(f"\n{'='*60}")
    print(f"DONE")
    print(f"{'='*60}")
    print(f"Entries with fixes: {grand_entries}")
    print(f"Total individual fixes: {grand_fixes}")
    if DRY_RUN:
        print(f"\nThis was a DRY RUN. Re-run without --dry-run to apply changes.")


if __name__ == "__main__":
    main()
```

### Step 2B: Dry run first

```bash
source .env.local
python3 scripts/ae-strapi-content-cleanup.py --dry-run
```

Review the output. It will show every change it *would* make without touching Strapi.

### Step 2C: Apply the fixes

```bash
source .env.local
python3 scripts/ae-strapi-content-cleanup.py
```

---

## Part 3 — Playwright Verification

After both scripts run, verify the live site content is clean.

Create `tests/ae-content-quality.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

// Sample AE pages to check
const AE_PAGES = [
  "/ae/",
  "/ae/about/",
  "/ae/contact/",
  "/ae/services/",
  "/ae/blog/",
  "/ae/case-studies/",
];

test.describe("AE Content Quality — No Formatting Artifacts", () => {

  for (const path of AE_PAGES) {
    test(`${path} — no stray ** markdown bold`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      // ** should never appear as visible text (it's markdown, not rendered HTML)
      const matches = body.match(/\*{2,}/g) || [];
      expect(matches.length, `Found stray ** on ${path}: ${matches.join(", ")}`).toBe(0);
    });

    test(`${path} — no stray ## markdown headers in text`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      // ## should not appear as visible text
      const matches = body.match(/#{2,}\s/g) || [];
      expect(matches.length, `Found stray ## on ${path}`).toBe(0);
    });

    test(`${path} — no HTML entities visible`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("body").innerText();
      const entities = ["&amp;", "&nbsp;", "&rsquo;", "&ldquo;", "&rdquo;", "&#8217;", "&#8220;"];
      for (const entity of entities) {
        expect(body).not.toContain(entity);
      }
    });

    test(`${path} — no null-prefixed emails`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      expect(html).not.toContain("nullinfo@");
      expect(html).not.toContain("nullmailto:");
    });

    test(`${path} — no Cloudflare email protection artifacts`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const html = await page.content();
      expect(html).not.toContain("/cdn-cgi/l/email-protection");
    });

    test(`${path} — no dead carelabs.me links`, async ({ page }) => {
      await page.goto(`${BASE}${path}`, { waitUntil: "domcontentloaded" });
      const deadLinks = await page.locator('a[href*="carelabs.me"]').count();
      expect(deadLinks).toBe(0);
    });
  }

  // Also spot-check a few service pages
  test("Service page body has no ** artifacts", async ({ page }) => {
    // Get the first service page from the services index
    await page.goto(`${BASE}/ae/services/`, { waitUntil: "domcontentloaded" });
    const firstLink = page.locator('a[href*="/ae/services/"][href$="-ae/"]').first();
    const href = await firstLink.getAttribute("href");
    if (href) {
      await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("main").innerText();
      const matches = body.match(/\*{2,}/g) || [];
      expect(matches.length, `Found stray ** on ${href}`).toBe(0);
    }
  });

  // Spot-check a few blog posts
  test("Blog post body has no ** artifacts", async ({ page }) => {
    await page.goto(`${BASE}/ae/blog/`, { waitUntil: "domcontentloaded" });
    const firstLink = page.locator('a[href*="/ae/blog/"]').first();
    const href = await firstLink.getAttribute("href");
    if (href && href !== "/ae/blog/") {
      await page.goto(`${BASE}${href}`, { waitUntil: "domcontentloaded" });
      const body = await page.locator("main").innerText();
      const matches = body.match(/\*{2,}/g) || [];
      expect(matches.length, `Found stray ** on ${href}`).toBe(0);
    }
  });
});
```

### Run the tests:

```bash
npx playwright test tests/ae-content-quality.spec.ts --reporter=list
```

---

## Part 4 — Comprehensive Link + Content Audit (Full Site Crawl)

As a final pass, crawl ALL AE pages and check every link + visible text:

Create `tests/ae-full-site-audit.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

const BASE = "https://carelabz-website-experiment1-ivory.vercel.app";

test("Full AE site crawl — collect all internal links and verify", async ({ page }) => {
  const visited = new Set<string>();
  const broken: string[] = [];
  const queue = ["/ae/"];

  while (queue.length > 0 && visited.size < 200) {
    const path = queue.shift()!;
    if (visited.has(path)) continue;
    visited.add(path);

    try {
      const res = await page.goto(`${BASE}${path}`, {
        waitUntil: "domcontentloaded",
        timeout: 15000,
      });

      if (res && res.status() >= 400) {
        broken.push(`${res.status()} ${path}`);
        continue;
      }

      // Collect all internal AE links
      const links = await page.locator('a[href^="/ae/"]').evaluateAll((els) =>
        els.map((el) => el.getAttribute("href")).filter(Boolean)
      );

      for (const link of links) {
        if (link && !visited.has(link) && link.startsWith("/ae/")) {
          queue.push(link);
        }
      }
    } catch (e) {
      broken.push(`TIMEOUT ${path}`);
    }
  }

  console.log(`\nCrawled ${visited.size} pages`);
  if (broken.length > 0) {
    console.log(`\nBROKEN:`);
    broken.forEach((b) => console.log(`  ${b}`));
  }
  expect(broken.length, `Found ${broken.length} broken pages: ${broken.join(", ")}`).toBe(0);
});
```

---

## Verification Checklist

1. `python3 scripts/ae-content-source-audit.py` → report at `data/audit/AE-CONTENT-SOURCE-AUDIT.md`
2. `python3 scripts/ae-strapi-content-cleanup.py --dry-run` → review changes
3. `python3 scripts/ae-strapi-content-cleanup.py` → apply fixes
4. `npx playwright test tests/ae-content-quality.spec.ts` → all pass
5. `npx playwright test tests/ae-full-site-audit.spec.ts` → 0 broken pages
6. `npx tsc --noEmit` → zero errors
7. `npm run build` → all AE routes compile
8. Commit: `chore(ae): content source audit + strapi formatting cleanup`
9. Push: `git push origin main && git push company main`

---

## Summary

| Script | Purpose | Output |
|--------|---------|--------|
| `scripts/ae-content-source-audit.py` | Report what's hardcoded vs Strapi | `data/audit/AE-CONTENT-SOURCE-AUDIT.md` |
| `scripts/ae-strapi-content-cleanup.py` | Fix formatting artifacts in Strapi | Strapi PUTs (idempotent, safe to re-run) |
| `tests/ae-content-quality.spec.ts` | Verify no artifacts on live pages | Playwright pass/fail |
| `tests/ae-full-site-audit.spec.ts` | Crawl all AE pages for broken links | Playwright pass/fail |

**Scripts are idempotent — safe to re-run after future content changes.**
