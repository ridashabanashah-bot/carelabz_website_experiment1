#!/usr/bin/env python3
"""POST/UPDATE blog-post entries in Strapi from data/wp-blog-extracts/.

For NEW slugs:  POST entire payload, then publish.
For EXISTING slugs: PUT only enrichment fields if WP body is significantly longer.
                    Skip metaTitle / metaDescription / seoKeywords (SEO-critical).

--dry-run        preview every POST/PUT without sending
--update-only    skip new creations
--create-only    skip enrichment of existing
--force-update   overwrite existing even when WP body isn't longer
"""

import os, json, sys, time, subprocess
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

EXTRACTS = Path("data/wp-blog-extracts")
GROW_RATIO = 1.3  # WP body must be 1.3x longer to overwrite, unless --force-update


def fetch_existing(slug: str) -> dict | None:
    r = requests.get(
        f"{STRAPI}/blog-posts?filters[slug][$eq]={slug}&filters[region][$eq]=ae&publicationState=preview",
        headers=H, timeout=15,
    )
    data = r.json().get("data", [])
    return data[0] if data else None


def post_new(payload: dict) -> tuple[bool, str]:
    if DRY_RUN:
        return True, "dry-run"
    r = requests.post(f"{STRAPI}/blog-posts", headers=HP, json=payload, timeout=30)
    if r.status_code in (200, 201):
        try:
            return True, r.json()["data"]["documentId"]
        except Exception:
            return True, ""
    return False, f"{r.status_code}: {r.text[:240]}"


def put_update(doc_id: str, data: dict) -> tuple[bool, str]:
    if DRY_RUN:
        return True, f"dry-run keys={list(data.keys())}"
    r = requests.put(f"{STRAPI}/blog-posts/{doc_id}", headers=HP, json={"data": data}, timeout=30)
    if r.status_code in (200, 201):
        return True, "OK"
    return False, f"{r.status_code}: {r.text[:240]}"


def publish(doc_id: str) -> bool:
    if DRY_RUN:
        return True
    r = requests.post(f"{STRAPI}/blog-posts/{doc_id}/actions/publish", headers=HP, timeout=30)
    if r.status_code in (200, 201):
        return True
    # Fallback: PUT publishedAt
    from datetime import datetime, timezone
    now = datetime.now(timezone.utc).isoformat().replace("+00:00", "Z")
    r2 = requests.put(f"{STRAPI}/blog-posts/{doc_id}", headers=HP, json={"data": {"publishedAt": now}}, timeout=30)
    return r2.status_code in (200, 201)


def main():
    files = sorted(EXTRACTS.glob("*.json"))
    print(f"Loaded {len(files)} payloads\n")

    created, updated, skipped, failed = [], [], [], []

    for fpath in files:
        payload = json.loads(fpath.read_text(encoding="utf-8"))
        data = payload["data"]
        slug = data["slug"]

        existing = fetch_existing(slug)

        if not existing:
            if UPDATE_ONLY:
                skipped.append((slug, "update-only mode, no existing entry"))
                continue
            ok, info = post_new({"data": data})
            if ok:
                doc_id = info if info != "dry-run" else None
                if doc_id and publish(doc_id):
                    created.append(slug)
                    print(f"  NEW   {slug} -> {doc_id} (published)")
                elif DRY_RUN:
                    created.append(slug)
                    print(f"  NEW   {slug} (dry-run)")
                else:
                    created.append(slug)
                    print(f"  NEW   {slug} -> {doc_id} (publish failed)")
            else:
                failed.append((slug, info))
                print(f"  FAIL  {slug}: {info}")
            time.sleep(0.4)
            continue

        # Existing entry — only enrich, never touch SEO fields
        if CREATE_ONLY:
            skipped.append((slug, "create-only mode"))
            continue

        old_body_len = len(existing.get("body") or "")
        new_body_len = len(data.get("body") or "")

        if not FORCE_UPDATE and new_body_len < old_body_len * GROW_RATIO:
            skipped.append((slug, f"existing body {old_body_len}c >= new {new_body_len}c (need >{GROW_RATIO}x)"))
            print(f"  SKIP  {slug} (existing body {old_body_len}c, new {new_body_len}c)")
            continue

        # Build enrichment payload — body, author, heroImage, tags, category, dates only
        enrich = {}
        for k in ("body", "author", "heroImage", "heroImageAlt", "tags", "category", "publishedDate"):
            v = data.get(k)
            if v not in (None, "", []):
                enrich[k] = v
        # Excerpt only if existing is empty
        if data.get("excerpt") and not existing.get("excerpt"):
            enrich["excerpt"] = data["excerpt"]

        doc_id = existing["documentId"]
        ok, info = put_update(doc_id, enrich)
        if ok:
            # If draft, publish
            if not existing.get("publishedAt"):
                publish(doc_id)
            updated.append(slug)
            print(f"  ENR   {slug} (body {old_body_len}c -> {new_body_len}c)")
        else:
            failed.append((slug, info))
            print(f"  FAIL  {slug}: {info}")
        time.sleep(0.3)

    print(f"\n=== DONE ===")
    print(f"Created: {len(created)}")
    print(f"Enriched: {len(updated)}")
    print(f"Skipped: {len(skipped)}")
    print(f"Failed: {len(failed)}")
    for s, why in failed:
        print(f"  - {s}: {why}")


if __name__ == "__main__":
    main()
