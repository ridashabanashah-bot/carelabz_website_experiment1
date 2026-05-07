"""Scrape every WordPress URL from carelabz.com listed in the audit prompt.

Saves each extracted page as JSON under data/extracted/{type}/{slug}.json.

Categories (per the prompt):
  - pages   -> homepage, about, contact (3)
  - services -> 70 main service URLs + 6 calibration service URLs
  - blogs   -> 38 blog/educational URLs

Total: ~117 URLs. Rate-limited at 1s between requests.
"""

import json
import os
import re
import sys
import time
from pathlib import Path

import requests
from bs4 import BeautifulSoup
from markdownify import markdownify as md

HEADERS = {
    "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
    "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0.0.0 Safari/537.36",
}

PAGES = {
    "home":    "https://carelabz.com/",
    "about":   "https://carelabz.com/about-carelabs/",
    "contact": "https://carelabz.com/contact-us/",
}

SERVICES = [
    # main services
    "https://carelabz.com/arc-flash-study-analysis/",
    "https://carelabz.com/arc-flash-study/",
    "https://carelabz.com/automatic-transfer-switch-testing-service/",
    "https://carelabz.com/battery-testing-services-dubai-uae/",
    "https://carelabz.com/biomedical-equipment-safety-inspection-services/",
    "https://carelabz.com/biomedical-equipment-safety-testing-services/",
    "https://carelabz.com/building-envelope-infrared-thermography-inspection-service/",
    "https://carelabz.com/cable-testing/",
    "https://carelabz.com/capacitor-bank-test/",
    "https://carelabz.com/circuit-breaker-testing/",
    "https://carelabz.com/commercial-electrical-inspection-services-dubai-uae/",
    "https://carelabz.com/commercial-electrical-testing/",
    "https://carelabz.com/contact-resistance-testing-service/",
    "https://carelabz.com/continuity-testing/",
    "https://carelabz.com/earth-fault-loop-impedence-test/",
    "https://carelabz.com/earth-ground-testing-service/",
    "https://carelabz.com/electric-motor-testing/",
    "https://carelabz.com/electric-switchgear-testing-services/",
    "https://carelabz.com/electrical-calibration/",
    "https://carelabz.com/electrical-compliance-inspection/",
    "https://carelabz.com/electrical-installations-certification-service/",
    "https://carelabz.com/electrical-safety-audit-service/",
    "https://carelabz.com/electrical-safety-auditing-inspection-service/",
    "https://carelabz.com/electrical-safety-testing/",
    "https://carelabz.com/electrical-switchgear-risk-assessment-study-hazard-analysis-service/",
    "https://carelabz.com/electrical-switchgear-safety-inspection-services/",
    "https://carelabz.com/electrical-thermography-inspection/",
    "https://carelabz.com/energy-auditing-service/",
    "https://carelabz.com/factory-acceptance-testing-services/",
    "https://carelabz.com/fixed-electrical-testing/",
    "https://carelabz.com/fixed-wire-testing/",
    "https://carelabz.com/frequency-stability-analysis/",
    "https://carelabz.com/generator-load-bank-testing/",
    "https://carelabz.com/gfci-standard-inspection-service/",
    "https://carelabz.com/ground-fault-testing/",
    "https://carelabz.com/grounding-grid-study-analysis/",
    "https://carelabz.com/grounding-system-design-and-planning/",
    "https://carelabz.com/harmonic-study-analysis/",
    "https://carelabz.com/insulation-resistance-test-service/",
    "https://carelabz.com/leakage-current-measurement/",
    "https://carelabz.com/lightning-arrester-testing-service/",
    "https://carelabz.com/lightning-arrester-testing/",
    "https://carelabz.com/live-testing/",
    "https://carelabz.com/load-flow-analysis/",
    "https://carelabz.com/mcc-panel-operation-testing/",
    "https://carelabz.com/megger-test/",
    "https://carelabz.com/motor-acceleration-study-analysis/",
    "https://carelabz.com/pfc-psc-test/",
    "https://carelabz.com/polarity-test-service/",
    "https://carelabz.com/portable-appliance-testing-dubai-uae/",
    "https://carelabz.com/power-quality-study-analysis/",
    "https://carelabz.com/power-restoration-optimization/",
    "https://carelabz.com/power-system-study-analysis/",
    "https://carelabz.com/primary-current-injection-test/",
    "https://carelabz.com/prospective-short-circuit-test-prospective-fault-current-test/",
    "https://carelabz.com/protection-relay-testing-services/",
    "https://carelabz.com/protective-devices-testing-services/",
    "https://carelabz.com/relay-coordination-study-and-analysis/",
    "https://carelabz.com/residual-current-device-testing-safety/",
    "https://carelabz.com/residual-current-device-testing-safety-2/",
    "https://carelabz.com/secondary-current-injection-test/",
    "https://carelabz.com/short-circuit-study-analysis/",
    "https://carelabz.com/soil-resistivity-test/",
    "https://carelabz.com/third-party-electrical-certification/",
    "https://carelabz.com/third-party-electrical-inspection-company-uae/",
    "https://carelabz.com/third-party-inspection-electrical-installation/",
    "https://carelabz.com/torque-test/",
    "https://carelabz.com/unbalanced-load-flow-study-analysis/",
    "https://carelabz.com/vibration-study-and-analysis/",
    "https://carelabz.com/voltage-drop-study-analysis/",
    "https://carelabz.com/voltage-imbalance-study/",
    # calibration services
    "https://carelabz.com/bain-marie-calibration/",
    "https://carelabz.com/blast-chiller-calibration/",
    "https://carelabz.com/blast-freezer-calibration/",
    "https://carelabz.com/calibrator-calibration/",
    "https://carelabz.com/chiller-calibration/",
    "https://carelabz.com/digital-thermometer-calibration/",
]

BLOGS = [
    "https://carelabz.com/megger-test-performed/",
    "https://carelabz.com/about-earth-fault-loop-impedence-test/",
    "https://carelabz.com/electrical-infrared-thermography-inspection-important/",
    "https://carelabz.com/electrical-installation-inspection-fulfilling-trakhees-guidelines-to-procure-operation-fitness-certificate-ofc/",
    "https://carelabz.com/how-what-why-generator-load-bank-testing-done/",
    "https://carelabz.com/learn-about-residual-current-device-testing-safety/",
    "https://carelabz.com/learn-continuity-testing-what-how/",
    "https://carelabz.com/learn-how-insulation-resistance-test-done/",
    "https://carelabz.com/learn-what-is-earth-ground-test-why-and-how-is-it-done/",
    "https://carelabz.com/need-conduct-electrical-safety-testing/",
    "https://carelabz.com/protecting-electrical-systems/",
    "https://carelabz.com/purpose-lightning-arrester-testing-necessary/",
    "https://carelabz.com/thermography-test-of-electrical-panels/",
    "https://carelabz.com/thermography-testing-of-electrical-equipment/",
    "https://carelabz.com/what-automatic-transfer-switch-testing-how-automatic-transfer-switch-testing-done/",
    "https://carelabz.com/what-cable-testing-how-cable-testing-done/",
    "https://carelabz.com/what-capacitor-bank-testing-why-capacitor-bank-testing-done/",
    "https://carelabz.com/what-circuit-breaker-testing-how-circuit-breaker-testing-done/",
    "https://carelabz.com/what-contact-resistance-test-why-contact-resistance-testing-done/",
    "https://carelabz.com/what-earth-grounding/",
    "https://carelabz.com/what-factory-acceptance-testing-how-fat-done/",
    "https://carelabz.com/what-ground-fault-testing-why-ground-fault-testing-important/",
    "https://carelabz.com/what-how-grounding-design-planning/",
    "https://carelabz.com/what-how-harmonic-study-analysis-done/",
    "https://carelabz.com/what-is-electric-motor-testing-and-why-is-it-done/",
    "https://carelabz.com/what-is-soil-resistivity-test-how-is-soil-resistivity-testing-done/",
    "https://carelabz.com/what-is-torque-testing-how-is-torque-testing-done/",
    "https://carelabz.com/what-leakage-current-testing-measuring-how-leakage-current-testing-measuring-done/",
    "https://carelabz.com/what-motor-acceleration-study-analysis/",
    "https://carelabz.com/what-pat-test-why-pat-test-done/",
    "https://carelabz.com/what-polarity-test-why-conduct-polarity-test/",
    "https://carelabz.com/what-protective-device-testing-how-done/",
    "https://carelabz.com/what-short-circuit-analysis-done-why/",
    "https://carelabz.com/what-voltage-drop-study-analysis/",
    "https://carelabz.com/what-why-load-flow-analysis-power-flow-analysis-done/",
    "https://carelabz.com/what-you-need-to-know-about-arc-flash/",
    "https://carelabz.com/what-you-need-to-know-about-arc-flash-hazard-study-and-analysis/",
    "https://carelabz.com/why-how-what-automatic-transfer-switch-testing-done/",
]


def extract_page(url: str) -> dict:
    """Extract content + SEO metadata from a WordPress page."""
    resp = requests.get(url, headers=HEADERS, timeout=30, allow_redirects=True)
    resp.raise_for_status()
    soup = BeautifulSoup(resp.text, "html.parser")

    title_tag = soup.find("title")
    meta_desc = soup.find("meta", attrs={"name": "description"})
    canonical = soup.find("link", attrs={"rel": "canonical"})
    og_tags = {}
    for tag in soup.find_all("meta", attrs={"property": re.compile(r"^og:")}):
        og_tags[tag["property"]] = tag.get("content", "")

    h1 = soup.find("h1")
    h1_text = h1.get_text(strip=True) if h1 else ""

    # Try selectors in priority order — pick the first that actually has content.
    candidates = [
        soup.find("div", class_="postcontent"),
        soup.find("div", class_="thememount-post-wrapper"),
        soup.find("div", class_="entry-content"),
        soup.find("div", class_="elementor-widget-container"),
        soup.find("article"),
        soup.find("main"),
    ]
    content_el = None
    for c in candidates:
        if c and len(c.get_text(strip=True)) > 100:
            content_el = c
            break

    body_html = ""
    body_md = ""
    headings = []
    images = []

    if content_el:
        # Strip non-content children
        for tag in content_el.find_all(["script", "style", "nav", "footer", "header", "form"]):
            tag.decompose()
        # Strip inline style + class
        for tag in content_el.find_all(True):
            for attr in ("style", "class", "id", "data-id", "data-element_type"):
                if attr in tag.attrs:
                    del tag.attrs[attr]

        body_html = str(content_el)
        try:
            body_md = md(body_html, heading_style="ATX", strip=["img"]).strip()
        except Exception:
            body_md = ""
        body_md = re.sub(r"\n{3,}", "\n\n", body_md)
        body_md = re.sub(r"^[ \t]+$", "", body_md, flags=re.MULTILINE)

        for h in content_el.find_all(["h2", "h3", "h4"]):
            headings.append({"level": int(h.name[1]), "text": h.get_text(strip=True)})

        for img in content_el.find_all("img"):
            src = img.get("src", "")
            if src and not src.startswith("data:"):
                images.append({
                    "src": src,
                    "alt": img.get("alt", ""),
                    "width": img.get("width"),
                    "height": img.get("height"),
                })

    # Clean title — remove "| Carelabs" / "- Carelabs" trailing tokens
    raw_title = title_tag.get_text(strip=True) if title_tag else h1_text
    clean_title = re.sub(r"\s*[|\-\u2013]\s*Care[lL]ab[sz]?\s*$", "", raw_title, flags=re.IGNORECASE)

    return {
        "source_url": url,
        "slug": url.rstrip("/").split("/")[-1],
        "seo": {
            "title": clean_title,
            "raw_title": raw_title,
            "meta_description": meta_desc["content"] if meta_desc and meta_desc.get("content") else "",
            "canonical": canonical["href"] if canonical else url,
            "og": og_tags,
        },
        "content": {
            "h1": h1_text,
            "body_html": body_html[:50000],  # cap to keep file sizes reasonable
            "body_markdown": body_md,
            "headings": headings,
            "images": images,
        },
    }


def fetch_to(url: str, dest: Path) -> bool:
    try:
        data = extract_page(url)
    except Exception as e:
        print(f"  [ERR] {url}: {e}", flush=True)
        return False
    dest.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")
    return True


def main():
    base = Path("data/extracted")
    (base / "pages").mkdir(parents=True, exist_ok=True)
    (base / "services").mkdir(parents=True, exist_ok=True)
    (base / "blogs").mkdir(parents=True, exist_ok=True)

    total = len(PAGES) + len(SERVICES) + len(BLOGS)
    done = 0

    print(f"=== Extracting {total} URLs from carelabz.com ===", flush=True)

    for name, url in PAGES.items():
        done += 1
        print(f"[{done}/{total}] PAGE {name}", flush=True)
        fetch_to(url, base / "pages" / f"{name}.json")
        time.sleep(1)

    for url in SERVICES:
        slug = url.rstrip("/").split("/")[-1]
        done += 1
        print(f"[{done}/{total}] SERVICE {slug}", flush=True)
        fetch_to(url, base / "services" / f"{slug}.json")
        time.sleep(1)

    for url in BLOGS:
        slug = url.rstrip("/").split("/")[-1]
        done += 1
        print(f"[{done}/{total}] BLOG {slug}", flush=True)
        fetch_to(url, base / "blogs" / f"{slug}.json")
        time.sleep(1)

    print(f"\n=== Done. Extracted {total} URLs ===", flush=True)


if __name__ == "__main__":
    main()
