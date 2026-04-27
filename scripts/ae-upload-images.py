#!/usr/bin/env python3
"""Upload images to Strapi media library and get URLs back."""

import os, sys, glob, json, subprocess, time
from pathlib import Path

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

# Load .env.local
env_file = Path(".env.local")
if env_file.exists():
    for line in env_file.read_text().splitlines():
        if line.startswith("STRAPI_API_TOKEN="):
            os.environ["STRAPI_API_TOKEN"] = line.split("=", 1)[1].strip().strip('"').strip("'")
            break

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}"}


def upload_image(filepath):
    filename = os.path.basename(filepath)
    ext = filename.rsplit(".", 1)[-1].lower()
    mime_map = {"jpg": "image/jpeg", "jpeg": "image/jpeg", "png": "image/png", "webp": "image/webp"}
    mime = mime_map.get(ext, "image/jpeg")

    with open(filepath, "rb") as f:
        files = {"files": (filename, f, mime)}
        r = requests.post(
            f"{STRAPI_BASE}/api/upload",
            headers=HEADERS,
            files=files,
            timeout=60,
        )

    if r.status_code in (200, 201):
        data = r.json()
        if isinstance(data, list) and len(data) > 0:
            url = data[0].get("url", "")
            if url.startswith("/"):
                url = f"{STRAPI_BASE}{url}"
            print(f"  OK {filename} -> {url}")
            return url

    print(f"  FAIL {filename} ({r.status_code}): {r.text[:200]}")
    return None


def fetch_existing_media():
    """Query Strapi /upload/files for images already uploaded.
    Returns map: filename -> url. Picks the most recent if duplicates."""
    out = {}
    page = 1
    while True:
        r = requests.get(
            f"{STRAPI_BASE}/api/upload/files?pagination[page]={page}&pagination[pageSize]=100&sort=createdAt:desc",
            headers=HEADERS,
            timeout=30,
        )
        if r.status_code != 200:
            break
        items = r.json()
        if not isinstance(items, list) or not items:
            break
        for item in items:
            name = item.get("name", "")
            url = item.get("url", "")
            if url and url.startswith("/"):
                url = f"{STRAPI_BASE}{url}"
            if name and url and name not in out:  # newest first wins
                out[name] = url
        if len(items) < 100:
            break
        page += 1
    return out


def main():
    if not STRAPI_TOKEN:
        print("ERROR: STRAPI_API_TOKEN not set. Add it to .env.local.")
        sys.exit(1)

    image_dirs = [
        "public/images/ae/",
        "public/images/industries/",
        "public/images/insights/",
    ]
    individual_files = [
        "public/images/hero-arc-flash.jpg",
        "public/images/arc-flash-report.jpg",
        "public/images/safety-assessment.jpg",
    ]

    all_files = list(individual_files)
    for d in image_dirs:
        if os.path.isdir(d):
            for ext in ("*.jpg", "*.jpeg", "*.png", "*.webp"):
                all_files.extend(glob.glob(os.path.join(d, ext)))

    all_files = sorted(set(f for f in all_files if os.path.exists(f)))

    print("Fetching existing Strapi media library...")
    existing = fetch_existing_media()
    print(f"Found {len(existing)} files already in Strapi.\n")

    url_map = {}
    upload_needed = []
    for filepath in all_files:
        filename = os.path.basename(filepath)
        if filename in existing:
            url_map[filename] = existing[filename]
            print(f"  SKIP {filename} (already uploaded -> {existing[filename]})")
        else:
            upload_needed.append(filepath)

    if upload_needed:
        print(f"\nUploading {len(upload_needed)} new images...\n")
        for filepath in upload_needed:
            url = upload_image(filepath)
            if url:
                url_map[os.path.basename(filepath)] = url
            time.sleep(0.5)

    os.makedirs("data", exist_ok=True)
    with open("data/ae-image-urls.json", "w") as f:
        json.dump(url_map, f, indent=2)

    print(f"\n{len(url_map)}/{len(all_files)} uploaded.")
    print("URL map -> data/ae-image-urls.json")


if __name__ == "__main__":
    main()
