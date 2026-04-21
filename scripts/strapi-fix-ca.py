"""Fix CareLabs spelling and content-parity drift on CA Strapi entries.

For each CA entry in Strapi:
  1. Walk all string fields, replace any "Care Labs" / "Carelabs" / "CARELABS" with "CareLabs"
     (preserve legit carelabz.com domain + email).
  2. For pages that map to a live WP URL, fetch WP and compare meta title,
     meta description, and H1. Update Strapi to match WP exactly where they drift.
  3. PUT update each changed entry via documentId.

Uses STRAPI_API_TOKEN from .env.local.
"""
from __future__ import annotations

import copy
import html as html_mod
import json
import re
import sys
import urllib.error
import urllib.request

STRAPI_URL = "https://rational-cheese-8e8c4f80ea.strapiapp.com"

SERVICE_URL_MAP = {
    "arc-flash-study-ca": "https://carelabz.com/ca/services/arc-flash-study/",
    "short-circuit-analysis-ca": "https://carelabz.com/ca/services/short-circuit-analysis/",
    "load-flow-analysis-ca": "https://carelabz.com/ca/services/load-flow-analysis/",
    "relay-coordination-study-ca": "https://carelabz.com/ca/services/relay-coordination-study/",
}

BLOG_URL_FMT = "https://carelabz.com/ca/{slug}/"  # WP blog URLs mirror slug directly

HOME_URL = "https://carelabz.com/ca/"
ABOUT_URL = "https://carelabz.com/ca/about-us/"
CONTACT_URL = "https://carelabz.com/ca/contact/"


def load_token() -> str:
    with open(".env.local", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("STRAPI_API_TOKEN="):
                return line.split("=", 1)[1].strip().strip('"').strip("'")
    raise RuntimeError("STRAPI_API_TOKEN missing")


def http(method: str, path: str, token: str, body: dict | None = None) -> dict:
    req_body = json.dumps({"data": body}).encode("utf-8") if body is not None else None
    headers = {"Authorization": f"Bearer {token}"}
    if req_body:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(
        f"{STRAPI_URL}{path}", data=req_body, headers=headers, method=method
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        return {"error": f"HTTP {e.code}: {err[:400]}"}


def list_all(collection: str, token: str) -> list:
    out = []
    page = 1
    while True:
        path = f"/api/{collection}?filters[region][$eq]=ca&pagination[page]={page}&pagination[pageSize]=100&populate=*"
        r = http("GET", path, token)
        data = r.get("data", []) or []
        out.extend(data)
        meta = r.get("meta", {}).get("pagination", {})
        if page >= meta.get("pageCount", 1):
            break
        page += 1
    return out


def fix_brand_string(s: str) -> str:
    """Replace misspellings but preserve carelabz.com / @carelabz.com / /carelabz/ paths."""
    if not isinstance(s, str):
        return s
    placeholder_map = {}
    # Protect legit carelabz uses (domain, email, path, social handle)
    pattern = re.compile(r"(https?://[^\s\"'<>]*carelabz[^\s\"'<>]*|[a-zA-Z0-9._%+-]+@carelabz\.[a-zA-Z]+|/carelabs-logo\.svg|/carelabz/|carelabz\.com)")
    def _protect(m):
        k = f"\x00PROT{len(placeholder_map)}\x00"
        placeholder_map[k] = m.group(0)
        return k
    protected = pattern.sub(_protect, s)
    # Replace misspellings
    protected = re.sub(r"\bCare\s+Labs\b", "CareLabs", protected)
    protected = re.sub(r"\bCarelabs\b", "CareLabs", protected)
    protected = re.sub(r"\bCARELABS\b", "CareLabs", protected)
    protected = re.sub(r"\bCareLAbz\b", "CareLabs", protected)
    # Restore
    for k, v in placeholder_map.items():
        protected = protected.replace(k, v)
    return protected


def deep_fix_brand(obj):
    if isinstance(obj, str):
        return fix_brand_string(obj)
    if isinstance(obj, list):
        return [deep_fix_brand(x) for x in obj]
    if isinstance(obj, dict):
        return {k: deep_fix_brand(v) for k, v in obj.items()}
    return obj


def count_misspellings(obj) -> int:
    text = json.dumps(obj, ensure_ascii=False)
    # Only count misspellings NOT inside a protected domain/email/path
    candidate = re.sub(r"https?://[^\s\"'<>]*carelabz[^\s\"'<>]*", "", text)
    candidate = re.sub(r"@carelabz\.[a-zA-Z]+", "", candidate)
    candidate = re.sub(r"carelabz\.com", "", candidate)
    candidate = re.sub(r"carelabs-logo\.svg", "", candidate)
    return (
        len(re.findall(r"\bCare\s+Labs\b", candidate))
        + len(re.findall(r"\bCarelabs\b", candidate))
        + len(re.findall(r"\bCARELABS\b", candidate))
        + len(re.findall(r"\bCareLAbz\b", candidate))
    )


def fetch_wp(url: str) -> dict:
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 CareLabs-QA/1.0"})
    with urllib.request.urlopen(req, timeout=30) as r:
        html = r.read().decode("utf-8", errors="replace")
    title = re.search(r"<title[^>]*>(.*?)</title>", html, re.DOTALL)
    desc = re.search(
        r'<meta\s+name=["\']description["\']\s+content=["\'](.*?)["\']', html, re.DOTALL
    )
    h1 = re.search(r"<h1[^>]*>(.*?)</h1>", html, re.DOTALL)
    def clean(s):
        if not s: return ""
        t = re.sub(r"<[^>]+>", "", s).strip()
        t = re.sub(r"\s+", " ", t)
        t = html_mod.unescape(t)
        return fix_brand_string(t)
    return {
        "title": clean(title.group(1)) if title else "",
        "metaDescription": clean(desc.group(1)) if desc else "",
        "h1": clean(h1.group(1)) if h1 else "",
    }


def put_entry(collection: str, doc_id: str, payload: dict, token: str) -> dict:
    STRIP_TOP = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"}
    COMPONENT_ID = {"id"}  # strip stale component ids from list items so Strapi recreates them

    def deep_strip(obj):
        if isinstance(obj, dict):
            return {k: deep_strip(v) for k, v in obj.items() if k not in COMPONENT_ID}
        if isinstance(obj, list):
            return [deep_strip(i) for i in obj]
        return obj

    clean_top = {k: v for k, v in payload.items() if k not in STRIP_TOP}
    # For component arrays (faqs, features, etc), remove nested `id` fields
    clean_deep = deep_strip(clean_top)
    return http("PUT", f"/api/{collection}/{doc_id}", token, clean_deep)


def run():
    token = load_token()
    changes = []

    def process(collection: str, slug_url_map: dict | None = None, title_field: str = "title"):
        entries = list_all(collection, token)
        print(f"\n=== {collection} ({len(entries)}) ===")
        for e in entries:
            before = copy.deepcopy(e)
            after = deep_fix_brand(copy.deepcopy(e))
            spelling_changed = after != before
            misspell_count = count_misspellings(before)

            # Content parity for entries that have a WP URL
            parity_changes = []
            wp_url = None
            if collection == "service-pages" and e.get("slug") in SERVICE_URL_MAP:
                wp_url = SERVICE_URL_MAP[e["slug"]]
            elif collection == "home-pages":
                wp_url = HOME_URL
            elif collection == "about-pages":
                wp_url = ABOUT_URL
            elif collection == "contact-pages":
                wp_url = CONTACT_URL
            elif collection == "blog-posts" and e.get("slug"):
                wp_url = BLOG_URL_FMT.format(slug=e["slug"])

            if wp_url:
                wp = fetch_wp(wp_url)
                # metaTitle
                if wp["title"] and after.get("metaTitle", "") != wp["title"]:
                    parity_changes.append(f"metaTitle: '{after.get('metaTitle','')}' -> '{wp['title']}'")
                    after["metaTitle"] = wp["title"]
                # metaDescription
                if wp["metaDescription"] and after.get("metaDescription", "") != wp["metaDescription"]:
                    parity_changes.append(
                        f"metaDescription: '{(after.get('metaDescription') or '')[:60]}...' -> '{wp['metaDescription'][:60]}...'"
                    )
                    after["metaDescription"] = wp["metaDescription"]
                # title field (e.g. H1 -> title for service-pages, heroHeadline for home/about)
                if collection == "service-pages":
                    if wp["h1"] and after.get("title", "") != wp["h1"]:
                        parity_changes.append(f"title(H1): '{after.get('title','')}' -> '{wp['h1']}'")
                        after["title"] = wp["h1"]
                elif collection in ("home-pages", "about-pages"):
                    if wp["h1"] and after.get("heroHeadline", "") != wp["h1"]:
                        parity_changes.append(f"heroHeadline(H1): '{after.get('heroHeadline','')}' -> '{wp['h1']}'")
                        after["heroHeadline"] = wp["h1"]
                elif collection == "blog-posts":
                    if wp["h1"] and after.get("title", "") != wp["h1"]:
                        parity_changes.append(f"title(H1): '{after.get('title','')[:50]}...' -> '{wp['h1'][:50]}...'")
                        after["title"] = wp["h1"]

            if spelling_changed or parity_changes:
                r = put_entry(collection, e["documentId"], after, token)
                ok = "error" not in r
                msg = f"misspell_found={misspell_count} parity_updates={len(parity_changes)}"
                print(f"  {'OK' if ok else 'ERR'} {e.get('slug', e.get('region')):40s} {msg}")
                for p in parity_changes:
                    print(f"      {p}")
                if not ok:
                    print(f"      !! {r.get('error')}")
                changes.append({"collection": collection, "slug": e.get("slug", e.get("region")), "spelling": spelling_changed, "parity": parity_changes, "ok": ok})
            else:
                print(f"  clean {e.get('slug', e.get('region'))}")

    process("service-pages", SERVICE_URL_MAP)
    process("home-pages")
    process("about-pages")
    process("contact-pages")
    process("blog-posts")

    updates = [c for c in changes if c.get("ok")]
    fails = [c for c in changes if not c.get("ok")]
    print()
    print(f"TOTAL updates: {len(updates)}  failures: {len(fails)}")
    with open("data/strapi-payloads/ca-fix-report.json", "w", encoding="utf-8") as f:
        json.dump({"updates": len(updates), "failures": len(fails), "changes": changes}, f, indent=2)


if __name__ == "__main__":
    run()
