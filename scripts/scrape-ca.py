"""Scrape all Canada WordPress pages and save as JSON extracts.

Output: data/wp-extracts/ca-{slug}.json, one per URL.
"""
import json
import os
import re
import sys
import time
import urllib.request
from bs4 import BeautifulSoup

OUT_DIR = "data/wp-extracts"

HOME_URL = "https://carelabz.com/ca/"
ABOUT_URL = "https://carelabz.com/ca/about-us/"
CONTACT_URL = "https://carelabz.com/ca/contact/"

SERVICE_URLS = [
    "https://carelabz.com/ca/services/arc-flash-study/",
    "https://carelabz.com/ca/services/short-circuit-analysis/",
    "https://carelabz.com/ca/services/load-flow-analysis/",
    "https://carelabz.com/ca/services/relay-coordination-study/",
]

BLOG_URLS = [
    "https://carelabz.com/ca/understanding-arc-flash-boundaries-crucial-insights-for-workplace-safety/",
    "https://carelabz.com/ca/etap-and-its-utilizations-on-arc-flash-study/",
    "https://carelabz.com/ca/the-importance-of-personal-protective-equipment-ppe-requirement-for-electrical-workers/",
    "https://carelabz.com/ca/prioritizing-safety-and-efficiency-carelabs-comprehensive-electrical-engineering-solutions/",
    "https://carelabz.com/ca/understanding-the-importance-of-analysis-of-arc-flash-hazard-in-canada/",
    "https://carelabz.com/ca/comprehensive-electrical-safety-inspections-in-canada/",
    "https://carelabz.com/ca/why-arc-flash-study-and-analysis-important-in-canada/",
    "https://carelabz.com/ca/electrical-safety-protocol-for-arc-flash-study-in-canada/",
    "https://carelabz.com/ca/effective-electrical-safety-program-development/",
    "https://carelabz.com/ca/customized-electrical-safety-management-plans-for-canada/",
    "https://carelabz.com/ca/expert-electrical-safety-advisors-canada-carelabz/",
    "https://carelabz.com/ca/arc-flash-safety-measures-with-carelabs/",
    "https://carelabz.com/ca/arc-flash-incidents/",
    "https://carelabz.com/ca/arc-flash-hazard-analysis-proven-mitigation-strategies/",
    "https://carelabz.com/ca/electrical-standards-for-arc-flash-study-and-analysis/",
    "https://carelabz.com/ca/empowering-microgrids-in-canada-the-role-of-relay-coordination-study/",
    "https://carelabz.com/ca/the-importance-of-load-flow-analysis-to-enhance-grid-resilience-in-canada/",
    "https://carelabz.com/ca/the-role-of-short-circuit-analysis-in-enhancing-workplace-electrical-safety/",
    "https://carelabz.com/ca/safe-and-sustainable-hydropower-in-canada/",
    "https://carelabz.com/ca/cost-effective-arc-flash-study-in-canada/",
]

STANDARDS = ["CSA", "NEC", "IEEE", "IEC", "NFPA", "OSHA", "ETAP", "CEC", "ANSI"]


def fetch(url: str) -> str:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 CareLabs-Migration/1.0"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        raw = resp.read()
    try:
        return raw.decode("utf-8")
    except UnicodeDecodeError:
        return raw.decode("cp1252", errors="replace")


def clean_text(s: str) -> str:
    s = re.sub(r"\s+", " ", s)
    return s.strip()


def fix_brand(text: str) -> str:
    """Enforce CareLabs brand spelling per CLAUDE.md."""
    text = re.sub(r"\bCare\s+Labs\b", "CareLabs", text)
    text = re.sub(r"\bCareLAbz\b", "CareLabs", text)
    text = re.sub(r"\bCARELABS\b", "CareLabs", text)
    return text


def slug_from_url(url: str) -> str:
    m = re.search(r"/ca/(.*?)/?$", url)
    if not m:
        return url.rstrip("/").split("/")[-1]
    return m.group(1).strip("/").split("/")[-1]


def extract_meta(soup) -> dict:
    title = soup.title.string.strip() if soup.title and soup.title.string else ""
    md = soup.find("meta", attrs={"name": "description"})
    desc = md["content"].strip() if md and md.get("content") else ""
    og_img = soup.find("meta", property="og:image")
    og = og_img["content"] if og_img and og_img.get("content") else ""
    canonical = soup.find("link", rel="canonical")
    can = canonical["href"] if canonical and canonical.get("href") else ""
    return {
        "metaTitle": fix_brand(title),
        "metaDescription": fix_brand(desc),
        "ogImage": og,
        "canonicalSource": can,
    }


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
    bullets = []
    for ul in main.find_all("ul"):
        items = [clean_text(li.get_text(" ", strip=True)) for li in ul.find_all("li", recursive=False)]
        items = [fix_brand(x) for x in items if 5 < len(x) < 300]
        if items:
            bullets.append(items)
    return bullets


def extract_faqs(main):
    """Detect FAQ blocks: H3/H4 question followed by any text until next heading."""
    faqs = []
    headings = main.find_all(["h2", "h3", "h4"])
    for i, h in enumerate(headings):
        q = clean_text(h.get_text(" ", strip=True))
        if not q.endswith("?") or len(q) < 10:
            continue
        # collect text between this heading and the next heading in DOM order
        next_heading = headings[i + 1] if i + 1 < len(headings) else None
        answer_parts = []
        node = h
        while True:
            nxt = node.find_next(string=False)
            if nxt is None:
                break
            if nxt is next_heading:
                break
            if nxt.name in ("p", "li", "span", "div") and nxt.get("class") is None:
                t = clean_text(nxt.get_text(" ", strip=True))
                if t and t != q and len(t) > 15:
                    answer_parts.append(t)
                    if len(" ".join(answer_parts)) > 600:
                        break
            node = nxt
        # dedupe overlapping text
        seen = set()
        unique = []
        for p in answer_parts:
            if p[:80] not in seen:
                seen.add(p[:80])
                unique.append(p)
        answer = fix_brand(" ".join(unique[:4]).strip())
        if answer and len(answer) > 30:
            faqs.append({"question": fix_brand(q), "answer": answer[:800]})
    return faqs


def detect_standards(text: str):
    found = []
    for s in STANDARDS:
        if re.search(rf"\b{s}\b", text):
            found.append(s)
    return found


def extract_contact_info(main_or_soup):
    # Include tel: and mailto: links (most reliable source)
    phones = []
    emails = []
    for a in main_or_soup.find_all("a", href=True):
        href = a["href"]
        if href.startswith("tel:"):
            phones.append(href.replace("tel:", "").strip())
        elif href.startswith("mailto:"):
            emails.append(href.replace("mailto:", "").split("?")[0].strip())
    text = main_or_soup.get_text(" ", strip=True)
    # Fallback: regex on text
    phones.extend(re.findall(r"\+?\d[\d\s().\-]{8,17}\d", text))
    phones = [p.strip() for p in phones if len(re.sub(r"\D", "", p)) >= 9]
    emails.extend(re.findall(r"[\w.\-]+@[\w.\-]+\.\w+", text))
    emails = [e for e in emails if not any(e.endswith(ext) for ext in (".png", ".jpg", ".svg", ".webp"))]
    return {
        "phones": list(dict.fromkeys(phones))[:5],
        "emails": list(dict.fromkeys(emails))[:5],
    }


def scrape_generic(url: str) -> dict:
    html = fetch(url)
    soup = BeautifulSoup(html, "lxml")
    full_soup = BeautifulSoup(html, "lxml")
    main = extract_main(soup)
    meta = extract_meta(full_soup)
    headings = extract_headings(main)
    paragraphs = extract_paragraphs(main)
    bullets = extract_bullets(main)
    faqs = extract_faqs(main)
    full_text = main.get_text(" ", strip=True)
    standards = detect_standards(full_text)
    word_count = len(full_text.split())
    contact = extract_contact_info(full_soup)
    return {
        "url": url,
        "slug": slug_from_url(url),
        **meta,
        **headings,
        "paragraphs": paragraphs,
        "bulletLists": bullets,
        "faqs": faqs,
        "standards": standards,
        "wordCount": word_count,
        "phones": contact["phones"],
        "emails": contact["emails"],
        "scrapedAt": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime()),
    }


def scrape_contact(url: str) -> dict:
    data = scrape_generic(url)
    html = fetch(url)
    soup = BeautifulSoup(html, "lxml")
    text = soup.get_text(" ", strip=True)
    hours_patterns = [
        r"(\d{1,2}\s*[:.]?\d{0,2}\s*(?:AM|PM).{0,30}\d{1,2}\s*[:.]?\d{0,2}\s*(?:AM|PM))",
        r"(Mon(?:day)?.{0,80}(?:Fri|Sun).{0,60}(?:AM|PM|am|pm|EST|PST|GMT)?)",
        r"(24\s*[x/\-]\s*7|24/7|round[\- ]the[\- ]clock)",
    ]
    hours = ""
    for pat in hours_patterns:
        m = re.search(pat, text, re.IGNORECASE)
        if m:
            hours = m.group(1)[:120]
            break
    data["officeHours"] = hours
    iframe = soup.find("iframe", src=re.compile(r"google.com/maps"))
    data["mapEmbedUrl"] = iframe["src"] if iframe else ""
    return data


def run():
    os.makedirs(OUT_DIR, exist_ok=True)
    jobs = [
        ("home", HOME_URL, "home"),
        ("about", ABOUT_URL, "about-us"),
        ("contact", CONTACT_URL, "contact"),
    ]
    for url in SERVICE_URLS:
        jobs.append(("service", url, slug_from_url(url)))
    for url in BLOG_URLS:
        jobs.append(("blog", url, slug_from_url(url)))

    results = []
    for kind, url, slug in jobs:
        try:
            data = scrape_contact(url) if kind == "contact" else scrape_generic(url)
            data["pageType"] = kind
            out = os.path.join(OUT_DIR, f"ca-{slug}.json")
            with open(out, "w", encoding="utf-8") as f:
                json.dump(data, f, indent=2, ensure_ascii=False)
            results.append({
                "kind": kind,
                "slug": slug,
                "file": out,
                "title": data.get("metaTitle", "")[:60],
                "wordCount": data.get("wordCount", 0),
                "h2Count": len(data.get("h2", [])),
                "faqCount": len(data.get("faqs", [])),
                "standards": data.get("standards", []),
            })
            print(f"OK  {kind:8s} {slug[:55]:55s} words={data.get('wordCount',0):5d} h2={len(data.get('h2',[])):2d} faq={len(data.get('faqs',[])):2d}")
        except Exception as e:
            print(f"ERR {kind:8s} {slug:55s} {type(e).__name__}: {e}")

    summary = {
        "totalPages": len(results),
        "byKind": {},
        "pages": results,
    }
    for r in results:
        summary["byKind"].setdefault(r["kind"], 0)
        summary["byKind"][r["kind"]] += 1
    with open(os.path.join(OUT_DIR, "ca-summary.json"), "w", encoding="utf-8") as f:
        json.dump(summary, f, indent=2, ensure_ascii=False)
    print()
    print(f"DONE: {len(results)}/{len(jobs)} pages scraped")
    print(f"By kind: {summary['byKind']}")


if __name__ == "__main__":
    run()
