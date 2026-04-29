#!/usr/bin/env python3
"""For each blog payload in data/wp-blog-extracts/, download the heroImage URL,
upload to Strapi media library, and replace the heroImage field with the new
Strapi-hosted URL. Idempotent: re-runs skip files that already point at
strapiapp.com.
"""

import os, json, sys, time, subprocess
from pathlib import Path
from urllib.parse import urlparse, unquote

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

STRAPI = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
H = {"Authorization": f"Bearer {os.environ['STRAPI_API_TOKEN']}"}
DRY_RUN = "--dry-run" in sys.argv

EXTRACTS = Path("data/wp-blog-extracts")
DOWNLOAD_DIR = Path("data/wp-blog-hero-cache")
DOWNLOAD_DIR.mkdir(parents=True, exist_ok=True)


def fetch_existing_media() -> dict[str, str]:
    """Map filename -> Strapi URL for already-uploaded files."""
    out = {}
    page = 1
    while True:
        r = requests.get(
            f"{STRAPI}/api/upload/files?pagination[page]={page}&pagination[pageSize]=100&sort=createdAt:desc",
            headers=H, timeout=30,
        )
        if r.status_code != 200:
            break
        items = r.json()
        if not isinstance(items, list) or not items:
            break
        for it in items:
            name = it.get("name", "")
            url = it.get("url", "")
            if url.startswith("/"):
                url = f"{STRAPI}{url}"
            if name and url and name not in out:
                out[name] = url
        if len(items) < 100:
            break
        page += 1
    return out


def slugify_filename(slug: str, original_url: str) -> str:
    parsed = urlparse(original_url)
    base = unquote(os.path.basename(parsed.path))
    ext = ".jpg"
    if base and "." in base:
        ext = "." + base.rsplit(".", 1)[-1].lower()
        if ext not in (".jpg", ".jpeg", ".png", ".webp"):
            ext = ".jpg"
    return f"blog-{slug}{ext}"


def download(url: str, dest: Path) -> bool:
    if dest.exists() and dest.stat().st_size > 0:
        return True
    try:
        r = requests.get(url, headers={"User-Agent": "Mozilla/5.0"}, timeout=30, stream=True)
        if r.status_code != 200:
            return False
        with open(dest, "wb") as f:
            for chunk in r.iter_content(8192):
                f.write(chunk)
        return dest.stat().st_size > 0
    except Exception as e:
        print(f"    download error: {e}")
        return False


def upload_to_strapi(filepath: Path) -> str | None:
    if DRY_RUN:
        return f"[dry-run] {filepath.name}"
    mime = "image/jpeg" if filepath.suffix.lower() in (".jpg", ".jpeg") else \
           "image/png" if filepath.suffix.lower() == ".png" else "image/webp"
    with open(filepath, "rb") as f:
        files = {"files": (filepath.name, f, mime)}
        r = requests.post(f"{STRAPI}/api/upload", headers=H, files=files, timeout=60)
    if r.status_code in (200, 201):
        data = r.json()
        if isinstance(data, list) and data:
            url = data[0].get("url", "")
            if url.startswith("/"):
                url = f"{STRAPI}{url}"
            return url
    print(f"    upload {r.status_code}: {r.text[:200]}")
    return None


def main():
    if not EXTRACTS.exists():
        print("No extracts dir.")
        sys.exit(1)

    print("Fetching existing Strapi media list...")
    existing = fetch_existing_media()
    print(f"  {len(existing)} files already uploaded\n")

    files = sorted(EXTRACTS.glob("*.json"))
    uploaded, skipped, failed = 0, 0, 0

    for fpath in files:
        payload = json.loads(fpath.read_text(encoding="utf-8"))
        slug = payload["data"]["slug"].replace("-ae", "")
        hero = (payload["data"].get("heroImage") or "").strip()

        if not hero:
            skipped += 1
            continue
        if "strapiapp.com" in hero:
            skipped += 1
            continue
        if not hero.startswith("http"):
            skipped += 1
            continue

        target_name = slugify_filename(slug, hero)
        if target_name in existing:
            payload["data"]["heroImage"] = existing[target_name]
            fpath.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"  REUSE {slug} -> {existing[target_name]}")
            uploaded += 1
            continue

        local = DOWNLOAD_DIR / target_name
        if not download(hero, local):
            print(f"  FAIL_DL {slug} ({hero})")
            failed += 1
            continue

        url = upload_to_strapi(local)
        if not url:
            print(f"  FAIL_UP {slug}")
            failed += 1
            continue

        payload["data"]["heroImage"] = url
        fpath.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  OK    {slug} -> {url}")
        uploaded += 1
        time.sleep(0.4)

    print(f"\nUploaded/reused: {uploaded}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
