#!/usr/bin/env python3
"""Diff WP blog URLs vs existing Strapi blog-posts (region=ae).
Prints which need creation vs which can be updated."""

import os, sys, json, re, subprocess
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

STRAPI = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
H = {"Authorization": f"Bearer {os.environ['STRAPI_API_TOKEN']}"}


def url_to_slug(url: str) -> str:
    return url.rstrip("/").rsplit("/", 1)[-1]


def fetch_strapi():
    out = []
    page = 1
    while True:
        r = requests.get(
            f"{STRAPI}/blog-posts?filters[region][$eq]=ae&pagination[page]={page}&pagination[pageSize]=100&fields[0]=slug&fields[1]=title&fields[2]=body",
            headers=H, timeout=15,
        )
        data = r.json().get("data", [])
        if not data:
            break
        out.extend(data)
        if len(data) < 100:
            break
        page += 1
    return out


def main():
    wp_summary = json.loads(Path("data/wp-blog-summary.json").read_text(encoding="utf-8"))
    wp_by_slug = {item["slug"]: item for item in wp_summary}

    strapi = fetch_strapi()
    strapi_by_slug = {}
    for s in strapi:
        slug = s.get("slug", "")
        clean = slug[:-3] if slug.endswith("-ae") else slug
        strapi_by_slug[clean] = {
            "documentId": s.get("documentId"),
            "slug": slug,
            "title": s.get("title", ""),
            "body_len": len(s.get("body") or ""),
        }

    matches, news = [], []
    for slug, wp in wp_by_slug.items():
        st = strapi_by_slug.get(slug)
        if st:
            matches.append({"slug": slug, "wp": wp, "strapi": st})
        else:
            news.append({"slug": slug, "wp": wp})

    extras = [s for s in strapi_by_slug if s not in wp_by_slug]

    print(f"WP posts:      {len(wp_summary)}")
    print(f"Strapi posts:  {len(strapi)}")
    print(f"MATCH (will be enriched if WP body longer): {len(matches)}")
    print(f"NEW (will be created):                       {len(news)}")
    print(f"Strapi-only (extras, untouched):             {len(extras)}")
    print()
    if news:
        print("NEW (first 10):")
        for n in news[:10]:
            print(f"  {n['slug']}  -  {n['wp']['title'][:80]}")
        if len(news) > 10:
            print(f"  ... and {len(news)-10} more")
    print()
    if matches:
        print("MATCH (first 5):")
        for m in matches[:5]:
            print(f"  {m['slug']}  Strapi={m['strapi']['body_len']}c  WP=?  ({m['wp']['title'][:60]})")

    Path("data/ae-blog-diff.json").write_text(
        json.dumps({"matches": matches, "news": news, "extras": extras}, indent=2, ensure_ascii=False),
        encoding="utf-8",
    )
    print("\nReport: data/ae-blog-diff.json")


if __name__ == "__main__":
    main()
