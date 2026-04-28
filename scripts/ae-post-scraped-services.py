#!/usr/bin/env python3
"""POST shaped service-page payloads to Strapi (region=ae). Idempotent: skips slugs already present."""

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
H_GET = {"Authorization": f"Bearer {os.environ['STRAPI_API_TOKEN']}"}
H_POST = {**H_GET, "Content-Type": "application/json"}
DRY_RUN = "--dry-run" in sys.argv


def slug_exists(slug: str) -> bool:
    r = requests.get(
        f"{STRAPI}/service-pages?filters[slug][$eq]={slug}&filters[region][$eq]=ae",
        headers=H_GET, timeout=15,
    )
    return bool(r.json().get("data"))


def post_payload(payload: dict) -> tuple[bool, str]:
    if DRY_RUN:
        return True, "dry-run"
    r = requests.post(
        f"{STRAPI}/service-pages",
        headers=H_POST,
        json=payload,
        timeout=30,
    )
    if r.status_code in (200, 201):
        try:
            return True, r.json()["data"]["documentId"]
        except Exception:
            return True, ""
    return False, f"{r.status_code}: {r.text[:300]}"


def main():
    extracts_dir = Path("data/wp-extracts/services")
    if not extracts_dir.exists():
        print("No extracts dir. Run ae-shape-scraped-services.py first.")
        sys.exit(1)

    files = sorted(extracts_dir.glob("*.json"))
    created, skipped, failed = [], [], []

    for f in files:
        payload = json.loads(f.read_text(encoding="utf-8"))
        slug = payload["data"]["slug"]

        if slug_exists(slug):
            skipped.append(slug)
            print(f"  SKIP  {slug} (already exists)")
            continue

        ok, info = post_payload(payload)
        if ok:
            created.append(slug)
            print(f"  OK    {slug} -> {info}")
        else:
            failed.append((slug, info))
            print(f"  FAIL  {slug} {info}")
        time.sleep(0.4)

    print()
    print(f"Created: {len(created)}")
    print(f"Skipped (already there): {len(skipped)}")
    print(f"Failed: {len(failed)}")
    if failed:
        for s, info in failed:
            print(f"  - {s}: {info}")


if __name__ == "__main__":
    main()
