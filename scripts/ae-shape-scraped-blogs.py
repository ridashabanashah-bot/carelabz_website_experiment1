#!/usr/bin/env python3
"""Read wp-blog-scrape-report.json, convert each post's bodyHTML to clean markdown,
and emit per-slug Strapi BlogPost payloads to data/wp-blog-extracts/{slug}.json.

Preserves ALL content from the WP body (no slicing). Hero image URLs are kept as
external URLs in the payload — a separate uploader pass migrates them to Strapi
media before pushing.

Per client instruction: when a Strapi blog-post already exists, the upload script
will only enrich body / author / publishedDate / heroImage / tags / category.
metaTitle / metaDescription / seoKeywords are left alone (SEO-critical).
"""

import os, re, json, sys, subprocess
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
    import markdownify
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4", "markdownify", "--break-system-packages", "-q"])
    import requests
    from bs4 import BeautifulSoup
    import markdownify


def clean_text(text: str) -> str:
    if not text:
        return ""
    # Markdown formatting artifacts
    text = re.sub(r"\*{2}\s*\*{2}", "", text)
    text = re.sub(r"\*{3,}", "", text)
    text = re.sub(r"(?<![*\s])\*(?![*\s])", "", text)
    text = re.sub(r"(?<=\w)\*(?=\w)", "", text)
    # Cloudflare email protection / null prefix
    text = re.sub(r"\[email\s*protected\]", "info@carelabz.com", text)
    text = re.sub(r"/cdn-cgi/l/email-protection[^\s\"'<)]*", "mailto:info@carelabz.com", text)
    text = text.replace("nullinfo@", "info@").replace("nullmailto:", "mailto:")
    # HTML entities
    for ent, rep in {
        "&amp;": "&", "&nbsp;": " ", "&rsquo;": "'", "&lsquo;": "'",
        "&rdquo;": '"', "&ldquo;": '"', "&mdash;": "—", "&ndash;": "–",
        "&hellip;": "—", "&#8217;": "'", "&#8220;": '"', "&#8221;": '"',
    }.items():
        text = text.replace(ent, rep)
    # Whitespace
    text = re.sub(r"[^\S\n]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def html_to_markdown(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    # Remove scripts/styles/nav/footer/aside
    for tag in soup.find_all(["script", "style", "nav", "footer", "aside", "form", "iframe"]):
        tag.decompose()
    # Remove WP-specific share/related blocks
    for sel in [".sharedaddy", ".jp-relatedposts", ".wp-block-buttons", ".wp-block-social-links", ".sd-social", ".addtoany_share_save_container"]:
        for el in soup.select(sel):
            el.decompose()
    # Remove the title <h1> if it's already in the body (we keep it as title field separately)
    h1s = soup.find_all("h1")
    for h in h1s[:1]:
        h.decompose()
    md = markdownify.markdownify(str(soup), heading_style="ATX", bullets="-")
    md = re.sub(r"\n{3,}", "\n\n", md)
    md = clean_text(md)
    return md.strip()


def html_to_excerpt(html: str, max_chars: int = 220) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    for tag in soup.find_all(["script", "style", "h1", "h2", "figure", "img"]):
        tag.decompose()
    text = soup.get_text(" ", strip=True)
    text = clean_text(text)
    if len(text) <= max_chars:
        return text
    cutoff = text[:max_chars].rfind(". ")
    return text[: cutoff + 1] if cutoff > max_chars * 0.6 else text[:max_chars].rstrip() + "."


def normalize_date(s: str) -> str:
    if not s:
        return ""
    s = s.strip()
    # Common WP forms: 2023-01-15T10:30:00+00:00 -> keep as-is
    if "T" in s:
        return s.replace("+00:00", "Z")
    return s


def derive_category(meta_category: str, slug: str, title: str) -> str:
    txt = (meta_category + " " + slug + " " + title).lower()
    if any(k in txt for k in ["arc flash", "arc-flash"]):
        return "Arc Flash"
    if any(k in txt for k in ["safety", "audit", "inspection"]):
        return "Electrical Safety"
    if any(k in txt for k in ["calibration"]):
        return "Calibration"
    if any(k in txt for k in ["thermography", "thermograph"]):
        return "Thermography"
    if any(k in txt for k in ["power quality", "harmonic", "voltage", "current", "load flow", "short circuit", "relay"]):
        return "Power Systems"
    if any(k in txt for k in ["test", "testing"]):
        return "Testing"
    return "Insights"


def derive_keywords(title: str, body_md: str) -> list[str]:
    base = title.lower()
    kws = [base, f"{base} UAE", f"{base} Dubai"]
    return list(dict.fromkeys(k for k in kws if k))


def main():
    report = json.loads(Path("data/wp-blog-scrape-report.json").read_text(encoding="utf-8"))
    out_dir = Path("data/wp-blog-extracts")
    out_dir.mkdir(parents=True, exist_ok=True)

    shaped, skipped = [], []
    for entry in report:
        slug = entry["slug"]
        if entry.get("status", 0) >= 400 or len(entry.get("bodyHTML", "")) < 200:
            skipped.append({"slug": slug, "reason": f"status {entry.get('status')} body {len(entry.get('bodyHTML',''))}c"})
            continue

        title = clean_text(entry.get("title") or slug.replace("-", " ").title())
        meta_desc = clean_text(entry.get("metaDescription") or "")
        published = normalize_date(entry.get("publishedDate") or "")
        modified = normalize_date(entry.get("modifiedDate") or "")
        author = clean_text(entry.get("author") or "Carelabs Engineering Team") or "Carelabs Engineering Team"
        category = derive_category(entry.get("category") or "", slug, title)
        tags = entry.get("tags") or []

        body_md = html_to_markdown(entry.get("bodyHTML", ""))
        excerpt = clean_text(entry.get("metaDescription") or "") or html_to_excerpt(entry.get("bodyHTML", ""))

        hero = (entry.get("heroImage") or "").strip()
        hero_alt = clean_text(entry.get("heroImageAlt") or title)

        payload = {
            "data": {
                "region": "ae",
                "slug": f"{slug}-ae",
                "title": title,
                "metaTitle": f"{title} | Carelabs UAE",
                "metaDescription": (meta_desc or excerpt)[:158].rstrip(),
                "excerpt": excerpt[:480],
                "body": body_md,
                "author": author,
                "category": category,
                "tags": tags,
                "publishedDate": published or None,
                "heroImage": hero,
                "heroImageAlt": hero_alt,
                "seoKeywords": derive_keywords(title, body_md),
                "publishedAt": None,  # set by publish step
            },
            "_source": {
                "wp_url": entry.get("url"),
                "wp_screenshot": entry.get("screenshot"),
                "wp_body_chars": len(body_md),
            },
        }

        out_path = out_dir / f"{slug}.json"
        out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        shaped.append(slug)

    Path("data/wp-blog-shape-summary.json").write_text(json.dumps({
        "shaped": shaped, "skipped": skipped,
    }, indent=2), encoding="utf-8")

    print(f"Shaped: {len(shaped)}")
    print(f"Skipped: {len(skipped)}")
    for s in skipped:
        print(f"  - {s['slug']}: {s['reason']}")


if __name__ == "__main__":
    main()
