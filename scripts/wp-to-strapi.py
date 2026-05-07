"""Upload extracted carelabz.com WordPress content into Strapi as region=ae.

Reads data/extracted/{pages,services,blogs}/*.json and creates one entry
per file via the Strapi REST API. Skips entries whose slug already exists
for region=ae (so the 9 pre-existing service pages and the 1 case study
are NOT touched).

Mapping:
  pages/home.json    -> home-pages
  pages/about.json   -> about-pages
  pages/contact.json -> contact-pages
  services/*.json    -> service-pages
  blogs/*.json       -> blog-posts
"""

import glob
import json
import os
import re
import time
from pathlib import Path

import requests

STRAPI_URL = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
REGION = "ae"

# Load token from .env.local
for line in Path(".env.local").read_text().splitlines():
    if line.startswith("STRAPI_API_TOKEN="):
        os.environ["STRAPI_API_TOKEN"] = line.split("=", 1)[1].strip().strip('"').strip("'")
        break

TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
if not TOKEN:
    raise SystemExit("STRAPI_API_TOKEN not found in .env.local")

HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}


# ── helpers ────────────────────────────────────────────────────────────────

def create_entry(endpoint: str, payload: dict, label: str = "") -> dict | None:
    url = f"{STRAPI_URL}/api/{endpoint}"
    try:
        resp = requests.post(url, headers=HEADERS, json={"data": payload}, timeout=30)
    except Exception as e:
        print(f"  [ERR] POST {endpoint}: {e}")
        return None
    if resp.status_code in (200, 201):
        print(f"  [OK]  {endpoint:<14}  {label}")
        return resp.json()
    print(f"  [FAIL {resp.status_code}] {endpoint}  {label}\n        {resp.text[:300]}")
    return None


def check_exists(endpoint: str, slug: str) -> bool:
    url = (
        f"{STRAPI_URL}/api/{endpoint}"
        f"?filters[slug][$eq]={slug}&filters[region][$eq]={REGION}"
    )
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
    except Exception:
        return False
    if not resp.ok:
        return False
    return len(resp.json().get("data", [])) > 0


def check_singleton(endpoint: str) -> bool:
    """Check if a region=ae entry exists for singleton-style content
    types (home/about/contact — no slug)."""
    url = f"{STRAPI_URL}/api/{endpoint}?filters[region][$eq]={REGION}"
    try:
        resp = requests.get(url, headers=HEADERS, timeout=15)
    except Exception:
        return False
    if not resp.ok:
        return False
    return len(resp.json().get("data", [])) > 0


def clean_slug(slug: str) -> str:
    slug = slug.lower().strip("-/")
    if not slug.endswith("-ae"):
        slug = f"{slug}-ae"
    return slug


def clean_title(t: str) -> str:
    if not t:
        return ""
    t = re.sub(r"\s*[|\-\u2013]\s*Care[lL]ab[sz]?\s*$", "", t, flags=re.IGNORECASE)
    return t.strip()


def trim(s: str | None, n: int) -> str:
    if not s:
        return ""
    s = s.strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "\u2026"


# ── upload functions ──────────────────────────────────────────────────────

def upload_homepage(extracted: dict):
    if check_singleton("home-pages"):
        print("  [skip] home-pages already exists for region=ae")
        return None
    headings = extracted["content"]["headings"]
    services = []
    for h in headings:
        if h["level"] == 3:
            slug_part = re.sub(r"[^a-z0-9]+", "-", h["text"].lower()).strip("-")
            if not slug_part:
                continue
            services.append({
                "href": f"/ae/{slug_part}/",
                "icon": "Zap",
                "title": h["text"],
                "description": "",
            })
    services = services[:8] or [
        {"href": "/ae/arc-flash-study-ae/", "icon": "Zap", "title": "Arc Flash Study", "description": "IEEE 1584 arc flash hazard analysis"},
        {"href": "/ae/short-circuit-study-analysis-ae/", "icon": "BarChart", "title": "Short Circuit Analysis", "description": "Fault current calculations and protective device evaluation"},
        {"href": "/ae/load-flow-analysis-ae/", "icon": "Settings", "title": "Load Flow Analysis", "description": "Power flow optimization and voltage regulation"},
        {"href": "/ae/relay-coordination-study-and-analysis-ae/", "icon": "Shield", "title": "Relay Coordination", "description": "Protection coordination and selectivity studies"},
        {"href": "/ae/electrical-thermography-inspection-ae/", "icon": "Thermometer", "title": "Thermographic Inspection", "description": "Infrared scanning of electrical systems"},
        {"href": "/ae/circuit-breaker-testing-ae/", "icon": "CheckCircle", "title": "Circuit Breaker Testing", "description": "Performance verification and safety compliance"},
    ]

    payload = {
        "region": REGION,
        "heroHeadline": extracted["content"]["h1"] or "Electrical Safety Demands Precision in UAE",
        "heroSubtext": trim(extracted["seo"]["meta_description"], 200) or "DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.",
        "heroPrimaryCtaText": "Get a Quote",
        "heroPrimaryCtaHref": "/ae/contact-us/",
        "heroSecondaryCtaText": "Our Services",
        "heroSecondaryCtaHref": "/ae/our-services/",
        "servicesHeading": "Our Services",
        "servicesSubtext": "Comprehensive electrical safety and power system engineering",
        "services": services,
        "industriesHeading": "Industries We Serve",
        "industries": [
            {"name": "Oil & Gas", "image": "", "alt": "Oil and Gas"},
            {"name": "Manufacturing", "image": "", "alt": "Manufacturing"},
            {"name": "Healthcare", "image": "", "alt": "Healthcare"},
            {"name": "Data Centers", "image": "", "alt": "Data Centers"},
            {"name": "Commercial", "image": "", "alt": "Commercial Real Estate"},
            {"name": "Hospitality", "image": "", "alt": "Hospitality"},
        ],
        "ctaBannerHeading": "Ready to ensure compliance?",
        "ctaBannerSubtext": "Contact our team for a consultation.",
        "ctaBannerPrimaryText": "Contact Us",
        "ctaBannerPrimaryHref": "/ae/contact-us/",
        "footerEmail": "info@carelabz.com",
        "footerAddress": "Dubai, United Arab Emirates",
        "metaTitle": trim(clean_title(extracted["seo"]["title"]), 60) or "Carelabs UAE — Electrical Safety & Power System Studies",
        "metaDescription": trim(extracted["seo"]["meta_description"], 160) or "DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.",
        "seoKeywords": ["arc flash study UAE", "electrical safety Dubai", "DEWA compliance", "IEEE 1584", "power system analysis"],
        "faqsHeading": "Frequently Asked Questions",
        "faqs": [
            {"question": "What is an arc flash study?", "answer": "An arc flash study is an engineering analysis that evaluates the potential hazards from electrical arc flash events in your facility. It determines incident energy levels, establishes arc flash boundaries, and specifies appropriate PPE requirements per IEEE 1584 and NFPA 70E standards."},
            {"question": "Is an arc flash study mandatory in the UAE?", "answer": "While DEWA regulations require comprehensive electrical safety assessments, arc flash studies following IEEE 1584 are considered best practice for all commercial and industrial facilities in the UAE. Many insurers and facility operators require them as part of their safety compliance programs."},
            {"question": "How long does a typical power system study take?", "answer": "The timeline depends on facility size and complexity. A single arc flash study for a medium facility typically takes two to four weeks from data collection to final report delivery. Larger multi-building campuses or industrial complexes may require six to eight weeks."},
            {"question": "What standards does Carelabs follow?", "answer": "We follow IEEE 1584 for arc flash calculations, NFPA 70E for electrical safety in the workplace, IEC 61482 for protective clothing, IEC 60364 for electrical installations, and local DEWA regulations for UAE-specific compliance requirements."},
            {"question": "Do you provide services across all Emirates?", "answer": "Yes. Carelabs serves clients across Dubai, Abu Dhabi, Sharjah, Ajman, Ras Al Khaimah, Fujairah, and Umm Al Quwain. Our team operates throughout the UAE with project experience across all seven Emirates."},
        ],
        "trustBadges": [
            {"label": "DEWA Approved"},
            {"label": "IEEE 1584"},
            {"label": "NFPA 70E"},
            {"label": "IEC 61482"},
        ],
    }
    return create_entry("home-pages", payload, "homepage")


def upload_about_page(extracted: dict):
    if check_singleton("about-pages"):
        print("  [skip] about-pages already exists for region=ae")
        return None
    body_md = extracted["content"]["body_markdown"] or ""
    payload = {
        "region": REGION,
        "heroHeadline": extracted["content"]["h1"] or "About Carelabs",
        "heroSubtext": trim(extracted["seo"]["meta_description"], 200) or "Electrical safety engineering across the UAE.",
        "missionHeading": "Our Mission",
        "missionBody": trim(body_md, 2000) or "Carelabs is a specialized electrical safety and power system engineering firm serving the UAE and the wider Middle East. We deliver DEWA-compliant arc flash studies, comprehensive power system analyses, and electrical testing services that protect people, facilities, and operations.",
        "valuesHeading": "Our Values",
        "values": [
            {"title": "Safety First", "description": "Every study, every test, every recommendation is designed to protect human life.", "icon": "Shield"},
            {"title": "Technical Precision", "description": "IEEE 1584, NFPA 70E, IEC standards \u2014 we follow the numbers, not assumptions.", "icon": "Target"},
            {"title": "Client Partnership", "description": "We work alongside your engineering team, not around them.", "icon": "Users"},
            {"title": "Continuous Compliance", "description": "Standards evolve. We keep your facility current with DEWA and international requirements.", "icon": "RefreshCw"},
        ],
        "statsHeading": "By the Numbers",
        "stats": [
            {"metric": "Years in UAE", "value": "10+"},
            {"metric": "Facilities Assessed", "value": "500+"},
            {"metric": "Electrical Studies", "value": "2,000+"},
            {"metric": "Emirates Covered", "value": "7"},
        ],
        "certifications": ["DEWA", "IEEE", "NFPA", "IEC", "OSHA"],
        "ctaBannerHeading": "Work With Us",
        "ctaBannerSubtext": "Get in touch to discuss your electrical safety requirements.",
        "ctaBannerPrimaryText": "Contact Us",
        "ctaBannerPrimaryHref": "/ae/contact-us/",
        "metaTitle": "About Carelabs UAE \u2014 Electrical Safety Engineering",
        "metaDescription": "Learn about Carelabs, a specialized electrical safety and power system engineering firm serving the UAE with DEWA-compliant studies and testing services.",
    }
    return create_entry("about-pages", payload, "about")


def upload_contact_page(extracted: dict):
    if check_singleton("contact-pages"):
        print("  [skip] contact-pages already exists for region=ae")
        return None
    payload = {
        "region": REGION,
        "heroHeadline": "Get in Touch",
        "heroSubtext": "Tell us about your facility and compliance requirements.",
        "email": "info@carelabz.com",
        "address": "Dubai, United Arab Emirates",
        "formHeading": "Request a Quote",
        "formSubtext": "Fill out the form below and our engineering team will get back to you within 24 hours.",
        "metaTitle": "Contact Carelabs UAE \u2014 Electrical Safety Consultation",
        "metaDescription": "Contact Carelabs for DEWA-compliant arc flash studies, power system engineering, and electrical safety services across the UAE.",
    }
    return create_entry("contact-pages", payload, "contact")


def upload_service_page(extracted: dict):
    slug = clean_slug(extracted["slug"])
    if check_exists("service-pages", slug):
        print(f"  [skip] service-pages exists: {slug}")
        return None

    title = clean_title(extracted["seo"]["title"]) or extracted["content"]["h1"] or slug.replace("-ae", "").replace("-", " ").title()
    body_text = extracted["content"]["body_markdown"] or ""

    # Try to extract Q&A blocks from body H2/H3 markdown
    faqs = []
    faq_pattern = re.compile(r"(?:^|\n)#+\s*(.*?\?)\s*\n([\s\S]*?)(?=\n#+|\Z)", re.MULTILINE)
    for m in faq_pattern.finditer(body_text):
        q = m.group(1).strip()
        a = m.group(2).strip()
        if q and a:
            faqs.append({"question": q, "answer": trim(a, 300)})

    payload = {
        "title": title,
        "slug": slug,
        "region": REGION,
        "body": trim(body_text, 5000) or f"Professional {title.lower()} services across the UAE. Contact Carelabs for DEWA-compliant electrical safety solutions.",
        "metaTitle": trim(extracted["seo"]["title"] or title, 60),
        "metaDescription": trim(extracted["seo"]["meta_description"], 160) or trim(f"{title} services in Dubai and across the UAE. DEWA-compliant, IEEE 1584 certified.", 160),
        "eyebrow": "Service",
        "ctaPrimaryText": "Request a Quote",
        "ctaPrimaryHref": "/ae/contact-us/",
        "ctaSecondaryText": "All Services",
        "ctaSecondaryHref": "/ae/our-services/",
        "faqs": faqs[:10] or [
            {"question": f"What is {title.lower()}?", "answer": f"{title} is a critical component of electrical safety and compliance. Our team follows IEEE 1584, NFPA 70E, and DEWA standards to deliver thorough, actionable results for your facility."},
            {"question": f"Why is {title.lower()} important?", "answer": f"Regular {title.lower()} helps identify potential hazards, ensures regulatory compliance with DEWA requirements, and protects personnel and equipment from electrical incidents."},
            {"question": f"How often should {title.lower()} be performed?", "answer": f"Industry best practice recommends conducting {title.lower()} every three to five years, or after any major system modification. DEWA may require more frequent assessments for certain facility types."},
        ],
        "processHeading": "Our Process",
        "processSteps": [
            {"number": 1, "title": "Consultation", "description": "We discuss your facility requirements, compliance goals, and project timeline."},
            {"number": 2, "title": "Data Collection", "description": "Our engineers gather system data, single-line diagrams, and equipment specifications on-site."},
            {"number": 3, "title": "Analysis", "description": "We perform the study using industry-standard software and IEEE/IEC methodologies."},
            {"number": 4, "title": "Reporting", "description": "You receive actionable documentation with findings, risk ratings, and remediation recommendations."},
            {"number": 5, "title": "Implementation Support", "description": "We help implement recommendations including labeling, PPE selection, and system modifications."},
            {"number": 6, "title": "Compliance Verification", "description": "Final review ensures full alignment with DEWA regulations and international standards."},
        ],
        "seoKeywords": [
            slug.replace("-ae", "").replace("-", " "),
            f"{title} Dubai", f"{title} UAE",
            "DEWA compliance", "electrical safety",
        ],
        "footerEmail": "info@carelabz.com",
        "footerAddress": "Dubai, United Arab Emirates",
        "ctaBannerHeading": "Need This Service?",
        "ctaBannerBody": "Our engineering team is ready to help with your electrical safety requirements.",
        "ctaBannerPrimaryText": "Get a Quote",
        "ctaBannerPrimaryHref": "/ae/contact-us/",
    }
    return create_entry("service-pages", payload, slug)


def upload_blog_post(extracted: dict):
    slug = clean_slug(extracted["slug"])
    if check_exists("blog-posts", slug):
        print(f"  [skip] blog-posts exists: {slug}")
        return None

    title = clean_title(extracted["seo"]["title"]) or extracted["content"]["h1"] or slug.replace("-ae", "").replace("-", " ").title()
    body_text = extracted["content"]["body_markdown"] or ""

    faqs = []
    faq_pattern = re.compile(r"(?:^|\n)#+\s*(.*?\?)\s*\n([\s\S]*?)(?=\n#+|\Z)", re.MULTILINE)
    for m in faq_pattern.finditer(body_text):
        q = m.group(1).strip()
        a = m.group(2).strip()
        if q and a:
            faqs.append({"question": q, "answer": trim(a, 300)})

    category = "Electrical Testing"
    s = slug
    if any(kw in s for kw in ("study", "analysis", "flow")):
        category = "Power System Studies"
    elif any(kw in s for kw in ("calibration", "calibrat")):
        category = "Calibration"
    elif any(kw in s for kw in ("inspection", "audit", "compliance")):
        category = "Inspection & Compliance"
    elif any(kw in s for kw in ("what-", "how-", "learn-", "why-", "about-")):
        category = "Educational"

    payload = {
        "title": title,
        "slug": slug,
        "region": REGION,
        "category": category,
        "body": trim(body_text, 8000) or f"Learn about {title.lower()} \u2014 an essential aspect of electrical safety and compliance in the UAE.",
        "excerpt": trim(extracted["seo"]["meta_description"], 200) or trim(f"Learn about {title.lower()} \u2014 importance, methodology, and best practices for electrical safety.", 200),
        "author": "Carelabs Engineering Team",
        "publishedDate": "2026-01-01",
        "tags": [category, "Electrical Safety", "UAE", "DEWA"],
        "metaTitle": trim(title, 60),
        "metaDescription": trim(extracted["seo"]["meta_description"], 160) or trim(f"Learn about {title.lower()} \u2014 importance, procedures, and DEWA compliance requirements.", 160),
        "seoKeywords": [
            slug.replace("-ae", "").replace("-", " "),
            f"{title} Dubai",
            "electrical safety UAE",
        ],
        "faqs": faqs[:5] or None,
    }
    return create_entry("blog-posts", payload, slug)


# ── orchestrator ──────────────────────────────────────────────────────────

def main():
    print("=" * 60)
    print("UPLOADING TO STRAPI \u2014 UAE (ae) REGION")
    print("=" * 60)

    print("\n[HOMEPAGE]")
    p = Path("data/extracted/pages/home.json")
    if p.exists():
        upload_homepage(json.loads(p.read_text(encoding="utf-8")))

    print("\n[ABOUT PAGE]")
    p = Path("data/extracted/pages/about.json")
    if p.exists():
        upload_about_page(json.loads(p.read_text(encoding="utf-8")))

    print("\n[CONTACT PAGE]")
    p = Path("data/extracted/pages/contact.json")
    if p.exists():
        upload_contact_page(json.loads(p.read_text(encoding="utf-8")))

    print("\n[SERVICE PAGES]")
    for path in sorted(glob.glob("data/extracted/services/*.json")):
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        upload_service_page(data)
        time.sleep(0.5)

    print("\n[BLOG POSTS]")
    for path in sorted(glob.glob("data/extracted/blogs/*.json")):
        data = json.loads(Path(path).read_text(encoding="utf-8"))
        upload_blog_post(data)
        time.sleep(0.5)

    print("\n" + "=" * 60)
    print("MIGRATION COMPLETE")
    print("=" * 60)


if __name__ == "__main__":
    main()
