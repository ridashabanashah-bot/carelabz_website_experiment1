#!/usr/bin/env python3
"""Clean AE service-page TITLE fields in Strapi.

ONLY mutates the `title` field. Leaves metaTitle, metaDescription, seoKeywords,
and any other SEO-critical content untouched (per client instruction — Google
ranking surfaces use those fields).

Strips brand suffixes ('| Carelabz.com', '| Carelabs UAE', etc.) and converts
ALL-CAPS / mostly-upper titles to Title Case while preserving real acronyms
(DEWA, IEEE, NFPA, IEC, OSHA, UAE, MV, LV, RCD, etc.).
"""

import os, sys, re, json, time, subprocess
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

BRAND_SUFFIX_RES = [
    re.compile(r"\s*[|–—-]\s*Care\s*[Ll]ab[sz](?:\.com|\.me)?\s*$", re.IGNORECASE),
    re.compile(r"\s*[|–—-]\s*Carelabs\s+(?:UAE|United Arab Emirates|Dubai)\s*$", re.IGNORECASE),
]

ACRONYMS = {
    "DEWA", "NFPA", "IEEE", "OSHA", "IEC", "ETAP", "ISO", "ANSI",
    "MV", "LV", "ELV", "HV", "DC", "AC",
    "UAE", "USA", "UK", "EU",
    "RCD", "PFC", "PSC", "MCC", "PFCC",
    "GFCI", "RCBO", "MCB", "ELCB",
    "OFC", "PAT", "ATS", "FAT", "SAT",
    "VFD", "VSD", "CT", "VT", "PT",
    "HVAC", "PLC", "SCADA",
    "IR", "PV", "CO2",
}

SMALL_WORDS = {"a", "an", "and", "as", "at", "but", "by", "for", "if", "in", "of",
               "on", "or", "the", "to", "vs", "vs.", "via", "with", "from"}


def smart_cap(word: str, is_first: bool) -> str:
    if not word or not re.search(r"[A-Za-z]", word):
        return word
    if re.search(r"[a-z]", word) and re.search(r"[A-Z]", word):
        return word  # leave mixed case alone
    if "/" in word or "-" in word:
        sep = "/" if "/" in word else "-"
        parts = word.split(sep)
        return sep.join(smart_cap(p, is_first and i == 0) for i, p in enumerate(parts))
    m = re.match(r"^(.*?)([^A-Za-z0-9]*)$", word)
    stripped = m.group(1)
    trailing = m.group(2) or ""
    upper = stripped.upper()
    if upper in ACRONYMS:
        return upper + trailing
    if stripped[:1].isdigit():
        return stripped + trailing
    lower = stripped.lower()
    if not is_first and lower in SMALL_WORDS:
        return lower + trailing
    if not stripped:
        return word
    return stripped[0].upper() + stripped[1:].lower() + trailing


def is_mostly_upper(s: str) -> bool:
    letters = re.sub(r"[^A-Za-z]", "", s)
    if len(letters) < 4:
        return False
    upper = re.sub(r"[^A-Z]", "", letters)
    return len(upper) / len(letters) >= 0.8


def title_case(s: str) -> str:
    parts = re.split(r"(\s+)", s)
    out = []
    seen_first = False
    for p in parts:
        if re.fullmatch(r"\s+", p):
            out.append(p)
            continue
        is_first = not seen_first
        seen_first = True
        out.append(smart_cap(p, is_first))
    return "".join(out)


def clean_title(raw: str) -> str:
    if not raw:
        return ""
    t = raw.strip()
    prev = None
    while prev != t:
        prev = t
        for r in BRAND_SUFFIX_RES:
            t = r.sub("", t)
        t = t.strip()
    t = re.sub(r"\s{2,}", " ", t)
    if is_mostly_upper(t):
        t = title_case(t)
    return t.strip()


def fetch_all_services():
    out = []
    page = 1
    while True:
        r = requests.get(
            f"{STRAPI}/service-pages?filters[region][$eq]=ae&pagination[page]={page}&pagination[pageSize]=100&fields[0]=title&fields[1]=slug",
            headers=H, timeout=15,
        )
        data = r.json().get("data", [])
        if not data:
            break
        out.extend(data)
        if len(data) < 100:
            break
        page += 1
    return out


def main():
    if DRY_RUN:
        print("=" * 60)
        print("DRY RUN — no changes")
        print("=" * 60)
    services = fetch_all_services()
    print(f"Loaded {len(services)} AE service-pages\n")

    changes = []
    for s in services:
        doc_id = s["documentId"]
        old = (s.get("title") or "").strip()
        new = clean_title(old)
        if new and new != old:
            changes.append({"doc_id": doc_id, "slug": s.get("slug", ""), "old": old, "new": new})

    print(f"Changes proposed: {len(changes)}\n")
    for c in changes:
        print(f"  {c['slug']}")
        print(f"    OLD: {c['old']}")
        print(f"    NEW: {c['new']}")

    if DRY_RUN:
        return

    print()
    failed = 0
    for c in changes:
        r = requests.put(
            f"{STRAPI}/service-pages/{c['doc_id']}",
            headers=HP,
            json={"data": {"title": c["new"]}},
            timeout=30,
        )
        if r.status_code in (200, 201):
            print(f"  OK {c['slug']}")
        else:
            failed += 1
            print(f"  FAIL {c['slug']}: {r.status_code} {r.text[:200]}")
        time.sleep(0.25)

    print(f"\nApplied {len(changes) - failed}/{len(changes)} updates.")


if __name__ == "__main__":
    main()
