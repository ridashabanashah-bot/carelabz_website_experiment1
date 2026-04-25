"""Bulk-restyle Northern Europe pages: Nordic palette + Fraunces/Syne fonts.

Operates only on:
  - src/app/{uk,ie,se,no,dk,fi}/**/*.tsx
  - src/components/ne-*.tsx

Does NOT touch SA / US / AE files.

Order of operations per file:
  1. Font class swaps (specific patterns first, default last)
  2. Tracking-tight removal where now redundant
  3. Hero <h1> font-size reduction (Fraunces is optically larger)
  4. Color palette swaps
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC = ROOT / "src"

NE_PAGE_DIRS = [
    SRC / "app" / cc for cc in ("uk", "ie", "se", "no", "dk", "fi")
]
NE_COMPONENTS = [
    SRC / "components" / "ne-navbar.tsx",
    SRC / "components" / "ne-footer.tsx",
    SRC / "components" / "ne-announcement-ticker.tsx",
]


def collect_files():
    files = []
    for d in NE_PAGE_DIRS:
        if d.exists():
            files.extend(d.rglob("*.tsx"))
    for c in NE_COMPONENTS:
        if c.exists():
            files.append(c)
    return sorted(set(files))


# Font swap rules — applied in order. First match wins for any given substring.
FONT_RULES = [
    # === Buttons (font-condensed font-bold + tracking-[0.15em]) ===
    (
        r"font-condensed font-bold text-sm uppercase tracking-\[0\.15em\]",
        "font-ne-nav font-semibold text-sm uppercase tracking-[0.1em]",
    ),
    (
        r"font-condensed font-bold text-xs uppercase tracking-\[0\.15em\]",
        "font-ne-nav font-semibold text-xs uppercase tracking-[0.1em]",
    ),
    # === Navbar / dropdown small uppercase nav text ===
    (
        r"font-condensed text-\[12px\] uppercase tracking-\[0\.15em\]",
        "font-ne-nav text-[12px] uppercase tracking-[0.18em]",
    ),
    (
        r"font-condensed text-\[12px\] uppercase tracking-\[0\.2em\]",
        "font-ne-nav text-[12px] uppercase tracking-[0.18em]",
    ),
    # === Eyebrows / labels — text-xs uppercase ===
    (
        r"font-condensed text-xs uppercase tracking-\[0\.3em\]",
        "font-ne-nav text-xs uppercase tracking-[0.18em]",
    ),
    (
        r"font-condensed text-xs uppercase tracking-\[0\.25em\]",
        "font-ne-nav text-xs uppercase tracking-[0.18em]",
    ),
    (
        r"font-condensed text-xs uppercase tracking-\[0\.2em\]",
        "font-ne-nav text-xs uppercase tracking-[0.18em]",
    ),
    (
        r"font-condensed text-xs uppercase tracking-\[0\.18em\]",
        "font-ne-nav text-xs uppercase tracking-[0.18em]",
    ),
    (
        r"font-condensed text-xs uppercase tracking-\[0\.15em\]",
        "font-ne-nav text-xs uppercase tracking-[0.18em]",
    ),
    # === Section labels — text-sm uppercase tracked ===
    (
        r"font-condensed text-sm uppercase tracking-\[0\.2em\]",
        "font-ne-nav text-sm uppercase tracking-[0.18em]",
    ),
    (
        r"font-condensed text-sm uppercase tracking-\[0\.15em\]",
        "font-ne-nav text-sm uppercase tracking-[0.18em]",
    ),
    # === Display headings — font-extrabold becomes font-black ===
    (
        r"font-condensed font-extrabold",
        "font-ne-display font-black",
    ),
    # === Default font-condensed → font-ne-display ===
    (
        r"font-condensed",
        "font-ne-display",
    ),
    # === Accent italic family swap ===
    (
        r"font-accent",
        "font-ne-accent",
    ),
    # === Body family swap ===
    (
        r"font-body",
        "font-ne-body",
    ),
]


def apply_font_swaps(text: str) -> str:
    for pattern, replacement in FONT_RULES:
        text = re.sub(pattern, replacement, text)
    return text


def remove_tracking_tight(text: str) -> str:
    """Remove `tracking-tight` from any class string that already uses
    font-ne-display. Fraunces doesn't need it (not condensed)."""
    # Match any class attribute that contains font-ne-display followed by tracking-tight
    # in the same className. Simplest approach: where a class string contains
    # font-ne-display, drop ` tracking-tight` anywhere in that string.
    def _scrub(match: re.Match) -> str:
        cls = match.group(1)
        if "font-ne-display" not in cls:
            return match.group(0)
        # remove tracking-tight token
        cls = re.sub(r"\s+tracking-tight\b", "", cls)
        cls = re.sub(r"\btracking-tight\s+", "", cls)
        cls = re.sub(r"\btracking-tight\b", "", cls)
        cls = re.sub(r"\s{2,}", " ", cls).strip()
        return f'className="{cls}"'

    return re.sub(r'className="([^"]*)"', _scrub, text)


def reduce_hero_h1_sizes(text: str) -> str:
    """On <h1 ...> elements only, reduce text-7xl → text-6xl and text-8xl → text-7xl.
    Fraunces renders optically larger than Barlow Condensed at the same nominal size.
    """
    h1_pattern = re.compile(r"<h1\b([^>]*?)>", re.MULTILINE | re.DOTALL)

    def _shrink(match: re.Match) -> str:
        inner = match.group(1)
        # Only reduce if this h1 actually uses font-ne-display
        if "font-ne-display" not in inner:
            return match.group(0)
        # Reduce sizes — order matters (8xl first to avoid double-replacement)
        inner = inner.replace("text-8xl", "text-7xl")
        inner = inner.replace("md:text-8xl", "md:text-7xl")
        inner = inner.replace("lg:text-8xl", "lg:text-7xl")
        inner = inner.replace("xl:text-8xl", "xl:text-7xl")

        inner = inner.replace("md:text-7xl", "md:text-6xl")
        inner = inner.replace("lg:text-7xl", "lg:text-6xl")
        inner = inner.replace("xl:text-7xl", "xl:text-6xl")
        # bare text-7xl (uncommon on hero, but safe)
        inner = re.sub(r"\btext-7xl\b", "text-6xl", inner)
        return f"<h1{inner}>"

    return h1_pattern.sub(_shrink, text)


# Color rules — applied in order
COLOR_RULES = [
    ("#0B1A2F", "#1A3650"),
    ("#F8FAFC", "#F0EBE1"),
    ("#1E293B", "#243E54"),
    # divider color in dark sections
    ("divide-white/10", "divide-[#4A7C9B]/20"),
]


def apply_color_swaps(text: str) -> str:
    for find, replace in COLOR_RULES:
        text = text.replace(find, replace)
    # bg-white → bg-[#F9F7F3] — keep careful: only standalone class
    text = re.sub(r"\bbg-white\b", "bg-[#F9F7F3]", text)
    return text


# Component-specific tweaks
def apply_navbar_tweaks(text: str) -> str:
    # Dropdown container border-white/10 → border-[#4A7C9B]/20
    # And dropdown link hover:bg-white/5 → hover:bg-[#4A7C9B]/10
    text = text.replace(
        "border border-white/10 shadow-2xl",
        "border border-[#4A7C9B]/20 shadow-2xl",
    )
    text = text.replace("hover:bg-white/5", "hover:bg-[#4A7C9B]/10")
    return text


def apply_homepage_circle_tweak(text: str) -> str:
    """Update middle concentric-circle border in hero geometric element."""
    return text.replace(
        "border border-white/10 rounded-full",
        "border border-[#4A7C9B]/30 rounded-full",
    )


def process_file(path: Path) -> bool:
    original = path.read_text(encoding="utf-8")
    text = original

    # Part 2 — font swaps
    text = apply_font_swaps(text)
    text = remove_tracking_tight(text)
    text = reduce_hero_h1_sizes(text)

    # Part 3 — color swaps
    text = apply_color_swaps(text)

    # Part 4 — component-specific
    if path.name == "ne-navbar.tsx":
        text = apply_navbar_tweaks(text)

    # Hero geometric circle — applies to homepage page.tsx files at the top
    # level of each country directory only (uk/page.tsx, ie/page.tsx, etc.)
    if path.name == "page.tsx" and path.parent.parent.name == "app":
        text = apply_homepage_circle_tweak(text)

    if text != original:
        path.write_text(text, encoding="utf-8")
        return True
    return False


def main() -> None:
    files = collect_files()
    changed = 0
    print(f"Processing {len(files)} files...\n")
    for p in files:
        if process_file(p):
            changed += 1
            print(f"  [UPDATED] {p.relative_to(ROOT)}")
        else:
            print(f"  [skip   ] {p.relative_to(ROOT)}")
    print(f"\nDone. {changed}/{len(files)} files updated.")


if __name__ == "__main__":
    main()
