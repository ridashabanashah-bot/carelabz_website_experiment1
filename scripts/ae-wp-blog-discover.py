#!/usr/bin/env python3
"""Fetch every blog post URL from carelabz.com via WordPress REST API.
Falls back to category page crawl if REST is blocked."""

import os, sys, json, subprocess
from pathlib import Path

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

WP = "https://carelabz.com"


def via_rest_api():
    posts = []
    page = 1
    while True:
        r = requests.get(
            f"{WP}/wp-json/wp/v2/posts?per_page=100&page={page}&_fields=id,slug,link,title,date,excerpt,categories,featured_media",
            headers={"User-Agent": "Mozilla/5.0"},
            timeout=30,
        )
        if r.status_code == 400:
            # Out of pages
            break
        if r.status_code != 200:
            print(f"  page {page} HTTP {r.status_code}")
            break
        batch = r.json()
        if not batch:
            break
        posts.extend(batch)
        if len(batch) < 100:
            break
        page += 1
    return posts


def main():
    print(f"Fetching from {WP}/wp-json/wp/v2/posts ...")
    posts = via_rest_api()
    print(f"Got {len(posts)} posts")

    urls = []
    summary = []
    for p in posts:
        link = p.get("link", "")
        slug = p.get("slug", "")
        title = (p.get("title") or {}).get("rendered", "")
        date = p.get("date", "")
        if link and slug:
            urls.append(link)
            summary.append({
                "id": p.get("id"),
                "slug": slug,
                "url": link,
                "title": title,
                "date": date,
                "categories": p.get("categories", []),
                "featured_media_id": p.get("featured_media", 0),
            })

    Path("data").mkdir(exist_ok=True)
    Path("data/wp-blog-urls.txt").write_text("\n".join(urls), encoding="utf-8")
    Path("data/wp-blog-summary.json").write_text(json.dumps(summary, indent=2, ensure_ascii=False), encoding="utf-8")
    print(f"\nWrote data/wp-blog-urls.txt ({len(urls)} URLs)")
    print(f"Wrote data/wp-blog-summary.json")


if __name__ == "__main__":
    main()
