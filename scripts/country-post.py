#!/usr/bin/env python3
"""POST/UPDATE per-country shaped payloads to Strapi.

Usage:
  python3 scripts/country-post.py {cc} {blog|service} [--dry-run] [--update-only] [--create-only] [--force-update]
"""

import os, sys, json, time, subprocess
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
HP = {**H, "Content-Type": "application/json"}

DRY_RUN = "--dry-run" in sys.argv
UPDATE_ONLY = "--update-only" in sys.argv
CREATE_ONLY = "--create-only" in sys.argv
FORCE_UPDATE = "--force-update" in sys.argv
GROW_RATIO = 1.3

# Fields safe to enrich on existing entries (NEVER metaTitle/metaDescription/seoKeywords)
ENRICH_FIELDS_BLOG = ["body", "author", "heroImage", "heroImageAlt", "tags", "category", "publishedDate"]
ENRICH_FIELDS_SERVICE = ["body", "definitionalLede", "heroImagePath", "heroImageAlt", "eyebrow"]


def endpoint(kind: str) -> str:
    return "blog-posts" if kind == "blog" else "service-pages"


def fetch_existing(kind: str, slug: str, cc: str) -> dict | None:
    r = requests.get(
        f"{STRAPI}/{endpoint(kind)}?filters[slug][$eq]={slug}&filters[region][$eq]={cc}&publicationState=preview",
        headers=H, timeout=15,
    )
    data = r.json().get("data", [])
    return data[0] if data else None


def post_new(kind: str, payload: dict) -> tuple[bool, str]:
    if DRY_RUN:
        return True, "dry-run"
    r = requests.post(f"{STRAPI}/{endpoint(kind)}", headers=HP, json=payload, timeout=30)
    if r.status_code in (200, 201):
        try:
            return True, r.json()["data"]["documentId"]
        except Exception:
            return True, ""
    return False, f"{r.status_code}: {r.text[:240]}"


def put_update(kind: str, doc_id: str, data: dict) -> tuple[bool, str]:
    if DRY_RUN:
        return True, f"dry-run keys={list(data.keys())}"
    r = requests.put(f"{STRAPI}/{endpoint(kind)}/{doc_id}", headers=HP, json={"data": data}, timeout=30)
    if r.status_code in (200, 201):
        return True, "OK"
    return False, f"{r.status_code}: {r.text[:240]}"


def publish(kind: str, doc_id: str) -> bool:
    if DRY_RUN:
        return True
    r = requests.post(f"{STRAPI}/{endpoint(kind)}/{doc_id}/actions/publish", headers=HP, timeout=30)
    if r.status_code in (200, 201):
        return True
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    r2 = requests.put(f"{STRAPI}/{endpoint(kind)}/{doc_id}", headers=HP, json={"data": {"publishedAt": now}}, timeout=30)
    return r2.status_code in (200, 201)


def main():
    args = [a for a in sys.argv[1:] if not a.startswith("--")]
    if len(args) < 2:
        print("Usage: country-post.py {cc} {blog|service}")
        sys.exit(1)
    cc, kind = args[0], args[1]
    extracts = Path(f"data/{cc}/wp-{kind}-extracts")
    if not extracts.exists():
        print(f"No extracts at {extracts}")
        sys.exit(1)

    files = sorted(extracts.glob("*.json"))
    enrich_fields = ENRICH_FIELDS_BLOG if kind == "blog" else ENRICH_FIELDS_SERVICE
    created, updated, skipped, failed = [], [], [], []

    for fpath in files:
        payload = json.loads(fpath.read_text(encoding="utf-8"))
        data = payload["data"]
        slug = data["slug"]

        existing = fetch_existing(kind, slug, cc)

        if not existing:
            if UPDATE_ONLY:
                skipped.append((slug, "update-only"))
                continue
            ok, info = post_new(kind, {"data": data})
            if ok:
                doc_id = info if info != "dry-run" else None
                if doc_id and publish(kind, doc_id):
                    created.append(slug)
                    print(f"  NEW   {slug} (published)")
                else:
                    created.append(slug)
                    print(f"  NEW   {slug} {info}")
            else:
                failed.append((slug, info))
                print(f"  FAIL  {slug}: {info}")
            time.sleep(0.4)
            continue

        if CREATE_ONLY:
            skipped.append((slug, "create-only"))
            continue

        old_body_len = len(existing.get("body") or "")
        new_body_len = len(data.get("body") or "")
        if not FORCE_UPDATE and new_body_len < old_body_len * GROW_RATIO:
            skipped.append((slug, f"existing {old_body_len}c >= new {new_body_len}c"))
            print(f"  SKIP  {slug} ({old_body_len}c vs {new_body_len}c)")
            continue

        enrich = {}
        for k in enrich_fields:
            v = data.get(k)
            if v not in (None, "", []):
                enrich[k] = v
        if data.get("excerpt") and not existing.get("excerpt"):
            enrich["excerpt"] = data["excerpt"]

        doc_id = existing["documentId"]
        ok, info = put_update(kind, doc_id, enrich)
        if ok:
            if not existing.get("publishedAt"):
                publish(kind, doc_id)
            updated.append(slug)
            print(f"  ENR   {slug} ({old_body_len}c -> {new_body_len}c)")
        else:
            failed.append((slug, info))
            print(f"  FAIL  {slug}: {info}")
        time.sleep(0.3)

    print(f"\n=== DONE {cc}/{kind} ===")
    print(f"Created:  {len(created)}")
    print(f"Enriched: {len(updated)}")
    print(f"Skipped:  {len(skipped)}")
    print(f"Failed:   {len(failed)}")

    Path(f"data/{cc}/wp-{kind}-post-summary.json").write_text(
        json.dumps({"created": created, "updated": updated, "skipped": skipped, "failed": failed}, indent=2),
        encoding="utf-8",
    )


if __name__ == "__main__":
    main()
