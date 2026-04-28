#!/usr/bin/env python3
"""
AE Full Site QA — Phase 1: Discover all URLs from Strapi.
"""

import os, sys, json, subprocess
from pathlib import Path

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

env_file = Path(".env.local")
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if line.startswith("STRAPI_API_TOKEN="):
            os.environ["STRAPI_API_TOKEN"] = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}"}
REGION = "ae"


def get_all_ae_urls():
    urls = set()

    # Static pages
    urls.add("/ae/")
    urls.add("/ae/about/")
    urls.add("/ae/contact/")
    urls.add("/ae/services/")
    urls.add("/ae/blog/")
    urls.add("/ae/case-studies/")

    # Service pages — strip -ae suffix to match the dynamic route slug
    r = requests.get(
        f"{STRAPI_BASE}/service-pages?filters[region][$eq]={REGION}&pagination[pageSize]=100&fields[0]=slug",
        headers=HEADERS, timeout=15,
    )
    for entry in r.json().get("data", []):
        slug = entry.get("slug", "")
        if slug:
            clean = slug[:-3] if slug.endswith("-ae") else slug
            urls.add(f"/ae/services/{clean}/")

    # Blog posts
    r = requests.get(
        f"{STRAPI_BASE}/blog-posts?filters[region][$eq]={REGION}&pagination[pageSize]=100&fields[0]=slug",
        headers=HEADERS, timeout=15,
    )
    for entry in r.json().get("data", []):
        slug = entry.get("slug", "")
        if slug:
            clean = slug[:-3] if slug.endswith("-ae") else slug
            urls.add(f"/ae/blog/{clean}/")

    # Case studies
    r = requests.get(
        f"{STRAPI_BASE}/case-studies?filters[region][$eq]={REGION}&pagination[pageSize]=100&fields[0]=slug",
        headers=HEADERS, timeout=15,
    )
    for entry in r.json().get("data", []):
        slug = entry.get("slug", "")
        if slug:
            clean = slug[:-3] if slug.endswith("-ae") else slug
            urls.add(f"/ae/case-studies/{clean}/")

    return sorted(urls)


if __name__ == "__main__":
    urls = get_all_ae_urls()
    os.makedirs("data", exist_ok=True)
    with open("data/ae-all-urls.json", "w") as f:
        json.dump(urls, f, indent=2)
    print(f"Found {len(urls)} AE URLs")
    for u in urls[:10]:
        print(f"  {u}")
    if len(urls) > 10:
        print(f"  ... and {len(urls) - 10} more")
