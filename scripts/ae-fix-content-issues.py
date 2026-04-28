#!/usr/bin/env python3
"""
AE Content Fix — reads QA report and fixes issues in Strapi CMS.
For ellipses: fetches original content from WordPress to restore full text.
For asterisks/formatting: cleans the Strapi field directly.
"""

import os, sys, json, re, subprocess, time
from pathlib import Path

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

try:
    from bs4 import BeautifulSoup
    import markdownify
except ImportError:
    subprocess.check_call([
        sys.executable, "-m", "pip", "install",
        "beautifulsoup4", "markdownify", "--break-system-packages", "-q"
    ])
    from bs4 import BeautifulSoup
    import markdownify

env_file = Path(".env.local")
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if line.startswith("STRAPI_API_TOKEN="):
            os.environ["STRAPI_API_TOKEN"] = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS_GET = {"Authorization": f"Bearer {STRAPI_TOKEN}"}
HEADERS_PUT = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json",
}
REGION = "ae"
WP_BASE = "https://www.carelabz.com"
DRY_RUN = "--dry-run" in sys.argv
SKIP_WP = "--skip-wp" in sys.argv  # bypass slow WordPress fetches, just inline-clean ellipses

# Cache resolved entries to avoid re-fetching
_strapi_cache = {}


def url_to_strapi(url_path):
    path = url_path.rstrip("/")
    if re.match(r"^/ae/services/(.+)$", path):
        return ("service-pages", re.match(r"^/ae/services/(.+)$", path).group(1))
    if re.match(r"^/ae/blog/(.+)$", path):
        return ("blog-posts", re.match(r"^/ae/blog/(.+)$", path).group(1))
    if re.match(r"^/ae/case-studies/(.+)$", path):
        return ("case-studies", re.match(r"^/ae/case-studies/(.+)$", path).group(1))
    if path == "/ae/about":
        return ("about-pages", None)
    if path == "/ae/contact":
        return ("contact-pages", None)
    if path in ("/ae", "/ae/services", "/ae/blog", "/ae/case-studies"):
        return ("home-pages", None)
    return (None, None)


def url_to_wordpress(url_path):
    path = url_path.rstrip("/")
    if "/services/" in path:
        slug = path.split("/services/")[-1]
        wp_slug = re.sub(r"-ae$", "", slug)
        return [
            f"{WP_BASE}/{wp_slug}/",
            f"{WP_BASE}/ae/{wp_slug}/",
            f"{WP_BASE}/ae/services/{wp_slug}/",
        ]
    if "/blog/" in path:
        slug = path.split("/blog/")[-1]
        wp_slug = re.sub(r"-ae$", "", slug)
        return [
            f"{WP_BASE}/{wp_slug}/",
            f"{WP_BASE}/ae/{wp_slug}/",
            f"{WP_BASE}/ae/blog/{wp_slug}/",
        ]
    return []


def fetch_wordpress_content(wp_urls):
    for url in wp_urls:
        try:
            r = requests.get(url, timeout=15, headers={
                "User-Agent": "Mozilla/5.0 (compatible; CareLabsMigration/1.0)"
            })
            if r.status_code == 200:
                soup = BeautifulSoup(r.text, "html.parser")
                content = None
                for selector in [
                    "article .entry-content", ".post-content", ".entry-content",
                    "article", ".content-area", "main",
                ]:
                    content = soup.select_one(selector)
                    if content:
                        break
                if content:
                    for tag in content.find_all(["script", "style", "nav", "footer", "aside"]):
                        tag.decompose()
                    md = markdownify.markdownify(str(content), heading_style="ATX")
                    md = re.sub(r"\n{3,}", "\n\n", md).strip()
                    if len(md) > 100:
                        print(f"    OK fetched WP content from {url} ({len(md)} chars)")
                        return md
        except Exception:
            continue
    return None


def get_strapi_entry(content_type, slug=None):
    cache_key = f"{content_type}::{slug or '_'}"
    if cache_key in _strapi_cache:
        return _strapi_cache[cache_key]

    # Strapi slugs use the -ae suffix; the URL slug strips it. Try both.
    candidates = [slug, f"{slug}-ae"] if slug else [None]
    for candidate in candidates:
        if candidate:
            url = f"{STRAPI_BASE}/{content_type}?filters[slug][$eq]={candidate}&filters[region][$eq]={REGION}&populate=*"
        else:
            url = f"{STRAPI_BASE}/{content_type}?filters[region][$eq]={REGION}&populate=*"
        try:
            r = requests.get(url, headers=HEADERS_GET, timeout=15)
            data = r.json().get("data", [])
            if data:
                _strapi_cache[cache_key] = data[0]
                return data[0]
        except Exception:
            continue
    _strapi_cache[cache_key] = None
    return None


def update_strapi_entry(content_type, doc_id, update_data):
    if DRY_RUN:
        print(f"    [DRY RUN] Would PUT {content_type}/{doc_id}: {list(update_data.keys())}")
        return True
    r = requests.put(
        f"{STRAPI_BASE}/{content_type}/{doc_id}",
        headers=HEADERS_PUT,
        json={"data": update_data},
        timeout=30,
    )
    if r.status_code in (200, 201):
        print(f"    OK PUT {content_type}/{doc_id}")
        return True
    print(f"    FAIL {content_type}/{doc_id} ({r.status_code}): {r.text[:200]}")
    return False


def clean_field(text):
    if not text or not isinstance(text, str):
        return text, []
    original = text
    changes = []

    cleaned = re.sub(r"\*{2}\s*\*{2}", "", text)
    if cleaned != text:
        changes.append("Removed empty bold markers")
        text = cleaned

    cleaned = re.sub(r"\*{3,}", "**", text)
    if cleaned != text:
        changes.append("Collapsed triple-stars")
        text = cleaned

    # Markdown bold that won't render because closing ** has no whitespace after it.
    # Pattern: **TEXT**OTHER -> TEXT OTHER  (drop markers, keep both, insert space)
    cleaned = re.sub(r"\*\*([^*\n]+?)\*\*(?=[^\s*\n.,!?;:])", r"\1 ", text)
    if cleaned != text:
        changes.append("Fixed glued **bold** pairs (no space after close)")
        text = cleaned
    # Same case where opening ** has no whitespace before it.
    cleaned = re.sub(r"(?<=[^\s*\n>])\*\*([^*\n]+?)\*\*", r" \1", text)
    if cleaned != text:
        changes.append("Fixed glued **bold** pairs (no space before open)")
        text = cleaned

    # Lines starting with a single orphan asterisk (broken markdown).
    lines = text.split("\n")
    fixed_lines = []
    for line in lines:
        stripped = line.lstrip()
        if stripped.startswith("*") and not stripped.startswith("**"):
            after = stripped[1:]
            if after and not after.startswith(" "):
                # E.g. "*Carelabs is authorized..." -> "Carelabs is authorized..."
                line = line.replace("*", "", 1)
                changes.append("Stripped leading orphan *")
        if line.count("**") == 1:
            line2 = line.replace("**", "")
            if line2 != line:
                changes.append(f"Removed orphaned **: {line[:60]}")
                line = line2
        fixed_lines.append(line)
    text = "\n".join(fixed_lines)

    cleaned = re.sub(r"(?<=\w)\*(?=\w)", "", text)
    if cleaned != text:
        changes.append("Removed stray * between words")
        text = cleaned

    # Single * not adjacent to whitespace or another * (broken markdown italic).
    # Catches "tests.*Dynamic" -> "tests.Dynamic"
    cleaned = re.sub(r"(?<![*\s])\*(?![*\s])", "", text)
    if cleaned != text:
        changes.append("Removed lone * adjacent to non-space")
        text = cleaned

    # Markdown bold around tab-separated content (table headers) doesn't render.
    # Strip the ** wrapper, keep content with tabs.
    cleaned = re.sub(r"\*\*([^*\n]*\t[^*\n]*?)\*\*", r"\1", text)
    if cleaned != text:
        changes.append("Stripped ** around tab-content")
        text = cleaned

    # Markdown table rows (line starts and ends with |) — strip ** since
    # bold across cells doesn't render reliably.
    table_lines = text.split("\n")
    table_changed = False
    for i, line in enumerate(table_lines):
        s = line.strip()
        if s.startswith("|") and s.endswith("|") and "**" in s:
            table_lines[i] = line.replace("**", "")
            table_changed = True
    if table_changed:
        changes.append("Stripped ** from table rows")
        text = "\n".join(table_lines)

    cleaned = re.sub(r"(?<=\w) #{2,3} (?=\w)", " — ", text)
    if cleaned != text:
        changes.append("Replaced mid-line ## with dash")
        text = cleaned

    entities = {
        "&amp;": "&", "&nbsp;": " ", "&rsquo;": "'", "&lsquo;": "'",
        "&rdquo;": '"', "&ldquo;": '"', "&mdash;": "—", "&ndash;": "–",
        "&hellip;": "…", "&bull;": "•", "&#8217;": "'", "&#8220;": '"',
        "&#8221;": '"', "&#160;": " ",
    }
    for entity, replacement in entities.items():
        if entity in text:
            text = text.replace(entity, replacement)
            changes.append(f"Decoded {entity}")

    if "/cdn-cgi/l/email-protection" in text:
        text = re.sub(r"\[email\s*protected\]\(/cdn-cgi/l/email-protection[^)]*\)", "info@carelabz.com", text)
        text = re.sub(r"/cdn-cgi/l/email-protection[^\s\"'<)]*", "mailto:info@carelabz.com", text)
        changes.append("Replaced Cloudflare artifact")
    if "[email protected]" in text:
        text = text.replace("[email protected]", "info@carelabz.com")
        changes.append("Replaced [email protected] placeholder")

    if "nullinfo@" in text:
        text = text.replace("nullinfo@carelabz.com", "info@carelabz.com")
        text = text.replace("nullinfo@", "info@")
        changes.append("Fixed null email prefix")

    # Ellipses — strip everywhere (the user wants no truncation indicators)
    cleaned = re.sub(r"\s*\.{3,}\s*$", ".", text)
    cleaned = re.sub(r"\s*…\s*$", ".", cleaned)
    cleaned = re.sub(r"\s*\.{3,}\s*", " — ", cleaned)
    cleaned = re.sub(r"\s*…\s*", " — ", cleaned)
    if cleaned != text:
        changes.append("Cleaned ellipses")
        text = cleaned

    cleaned = re.sub(r"[^\S\n]{2,}", " ", text)
    if cleaned != text:
        changes.append("Collapsed multiple spaces")
        text = cleaned

    cleaned = re.sub(r"\n{3,}", "\n\n", text)
    if cleaned != text:
        changes.append("Reduced excessive blank lines")
        text = cleaned

    text = text.strip()
    return text, changes


def fix_ellipses_from_wordpress(entry, content_type, url_path):
    update = {}
    changes = []

    text_fields = [
        "body", "definitionalLede", "heroSubtext", "heroHeadline",
        "missionBody", "challenge", "solution", "excerpt",
        "ctaBannerBody", "ctaBannerHeading", "safetyBody",
        "metaDescription",
    ]

    fields_with_ellipsis = []
    for field in text_fields:
        val = entry.get(field) or ""
        if isinstance(val, str) and ("..." in val or "…" in val):
            fields_with_ellipsis.append(field)

    if not fields_with_ellipsis:
        return {}, []

    print(f"  Fields with ellipses: {fields_with_ellipsis}")
    wp_urls = url_to_wordpress(url_path) if not SKIP_WP else []
    wp_content = fetch_wordpress_content(wp_urls) if wp_urls else None

    if wp_content:
        if "body" in fields_with_ellipsis:
            current_body = entry.get("body") or ""
            if len(wp_content) > len(current_body) * 1.2:
                cleaned_wp, _ = clean_field(wp_content)
                max_len = 8000 if "blog" in content_type else 5000
                if len(cleaned_wp) > max_len:
                    cutoff = cleaned_wp[:max_len].rfind(". ")
                    cleaned_wp = cleaned_wp[: cutoff + 1] if cutoff > max_len * 0.8 else cleaned_wp[:max_len]
                update["body"] = cleaned_wp
                changes.append(f"Restored body from WordPress ({len(current_body)} -> {len(cleaned_wp)} chars)")
                fields_with_ellipsis.remove("body")

        for field in fields_with_ellipsis:
            current = entry.get(field) or ""
            if not current:
                continue
            before_ellipsis = re.split(r"\.{3}|…", current)[0].strip()
            if len(before_ellipsis) < 10:
                continue
            search_text = before_ellipsis[-50:]
            if search_text in wp_content:
                idx = wp_content.index(search_text)
                rest = wp_content[idx + len(search_text):]
                end_idx = rest.find("\n\n")
                if end_idx == -1:
                    end_idx = min(len(rest), 500)
                full_text = before_ellipsis + rest[:end_idx].strip()
                cleaned_full, _ = clean_field(full_text)
                max_field_len = 160 if "meta" in field.lower() else 500
                if len(cleaned_full) > max_field_len:
                    cutoff = cleaned_full[:max_field_len].rfind(". ")
                    if cutoff > max_field_len * 0.7:
                        cleaned_full = cleaned_full[: cutoff + 1]
                update[field] = cleaned_full
                changes.append(f"Restored {field} from WordPress")
    else:
        for field in fields_with_ellipsis:
            current = entry.get(field) or ""
            fixed = re.sub(r"\s*\.{3}\s*$", ".", current)
            fixed = re.sub(r"\s*\.{3}\s*", " — ", fixed)
            fixed = re.sub(r"\s*…\s*$", ".", fixed)
            fixed = re.sub(r"\s*…\s*", " — ", fixed)
            if fixed != current:
                update[field] = fixed
                changes.append(f"Cleaned ellipsis in {field} (no WP source)")

    return update, changes


def main():
    if DRY_RUN:
        print("=" * 60)
        print("DRY RUN — no changes will be saved")
        print("=" * 60)

    report_path = "data/ae-qa-report.json"
    if not os.path.exists(report_path):
        print(f"No QA report found at {report_path}")
        sys.exit(1)

    with open(report_path, encoding="utf-8") as f:
        issues = json.load(f)

    print(f"Loaded {len(issues)} issues from QA report\n")

    by_url = {}
    for issue in issues:
        by_url.setdefault(issue["url"], []).append(issue)

    total_fixed = 0
    total_skipped = 0

    text_fields_simple = [
        "body", "definitionalLede", "heroSubtext", "heroHeadline",
        "missionBody", "challenge", "solution", "excerpt",
        "ctaBannerBody", "ctaBannerHeading", "ctaBannerSubtext",
        "ctaBannerPrimaryText", "ctaBannerSecondaryText",
        "safetyBody", "safetyHeading", "safetyEyebrow",
        "processHeading", "featuresHeading", "featuresSubtext",
        "faqSectionHeading", "metaTitle", "metaDescription",
        "title", "eyebrow", "reportsHeading", "reportsBody",
        "reportsEyebrow", "valuesHeading", "statsHeading",
        "industriesHeading", "insightsHeading",
        "footerDescription",
    ]

    array_fields = [
        "faqs", "features", "processSteps", "safetyBullets",
        "industries", "insights", "values", "stats",
        "certifications", "results", "services", "trustBadges",
        "reportsBullets", "navLinks", "seoKeywords", "tags",
    ]

    for url_path, page_issues in sorted(by_url.items()):
        print(f"\n{'='*60}")
        print(f"Page: {url_path} ({len(page_issues)} issues)")
        print(f"{'='*60}")

        content_type, slug = url_to_strapi(url_path)
        if not content_type:
            print(f"  SKIP — cannot map to Strapi")
            total_skipped += len(page_issues)
            continue

        entry = get_strapi_entry(content_type, slug)
        if not entry:
            print(f"  SKIP — no Strapi entry for {content_type}/{slug}")
            total_skipped += len(page_issues)
            continue

        doc_id = entry.get("documentId") or entry.get("id")
        issue_types = set(i["type"] for i in page_issues)
        print(f"  Issue types: {issue_types}")

        update = {}
        all_changes = []

        # Top-level scalar fields
        for field in text_fields_simple:
            val = entry.get(field) or ""
            if not isinstance(val, str) or not val:
                continue
            cleaned, changes = clean_field(val)
            if changes:
                update[field] = cleaned
                all_changes.extend([f"{field}: {c}" for c in changes])

        # Repeatable component arrays
        for array_field in array_fields:
            arr = entry.get(array_field)
            if not arr or not isinstance(arr, list):
                continue
            updated_arr = []
            arr_changed = False
            for item in arr:
                if isinstance(item, str):
                    cleaned, changes = clean_field(item)
                    if changes:
                        all_changes.extend([f"{array_field}[]: {c}" for c in changes])
                        arr_changed = True
                        updated_arr.append(cleaned)
                    else:
                        updated_arr.append(item)
                    continue
                if not isinstance(item, dict):
                    updated_arr.append(item)
                    continue
                new_item = dict(item)
                new_item.pop("id", None)
                for k, v in item.items():
                    if k == "id":
                        continue
                    if isinstance(v, str) and v:
                        cleaned, changes = clean_field(v)
                        if changes:
                            new_item[k] = cleaned
                            all_changes.extend([f"{array_field}[].{k}: {c}" for c in changes])
                            arr_changed = True
                updated_arr.append(new_item)
            if arr_changed:
                update[array_field] = updated_arr

        # Ellipsis backfill from WordPress
        if "ELLIPSIS" in issue_types:
            wp_update, wp_changes = fix_ellipses_from_wordpress(entry, content_type, url_path)
            update.update(wp_update)
            all_changes.extend(wp_changes)

        if update:
            print(f"  Fixes ({len(all_changes)}):")
            for c in all_changes[:15]:
                print(f"    - {c}")
            if len(all_changes) > 15:
                print(f"    ... and {len(all_changes) - 15} more")
            ok = update_strapi_entry(content_type, doc_id, update)
            if ok:
                total_fixed += len(all_changes)
            time.sleep(0.3)
        else:
            print(f"  No Strapi-fixable issues")
            total_skipped += len(page_issues)

    print(f"\n{'='*60}")
    print(f"DONE — fixes applied: {total_fixed}, skipped: {total_skipped}")


if __name__ == "__main__":
    main()
