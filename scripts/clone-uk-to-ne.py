"""Clone the UK NE-design pages to IE/SE/NO/DK/FI.

The UK pages are the template. For each target country we:
  1. Read each UK source file
  2. Replace CC/COUNTRY_NAME/HREFLANG constants
  3. Write to the target directory

The NE pages are config-driven (via COUNTRY_CONFIGS[CC]) so most
string interpolation handles itself. Only [slug]/page.tsx uses
hardcoded COUNTRY_NAME + HREFLANG module constants that we swap.
"""

import shutil
from pathlib import Path

ROOT = Path(__file__).parent.parent / "src" / "app"

TARGETS = [
    {
        "cc": "ie",
        "country_name": "Ireland",
        "hreflang": "en-IE",
    },
    {
        "cc": "se",
        "country_name": "Sweden",
        "hreflang": "en-SE",
    },
    {
        "cc": "no",
        "country_name": "Norway",
        "hreflang": "en-NO",
    },
    {
        "cc": "dk",
        "country_name": "Denmark",
        "hreflang": "en-DK",
    },
    {
        "cc": "fi",
        "country_name": "Finland",
        "hreflang": "en-FI",
    },
]

# Subpaths relative to src/app/uk/ to clone
SUBPATHS = [
    "page.tsx",
    "about-us/page.tsx",
    "contact-us/page.tsx",
    "our-services/page.tsx",
    "blogs/page.tsx",
    "case-studies/page.tsx",
    "[slug]/page.tsx",
]

SOURCE_CC = "uk"
SOURCE_COUNTRY = "United Kingdom"
SOURCE_HREFLANG = "en-GB"


def replicate(target):
    src_root = ROOT / SOURCE_CC
    dst_root = ROOT / target["cc"]
    for sub in SUBPATHS:
        src = src_root / sub
        dst = dst_root / sub
        if not src.exists():
            print(f"  [SKIP] missing source: {src}")
            continue

        dst.parent.mkdir(parents=True, exist_ok=True)

        text = src.read_text(encoding="utf-8")

        # Primary module constants
        text = text.replace(
            f'const CC = "{SOURCE_CC}"',
            f'const CC = "{target["cc"]}"',
        )
        text = text.replace(
            f'const COUNTRY_NAME = "{SOURCE_COUNTRY}"',
            f'const COUNTRY_NAME = "{target["country_name"]}"',
        )
        text = text.replace(
            f'const HREFLANG = "{SOURCE_HREFLANG}"',
            f'const HREFLANG = "{target["hreflang"]}"',
        )

        dst.write_text(text, encoding="utf-8")
        print(f"  [OK] {dst.relative_to(ROOT.parent.parent)}")


def main():
    for target in TARGETS:
        print(f"\n=== Cloning UK -> {target['cc'].upper()} ({target['country_name']}) ===")
        replicate(target)
    print("\nDone.")


if __name__ == "__main__":
    main()
