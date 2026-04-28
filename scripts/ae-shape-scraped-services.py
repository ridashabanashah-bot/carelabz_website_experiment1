#!/usr/bin/env python3
"""Read data/wp-scrape-report.json, structure each successful scrape into a Strapi
ServicePage payload, and write per-slug JSON files to data/wp-extracts/services/."""

import os, re, json
from pathlib import Path


def clean(text: str) -> str:
    if not text:
        return ""
    # Strip stray markdown markers and Cloudflare artifacts
    text = re.sub(r"\*{2}\s*\*{2}", "", text)
    text = re.sub(r"\*{3,}", "", text)
    text = re.sub(r"(?<![*\s])\*(?![*\s])", "", text)
    text = re.sub(r"(?<=\w)\*(?=\w)", "", text)
    text = text.replace("[email protected]", "info@carelabz.com")
    text = re.sub(r"/cdn-cgi/l/email-protection[^\s\"'<)]*", "mailto:info@carelabz.com", text)
    text = text.replace("nullinfo@", "info@").replace("nullmailto:", "mailto:")
    # Decode common entities
    for ent, rep in {
        "&amp;": "&", "&nbsp;": " ", "&rsquo;": "'", "&lsquo;": "'",
        "&rdquo;": '"', "&ldquo;": '"', "&mdash;": "—", "&ndash;": "–",
        "&hellip;": "—", "&#8217;": "'", "&#8220;": '"', "&#8221;": '"',
    }.items():
        text = text.replace(ent, rep)
    # Collapse spaces and trailing/mid ellipses
    text = re.sub(r"[^\S\n]{2,}", " ", text)
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"\s*\.{3,}\s*", " — ", text)
    text = re.sub(r"\s*…\s*", " — ", text)
    return text.strip()


def split_paragraphs(body: str) -> list[str]:
    return [p.strip() for p in re.split(r"\n{2,}", body) if p.strip() and len(p.strip()) > 20]


def detect_category(slug: str, title: str) -> str:
    s = (slug + " " + title).lower()
    if any(k in s for k in ["calibration"]):
        return "Calibration"
    if any(k in s for k in ["inspection", "audit", "certification"]):
        return "Inspection"
    if any(k in s for k in ["study", "analysis", "assessment"]):
        return "Study & Analysis"
    return "Testing"


def title_to_meta_title(title: str) -> str:
    if not title:
        return ""
    t = title.strip()
    if "Carelabs" in t:
        return t
    return f"{t} | Carelabs UAE"


def derive_eyebrow(category: str, title: str) -> str:
    if category == "Calibration":
        return "ISO 17025 · DEWA"
    if category == "Inspection":
        return "Third-Party · DEWA"
    if category == "Study & Analysis":
        return "IEEE 1584 · DEWA"
    return "Power System Testing · DEWA"


def main():
    report_path = Path("data/wp-scrape-report.json")
    out_dir = Path("data/wp-extracts/services")
    out_dir.mkdir(parents=True, exist_ok=True)

    report = json.loads(report_path.read_text(encoding="utf-8"))
    shaped = []
    skipped = []

    for entry in report:
        slug = entry["slug"]
        if entry["status"] >= 400 or len(entry.get("bodyText", "")) < 200:
            skipped.append({"slug": slug, "reason": f"status {entry['status']} / body {len(entry.get('bodyText', ''))} chars"})
            continue

        title = clean(entry.get("title", "") or slug.replace("-", " ").title())
        meta_desc = clean(entry.get("metaDescription", ""))
        body_clean = clean(entry.get("bodyText", ""))
        paragraphs = split_paragraphs(body_clean)
        lede = paragraphs[0] if paragraphs else ""
        category = detect_category(slug, title)

        # Build markdown body: keep paragraphs, leave headings if marked.
        md_body = "\n\n".join(paragraphs)

        payload = {
            "data": {
                "region": "ae",
                "slug": f"{slug}-ae",
                "title": title.strip(),
                "metaTitle": title_to_meta_title(title),
                "metaDescription": (meta_desc or lede)[:158].rstrip(),
                "eyebrow": derive_eyebrow(category, title),
                "heroImagePath": "",
                "heroImageAlt": title,
                "definitionalLede": lede[:480],
                "body": md_body,
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
                "industriesHeading": "",
                "industries": [],
                "insightsHeading": "",
                "insights": [],
                "navLinks": [],
                "trustBadges": [],
                "faqSectionHeading": "Frequently Asked Questions",
                "faqs": [],
                "ctaBannerHeading": f"Schedule Your {title.split(' in ')[0].strip()}",
                "ctaBannerBody": "Tell us about your project.",
                "ctaBannerPrimaryHref": "/ae/contact/",
                "ctaBannerPrimaryText": "Request a Quote",
                "ctaBannerSecondaryHref": "/ae/services/",
                "ctaBannerSecondaryText": "Browse Services",
                "ctaPrimaryHref": "/ae/contact/",
                "ctaPrimaryText": "Request a Quote",
                "ctaSecondaryHref": "/ae/services/",
                "ctaSecondaryText": "Browse Services",
                "footerEmail": "info@carelabz.com",
                "footerPhone": "+971 4 XXX XXXX",
                "footerAddress": "Dubai, United Arab Emirates",
                "footerDescription": "Carelabs delivers DEWA-compliant electrical safety services across the United Arab Emirates.",
                "seoKeywords": [
                    title.lower(),
                    f"{title.lower()} UAE",
                    f"{title.lower()} Dubai",
                ],
                "lastUpdated": "2026-04-29",
                "publishedAt": None,  # leave null so Strapi keeps draft state by default
            }
        }

        out_path = out_dir / f"{slug}.json"
        out_path.write_text(json.dumps(payload, indent=2), encoding="utf-8")
        shaped.append(slug)

    Path("data/wp-shape-summary.json").write_text(json.dumps({
        "shaped": shaped,
        "skipped": skipped,
    }, indent=2))

    print(f"Shaped: {len(shaped)}")
    print(f"Skipped: {len(skipped)}")
    if skipped:
        for s in skipped:
            print(f"  - {s['slug']}: {s['reason']}")


if __name__ == "__main__":
    main()
