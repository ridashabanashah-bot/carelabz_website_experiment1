#!/usr/bin/env python3
"""Diff canonical WP service URLs vs Strapi service-pages (region=ae). Prints which need scraping."""

import os, sys, json, re
from pathlib import Path
import subprocess

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

STRAPI = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
H = {"Authorization": f"Bearer {os.environ['STRAPI_API_TOKEN']}"}


def parse_canonical(path: str):
    urls = []
    for line in Path(path).read_text(encoding="utf-8").splitlines():
        line = line.strip()
        if not line or line.startswith("#"):
            continue
        urls.append(line.rstrip("/"))
    return urls


def url_to_slug(url: str) -> str:
    return url.rstrip("/").rsplit("/", 1)[-1]


def fetch_strapi_slugs() -> set[str]:
    out: set[str] = set()
    page = 1
    while True:
        r = requests.get(
            f"{STRAPI}/service-pages?filters[region][$eq]=ae&pagination[page]={page}&pagination[pageSize]=100&fields[0]=slug",
            headers=H, timeout=15,
        )
        data = r.json().get("data", [])
        if not data:
            break
        for entry in data:
            s = entry.get("slug", "")
            if s.endswith("-ae"):
                s = s[:-3]
            out.add(s)
        if len(data) < 100:
            break
        page += 1
    return out


def main():
    canonical_urls = parse_canonical("data/ae-wp-services-canonical.txt")
    canonical_slugs = {url_to_slug(u): u for u in canonical_urls}

    strapi_slugs = fetch_strapi_slugs()

    missing = sorted(s for s in canonical_slugs if s not in strapi_slugs)
    extras = sorted(s for s in strapi_slugs if s not in canonical_slugs)
    common = sorted(s for s in canonical_slugs if s in strapi_slugs)

    print(f"Canonical URLs: {len(canonical_urls)}")
    print(f"Strapi slugs:   {len(strapi_slugs)}")
    print(f"Common:         {len(common)}")
    print(f"In WP only (need scraping): {len(missing)}")
    print(f"In Strapi only (extras):    {len(extras)}")
    print()

    print("=== MISSING (need scraping) ===")
    missing_urls = [canonical_slugs[s] for s in missing]
    for u in missing_urls:
        print(f"  {u}")
    print()
    print("=== EXTRAS (Strapi has, not in WP list — keep) ===")
    for s in extras:
        print(f"  {s}")

    out = {
        "canonical_count": len(canonical_urls),
        "strapi_count": len(strapi_slugs),
        "common": common,
        "missing": [{"slug": s, "url": canonical_slugs[s]} for s in missing],
        "extras": extras,
    }
    Path("data/ae-service-diff.json").write_text(json.dumps(out, indent=2))
    print(f"\nReport written to data/ae-service-diff.json")
    Path("data/ae-missing-service-urls.txt").write_text("\n".join(missing_urls))
    print(f"URL list for scraping: data/ae-missing-service-urls.txt ({len(missing_urls)} URLs)")


if __name__ == "__main__":
    main()
