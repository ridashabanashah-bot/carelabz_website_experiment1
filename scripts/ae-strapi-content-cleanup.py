#!/usr/bin/env python3
"""
AE Strapi Content Cleanup
Scans all AE content in Strapi for formatting issues and fixes them via PUT.

Pass --dry-run to preview without saving.
"""

import os, json, re, sys, subprocess, time
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
HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}", "Content-Type": "application/json"}
REGION = "ae"
DRY_RUN = "--dry-run" in sys.argv

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
        "missionHeading", "missionBody", "valuesHeading",
        "ctaBannerHeading", "ctaBannerSubtext", "ctaBannerPrimaryText",
        "metaTitle", "metaDescription",
    ],
    "contact-pages": [
        "heroHeadline", "heroSubtext", "formHeading", "formSubtext",
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


def strip_markdown(text):
    """Aggressive: strip ALL markdown syntax for fields rendered as plain text."""
    if not text or not isinstance(text, str):
        return text, []
    original = text
    changes = []
    # Bold: **text** -> text
    new = re.sub(r'\*\*([^*\n]+?)\*\*', r'\1', text)
    if new != text:
        changes.append("Stripped **bold** markdown")
        text = new
    # Italic: *text* (not at line start as bullet) -> text
    new = re.sub(r'(?<![*\n])\*([^*\n]+?)\*(?!\*)', r'\1', text)
    if new != text:
        changes.append("Stripped *italic* markdown")
        text = new
    # Heading: ## ... -> ...
    new = re.sub(r'^#{1,6}\s+', '', text, flags=re.MULTILINE)
    if new != text:
        changes.append("Stripped # heading markers")
        text = new
    # Markdown links: [text](url) -> text
    new = re.sub(r'\[([^\]]+)\]\([^)]+\)', r'\1', text)
    if new != text:
        changes.append("Flattened markdown links")
        text = new
    # Stray remaining ** or *
    new = text.replace('**', '').replace('\\n\\n', '\n\n').replace('\\n', '\n')
    if new != text:
        changes.append("Removed stray ** + literal \\n")
        text = new
    # Collapse multiple blank lines
    new = re.sub(r'\n{3,}', '\n\n', text)
    if new != text:
        text = new
    return text.strip(), changes


def clean_text(text, field_name=""):
    if not text or not isinstance(text, str):
        return text, []
    changes = []

    # 0. Triple-star bold+italic ***text*** -> **text** (marked() doesn't pair
    # triple stars reliably across line breaks; demote to plain bold)
    new = re.sub(r'\*{3}([^*\n]+?)\*{3}', r'**\1**', text)
    if new != text:
        changes.append("Demoted ***triple-star*** to **bold**")
        text = new
    # Triple-star spanning lines: leading ***word followed by closing ***word
    new = re.sub(r'\*{3}', '**', text)
    if new != text:
        changes.append("Reduced stray *** to **")
        text = new

    # 0b. Non-breaking space (U+00A0) -> regular space
    if '\xa0' in text:
        text = text.replace('\xa0', ' ')
        changes.append("Normalized \\xa0 (nbsp) to space")

    # 1. Empty bold/italic markers
    new = re.sub(r'\*{2}\s*\*{2}', '', text)
    if new != text:
        changes.append("Removed empty bold markers (**** or ** **)")
        text = new
    new = re.sub(r'(?<!\*)\*\s+\*(?!\*)', '', text)
    if new != text:
        changes.append("Removed empty italic markers (* *)")
        text = new

    # 2. Orphaned ** (single occurrence per line)
    lines = text.split('\n')
    fixed_lines = []
    for line in lines:
        if line.count('**') == 1:
            new_line = line.replace('**', '')
            if new_line != line:
                changes.append(f"Removed orphaned ** in: {line[:60]}")
                line = new_line
        fixed_lines.append(line)
    text = '\n'.join(fixed_lines)

    # 3. Stray italic * mid-word
    new = re.sub(r'(?<=\w)\*(?=\w)', '', text)
    if new != text:
        changes.append("Removed stray italic * between words")
        text = new

    # 4. ## or ### mid-paragraph
    new = re.sub(r'(?<=\w) #{2,3} (?=\w)', ' — ', text)
    if new != text:
        changes.append("Replaced mid-line ## with dash")
        text = new

    # 5. Multiple spaces
    new = re.sub(r'[^\S\n]{2,}', ' ', text)
    if new != text:
        changes.append("Collapsed multiple spaces")
        text = new

    # 6. HTML entities
    entities = {
        '&amp;': '&', '&nbsp;': ' ', '&rsquo;': "'", '&lsquo;': "'",
        '&rdquo;': '"', '&ldquo;': '"', '&mdash;': '—', '&ndash;': '–',
        '&hellip;': '…', '&bull;': '•', '&lt;': '<', '&gt;': '>',
        '&#8217;': "'", '&#8216;': "'", '&#8220;': '"', '&#8221;': '"',
        '&#8211;': '–', '&#8212;': '—', '&#160;': ' ',
    }
    for ent, repl in entities.items():
        if ent in text:
            text = text.replace(ent, repl)
            changes.append(f"Decoded HTML entity: {ent}")

    # 7. Cloudflare email protection
    if '/cdn-cgi/l/email-protection' in text:
        text = re.sub(r'\[email\s*protected\]\(/cdn-cgi/l/email-protection[^)]*\)', 'info@carelabz.com', text)
        text = re.sub(r'/cdn-cgi/l/email-protection[^\s"\'<)]*', 'mailto:info@carelabz.com', text)
        changes.append("Replaced Cloudflare email protection artifact")

    # 8. null prefix on email
    if 'nullinfo@' in text or 'nullmailto:' in text:
        text = text.replace('nullinfo@carelabz.com', 'info@carelabz.com').replace('nullmailto:', 'mailto:')
        changes.append("Fixed null-prefixed email")

    # 9. Broken markdown links
    new = re.sub(r'\[([^\]]+)\]\(\s*#?\s*\)', r'\1', text)
    if new != text:
        changes.append("Removed broken markdown links with empty href")
        text = new
    new = re.sub(r'\[\]\(([^)]+)\)', r'\1', text)
    if new != text:
        changes.append("Removed markdown links with empty text")
        text = new

    # 10. Dead carelabs.me
    if 'carelabs.me' in text:
        text = re.sub(r'https?://carelabs\.me(/[^\s"\'<)]*)?', r'/ae/services\1', text)
        changes.append("Replaced dead carelabs.me domain")

    # 11. Trim
    stripped = text.strip()
    if stripped != text:
        changes.append("Trimmed whitespace")
        text = stripped

    # 12. Literal \n
    if '\\n' in text:
        text = text.replace('\\n', '\n')
        changes.append("Converted literal \\n to newlines")

    # 13. Excessive blank lines
    new = re.sub(r'\n{3,}', '\n\n', text)
    if new != text:
        changes.append("Reduced excessive blank lines")
        text = new

    return text, changes


# Strapi v5 quirk: when PUTing a component array (faqs/features/etc.),
# any element with an `id` from the original GET is treated as "must be
# the existing component on this entity" — but Strapi rejects with
# "Some of the provided components ... are not related to the entity"
# even when the IDs match. Safest: strip `id` (treats as full replace).
COMPONENT_KEYS = {
    "features", "processSteps", "faqs", "safetyBullets", "trustBadges",
    "services", "industries", "insights", "values", "stats",
    "results",
}


# Fields rendered as plain text (no marked()) — strip markdown syntax.
# These appear inside component arrays.
PLAIN_TEXT_FIELDS = {"answer", "description", "title", "question", "metric", "value", "label", "name"}


def clean_json_field(value, field_name="", strip_ids=False, plain=False):
    if isinstance(value, str):
        if plain:
            return strip_markdown(value)
        return clean_text(value, field_name)
    if isinstance(value, list):
        all_changes = []
        cleaned_list = []
        for i, item in enumerate(value):
            if isinstance(item, dict):
                ci, ic = clean_dict(item, f"{field_name}[{i}]", strip_ids=strip_ids, plain=plain)
                cleaned_list.append(ci)
                all_changes.extend(ic)
            elif isinstance(item, str):
                if plain:
                    cs, sc = strip_markdown(item)
                else:
                    cs, sc = clean_text(item, f"{field_name}[{i}]")
                cleaned_list.append(cs)
                all_changes.extend(sc)
            else:
                cleaned_list.append(item)
        return cleaned_list, all_changes
    return value, []


def clean_dict(d, prefix="", strip_ids=False, plain=False):
    all_changes = []
    cleaned = {}
    for k, v in d.items():
        if strip_ids and k == "id":
            continue
        # If we're inside a component and this key is a plain-text field,
        # apply aggressive markdown-strip
        use_plain = plain or (k in PLAIN_TEXT_FIELDS)
        cv, c = clean_json_field(v, f"{prefix}.{k}", strip_ids=strip_ids, plain=use_plain)
        cleaned[k] = cv
        for change in c:
            all_changes.append(f"{prefix}.{k}: {change}")
    return cleaned, all_changes


def fetch_all(content_type):
    items = []
    page = 1
    while True:
        url = f"{STRAPI_BASE}/{content_type}?filters[region][$eq]={REGION}&pagination[pageSize]=100&pagination[page]={page}&populate=*"
        r = requests.get(url, headers={"Authorization": HEADERS["Authorization"]}, timeout=30)
        data = r.json()
        items.extend(data.get("data") or [])
        meta = data.get("meta", {}).get("pagination", {})
        if page >= meta.get("pageCount", 1):
            break
        page += 1
    return items


# These (content_type, field) pairs ARE rendered through marked() → keep markdown.
# Everything else gets aggressive markdown strip.
MARKED_RENDERED = {
    ("service-pages", "body"),
    ("blog-posts", "body"),
    ("case-studies", "body"),
}


def process_content_type(content_type, fields):
    print(f"\n{'='*60}")
    print(f"Processing: {content_type}")
    print(f"{'='*60}")

    entries = fetch_all(content_type)
    print(f"  Found {len(entries)} entries")

    total_fixes = 0
    entries_fixed = 0

    for entry in entries:
        doc_id = entry.get("documentId") or entry.get("id", "?")
        slug = entry.get("slug") or entry.get("title") or doc_id
        update_data = {}
        entry_changes = []

        for field in fields:
            value = entry.get(field)
            if value is None:
                continue
            # Body fields rendered through marked() keep markdown; all others
            # render as plain text in JSX, so strip markdown syntax.
            if (content_type, field) in MARKED_RENDERED:
                cleaned, changes = clean_json_field(value, field)
            else:
                if isinstance(value, str):
                    cleaned, changes = strip_markdown(value)
                else:
                    cleaned, changes = clean_json_field(value, field, plain=True)
            if changes:
                update_data[field] = cleaned
                entry_changes.extend(changes)

        for key in ["features", "processSteps", "faqs", "safetyBullets", "trustBadges",
                    "services", "industries", "insights", "values", "stats", "certifications",
                    "results", "tags"]:
            value = entry.get(key)
            if value and isinstance(value, (list, dict)):
                # Strip nested component IDs for repeatable components — see COMPONENT_KEYS
                strip = key in COMPONENT_KEYS
                cleaned, changes = clean_json_field(value, key, strip_ids=strip)
                if changes:
                    update_data[key] = cleaned
                    entry_changes.extend(changes)

        if entry_changes:
            entries_fixed += 1
            total_fixes += len(entry_changes)
            print(f"\n  [{slug}] — {len(entry_changes)} fixes:")
            for c in entry_changes[:5]:
                print(f"    - {c}")
            if len(entry_changes) > 5:
                print(f"    ... +{len(entry_changes)-5} more")

            if not DRY_RUN:
                put_url = f"{STRAPI_BASE}/{content_type}/{doc_id}"
                try:
                    r = requests.put(put_url, headers=HEADERS, json={"data": update_data}, timeout=30)
                    if r.status_code == 200:
                        print(f"    [OK] Updated")
                    else:
                        print(f"    [FAIL {r.status_code}] {r.text[:200]}")
                except Exception as e:
                    print(f"    [ERR] {e}")
                time.sleep(0.3)
            else:
                print(f"    [DRY RUN] Would update {len(update_data)} fields")

    return entries_fixed, total_fixes


def main():
    if DRY_RUN:
        print("=" * 60)
        print("DRY RUN — no changes will be saved")
        print("=" * 60)
    else:
        print("=" * 60)
        print("LIVE MODE — changes will be saved to Strapi")
        print("=" * 60)

    grand_entries = 0
    grand_fixes = 0
    for ct, fields in CONTENT_TYPES.items():
        ef, tf = process_content_type(ct, fields)
        grand_entries += ef
        grand_fixes += tf

    print(f"\n{'='*60}")
    print("DONE")
    print(f"{'='*60}")
    print(f"Entries with fixes: {grand_entries}")
    print(f"Total individual fixes: {grand_fixes}")
    if DRY_RUN:
        print("\nRe-run without --dry-run to apply.")


if __name__ == "__main__":
    main()
