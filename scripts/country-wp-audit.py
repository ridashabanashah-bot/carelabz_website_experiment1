#!/usr/bin/env python3
"""Phase 0 audit: discover what carelabz.com WP actually serves per country.

For each country code in countries-config.ts, probes:
  - https://carelabz.com/{cc}/                  (homepage)
  - https://carelabz.com/{cc}/blogs/            (blog index)
  - https://carelabz.com/{cc}/our-blogs/        (alternate blog)
  - https://carelabz.com/{cc}/blog/             (alternate blog)
  - https://carelabz.com/{cc}/our-services/     (services index)
  - https://carelabz.com/{cc}/services/         (alternate)
  - https://carelabz.com/{cc}/service/          (alternate)
  - https://carelabz.com/{cc}/about-us/         (about)
  - https://carelabz.com/{cc}/contact-us/       (contact)

Also probes the WP REST API for posts filtered by category (does WP tag content
by country code via category slug?).

Writes data/wp-country-availability.json — input for the per-country migration
pipeline.
"""

import os, json, sys, time, re, subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

WP = "https://carelabz.com"
UA = {"User-Agent": "Mozilla/5.0 (compatible; CarelabsAudit/1.0)"}

# All country codes from src/lib/countries-config.ts (excluding AE which is already done)
COUNTRY_CODES = [
    "mx", "eg", "za", "tr", "sa", "nz", "au", "ph", "id", "vn", "th", "sg",
    "my", "in", "tw", "hk", "kr", "jp", "cn", "ru", "ua", "pl", "hu", "cz",
    "ro", "sk", "fr", "es", "pt", "gr", "it", "nl", "be", "at", "ch", "de",
    "uk", "ie", "se", "no", "dk", "fi", "br", "mx", "co", "cl", "ar", "pe",
    "ca", "us",
]
# Dedupe (mx appears twice above)
COUNTRY_CODES = list(dict.fromkeys(COUNTRY_CODES))

PROBE_PATHS = [
    ("homepage", ""),
    ("blog_blogs", "blogs/"),
    ("blog_our_blogs", "our-blogs/"),
    ("blog_blog", "blog/"),
    ("services_our_services", "our-services/"),
    ("services_services", "services/"),
    ("services_service", "service/"),
    ("about_us", "about-us/"),
    ("about_about", "about/"),
    ("about_about_carelabs", "about-carelabs/"),
    ("contact_us", "contact-us/"),
    ("contact_contact", "contact/"),
]


def probe(url: str, timeout: float = 10.0) -> dict:
    try:
        r = requests.head(url, headers=UA, timeout=timeout, allow_redirects=True)
        return {
            "url": url,
            "status": r.status_code,
            "final_url": r.url,
            "redirected": r.url != url,
        }
    except Exception as e:
        return {"url": url, "status": 0, "error": str(e)[:200]}


def country_audit(cc: str) -> dict:
    out = {"cc": cc, "probes": {}, "summary": {"any_200": False, "blog": None, "services": None, "about": None, "contact": None, "homepage": None}}
    for label, path in PROBE_PATHS:
        url = f"{WP}/{cc}/{path}"
        result = probe(url)
        out["probes"][label] = result
        if result.get("status") == 200:
            out["summary"]["any_200"] = True
            kind = label.split("_")[0]
            if kind in out["summary"] and out["summary"][kind] is None:
                out["summary"][kind] = path
    return out


def wp_categories():
    """Pull the full WP categories list — see if any are country-coded."""
    cats = []
    page = 1
    while True:
        r = requests.get(f"{WP}/wp-json/wp/v2/categories?per_page=100&page={page}", headers=UA, timeout=20)
        if r.status_code != 200:
            break
        batch = r.json()
        if not isinstance(batch, list) or not batch:
            break
        cats.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return cats


def main():
    print(f"Auditing {len(COUNTRY_CODES)} countries against {WP}\n")

    # Quick parallel probe
    audits = {}
    with ThreadPoolExecutor(max_workers=8) as ex:
        futures = {ex.submit(country_audit, cc): cc for cc in COUNTRY_CODES}
        for fut in as_completed(futures):
            cc = futures[fut]
            try:
                audits[cc] = fut.result()
                s = audits[cc]["summary"]
                marks = []
                if s["homepage"] is not None: marks.append("home")
                if s["blog"] is not None: marks.append(f"blog={s['blog']}")
                if s["services"] is not None: marks.append(f"svc={s['services']}")
                if s["about"] is not None: marks.append("about")
                if s["contact"] is not None: marks.append("contact")
                print(f"  {cc}: {'✓ ' + ' '.join(marks) if marks else '✗ NO WP'}")
            except Exception as e:
                print(f"  {cc}: ERROR {e}")

    # Categories — do they encode country?
    print("\nFetching WP categories...")
    try:
        cats = wp_categories()
        print(f"  {len(cats)} categories total")
        country_like = [c for c in cats if c.get("slug", "") in COUNTRY_CODES or len(c.get("slug", "")) == 2]
        print(f"  {len(country_like)} categories with country-code-like slugs:")
        for c in country_like[:20]:
            print(f"    {c['slug']:5s}  count={c.get('count', 0)}  name={c.get('name', '')[:50]}")
    except Exception as e:
        print(f"  ERROR fetching categories: {e}")
        cats = []

    Path("data").mkdir(exist_ok=True)
    Path("data/wp-country-availability.json").write_text(
        json.dumps({"audits": audits, "categories": cats}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )

    print("\n=== SUMMARY ===")
    have_blog = [cc for cc, a in audits.items() if a["summary"]["blog"] is not None]
    have_svc = [cc for cc, a in audits.items() if a["summary"]["services"] is not None]
    have_home = [cc for cc, a in audits.items() if a["summary"]["homepage"] is not None]
    no_wp = [cc for cc, a in audits.items() if not a["summary"]["any_200"]]
    print(f"Countries with WP homepage:  {len(have_home)}")
    print(f"Countries with blog index:   {len(have_blog)} -> {have_blog}")
    print(f"Countries with services:     {len(have_svc)} -> {have_svc}")
    print(f"Countries with NO WP source: {len(no_wp)} -> {no_wp}")

    print(f"\nWritten to data/wp-country-availability.json")


if __name__ == "__main__":
    main()
