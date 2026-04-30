#!/usr/bin/env python3
"""Per-country hero image uploader. Mirrors ae-blog-upload-hero-images.py logic
but generic across countries + content kinds.

Usage:
  python3 scripts/country-upload-hero-images.py {cc} {blog|service}
"""

import os, sys, json, time, subprocess
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


def fetch_existing_media(prefix: str) -> dict:
    """Fetch media filenames containing the prefix (e.g. 'uk-blog'). Strapi
    /api/upload/files ignores pagination caps, so use a name filter instead."""
    out = {}
    last_err = None
    for attempt in range(4):
        try:
            r = requests.get(
                f"{STRAPI}/api/upload/files",
                params={"filters[name][$contains]": prefix},
                headers=H, timeout=60,
            )
            if r.status_code == 200:
                items = r.json()
                if isinstance(items, list):
                    for it in items:
                        name = it.get("name", "")
                        url = it.get("url", "")
                        if url.startswith("/"):
                            url = f"{STRAPI}{url}"
                        if name and url:
                            out[name] = url
                return out
            last_err = f"status {r.status_code}"
            break
        except Exception as e:
            last_err = str(e)
            time.sleep(2 + attempt * 2)
    print(f"  WARN media fetch failed after retries: {last_err}")
    return out


def slugify(cc: str, kind: str, slug: str, original_url: str) -> str:
    parsed = urlparse(original_url)
    base = unquote(os.path.basename(parsed.path))
    ext = ".jpg"
    if base and "." in base:
        e = "." + base.rsplit(".", 1)[-1].lower()
        if e in (".jpg", ".jpeg", ".png", ".webp"):
            ext = e
    return f"{cc}-{kind}-{slug}{ext}"


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
    except Exception:
        return False


def upload(filepath: Path) -> str | None:
    if DRY_RUN:
        return f"[dry-run] {filepath.name}"
    ext = filepath.suffix.lower()
    mime = "image/jpeg" if ext in (".jpg", ".jpeg") else "image/png" if ext == ".png" else "image/webp"
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
    return None


def main():
    if len(sys.argv) < 3:
        print("Usage: country-upload-hero-images.py {cc} {blog|service}")
        sys.exit(1)
    cc = sys.argv[1]
    kind = sys.argv[2]
    extracts = Path(f"data/{cc}/wp-{kind}-extracts")
    if not extracts.exists():
        print(f"No extracts dir at {extracts}")
        sys.exit(1)

    cache = Path(f"data/{cc}/wp-{kind}-hero-cache")
    cache.mkdir(parents=True, exist_ok=True)

    prefix = f"{cc}-{kind}-"
    print(f"Fetching existing Strapi media (prefix '{prefix}')...")
    existing = fetch_existing_media(prefix)
    print(f"  {len(existing)} matching files in Strapi\n")

    files = sorted(extracts.glob("*.json"))
    uploaded, skipped, failed = 0, 0, 0
    image_field = "heroImagePath" if kind == "service" else "heroImage"

    for fpath in files:
        payload = json.loads(fpath.read_text(encoding="utf-8"))
        slug = payload["data"]["slug"].replace(f"-{cc}", "")
        hero = (payload["data"].get(image_field) or "").strip()
        if not hero or "strapiapp.com" in hero or not hero.startswith("http"):
            skipped += 1
            continue

        target = slugify(cc, kind, slug, hero)
        if target in existing:
            payload["data"][image_field] = existing[target]
            fpath.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
            print(f"  REUSE {slug}")
            uploaded += 1
            continue

        local = cache / target
        if not download(hero, local):
            print(f"  FAIL_DL {slug} ({hero})")
            failed += 1
            continue

        url = upload(local)
        if not url:
            print(f"  FAIL_UP {slug}")
            failed += 1
            continue

        payload["data"][image_field] = url
        fpath.write_text(json.dumps(payload, indent=2, ensure_ascii=False), encoding="utf-8")
        print(f"  OK    {slug} -> {url}")
        uploaded += 1
        time.sleep(0.4)

    print(f"\nUploaded/reused: {uploaded}, skipped: {skipped}, failed: {failed}")


if __name__ == "__main__":
    main()
