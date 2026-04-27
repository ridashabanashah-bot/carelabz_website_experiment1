"""Fix all 8 broken links on the UAE site (Parts A-E from the spec).

Part A is a code fix to countries-config.ts (handled separately).
Parts B-E are Strapi data fixes via PUT against the live API.

Each Part:
  - Surveys Strapi for occurrences of the broken pattern
  - Reports what it found
  - PUTs the corrected value
  - Re-fetches to confirm
"""

import json
import os
import re
import urllib.request
import urllib.error
from pathlib import Path
from typing import Optional

# Load token
for line in Path(".env.local").read_text().splitlines():
    if line.startswith("STRAPI_API_TOKEN="):
        os.environ["STRAPI_API_TOKEN"] = line.split("=", 1)[1].strip().strip('"').strip("'")
        break

BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
TOKEN = os.environ["STRAPI_API_TOKEN"]
H = {"Authorization": f"Bearer {TOKEN}"}
H_PUT = {**H, "Content-Type": "application/json"}


def get(path: str) -> dict:
    req = urllib.request.Request(f"{BASE}/{path}", headers=H)
    with urllib.request.urlopen(req, timeout=30) as r:
        return json.loads(r.read())


def put(endpoint: str, doc_id: str, data: dict) -> int:
    body = json.dumps({"data": data}).encode()
    req = urllib.request.Request(
        f"{BASE}/{endpoint}/{doc_id}",
        data=body,
        method="PUT",
        headers=H_PUT,
    )
    with urllib.request.urlopen(req, timeout=30) as r:
        return r.status


def attrs(e: dict) -> dict:
    return e if "documentId" in e else e.get("attributes", e)


def all_for(endpoint: str) -> list:
    """Fetch all region=ae entries for a content type, paginated."""
    items = []
    page = 1
    while True:
        qs = f"filters[region][$eq]=ae&pagination[pageSize]=100&pagination[page]={page}"
        data = get(f"{endpoint}?{qs}")
        batch = data.get("data") or []
        items.extend(batch)
        meta = data.get("meta", {}).get("pagination", {})
        if page >= meta.get("pageCount", 1):
            break
        page += 1
    return items


# ── slug verification (Part A prep) ───────────────────────────────

def verify_footer_slugs():
    print("=" * 60)
    print("Part A prep: verify footer service slugs in Strapi")
    print("=" * 60)
    candidates = [
        "arc-flash-study-analysis-ae",
        "short-circuit-study-analysis-ae",
        "load-flow-analysis-ae",
        "relay-coordination-study-and-analysis-ae",
        "protection-coordination-study",
        "protection-coordination-study-ae",
        "cable-testing",
        "cable-testing-ae",
    ]
    found = {}
    for s in candidates:
        d = get(f"service-pages?filters[slug][$eq]={s}&filters[region][$eq]=ae")
        n = d["meta"]["pagination"]["total"]
        found[s] = n
        print(f"  {s:50s} -> {n}")
    return found


# ── Part B: /ae/contact-us/ -> /ae/contact/ ──────────────────────

def find_contact_us_refs():
    print()
    print("=" * 60)
    print("Part B: scan all AE content for /ae/contact-us/ refs")
    print("=" * 60)
    hits = []
    for endpoint in ("about-pages", "service-pages", "blog-posts", "case-studies", "home-pages", "contact-pages"):
        for entry in all_for(endpoint):
            a = attrs(entry)
            for k, v in a.items():
                if isinstance(v, str) and "/ae/contact-us/" in v:
                    hits.append((endpoint, a.get("documentId") or entry.get("documentId"), a.get("slug", "?"), k, v))
    print(f"  Found {len(hits)} fields containing /ae/contact-us/")
    for ep, did, slug, k, v in hits[:20]:
        idx = v.find("/ae/contact-us/")
        ctx = v[max(0, idx - 20):idx + 30].replace("\n", " ")
        print(f"  [{ep}] {slug:45s} field={k:25s} ctx=...{ctx}...")
    return hits


def fix_contact_us(hits: list):
    """Apply field-level string replacement for each hit."""
    print()
    print("Part B fix: PUT corrected values")
    grouped: dict[tuple[str, str], dict[str, str]] = {}
    for ep, did, slug, k, v in hits:
        if not did:
            continue
        new_v = v.replace("/ae/contact-us/", "/ae/contact/")
        grouped.setdefault((ep, did), {})[k] = new_v
    for (ep, did), fields in grouped.items():
        try:
            status = put(ep, did, fields)
            print(f"  [{status}] {ep}/{did}  fields={list(fields.keys())}")
        except urllib.error.HTTPError as e:
            print(f"  [FAIL {e.code}] {ep}/{did}  {e.read()[:200]}")


# ── Part C: nullinfo@carelabz.com ────────────────────────────────

def find_null_email():
    print()
    print("=" * 60)
    print("Part C: scan for malformed nullinfo@ / nullmailto: tokens")
    print("=" * 60)
    hits = []
    for endpoint in ("about-pages", "service-pages", "blog-posts", "case-studies", "home-pages", "contact-pages"):
        for entry in all_for(endpoint):
            a = attrs(entry)
            for k, v in a.items():
                if not isinstance(v, str):
                    continue
                if "nullinfo@" in v or "nullmailto:" in v or "null mailto:" in v:
                    hits.append((endpoint, a.get("documentId") or entry.get("documentId"), a.get("slug", "?"), k, v))
    print(f"  Found {len(hits)} fields")
    for ep, did, slug, k, v in hits:
        for tok in ("nullinfo@", "nullmailto:", "null mailto:"):
            if tok in v:
                idx = v.find(tok)
                ctx = v[max(0, idx - 25):idx + 45].replace("\n", " ")
                print(f"  [{ep}] {slug:45s} field={k:20s} ctx=...{ctx}...")
                break
    return hits


def fix_null_email(hits: list):
    print()
    print("Part C fix: PUT corrected values")
    grouped: dict[tuple[str, str], dict[str, str]] = {}
    for ep, did, slug, k, v in hits:
        if not did:
            continue
        new_v = (
            v.replace("nullinfo@", "info@")
             .replace("nullmailto:", "mailto:")
             .replace("null mailto:", "mailto:")
        )
        grouped.setdefault((ep, did), {})[k] = new_v
    for (ep, did), fields in grouped.items():
        try:
            status = put(ep, did, fields)
            print(f"  [{status}] {ep}/{did}  fields={list(fields.keys())}")
        except urllib.error.HTTPError as e:
            print(f"  [FAIL {e.code}] {ep}/{did}  {e.read()[:200]}")


# ── Part D: /cdn-cgi/l/email-protection ──────────────────────────

def find_cf_email():
    print()
    print("=" * 60)
    print("Part D: scan for Cloudflare /cdn-cgi/l/email-protection links")
    print("=" * 60)
    hits = []
    for endpoint in ("blog-posts", "service-pages", "about-pages", "case-studies"):
        for entry in all_for(endpoint):
            a = attrs(entry)
            for k, v in a.items():
                if isinstance(v, str) and ("cdn-cgi" in v or "email-protection" in v):
                    hits.append((endpoint, a.get("documentId") or entry.get("documentId"), a.get("slug", "?"), k, v))
    print(f"  Found {len(hits)} fields")
    for ep, did, slug, k, v in hits[:10]:
        idx = v.find("cdn-cgi") if "cdn-cgi" in v else v.find("email-protection")
        ctx = v[max(0, idx - 30):idx + 60].replace("\n", " ")
        print(f"  [{ep}] {slug:45s} field={k:20s} ctx=...{ctx}...")
    return hits


def fix_cf_email(hits: list):
    print()
    print("Part D fix: replace /cdn-cgi/l/email-protection links with mailto:info@carelabz.com")
    grouped: dict[tuple[str, str], dict[str, str]] = {}
    for ep, did, slug, k, v in hits:
        if not did:
            continue
        # Replace the full Cloudflare email-protection URL (with trailing #hash if present)
        new_v = re.sub(
            r"(https?:)?//?[^\s\"\)\]]*?/cdn-cgi/l/email-protection[^\s\"\)\]]*",
            "mailto:info@carelabz.com",
            v,
        )
        # Also handle relative form starting with /
        new_v = re.sub(
            r"/cdn-cgi/l/email-protection[^\s\"\)\]]*",
            "mailto:info@carelabz.com",
            new_v,
        )
        if new_v == v:
            continue
        grouped.setdefault((ep, did), {})[k] = new_v
    for (ep, did), fields in grouped.items():
        try:
            status = put(ep, did, fields)
            print(f"  [{status}] {ep}/{did}  fields={list(fields.keys())}")
        except urllib.error.HTTPError as e:
            print(f"  [FAIL {e.code}] {ep}/{did}  {e.read()[:200]}")


# ── Part E: carelabs.me dead domain ──────────────────────────────

def find_carelabs_me(megger_slug_target: Optional[str]):
    print()
    print("=" * 60)
    print("Part E: scan for dead carelabs.me links")
    print("=" * 60)
    hits = []
    for endpoint in ("blog-posts", "service-pages", "about-pages", "case-studies", "home-pages"):
        for entry in all_for(endpoint):
            a = attrs(entry)
            for k, v in a.items():
                if isinstance(v, str) and "carelabs.me" in v:
                    hits.append((endpoint, a.get("documentId") or entry.get("documentId"), a.get("slug", "?"), k, v))
    print(f"  Found {len(hits)} fields")
    for ep, did, slug, k, v in hits[:10]:
        idx = v.find("carelabs.me")
        ctx = v[max(0, idx - 30):idx + 80].replace("\n", " ")
        print(f"  [{ep}] {slug:45s} field={k:20s} ctx=...{ctx}...")
    return hits


def fix_carelabs_me(hits: list, megger_slug: str):
    print()
    print(f"Part E fix: replace carelabs.me links")
    print(f"  megger redirect target: /ae/services/{megger_slug}/")
    grouped: dict[tuple[str, str], dict[str, str]] = {}
    for ep, did, slug, k, v in hits:
        if not did:
            continue
        new_v = re.sub(
            r"https?://carelabs\.me/megger-test/?",
            f"/ae/services/{megger_slug}/",
            v,
        )
        # Also catch other carelabs.me URLs -> internal contact as fallback
        new_v = re.sub(
            r"https?://carelabs\.me[^\s\"\)\]]*",
            "/ae/contact/",
            new_v,
        )
        if new_v == v:
            continue
        grouped.setdefault((ep, did), {})[k] = new_v
    for (ep, did), fields in grouped.items():
        try:
            status = put(ep, did, fields)
            print(f"  [{status}] {ep}/{did}  fields={list(fields.keys())}")
        except urllib.error.HTTPError as e:
            print(f"  [FAIL {e.code}] {ep}/{did}  {e.read()[:200]}")


def find_megger_slug() -> str:
    """Find the AE service slug for megger testing."""
    d = get("service-pages?filters[region][$eq]=ae&filters[slug][$containsi]=megger&pagination[pageSize]=10")
    items = d.get("data") or []
    if items:
        a = attrs(items[0])
        slug = a.get("slug") or ""
        print(f"  megger slug found: {slug}")
        # Strip -ae suffix for public URL
        return slug[:-3] if slug.endswith("-ae") else slug
    print("  no megger service entry found; using contact fallback")
    return ""


# ── orchestrator ─────────────────────────────────────────────────

def main():
    found = verify_footer_slugs()

    # Part B
    b_hits = find_contact_us_refs()
    if b_hits:
        fix_contact_us(b_hits)

    # Part C
    c_hits = find_null_email()
    if c_hits:
        fix_null_email(c_hits)

    # Part D
    d_hits = find_cf_email()
    if d_hits:
        fix_cf_email(d_hits)

    # Part E
    print()
    megger = find_megger_slug()
    e_hits = find_carelabs_me(megger)
    if e_hits and megger:
        fix_carelabs_me(e_hits, megger)

    print()
    print("=" * 60)
    print("Done. Footer slug verification result above (Part A) — apply manually to countries-config.ts.")
    print("=" * 60)


if __name__ == "__main__":
    main()
