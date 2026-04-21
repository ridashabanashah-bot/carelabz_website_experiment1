"""Generic WordPress-to-JSON scraper for any Carelabs country.

Usage:
    python3 scripts/scrape-country.py --cc mx --wp-url https://carelabz.com/mx/ \\
        --expected-services arc-flash-study,short-circuit-analysis,load-flow-analysis,relay-coordination-study \\
        [--contact-slug contact-us] [--blog-index-slug blogs]

Discovers URLs from WordPress sitemap_index.xml. Classifies each URL by
heuristics (home / services / about / contact / blog / misc). Saves one JSON
per page to data/wp-extracts/{cc}-{slug}.json plus a summary.
"""
from __future__ import annotations

import argparse
import json
import os
import re
import sys
import time
import urllib.error
import urllib.request
from bs4 import BeautifulSoup

OUT_DIR = "data/wp-extracts"

SERVICE_HINTS = {
    "arc-flash": "arc-flash-study",
    "short-circuit": "short-circuit-analysis",
    "load-flow": "load-flow-analysis",
    "relay-coordination": "relay-coordination-study",
}


def fetch(url: str) -> str | None:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 Carelabs-Migration/1.0"})
    try:
        with urllib.request.urlopen(req, timeout=30) as resp:
            raw = resp.read()
    except urllib.error.HTTPError as e:
        print(f"  !! {url} HTTP {e.code}", file=sys.stderr)
        return None
    except Exception as e:
        print(f"  !! {url} {type(e).__name__}: {e}", file=sys.stderr)
        return None
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252", errors="replace")


def clean_text(s: str) -> str:
    return re.sub(r"\s+", " ", s).strip()


def fix_brand(t: str) -> str:
    t = re.sub(r"\bCare\s+Labs\b", "Carelabs", t)
    t = re.sub(r"\bCareLabs\b", "Carelabs", t)
    t = re.sub(r"\bCareLAbz\b", "Carelabs", t)
    t = re.sub(r"\bCARELABS\b", "Carelabs", t)
    return t


def slug_from_url(url: str, cc: str) -> str:
    m = re.search(rf"/{cc}/(.*?)/?$", url)
    if not m:
        return url.rstrip("/").split("/")[-1]
    return m.group(1).strip("/").split("/")[-1] or cc


def discover_sitemap_urls(sitemap_url: str) -> list[str]:
    text = fetch(sitemap_url)
    if not text:
        return []
    urls: list[str] = []
    for u in re.findall(r"<loc>(.*?)</loc>", text):
        if u.endswith(".xml"):
            urls.extend(discover_sitemap_urls(u))
        else:
            urls.append(u)
    return urls


def classify_url(url: str, cc: str, expected_services: list[str],
                 contact_slug: str, about_slug: str, blog_index_slug: str,
                 case_slug: str | None) -> str:
    base = f"/{cc}/"
    path = re.search(rf"{base}(.*?)/?$", url)
    if not path:
        return "other"
    inside = path.group(1).strip("/")
    if inside == "":
        return "home"
    first = inside.split("/")[0]
    if first == contact_slug:
        return "contact"
    if first == about_slug:
        return "about"
    if first == blog_index_slug:
        return "blog-index"
    if first == "service" or first == "services":
        # Could be services index (/cc/service/) or nested service detail
        if inside in ("service", "services"):
            return "services-index"
        return "service-nested"
    if first == "case-study" or first == "case-studies":
        if inside in ("case-study", "case-studies"):
            return "case-study"
        return "case-study-detail"
    # Match expected service slugs
    if first in expected_services:
        return "service-flat"
    # Legacy/duplicate service slugs we want to exclude (e.g. "arc-flash-studies-in-mexico")
    for hint in SERVICE_HINTS:
        if hint in first and cc in first:
            return "service-legacy"
    # Flat "blog post" fallback
    return "blog-flat"


def extract_meta(soup):
    t = soup.title.string.strip() if soup.title and soup.title.string else ""
    md = soup.find("meta", attrs={"name": "description"})
    desc = md["content"].strip() if md and md.get("content") else ""
    canon = soup.find("link", rel="canonical")
    can = canon["href"] if canon and canon.get("href") else ""
    return {"metaTitle": fix_brand(t), "metaDescription": fix_brand(desc), "canonicalSource": can}


def extract_main(soup):
    for sel in ["main", "article.post", "article", ".entry-content", ".site-content", "#content"]:
        el = soup.select_one(sel)
        if el:
            for junk in el.select("nav, footer, header, script, style, .site-footer, .site-header, form"):
                junk.decompose()
            return el
    return soup.body or soup


def extract_headings(main):
    h1 = main.find("h1")
    return {
        "h1": fix_brand(clean_text(h1.get_text(" ", strip=True))) if h1 else "",
        "h2": [fix_brand(clean_text(h.get_text(" ", strip=True))) for h in main.find_all("h2") if h.get_text(strip=True)],
        "h3": [fix_brand(clean_text(h.get_text(" ", strip=True))) for h in main.find_all("h3") if h.get_text(strip=True)],
    }


def extract_paragraphs(main, limit=30):
    ps = []
    for p in main.find_all("p"):
        txt = clean_text(p.get_text(" ", strip=True))
        if len(txt) > 40:
            ps.append(fix_brand(txt))
        if len(ps) >= limit:
            break
    return ps


def extract_bullets(main):
    lists = []
    for ul in main.find_all("ul"):
        items = [fix_brand(clean_text(li.get_text(" ", strip=True))) for li in ul.find_all("li", recursive=False)]
        items = [x for x in items if 5 < len(x) < 300]
        if items:
            lists.append(items)
    return lists


def extract_contact_info(soup):
    phones = []
    emails = []
    for a in soup.find_all("a", href=True):
        h = a["href"]
        if h.startswith("tel:"):
            phones.append(h.replace("tel:", "").strip())
        elif h.startswith("mailto:"):
            emails.append(h.replace("mailto:", "").split("?")[0].strip())
    text = soup.get_text(" ", strip=True)
    phones.extend(re.findall(r"\+?\d[\d\s().\-]{8,17}\d", text))
    phones = [p.strip() for p in phones if len(re.sub(r"\D", "", p)) >= 9]
    emails.extend(re.findall(r"[\w.\-]+@[\w.\-]+\.\w+", text))
    emails = [e for e in emails if not any(e.endswith(ext) for ext in (".png", ".jpg", ".svg", ".webp"))]
    return {
        "phones": list(dict.fromkeys(phones))[:5],
        "emails": list(dict.fromkeys(emails))[:5],
    }


def scrape_page(url: str, cc: str, kind: str) -> dict | None:
    html = fetch(url)
    if not html:
        return None
    soup = BeautifulSoup(html, "lxml")
    main = extract_main(soup)
    meta = extract_meta(soup)
    head = extract_headings(main)
    full_text = main.get_text(" ", strip=True)
    return {
        "url": url,
        "slug": slug_from_url(url, cc),
        "pageType": kind,
        **meta,
        **head,
        "paragraphs": extract_paragraphs(main),
        "bulletLists": extract_bullets(main),
        "wordCount": len(full_text.split()),
        "phones": extract_contact_info(soup)["phones"],
        "emails": extract_contact_info(soup)["emails"],
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cc", required=True)
    ap.add_argument("--wp-url", required=True)
    ap.add_argument("--expected-services", default="arc-flash-study,short-circuit-analysis,load-flow-analysis,relay-coordination-study")
    ap.add_argument("--about-slug", default="about-us")
    ap.add_argument("--contact-slug", default="contact-us")
    ap.add_argument("--blog-index-slug", default="blogs")
    ap.add_argument("--case-slug", default=None)
    ap.add_argument("--max-blogs", type=int, default=40)
    args = ap.parse_args()

    cc = args.cc.lower()
    wp_url = args.wp_url.rstrip("/") + "/"
    expected_services = [s.strip() for s in args.expected_services.split(",") if s.strip()]

    sitemap_url = wp_url + "sitemap_index.xml"
    print(f"== {cc.upper()} == fetching sitemap: {sitemap_url}")
    all_urls = discover_sitemap_urls(sitemap_url)
    print(f"  discovered {len(all_urls)} URLs")

    # Classify
    bucketed: dict[str, list[str]] = {}
    for u in all_urls:
        k = classify_url(u, cc, expected_services, args.contact_slug, args.about_slug, args.blog_index_slug, args.case_slug)
        bucketed.setdefault(k, []).append(u)

    # Decide what to scrape
    to_scrape: list[tuple[str, str]] = []
    if bucketed.get("home"):
        to_scrape.append(("home", bucketed["home"][0]))
    if bucketed.get("about"):
        to_scrape.append(("about", bucketed["about"][0]))
    if bucketed.get("contact"):
        to_scrape.append(("contact", bucketed["contact"][0]))
    for u in bucketed.get("service-flat", []) + bucketed.get("service-nested", []):
        to_scrape.append(("service", u))
    if bucketed.get("case-study"):
        to_scrape.append(("case-study", bucketed["case-study"][0]))
    blogs = bucketed.get("blog-flat", [])[: args.max_blogs]
    for u in blogs:
        to_scrape.append(("blog", u))

    # Scrape
    os.makedirs(OUT_DIR, exist_ok=True)
    results = []
    seen_slugs: set[str] = set()
    for kind, url in to_scrape:
        data = scrape_page(url, cc, kind)
        if not data:
            continue
        # Drop empty/404-like pages (no h1 and very thin)
        if not data.get("h1") and data.get("wordCount", 0) < 80:
            print(f"  SKIP {kind:10s} {url} (no h1, thin content)")
            continue
        # Avoid duplicate slugs (first wins)
        slug = data["slug"]
        if slug in seen_slugs:
            continue
        seen_slugs.add(slug)
        path = os.path.join(OUT_DIR, f"{cc}-{slug}.json")
        with open(path, "w", encoding="utf-8") as f:
            json.dump(data, f, indent=2, ensure_ascii=False)
        results.append({
            "kind": kind,
            "slug": slug,
            "file": path,
            "wordCount": data["wordCount"],
            "h2Count": len(data["h2"]),
        })
        print(f"  OK   {kind:10s} {slug[:55]:55s} words={data['wordCount']}")

    # Summary
    by_kind: dict[str, int] = {}
    for r in results:
        by_kind[r["kind"]] = by_kind.get(r["kind"], 0) + 1
    summary = {
        "cc": cc,
        "wpUrl": wp_url,
        "totalPages": len(results),
        "byKind": by_kind,
        "pages": results,
        "skipped": {k: len(v) for k, v in bucketed.items() if k in ("service-legacy", "case-study-detail")},
        "discovered": len(all_urls),
    }
    with open(os.path.join(OUT_DIR, f"{cc}-summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print(f"\n== DONE {cc.upper()} == {len(results)} scraped   by_kind={by_kind}")


if __name__ == "__main__":
    main()
