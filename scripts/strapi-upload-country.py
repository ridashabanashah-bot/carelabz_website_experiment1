"""Upload scraped country content to Strapi with localized standards.

Usage:
    python3 scripts/strapi-upload-country.py --cc mx \\
        --country-name Mexico --country-iso CA \\
        --primary-standard "NOM-029-STPS-2011" \\
        --local-code "NOM-001-SEDE" \\
        --local-authority "STPS"

Reads data/wp-extracts/{cc}-*.json and data/strapi-refs/ (US reference entries).
Creates or updates CA-equivalent structure with country-localized text.
Delete -old duplicate blog slugs automatically (keeps first canonical).
"""
from __future__ import annotations

import argparse
import copy
import json
import os
import re
import sys
import urllib.error
import urllib.request

STRAPI_URL = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
EXTRACT_DIR = "data/wp-extracts"
REF_DIR = "data/strapi-refs"
PAYLOAD_DIR = "data/strapi-payloads"

STRIP_TOP = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"}

# Runtime-set CTA slugs (from args). Default keeps compatibility with existing Mexico run.
CONTACT_SLUG = "contact-us"
SERVICES_INDEX_SLUG = "service"


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


def deep_strip_id(obj):
    if isinstance(obj, dict):
        return {k: deep_strip_id(v) for k, v in obj.items() if k != "id"}
    if isinstance(obj, list):
        return [deep_strip_id(i) for i in obj]
    return obj


def strip_meta(obj):
    if isinstance(obj, dict):
        return {k: strip_meta(v) for k, v in obj.items() if k not in STRIP_TOP}
    if isinstance(obj, list):
        return [strip_meta(i) for i in obj]
    return obj


def fix_brand(s):
    if not isinstance(s, str):
        return s
    s = re.sub(r"\bCare\s+Labs\b", "Carelabs", s)
    s = re.sub(r"\bCareLabs\b", "Carelabs", s)
    s = re.sub(r"\bCareLAbz\b", "Carelabs", s)
    s = re.sub(r"\bCARELABS\b", "Carelabs", s)
    return s


def make_localizer(cc: str, name: str, primary_standard: str, local_code: str, local_authority: str):
    """Build a per-country text localizer that swaps US references."""
    LOCALIZE = [
        (r"\bNFPA 70E\b", primary_standard),
        (r"\bOSHA 1910 Subpart S\b", local_authority),
        (r"\bOSHA 1910 (Subpart )?S\b", local_authority),
        (r"\bOSHA\b", local_authority),
        (r"\bNational Electrical Code\b", local_code),
        (r"\bNEC\b", local_code.split("(")[-1].rstrip(")").strip() or local_code),
        (r"\bHouston, TX, United States\b", name),
        (r"\bHouston, TX\b", name),
        (r"\bHouston\b", name),
        (r"\bTexas\b", name),
        (r"\b(in|across|throughout|for) the (USA|U\.S\.|United States)\b", rf"\1 {name}"),
        (r"\b(USA|U\.S\.|United States)\b", name),
        (r"\bU\.S\. facility\b", f"{name} facility"),
        (r"\bU\.S\. facilities\b", f"{name} facilities"),
        (r"\bAmerican\b", f"{name.replace(' ','')}"),
        (r"\ben-US\b", f"en-{cc.upper()}"),
    ]

    def localize(text: str) -> str:
        if not isinstance(text, str):
            return text
        out = text
        for pat, rep in LOCALIZE:
            out = re.sub(pat, rep, out)
        return fix_brand(out)

    def deep(obj):
        if isinstance(obj, str):
            return localize(obj)
        if isinstance(obj, list):
            return [deep(i) for i in obj]
        if isinstance(obj, dict):
            return {k: deep(v) for k, v in obj.items()}
        return obj

    return deep


def rewrite_hrefs(obj, cc: str):
    if isinstance(obj, str):
        s = obj
        # US nested services /us/services/study-analysis/{slug}/ -> /cc/{slug}/
        s = re.sub(r"/us/services/[^/]+/([^/]+)/", rf"/{cc}/\1/", s)
        # US blog /us/blog/{slug}/ -> /cc/{slug}/  (most countries use flat)
        s = re.sub(r"/us/blog/([^/]+)/", rf"/{cc}/\1/", s)
        s = re.sub(r"/us/", f"/{cc}/", s)
        return s
    if isinstance(obj, dict):
        return {k: rewrite_hrefs(v, cc) for k, v in obj.items()}
    if isinstance(obj, list):
        return [rewrite_hrefs(i, cc) for i in obj]
    return obj


def load_extract(cc: str, slug: str):
    path = os.path.join(EXTRACT_DIR, f"{cc}-{slug}.json")
    if not os.path.exists(path):
        return None
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_ref(fname: str):
    path = os.path.join(REF_DIR, fname)
    if not os.path.exists(path):
        return {}
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    if isinstance(d.get("data"), list) and d["data"]:
        return d["data"][0]
    return d.get("data", {}) or {}


def http_post(path: str, payload: dict, token: str) -> dict:
    return http("POST", path, token, payload)


def put_entry(collection: str, doc_id: str, payload: dict, token: str) -> dict:
    clean = {k: v for k, v in payload.items() if k not in STRIP_TOP}
    return http("PUT", f"/api/{collection}/{doc_id}", token, deep_strip_id(clean))


def find_existing(collection: str, cc: str, slug: str, token: str) -> dict | None:
    path = f"/api/{collection}?filters[slug][$eq]={slug}&filters[region][$eq]={cc}"
    r = http("GET", path, token)
    data = r.get("data", [])
    return data[0] if data else None


def find_existing_singleton(collection: str, cc: str, token: str) -> dict | None:
    path = f"/api/{collection}?filters[region][$eq]={cc}&pagination[pageSize]=1"
    r = http("GET", path, token)
    data = r.get("data", [])
    return data[0] if data else None


def build_service(base_slug: str, cc: str, localize, ext: dict, us_ref: dict, standards: list) -> dict:
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize(payload)
    payload = rewrite_hrefs(payload, cc)
    payload["region"] = cc
    payload["slug"] = f"{base_slug}-{cc}"
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"]
    if ext.get("h1"):
        payload["title"] = ext["h1"]
    payload["ctaPrimaryHref"] = f"/{cc}/{CONTACT_SLUG}/"
    payload["ctaSecondaryHref"] = f"/{cc}/{SERVICES_INDEX_SLUG}/"
    payload["ctaBannerPrimaryHref"] = payload["ctaPrimaryHref"]
    payload["ctaBannerSecondaryHref"] = payload["ctaSecondaryHref"]
    payload["seoKeywords"] = list(dict.fromkeys(
        (payload.get("seoKeywords") or []) + standards + [f"{base_slug.replace('-',' ')} {cc.upper()}"]
    ))
    return payload


def build_home(cc: str, localize, ext: dict, us_ref: dict, standards: list) -> dict:
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize(payload)
    payload = rewrite_hrefs(payload, cc)
    payload["region"] = cc
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"]
    if ext.get("h1"):
        payload["heroHeadline"] = ext["h1"]
    contact = f"/{cc}/{CONTACT_SLUG}/"
    payload["heroPrimaryCtaHref"] = contact
    payload["heroSecondaryCtaHref"] = f"/{cc}/service/"
    payload["ctaBannerPrimaryHref"] = contact
    payload["ctaBannerSecondaryHref"] = f"/{cc}/service/"
    payload["seoKeywords"] = list(dict.fromkeys((payload.get("seoKeywords") or []) + standards))
    return payload


def build_about(cc: str, localize, ext: dict, us_ref: dict) -> dict:
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize(payload)
    payload = rewrite_hrefs(payload, cc)
    payload["region"] = cc
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"]
    if ext.get("h1"):
        payload["heroHeadline"] = ext["h1"]
    payload["ctaBannerPrimaryHref"] = f"/{cc}/contact-us/" if cc == "mx" else f"/{cc}/contact/"
    return payload


def build_contact(cc: str, localize, ext: dict, us_ref: dict, fallback_phone: str, fallback_email: str, fallback_address: str) -> dict:
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize(payload)
    payload = rewrite_hrefs(payload, cc)
    payload["region"] = cc
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"]
    if ext.get("h1"):
        payload["heroHeadline"] = ext["h1"]
    payload["phone"] = ext["phones"][0] if ext.get("phones") else fallback_phone
    payload["email"] = ext["emails"][0] if ext.get("emails") else fallback_email
    payload["address"] = fallback_address
    payload["officeHours"] = "Monday – Friday, 9 AM – 5 PM"
    return payload


def build_blog(cc: str, localize, ext: dict, us_ref: dict, standards: list, country_name: str) -> dict:
    payload = strip_meta(copy.deepcopy(us_ref)) if us_ref else {}
    payload.update({
        "region": cc,
        "slug": ext["slug"],
        "title": ext.get("h1") or ext.get("metaTitle", ""),
        "metaTitle": ext.get("metaTitle", ""),
        "metaDescription": ext.get("metaDescription", ""),
        "excerpt": (ext.get("paragraphs") or [""])[0][:250] if ext.get("paragraphs") else "",
        "body": "\n\n".join(ext.get("paragraphs", [])[:20]),
        "author": "Carelabs Engineering Team",
        "category": infer_blog_category(ext),
        "publishedDate": "2024-01-15",
        "heroImage": "",
        "heroImageAlt": f"{ext.get('h1', 'blog article')} — Carelabs {country_name}",
        "seoKeywords": standards + [f"electrical safety {country_name}", "Carelabs blog"],
        "tags": [country_name, "Electrical Safety"],
        "faqs": [],
        "relatedPosts": [],
    })
    # localize after hydrate
    payload = localize(payload)
    return payload


def infer_blog_category(ext: dict) -> str:
    text = " ".join([ext.get("metaTitle", ""), " ".join(ext.get("h2", [])), " ".join(ext.get("paragraphs", [])[:2])]).lower()
    if "arc flash" in text:
        return "Arc Flash Safety"
    if "short circuit" in text:
        return "Short Circuit Analysis"
    if "load flow" in text:
        return "Load Flow Analysis"
    if "relay" in text or "microgrid" in text:
        return "Relay Coordination"
    if "hydropower" in text or "sustainable" in text:
        return "Power Generation"
    if "ppe" in text or "protective" in text:
        return "Worker Safety"
    return "Electrical Engineering"


def upsert(collection: str, cc: str, slug: str | None, payload: dict, token: str, singleton: bool) -> dict:
    existing = find_existing_singleton(collection, cc, token) if singleton else find_existing(collection, cc, slug or "", token)
    if existing:
        return put_entry(collection, existing["documentId"], payload, token)
    else:
        return http_post(f"/api/{collection}", payload, token)


def run():
    ap = argparse.ArgumentParser()
    ap.add_argument("--cc", required=True)
    ap.add_argument("--country-name", required=True)
    ap.add_argument("--country-iso", required=True, help="ISO2 country code for PostalAddress")
    ap.add_argument("--primary-standard", required=True)
    ap.add_argument("--local-code", required=True)
    ap.add_argument("--local-authority", required=True)
    ap.add_argument("--standards", default="", help="comma-separated extra seoKeywords")
    ap.add_argument("--phone", default="+1 (800) 000-0000")
    ap.add_argument("--email", default="info@carelabz.com")
    ap.add_argument("--address", default="")
    ap.add_argument("--max-blogs", type=int, default=30)
    ap.add_argument("--services", default="arc-flash-study,short-circuit-analysis,load-flow-analysis,relay-coordination-study",
                    help="Comma-separated base service slugs this country has")
    ap.add_argument("--contact-slug", default="contact-us",
                    help="Contact URL slug for CTA hrefs (usually 'contact' or 'contact-us')")
    ap.add_argument("--services-index-slug", default="service",
                    help="Services index path slug")
    args = ap.parse_args()

    global CONTACT_SLUG, SERVICES_INDEX_SLUG
    CONTACT_SLUG = args.contact_slug
    SERVICES_INDEX_SLUG = args.services_index_slug

    cc = args.cc.lower()
    country_name = args.country_name
    address = args.address or f"{country_name}"
    standards = [s.strip() for s in args.standards.split(",") if s.strip()]
    if args.primary_standard not in standards: standards.insert(0, args.primary_standard)

    token = load_token()
    localize = make_localizer(cc, country_name, args.primary_standard, args.local_code, args.local_authority)

    results = []

    # Home
    ext = load_extract(cc, "home") or load_extract(cc, cc)
    if ext:
        us_ref = load_ref("home-us.json")
        p = build_home(cc, localize, ext, us_ref, standards)
        os.makedirs(PAYLOAD_DIR, exist_ok=True)
        with open(f"{PAYLOAD_DIR}/{cc}-home-home.json", "w", encoding="utf-8") as f:
            json.dump(p, f, indent=2, ensure_ascii=False)
        r = upsert("home-pages", cc, None, p, token, singleton=True)
        ok = "error" not in r
        print(f"  {'OK' if ok else 'ERR'} home-pages")
        results.append(ok)

    # About
    ext = load_extract(cc, "about-us") or load_extract(cc, "about")
    if ext:
        us_ref = load_ref("about-us.json")
        p = build_about(cc, localize, ext, us_ref)
        r = upsert("about-pages", cc, None, p, token, singleton=True)
        ok = "error" not in r
        print(f"  {'OK' if ok else 'ERR'} about-pages")
        results.append(ok)

    # Contact
    ext = load_extract(cc, "contact-us") or load_extract(cc, "contact")
    if ext:
        us_ref = load_ref("contact-us.json")
        p = build_contact(cc, localize, ext, us_ref, args.phone, args.email, address)
        r = upsert("contact-pages", cc, None, p, token, singleton=True)
        ok = "error" not in r
        print(f"  {'OK' if ok else 'ERR'} contact-pages")
        results.append(ok)

    # Services
    service_list = [s.strip() for s in args.services.split(",") if s.strip()]
    for base in service_list:
        ext = load_extract(cc, base)
        if not ext:
            print(f"  skip service {base} (no extract)")
            continue
        # Prefer matching US ref; fall back to arc-flash-study-us as universal template
        us_ref = load_ref(f"{base}-us.json")
        if not us_ref:
            us_ref = load_ref("arc-flash-study-us.json")
        if not us_ref:
            print(f"  skip service {base} (no US ref template)")
            continue
        p = build_service(base, cc, localize, ext, us_ref, standards)
        r = upsert("service-pages", cc, f"{base}-{cc}", p, token, singleton=False)
        ok = "error" not in r
        print(f"  {'OK' if ok else 'ERR'} service: {base}-{cc}" + ("" if ok else f" :: {r.get('error','')[:100]}"))
        results.append(ok)

    # Blogs
    us_blog_ref = load_ref("blog-us.json")
    blog_count = 0
    for fname in sorted(os.listdir(EXTRACT_DIR)):
        if not fname.startswith(f"{cc}-") or not fname.endswith(".json") or "summary" in fname:
            continue
        path = os.path.join(EXTRACT_DIR, fname)
        try:
            data = json.load(open(path, encoding="utf-8"))
        except Exception:
            continue
        if data.get("pageType") != "blog":
            continue
        if blog_count >= args.max_blogs:
            break
        slug = data["slug"]
        p = build_blog(cc, localize, data, us_blog_ref, standards, country_name)
        r = upsert("blog-posts", cc, slug, p, token, singleton=False)
        ok = "error" not in r
        print(f"  {'OK' if ok else 'ERR'} blog: {slug[:55]}" + ("" if ok else f" :: {r.get('error','')[:80]}"))
        results.append(ok)
        blog_count += 1

    ok_ct = sum(1 for r in results if r)
    print(f"\n== {cc.upper()} Strapi: {ok_ct}/{len(results)} OK")


if __name__ == "__main__":
    run()
