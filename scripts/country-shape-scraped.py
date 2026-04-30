#!/usr/bin/env python3
"""Shape per-country scraped WP content into Strapi blog-post or service-page payloads.

Usage:
  python3 scripts/country-shape-scraped.py {cc} {blog|service}

Output:
  data/{cc}/wp-{kind}-extracts/{slug}.json
"""

import os, sys, re, json, subprocess
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
    text = re.sub(r"\*{2}\s*\*{2}", "", text)
    text = re.sub(r"\*{3,}", "", text)
    text = re.sub(r"(?<![*\s])\*(?![*\s])", "", text)
    text = re.sub(r"(?<=\w)\*(?=\w)", "", text)
    text = re.sub(r"\[email\s*protected\]", "info@carelabz.com", text)
    text = re.sub(r"/cdn-cgi/l/email-protection[^\s\"'<)]*", "mailto:info@carelabz.com", text)
    text = text.replace("nullinfo@", "info@").replace("nullmailto:", "mailto:")
    for ent, rep in {
        "&amp;": "&", "&nbsp;": " ", "&rsquo;": "'", "&lsquo;": "'",
        "&rdquo;": '"', "&ldquo;": '"', "&mdash;": "—", "&ndash;": "–",
        "&hellip;": "—", "&#8217;": "'", "&#8220;": '"', "&#8221;": '"',
    }.items():
        text = text.replace(ent, rep)
    text = re.sub(r"[^\S\n]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    return text.strip()


def _extract_main_node(soup: BeautifulSoup):
    """Pick the densest content node — handle stock WP, Elementor, and Bethemes."""
    # Strip globals
    for tag in soup.find_all(["script", "style", "nav", "footer", "header", "aside", "form", "iframe", "noscript"]):
        tag.decompose()
    for sel in [
        ".sharedaddy", ".jp-relatedposts", ".wp-block-buttons", ".wp-block-social-links",
        ".sd-social", ".addtoany_share_save_container", ".elementor-button-wrapper",
        ".eael-grid-post", ".eael-post-grid", ".elementor-widget-wp-widget-recent-posts",
        "#cookie-notice", ".cookie-notice", ".moove-gdpr-cookie-modal", ".cli-bar-container",
        ".elementor-widget-mega-menu", ".elementor-nav-menu", ".elementor-location-header",
        ".elementor-location-footer", ".woocommerce-breadcrumb",
    ]:
        for el in soup.select(sel):
            el.decompose()

    # Try standard containers first
    for sel in [".entry-content", "article .content", 'div[data-elementor-type="wp-post"]',
                "main article", "main"]:
        node = soup.select_one(sel)
        if node and len(node.get_text(strip=True)) > 200:
            return node

    # Aggregate Elementor heading + text-editor + image widgets
    fragments = []
    for w in soup.select(".elementor-widget-heading, .elementor-widget-text-editor, .elementor-widget-image"):
        if w.find_parent(class_="elementor-location-header") or w.find_parent(class_="elementor-location-footer"):
            continue
        text = w.get_text(strip=True)
        if not text or len(text) < 3:
            continue
        if text.lower() in {"read more", "find out more", "enquire now", "chat with us", "email us", "contact us"}:
            continue
        fragments.append(str(w))
    if fragments:
        new_soup = BeautifulSoup("<div>" + "".join(fragments) + "</div>", "html.parser")
        return new_soup.div
    return soup


def html_to_markdown(html: str) -> str:
    if not html:
        return ""
    soup = BeautifulSoup(html, "html.parser")
    node = _extract_main_node(soup)
    h1s = node.find_all("h1")
    for h in h1s[:1]:
        h.decompose()
    md = markdownify.markdownify(str(node), heading_style="ATX", bullets="-")
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
    return s.replace("+00:00", "Z") if "T" in s else s


def derive_blog_category(meta: str, slug: str, title: str) -> str:
    txt = (meta + " " + slug + " " + title).lower()
    if "arc flash" in txt or "arc-flash" in txt: return "Arc Flash"
    if any(k in txt for k in ["safety", "audit", "inspection"]): return "Electrical Safety"
    if "calibration" in txt: return "Calibration"
    if "thermograph" in txt: return "Thermography"
    if any(k in txt for k in ["power quality", "harmonic", "voltage", "current", "load flow", "short circuit", "relay"]):
        return "Power Systems"
    if "test" in txt: return "Testing"
    return "Insights"


def derive_service_category(slug: str, title: str) -> str:
    txt = (slug + " " + title).lower()
    if "calibration" in txt: return "Calibration"
    if any(k in txt for k in ["inspection", "audit", "certification"]): return "Inspection"
    if any(k in txt for k in ["study", "analysis", "assessment"]): return "Study & Analysis"
    return "Testing"


def derive_eyebrow(category: str) -> str:
    if category == "Calibration": return "ISO 17025 · Compliance"
    if category == "Inspection": return "Third-Party · Standards"
    if category == "Study & Analysis": return "IEEE 1584 · Engineering"
    return "Power System Testing"


def main():
    if len(sys.argv) < 3:
        print("Usage: country-shape-scraped.py {cc} {blog|service}")
        sys.exit(1)
    cc = sys.argv[1]
    kind = sys.argv[2]

    report_path = Path(f"data/{cc}/wp-{kind}-scrape-report.json")
    if not report_path.exists():
        print(f"No scrape report at {report_path}. Run scrape first.")
        sys.exit(1)
    out_dir = Path(f"data/{cc}/wp-{kind}-extracts")
    out_dir.mkdir(parents=True, exist_ok=True)

    report = json.loads(report_path.read_text(encoding="utf-8"))
    shaped, skipped = [], []

    for entry in report:
        slug = entry["slug"]
        if entry.get("status", 0) >= 400 or len(entry.get("bodyHTML", "")) < 200:
            skipped.append({"slug": slug, "reason": f"status {entry.get('status')} body {len(entry.get('bodyHTML',''))}c"})
            continue

        title = clean_text(entry.get("title") or slug.replace("-", " ").title())
        meta_desc = clean_text(entry.get("metaDescription") or "")
        body_md = html_to_markdown(entry.get("bodyHTML", ""))
        excerpt = clean_text(entry.get("metaDescription") or "") or html_to_excerpt(entry.get("bodyHTML", ""))
        published = normalize_date(entry.get("publishedDate") or "")

        if kind == "blog":
            category = derive_blog_category(entry.get("category", ""), slug, title)
            payload = {
                "data": {
                    "region": cc,
                    "slug": f"{slug}-{cc}",
                    "title": title,
                    "metaTitle": f"{title} | Carelabs",
                    "metaDescription": (meta_desc or excerpt)[:158].rstrip(),
                    "excerpt": excerpt[:480],
                    "body": body_md,
                    "author": clean_text(entry.get("author") or "Carelabs Engineering Team") or "Carelabs Engineering Team",
                    "category": category,
                    "tags": entry.get("tags") or [],
                    "publishedDate": published or None,
                    "heroImage": (entry.get("heroImage") or "").strip(),
                    "heroImageAlt": clean_text(entry.get("heroImageAlt") or title),
                    "seoKeywords": [title.lower(), f"{title.lower()} {cc.upper()}"],
                    "publishedAt": None,
                },
                "_source": {"wp_url": entry.get("url"), "wp_screenshot": entry.get("screenshot"), "body_chars": len(body_md)},
            }
        else:  # service
            category = derive_service_category(slug, title)
            paragraphs = [p for p in body_md.split("\n\n") if p.strip()]
            lede = paragraphs[0] if paragraphs else ""
            payload = {
                "data": {
                    "region": cc,
                    "slug": f"{slug}-{cc}",
                    "title": title,
                    "metaTitle": f"{title} | Carelabs",
                    "metaDescription": (meta_desc or excerpt)[:158].rstrip(),
                    "eyebrow": derive_eyebrow(category),
                    "heroImagePath": (entry.get("heroImage") or "").strip(),
                    "heroImageAlt": clean_text(entry.get("heroImageAlt") or title),
                    "definitionalLede": lede[:480],
                    "body": body_md,
                    "featuresHeading": "Why Facilities Trust Carelabs",
                    "featuresSubtext": "",
                    "features": [],
                    "processHeading": "How We Work",
                    "processSteps": [],
                    "safetyEyebrow": "",
                    "safetyHeading": "",
                    "safetyBody": "",
                    "safetyImage": "",
                    "safetyImageAlt": "",
                    "safetyBullets": [],
                    "reportsEyebrow": "Deliverables",
                    "reportsHeading": "What You Receive",
                    "reportsBody": "",
                    "reportsImage": "",
                    "reportsImageAlt": "",
                    "reportsBullets": [],
                    "industries": [],
                    "insights": [],
                    "navLinks": [],
                    "trustBadges": [],
                    "faqSectionHeading": "Frequently Asked Questions",
                    "faqs": [],
                    "ctaBannerHeading": f"Schedule Your {title.split(' in ')[0].strip()}",
                    "ctaBannerBody": "Tell us about your project.",
                    "ctaBannerPrimaryHref": f"/{cc}/contact-us/",
                    "ctaBannerPrimaryText": "Request a Quote",
                    "ctaBannerSecondaryHref": f"/{cc}/our-services/",
                    "ctaBannerSecondaryText": "Browse Services",
                    "ctaPrimaryHref": f"/{cc}/contact-us/",
                    "ctaPrimaryText": "Request a Quote",
                    "ctaSecondaryHref": f"/{cc}/our-services/",
                    "ctaSecondaryText": "Browse Services",
                    "footerEmail": "info@carelabz.com",
                    "footerPhone": "",
                    "footerAddress": "",
                    "footerDescription": "",
                    "seoKeywords": [title.lower(), f"{title.lower()} {cc.upper()}"],
                    "publishedAt": None,
                },
                "_source": {"wp_url": entry.get("url"), "wp_screenshot": entry.get("screenshot"), "body_chars": len(body_md)},
            }

        out_path = out_dir / f"{slug}.json"
        out_path.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        shaped.append(slug)

    Path(f"data/{cc}/wp-{kind}-shape-summary.json").write_text(
        json.dumps({"shaped": shaped, "skipped": skipped}, indent=2),
        encoding="utf-8",
    )
    print(f"Shaped: {len(shaped)} | Skipped: {len(skipped)}")


if __name__ == "__main__":
    main()
