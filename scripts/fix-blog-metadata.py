"""Set author + publishedDate on every BR/CO/CL/AR/PE blog post in Strapi.

Addresses SEO gap flagged after content migration — Google article
freshness signals + frontend date display need these two fields.
"""
from __future__ import annotations

import json
import urllib.request
import urllib.error

STRAPI = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
TOKEN = ""
with open(".env.local", encoding="utf-8") as f:
    for line in f:
        if line.startswith("STRAPI_API_TOKEN="):
            TOKEN = line.split("=", 1)[1].strip().strip('"').strip("'")
            break


def http(method, path, body=None):
    req_body = json.dumps({"data": body}).encode() if body else None
    headers = {"Authorization": f"Bearer {TOKEN}"}
    if req_body:
        headers["Content-Type"] = "application/json"
    req = urllib.request.Request(
        STRAPI + path, data=req_body, headers=headers, method=method
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as r:
            raw = r.read().decode()
            return json.loads(raw) if raw else {}
    except urllib.error.HTTPError as e:
        return {"__error": f"HTTP {e.code}: {e.read().decode('utf-8','replace')[:200]}"}


AUTHOR = "Carelabs Engineering Team"
PUBLISHED = "2026-04-25"


def main():
    total_updated = total_skipped = total_failed = 0
    for cc in ["br", "co", "cl", "ar", "pe"]:
        print(f"\n=== {cc.upper()} ===")
        r = http(
            "GET",
            f"/api/blog-posts?filters[region][$eq]={cc}"
            "&fields[0]=documentId&fields[1]=slug&fields[2]=author"
            "&fields[3]=publishedDate&pagination[pageSize]=100",
        )
        if "__error" in r:
            print(f"  query err: {r['__error']}")
            continue
        entries = r.get("data", [])
        print(f"  {len(entries)} posts")
        for e in entries:
            payload = {}
            if not e.get("author"):
                payload["author"] = AUTHOR
            if not e.get("publishedDate"):
                payload["publishedDate"] = PUBLISHED
            if not payload:
                total_skipped += 1
                continue
            r2 = http("PUT", f"/api/blog-posts/{e['documentId']}", payload)
            if "__error" in r2:
                print(f"  [ERR] {e.get('slug')}: {r2['__error'][:100]}")
                total_failed += 1
            else:
                fields = "+".join(payload.keys())
                print(f"  [OK ] {e.get('slug'):<65} {fields}")
                total_updated += 1
    print(
        f"\nTotals: updated={total_updated} skipped={total_skipped} failed={total_failed}"
    )


if __name__ == "__main__":
    main()
