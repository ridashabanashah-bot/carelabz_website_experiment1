#!/usr/bin/env python3
"""Discover all blog + service WP URLs for one country by crawling the index pages.

Usage:
  python3 scripts/country-wp-discover.py {cc}

Output:
  data/{cc}/wp-blog-urls.txt
  data/{cc}/wp-service-urls.txt
"""

import os, sys, re, json, time, subprocess
from pathlib import Path

try:
    import requests
    from bs4 import BeautifulSoup
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "beautifulsoup4", "--break-system-packages", "-q"])
    import requests
    from bs4 import BeautifulSoup

WP = "https://carelabz.com"
UA = {"User-Agent": "Mozilla/5.0 (compatible; CarelabsMigration/1.0)"}


def load_availability():
    return json.loads(Path("data/wp-country-availability.json").read_text(encoding="utf-8"))["audits"]


def crawl_paginated(start_url: str, cc: str, max_pages: int = 30) -> list[str]:
    """Crawl an index page, paginate, return every post-style URL under /{cc}/.
    Filters out the index itself, /about/, /contact/, services index, etc."""
    found: set[str] = set()
    visited: set[str] = set()
    queue: list[str] = [start_url]

    EXCLUDE_PATTERNS = [
        r"/about(?:-us)?/?$",
        r"/contact(?:-us)?/?$",
        r"/blogs?/?$",
        r"/our-blogs/?$",
        r"/services?/?$",
        r"/our-services/?$",
        r"/feed/?$",
        r"/comments/feed/?$",
        r"/page/\d+/?$",
        r"/category/",
        r"/tag/",
        r"/author/",
        r"/wp-content/",
        r"/wp-login",
        r"/wp-admin",
        r"/registration/?$",
        r"/login/?$",
        r"/careers/?$",
        r"#",
    ]

    iteration = 0
    while queue and iteration < max_pages:
        url = queue.pop(0)
        if url in visited:
            continue
        visited.add(url)
        iteration += 1
        try:
            r = requests.get(url, headers=UA, timeout=20)
            if r.status_code != 200:
                continue
            soup = BeautifulSoup(r.text, "html.parser")
            for a in soup.find_all("a", href=True):
                href = a["href"]
                if not href.startswith(f"{WP}/{cc}/"):
                    continue
                clean = href.split("#")[0].split("?")[0].rstrip("/") + "/"
                if any(re.search(p, clean) for p in EXCLUDE_PATTERNS):
                    continue
                # Pagination: /blogs/page/2/ etc.
                if re.search(r"/page/\d+/?$", clean):
                    if clean not in visited:
                        queue.append(clean)
                    continue
                # Depth check: direct children of /{cc}/, or one-level-deeper
                # under known content prefixes (service/, services/, blog/, ...)
                rel = clean[len(f"{WP}/{cc}/"):]
                seg_count = rel.count("/")
                if seg_count == 1 and len(rel) > 1:
                    found.add(clean)
                elif seg_count == 2:
                    first = rel.split("/", 1)[0]
                    if first in {"service", "services", "our-services",
                                 "blog", "blogs", "our-blogs", "insights"}:
                        found.add(clean)
        except Exception as e:
            print(f"  WARN crawl {url}: {e}")
        time.sleep(0.3)

    return sorted(found)


def main():
    if len(sys.argv) < 2:
        print("Usage: country-wp-discover.py {cc}")
        sys.exit(1)
    cc = sys.argv[1]
    audits = load_availability()
    info = audits.get(cc)
    if not info:
        print(f"No audit data for {cc}")
        sys.exit(1)

    s = info["summary"]
    blog_path = s.get("blog")
    service_path = s.get("services")
    print(f"Country: {cc}")
    print(f"  Blog:    /{cc}/{blog_path or '(none)'}")
    print(f"  Service: /{cc}/{service_path or '(none)'}")

    out_dir = Path(f"data/{cc}")
    out_dir.mkdir(parents=True, exist_ok=True)

    if blog_path:
        print("\nCrawling blog index...")
        blogs = crawl_paginated(f"{WP}/{cc}/{blog_path}", cc)
        Path(f"data/{cc}/wp-blog-urls.txt").write_text("\n".join(blogs), encoding="utf-8")
        print(f"  Blog posts found: {len(blogs)}")

    if service_path:
        print("\nCrawling services index...")
        services = crawl_paginated(f"{WP}/{cc}/{service_path}", cc)
        Path(f"data/{cc}/wp-service-urls.txt").write_text("\n".join(services), encoding="utf-8")
        print(f"  Service pages found: {len(services)}")


if __name__ == "__main__":
    main()
