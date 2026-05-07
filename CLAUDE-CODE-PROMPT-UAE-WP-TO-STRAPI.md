# Claude Code Prompt — Migrate ALL WordPress Content to Strapi for UAE (AE)

Copy everything below the line into Claude Code.

---

## Task: Scrape every page from carelabz.com and push all content to Strapi CMS as `region=ae`

**Branch:** `migration/ae-wordpress-to-strapi`

Read `CLAUDE.md` before starting.

**Goal:** The live WordPress site at `carelabz.com` has ~80 real content pages (services, blog posts, homepage, about, contact). Scrape ALL of them, transform the content into Strapi-compatible payloads, and create entries via the Strapi REST API. When done, every page on the old site should have a corresponding Strapi entry with `region=ae`.

---

## Prerequisites

```bash
pip install requests beautifulsoup4 markdownify --break-system-packages
source .env.local
```

The Strapi API token is in `.env.local` as `STRAPI_API_TOKEN`.
Strapi Cloud URL: `https://rational-cheese-8e8c4f80ea.strapiapp.com`

---

## Step 1: Build the URL list

These are ALL the real content pages on carelabz.com (excluding attachment pages, image sub-URLs, category/tag archives, and junk pages). Categorize each URL by content type.

### Homepage (1 page → Strapi `home-pages`)
```
https://carelabz.com/
```

### About Page (1 page → Strapi `about-pages`)
```
https://carelabz.com/about-carelabs/
```

### Contact Page (1 page → Strapi `contact-pages`)
```
https://carelabz.com/contact-us/
```

### Service Pages (~50 pages → Strapi `service-pages`)
These are service/testing/study pages. Each becomes a ServicePage entry.

```
https://carelabz.com/arc-flash-study-analysis/
https://carelabz.com/arc-flash-study/
https://carelabz.com/automatic-transfer-switch-testing-service/
https://carelabz.com/battery-testing-services-dubai-uae/
https://carelabz.com/biomedical-equipment-safety-inspection-services/
https://carelabz.com/biomedical-equipment-safety-testing-services/
https://carelabz.com/building-envelope-infrared-thermography-inspection-service/
https://carelabz.com/cable-testing/
https://carelabz.com/capacitor-bank-test/
https://carelabz.com/circuit-breaker-testing/
https://carelabz.com/commercial-electrical-inspection-services-dubai-uae/
https://carelabz.com/commercial-electrical-testing/
https://carelabz.com/contact-resistance-testing-service/
https://carelabz.com/continuity-testing/
https://carelabz.com/earth-fault-loop-impedence-test/
https://carelabz.com/earth-ground-testing-service/
https://carelabz.com/electric-motor-testing/
https://carelabz.com/electric-switchgear-testing-services/
https://carelabz.com/electrical-calibration/
https://carelabz.com/electrical-compliance-inspection/
https://carelabz.com/electrical-installations-certification-service/
https://carelabz.com/electrical-safety-audit-service/
https://carelabz.com/electrical-safety-auditing-inspection-service/
https://carelabz.com/electrical-safety-testing/
https://carelabz.com/electrical-switchgear-risk-assessment-study-hazard-analysis-service/
https://carelabz.com/electrical-switchgear-safety-inspection-services/
https://carelabz.com/electrical-thermography-inspection/
https://carelabz.com/energy-auditing-service/
https://carelabz.com/factory-acceptance-testing-services/
https://carelabz.com/fixed-electrical-testing/
https://carelabz.com/fixed-wire-testing/
https://carelabz.com/frequency-stability-analysis/
https://carelabz.com/generator-load-bank-testing/
https://carelabz.com/gfci-standard-inspection-service/
https://carelabz.com/ground-fault-testing/
https://carelabz.com/grounding-grid-study-analysis/
https://carelabz.com/grounding-system-design-and-planning/
https://carelabz.com/harmonic-study-analysis/
https://carelabz.com/insulation-resistance-test-service/
https://carelabz.com/leakage-current-measurement/
https://carelabz.com/lightning-arrester-testing-service/
https://carelabz.com/lightning-arrester-testing/
https://carelabz.com/live-testing/
https://carelabz.com/load-flow-analysis/
https://carelabz.com/mcc-panel-operation-testing/
https://carelabz.com/megger-test/
https://carelabz.com/motor-acceleration-study-analysis/
https://carelabz.com/pfc-psc-test/
https://carelabz.com/polarity-test-service/
https://carelabz.com/portable-appliance-testing-dubai-uae/
https://carelabz.com/power-quality-study-analysis/
https://carelabz.com/power-restoration-optimization/
https://carelabz.com/power-system-study-analysis/
https://carelabz.com/primary-current-injection-test/
https://carelabz.com/prospective-short-circuit-test-prospective-fault-current-test/
https://carelabz.com/protection-relay-testing-services/
https://carelabz.com/protective-devices-testing-services/
https://carelabz.com/relay-coordination-study-and-analysis/
https://carelabz.com/residual-current-device-testing-safety/
https://carelabz.com/residual-current-device-testing-safety-2/
https://carelabz.com/secondary-current-injection-test/
https://carelabz.com/short-circuit-study-analysis/
https://carelabz.com/soil-resistivity-test/
https://carelabz.com/third-party-electrical-certification/
https://carelabz.com/third-party-electrical-inspection-company-uae/
https://carelabz.com/third-party-inspection-electrical-installation/
https://carelabz.com/torque-test/
https://carelabz.com/unbalanced-load-flow-study-analysis/
https://carelabz.com/vibration-study-and-analysis/
https://carelabz.com/voltage-drop-study-analysis/
https://carelabz.com/voltage-imbalance-study/
```

### Calibration Service Pages (~7 pages → also Strapi `service-pages`)
```
https://carelabz.com/bain-marie-calibration/
https://carelabz.com/blast-chiller-calibration/
https://carelabz.com/blast-freezer-calibration/
https://carelabz.com/calibrator-calibration/
https://carelabz.com/chiller-calibration/
https://carelabz.com/digital-thermometer-calibration/
```

### Blog Posts (~25 pages → Strapi `blog-posts`)
These are educational/informational articles (the "what is", "how is it done", "learn about" pages).

```
https://carelabz.com/megger-test-performed/
https://carelabz.com/about-earth-fault-loop-impedence-test/
https://carelabz.com/electrical-infrared-thermography-inspection-important/
https://carelabz.com/electrical-installation-inspection-fulfilling-trakhees-guidelines-to-procure-operation-fitness-certificate-ofc/
https://carelabz.com/how-what-why-generator-load-bank-testing-done/
https://carelabz.com/learn-about-residual-current-device-testing-safety/
https://carelabz.com/learn-continuity-testing-what-how/
https://carelabz.com/learn-how-insulation-resistance-test-done/
https://carelabz.com/learn-what-is-earth-ground-test-why-and-how-is-it-done/
https://carelabz.com/need-conduct-electrical-safety-testing/
https://carelabz.com/protecting-electrical-systems/
https://carelabz.com/purpose-lightning-arrester-testing-necessary/
https://carelabz.com/thermography-test-of-electrical-panels/
https://carelabz.com/thermography-testing-of-electrical-equipment/
https://carelabz.com/what-automatic-transfer-switch-testing-how-automatic-transfer-switch-testing-done/
https://carelabz.com/what-cable-testing-how-cable-testing-done/
https://carelabz.com/what-capacitor-bank-testing-why-capacitor-bank-testing-done/
https://carelabz.com/what-circuit-breaker-testing-how-circuit-breaker-testing-done/
https://carelabz.com/what-contact-resistance-test-why-contact-resistance-testing-done/
https://carelabz.com/what-earth-grounding/
https://carelabz.com/what-factory-acceptance-testing-how-fat-done/
https://carelabz.com/what-ground-fault-testing-why-ground-fault-testing-important/
https://carelabz.com/what-how-grounding-design-planning/
https://carelabz.com/what-how-harmonic-study-analysis-done/
https://carelabz.com/what-is-electric-motor-testing-and-why-is-it-done/
https://carelabz.com/what-is-soil-resistivity-test-how-is-soil-resistivity-testing-done/
https://carelabz.com/what-is-torque-testing-how-is-torque-testing-done/
https://carelabz.com/what-leakage-current-testing-measuring-how-leakage-current-testing-measuring-done/
https://carelabz.com/what-motor-acceleration-study-analysis/
https://carelabz.com/what-pat-test-why-pat-test-done/
https://carelabz.com/what-polarity-test-why-conduct-polarity-test/
https://carelabz.com/what-protective-device-testing-how-done/
https://carelabz.com/what-short-circuit-analysis-done-why/
https://carelabz.com/what-voltage-drop-study-analysis/
https://carelabz.com/what-why-load-flow-analysis-power-flow-analysis-done/
https://carelabz.com/what-you-need-to-know-about-arc-flash/
https://carelabz.com/what-you-need-to-know-about-arc-flash-hazard-study-and-analysis/
https://carelabz.com/why-how-what-automatic-transfer-switch-testing-done/
```

---

## Step 2: Create the extraction script

Create `scripts/wp-extract-all.py` that:

1. Takes a URL
2. Fetches the page HTML
3. Extracts:
   - `<title>` tag → `metaTitle`
   - `<meta name="description">` → `metaDescription`
   - `<meta property="og:*">` tags
   - `<link rel="canonical">` → canonical URL
   - `<h1>` → page heading
   - Main content area (look for `entry-content`, `elementor-widget-container`, `page-content`, or `<article>` tag)
   - All `<h2>`, `<h3>` headings within body
   - All `<img>` tags with `src` and `alt`
   - All `<ul>/<ol>` lists
4. Converts body HTML to clean Markdown using `markdownify`
5. Cleans WordPress artifacts:
   - Remove inline styles
   - Remove CSS classes
   - Remove empty `<p>` and `<div>` tags
   - Decode HTML entities (`&amp;` → `&`, `&#8217;` → `'`, etc.)
   - Remove Elementor/WPBakery wrapper divs
   - Strip `wp-image-XXXX` classes
6. Returns a JSON object with all extracted data

```python
import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md
import json
import re
import time

HEADERS = {"User-Agent": "Mozilla/5.0 (Carelabs Migration Bot)"}

def extract_page(url):
    """Extract content and metadata from a WordPress page."""
    resp = requests.get(url, headers=HEADERS, timeout=30)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    # SEO metadata
    title_tag = soup.find("title")
    meta_desc = soup.find("meta", attrs={"name": "description"})
    canonical = soup.find("link", attrs={"rel": "canonical"})
    og_tags = {}
    for tag in soup.find_all("meta", attrs={"property": re.compile(r"^og:")}):
        og_tags[tag["property"]] = tag.get("content", "")

    # H1
    h1 = soup.find("h1")
    h1_text = h1.get_text(strip=True) if h1 else ""

    # Main content — try multiple selectors
    content_el = (
        soup.find("div", class_="entry-content")
        or soup.find("div", class_="elementor-widget-container")
        or soup.find("article")
        or soup.find("main")
    )

    body_html = ""
    body_md = ""
    headings = []
    images = []

    if content_el:
        # Remove scripts, styles, nav, footer from content
        for tag in content_el.find_all(["script", "style", "nav", "footer", "header"]):
            tag.decompose()

        # Remove inline styles and classes
        for tag in content_el.find_all(True):
            if "style" in tag.attrs:
                del tag.attrs["style"]
            if "class" in tag.attrs:
                del tag.attrs["class"]

        body_html = str(content_el)
        body_md = md(body_html, heading_style="ATX", strip=["img"]).strip()

        # Clean markdown
        body_md = re.sub(r"\n{3,}", "\n\n", body_md)
        body_md = re.sub(r"^\s+$", "", body_md, flags=re.MULTILINE)

        # Extract headings
        for h in content_el.find_all(["h2", "h3", "h4"]):
            headings.append({
                "level": int(h.name[1]),
                "text": h.get_text(strip=True)
            })

        # Extract images
        for img in content_el.find_all("img"):
            src = img.get("src", "")
            if src and not src.startswith("data:"):
                images.append({
                    "src": src,
                    "alt": img.get("alt", ""),
                    "width": img.get("width"),
                    "height": img.get("height")
                })

    # Clean title
    clean_title = title_tag.get_text(strip=True) if title_tag else h1_text
    clean_title = re.sub(r"\s*[|\-–]\s*Carelabs?\s*$", "", clean_title, flags=re.IGNORECASE)
    clean_title = re.sub(r"\s*[|\-–]\s*Carelabz?\s*$", "", clean_title, flags=re.IGNORECASE)

    return {
        "source_url": url,
        "slug": url.rstrip("/").split("/")[-1],
        "seo": {
            "title": clean_title,
            "meta_description": meta_desc["content"] if meta_desc and meta_desc.get("content") else "",
            "canonical": canonical["href"] if canonical else url,
            "og": og_tags,
        },
        "content": {
            "h1": h1_text,
            "body_html": body_html,
            "body_markdown": body_md,
            "headings": headings,
            "images": images,
        }
    }
```

**Rate limit:** Add `time.sleep(1)` between requests to avoid hammering the server.

---

## Step 3: Create the Strapi upload script

Create `scripts/wp-to-strapi.py` that reads extracted data and pushes to Strapi.

```python
import requests
import json
import os
import time
import re

STRAPI_URL = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
TOKEN = os.environ.get("STRAPI_API_TOKEN")
HEADERS = {
    "Authorization": f"Bearer {TOKEN}",
    "Content-Type": "application/json",
}
REGION = "ae"

def create_entry(endpoint, payload):
    """Create a Strapi entry. Returns the response JSON or raises."""
    url = f"{STRAPI_URL}/api/{endpoint}"
    resp = requests.post(url, headers=HEADERS, json={"data": payload})
    if resp.status_code in (200, 201):
        print(f"  ✅ Created: {payload.get('title') or payload.get('heroHeadline', 'entry')}")
        return resp.json()
    else:
        print(f"  ❌ Failed ({resp.status_code}): {resp.text[:200]}")
        return None

def check_exists(endpoint, slug):
    """Check if an entry with this slug already exists."""
    url = f"{STRAPI_URL}/api/{endpoint}?filters[slug][$eq]={slug}&filters[region][$eq]={REGION}"
    resp = requests.get(url, headers=HEADERS)
    if resp.ok:
        data = resp.json().get("data", [])
        return len(data) > 0
    return False

def clean_slug(slug):
    """Ensure slug is clean and append -ae suffix if needed."""
    slug = slug.lower().strip("-/")
    # Don't double-append -ae
    if not slug.endswith("-ae"):
        slug = f"{slug}-ae"
    return slug
```

---

## Step 4: Run the full extraction + upload pipeline

### 4A: Extract ALL pages

```python
# In scripts/wp-extract-all.py — add main block

SERVICES = [
    # All service URLs from the list above
]

BLOGS = [
    # All blog URLs from the list above
]

PAGES = {
    "home": "https://carelabz.com/",
    "about": "https://carelabz.com/about-carelabs/",
    "contact": "https://carelabz.com/contact-us/",
}

if __name__ == "__main__":
    os.makedirs("data/extracted/services", exist_ok=True)
    os.makedirs("data/extracted/blogs", exist_ok=True)
    os.makedirs("data/extracted/pages", exist_ok=True)

    # Extract pages
    for name, url in PAGES.items():
        print(f"Extracting {name}: {url}")
        data = extract_page(url)
        with open(f"data/extracted/pages/{name}.json", "w") as f:
            json.dump(data, f, indent=2)
        time.sleep(1)

    # Extract services
    for url in SERVICES:
        slug = url.rstrip("/").split("/")[-1]
        print(f"Extracting service: {slug}")
        data = extract_page(url)
        with open(f"data/extracted/services/{slug}.json", "w") as f:
            json.dump(data, f, indent=2)
        time.sleep(1)

    # Extract blogs
    for url in BLOGS:
        slug = url.rstrip("/").split("/")[-1]
        print(f"Extracting blog: {slug}")
        data = extract_page(url)
        with open(f"data/extracted/blogs/{slug}.json", "w") as f:
            json.dump(data, f, indent=2)
        time.sleep(1)

    print(f"\n✅ Done. Extracted {len(PAGES) + len(SERVICES) + len(BLOGS)} pages.")
```

### 4B: Upload to Strapi

Create `scripts/wp-to-strapi.py` with upload functions for each content type:

```python
def upload_homepage(extracted):
    """Create HomePage entry from extracted WP homepage data."""
    # Extract services list from homepage content (usually rendered as a grid/list)
    services = []
    for h in extracted["content"]["headings"]:
        if h["level"] == 3:  # Service titles are usually h3 on WP homepage
            slug = re.sub(r"[^a-z0-9]+", "-", h["text"].lower()).strip("-")
            services.append({
                "href": f"/ae/services/{slug}/",
                "icon": "Zap",
                "title": h["text"],
                "description": ""
            })

    payload = {
        "region": REGION,
        "heroHeadline": extracted["content"]["h1"] or "Electrical Safety Demands Precision.",
        "heroSubtext": extracted["seo"]["meta_description"],
        "heroPrimaryCtaText": "Get a Quote",
        "heroPrimaryCtaHref": "/ae/contact/",
        "heroSecondaryCtaText": "Our Services",
        "heroSecondaryCtaHref": "/ae/services/",
        "servicesHeading": "Our Services",
        "servicesSubtext": "Comprehensive electrical safety and power system engineering",
        "services": services[:8] if services else [
            {"href": "/ae/services/arc-flash-study-ae/", "icon": "Zap", "title": "Arc Flash Study", "description": "IEEE 1584 arc flash hazard analysis"},
            {"href": "/ae/services/short-circuit-study-analysis-ae/", "icon": "BarChart", "title": "Short Circuit Analysis", "description": "Fault current calculations and protective device evaluation"},
            {"href": "/ae/services/load-flow-analysis-ae/", "icon": "Settings", "title": "Load Flow Analysis", "description": "Power flow optimization and voltage regulation"},
            {"href": "/ae/services/relay-coordination-study-and-analysis-ae/", "icon": "Shield", "title": "Relay Coordination", "description": "Protection coordination and selectivity studies"},
            {"href": "/ae/services/electrical-thermography-inspection-ae/", "icon": "Thermometer", "title": "Thermographic Inspection", "description": "Infrared scanning of electrical systems"},
            {"href": "/ae/services/circuit-breaker-testing-ae/", "icon": "CheckCircle", "title": "Circuit Breaker Testing", "description": "Performance verification and safety compliance"},
        ],
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
        "ctaBannerPrimaryHref": "/ae/contact/",
        "footerEmail": "info@carelabz.com",
        "footerAddress": "Dubai, United Arab Emirates",
        "metaTitle": extracted["seo"]["title"][:60] if extracted["seo"]["title"] else "Carelabs UAE — Electrical Safety & Power System Studies",
        "metaDescription": extracted["seo"]["meta_description"][:160] if extracted["seo"]["meta_description"] else "DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.",
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
    return create_entry("home-pages", payload)


def upload_about_page(extracted):
    """Create AboutPage entry from extracted WP about page."""
    payload = {
        "region": REGION,
        "heroHeadline": extracted["content"]["h1"] or "About Carelabs",
        "heroSubtext": extracted["seo"]["meta_description"] or "Electrical safety engineering across the UAE.",
        "missionHeading": "Our Mission",
        "missionBody": extracted["content"]["body_markdown"][:2000] if extracted["content"]["body_markdown"] else "Carelabs is a specialized electrical safety and power system engineering firm serving the UAE and the wider Middle East. We deliver DEWA-compliant arc flash studies, comprehensive power system analyses, and electrical testing services that protect people, facilities, and operations.",
        "valuesHeading": "Our Values",
        "values": [
            {"title": "Safety First", "description": "Every study, every test, every recommendation is designed to protect human life.", "icon": "Shield"},
            {"title": "Technical Precision", "description": "IEEE 1584, NFPA 70E, IEC standards — we follow the numbers, not assumptions.", "icon": "Target"},
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
        "ctaBannerPrimaryHref": "/ae/contact/",
        "metaTitle": "About Carelabs UAE — Electrical Safety Engineering",
        "metaDescription": "Learn about Carelabs, a specialized electrical safety and power system engineering firm serving the UAE with DEWA-compliant studies and testing services.",
    }
    return create_entry("about-pages", payload)


def upload_contact_page(extracted):
    """Create ContactPage entry from extracted WP contact page."""
    payload = {
        "region": REGION,
        "heroHeadline": "Get in Touch",
        "heroSubtext": "Tell us about your facility and compliance requirements.",
        "email": "info@carelabz.com",
        "address": "Dubai, United Arab Emirates",
        "formHeading": "Request a Quote",
        "formSubtext": "Fill out the form below and our engineering team will get back to you within 24 hours.",
        "metaTitle": "Contact Carelabs UAE — Electrical Safety Consultation",
        "metaDescription": "Contact Carelabs for DEWA-compliant arc flash studies, power system engineering, and electrical safety services across the UAE.",
    }
    return create_entry("contact-pages", payload)


def upload_service_page(extracted):
    """Create ServicePage entry from extracted WP service page."""
    slug = clean_slug(extracted["slug"])

    # Skip if already exists
    if check_exists("service-pages", slug):
        print(f"  ⏩ Skipped (exists): {slug}")
        return None

    # Generate FAQs from headings if none extracted
    faqs = []
    body_text = extracted["content"]["body_markdown"] or ""

    # Try to extract FAQ-like content from the body
    faq_pattern = re.compile(r"(?:^|\n)#+\s*(.*?\?)\s*\n([\s\S]*?)(?=\n#+|\Z)", re.MULTILINE)
    for match in faq_pattern.finditer(body_text):
        q = match.group(1).strip()
        a = match.group(2).strip()[:300]
        if q and a:
            faqs.append({"question": q, "answer": a})

    # Clean the title
    title = extracted["seo"]["title"] or extracted["content"]["h1"] or slug.replace("-", " ").title()
    # Remove "| Carelabs" suffixes
    title = re.sub(r"\s*[|\-–]\s*Carelabs?\s*$", "", title, flags=re.IGNORECASE)

    payload = {
        "title": title,
        "slug": slug,
        "region": REGION,
        "body": body_text[:5000] if body_text else f"Professional {title.lower()} services across the UAE. Contact Carelabs for DEWA-compliant electrical safety solutions.",
        "metaTitle": (extracted["seo"]["title"] or title)[:60],
        "metaDescription": (extracted["seo"]["meta_description"] or f"{title} services in Dubai and across the UAE. DEWA-compliant, IEEE 1584 certified.")[:160],
        "eyebrow": "Service",
        "ctaPrimaryText": "Request a Quote",
        "ctaPrimaryHref": "/ae/contact/",
        "ctaSecondaryText": "All Services",
        "ctaSecondaryHref": "/ae/services/",
        "faqs": faqs[:10] if faqs else [
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
        "seoKeywords": [slug.replace("-ae", "").replace("-", " "), f"{title} Dubai", f"{title} UAE", "DEWA compliance", "electrical safety"],
        "footerEmail": "info@carelabz.com",
        "footerAddress": "Dubai, United Arab Emirates",
        "ctaBannerHeading": "Need This Service?",
        "ctaBannerBody": "Our engineering team is ready to help with your electrical safety requirements.",
        "ctaBannerPrimaryText": "Get a Quote",
        "ctaBannerPrimaryHref": "/ae/contact/",
    }
    return create_entry("service-pages", payload)


def upload_blog_post(extracted):
    """Create BlogPost entry from extracted WP blog post."""
    slug = clean_slug(extracted["slug"])

    if check_exists("blog-posts", slug):
        print(f"  ⏩ Skipped (exists): {slug}")
        return None

    title = extracted["seo"]["title"] or extracted["content"]["h1"] or slug.replace("-", " ").title()
    title = re.sub(r"\s*[|\-–]\s*Carelabs?\s*$", "", title, flags=re.IGNORECASE)

    body_text = extracted["content"]["body_markdown"] or ""

    # Try to extract FAQs from body
    faqs = []
    faq_pattern = re.compile(r"(?:^|\n)#+\s*(.*?\?)\s*\n([\s\S]*?)(?=\n#+|\Z)", re.MULTILINE)
    for match in faq_pattern.finditer(body_text):
        q = match.group(1).strip()
        a = match.group(2).strip()[:300]
        if q and a:
            faqs.append({"question": q, "answer": a})

    # Determine category from slug/title
    category = "Electrical Testing"
    if any(kw in slug for kw in ["study", "analysis", "flow"]):
        category = "Power System Studies"
    elif any(kw in slug for kw in ["calibration", "calibrat"]):
        category = "Calibration"
    elif any(kw in slug for kw in ["inspection", "audit", "compliance"]):
        category = "Inspection & Compliance"
    elif any(kw in slug for kw in ["what-", "how-", "learn-", "why-", "about-"]):
        category = "Educational"

    payload = {
        "title": title,
        "slug": slug,
        "region": REGION,
        "category": category,
        "body": body_text[:8000] if body_text else f"Learn about {title.lower()} — an essential aspect of electrical safety and compliance in the UAE.",
        "excerpt": (extracted["seo"]["meta_description"] or f"Learn about {title.lower()} — importance, methodology, and best practices for electrical safety.")[:200],
        "author": "Carelabs Engineering Team",
        "publishedDate": "2026-01-01",
        "tags": [category, "Electrical Safety", "UAE", "DEWA"],
        "metaTitle": title[:60],
        "metaDescription": (extracted["seo"]["meta_description"] or f"Learn about {title.lower()} — importance, procedures, and DEWA compliance requirements.")[:160],
        "seoKeywords": [slug.replace("-ae", "").replace("-", " "), f"{title} Dubai", "electrical safety UAE"],
        "faqs": faqs[:5] if faqs else None,
    }
    return create_entry("blog-posts", payload)
```

### 4C: Main execution

```python
if __name__ == "__main__":
    # Load and upload each type
    import glob

    print("=" * 60)
    print("UPLOADING TO STRAPI — UAE (ae) REGION")
    print("=" * 60)

    # 1. Homepage
    print("\n📄 HOMEPAGE")
    with open("data/extracted/pages/home.json") as f:
        upload_homepage(json.load(f))

    # 2. About
    print("\n📄 ABOUT PAGE")
    with open("data/extracted/pages/about.json") as f:
        upload_about_page(json.load(f))

    # 3. Contact
    print("\n📄 CONTACT PAGE")
    with open("data/extracted/pages/contact.json") as f:
        upload_contact_page(json.load(f))

    # 4. Services
    print("\n🔧 SERVICE PAGES")
    for path in sorted(glob.glob("data/extracted/services/*.json")):
        with open(path) as f:
            data = json.load(f)
        upload_service_page(data)
        time.sleep(0.5)  # Rate limit

    # 5. Blogs
    print("\n📝 BLOG POSTS")
    for path in sorted(glob.glob("data/extracted/blogs/*.json")):
        with open(path) as f:
            data = json.load(f)
        upload_blog_post(data)
        time.sleep(0.5)

    print("\n" + "=" * 60)
    print("✅ MIGRATION COMPLETE")
    print("=" * 60)
```

---

## Step 5: Execute

Run in order:

```bash
# 1. Extract all WordPress content
python3 scripts/wp-extract-all.py

# 2. Verify extraction worked
ls data/extracted/pages/ data/extracted/services/ data/extracted/blogs/ | head -20

# 3. Upload to Strapi
python3 scripts/wp-to-strapi.py

# 4. Verify — re-run the audit
python3 scripts/audit-ae-content.py
```

---

## Step 6: Post-migration verification

After upload completes:

1. **Count check:**
   ```bash
   source .env.local
   BASE="https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
   AUTH="Authorization: Bearer $STRAPI_API_TOKEN"

   echo "Home pages:"
   curl -s -H "$AUTH" "$BASE/home-pages?filters[region][\$eq]=ae" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])"

   echo "Service pages:"
   curl -s -H "$AUTH" "$BASE/service-pages?filters[region][\$eq]=ae&pagination[pageSize]=1" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])"

   echo "Blog posts:"
   curl -s -H "$AUTH" "$BASE/blog-posts?filters[region][\$eq]=ae&pagination[pageSize]=1" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])"

   echo "About pages:"
   curl -s -H "$AUTH" "$BASE/about-pages?filters[region][\$eq]=ae" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])"

   echo "Contact pages:"
   curl -s -H "$AUTH" "$BASE/contact-pages?filters[region][\$eq]=ae" | python3 -c "import sys,json; print(json.load(sys.stdin)['meta']['pagination']['total'])"
   ```

2. **Expected minimums:**
   ```
   Home pages:     1
   Service pages:  60+  (existing 9 + ~50-70 new)
   Blog posts:     25+
   About pages:    1
   Contact pages:  1
   ```

3. **Spot-check top traffic pages:**
   - Verify `/megger-test-performed/` has a matching blog entry with body content
   - Verify `/arc-flash-study-analysis/` has a matching service entry
   - Verify homepage has services array populated

---

## Important Notes

- **Rate limiting:** Use `time.sleep(1)` between WordPress fetches, `time.sleep(0.5)` between Strapi uploads
- **Existing entries:** The `check_exists()` function prevents duplicates. If a slug already exists for `region=ae`, it skips. The 9 existing service pages will NOT be overwritten.
- **Slug convention:** All new entries get `-ae` suffix (e.g., `megger-test-ae`, `arc-flash-study-analysis-ae`). This keeps them distinct from entries for other regions.
- **Body content:** The script extracts the full body as Markdown. If a page has very little content (under 100 chars), log a warning but still create the entry — we can enhance content later.
- **Images:** This migration does NOT upload images to Strapi Media Library. Image URLs in the body Markdown will still point to `carelabz.com`. Image migration is a separate step.
- **Do NOT commit to main.** Keep on the migration branch until verified.
- **Do NOT delete any existing Strapi entries.** Only create new ones.
