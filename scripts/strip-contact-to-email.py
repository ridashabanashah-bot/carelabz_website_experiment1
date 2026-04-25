"""Strip Phone / Address / Office-hours blocks from every contact page,
keeping only the Email block. Reduces email font where it was bumped up.

Three template variants:
  - Generic (us/ca/eu/asia/etc.): {page?.phone && (...)} icon + label + link
  - SA (ar/br/cl/co/pe): <ContactItem icon={Phone} ... />
  - NE (uk/ie/se/no/dk/fi): <li>...<Phone /> Phone... </li> in a <ul>

Also removes the "no Strapi data" fallback block in generic template
because it shows phone + email + hours hardcoded.
"""

import re
from pathlib import Path

ROOT = Path(__file__).parent.parent
SRC = ROOT / "src" / "app"

# ── discover ────────────────────────────────────────────────────────────────

def collect_contact_pages():
    pages = []
    for sub in ("contact-us", "contact"):
        for f in SRC.glob(f"*/{sub}/page.tsx"):
            pages.append(f)
    return sorted(pages)


def classify(text: str) -> str:
    if "ContactItem" in text:
        return "sa"
    if "NEFooter" in text or "NENavbar" in text:
        return "ne"
    return "generic"


# ── generic-template removers ──────────────────────────────────────────────

# Match a single conditional contact block: {page?.<key> && ( ...wrapper div... )}
# Use paren-depth counting from the opening `(` to the matching `)`.
def remove_generic_block(text: str, key: str) -> str:
    start_re = re.compile(r"\{page\?\." + re.escape(key) + r" && \(")
    while True:
        m = start_re.search(text)
        if not m:
            break
        start = m.start()
        depth = 0
        i = m.end() - 1  # the `(`
        n = len(text)
        end = -1
        while i < n:
            c = text[i]
            if c == "(":
                depth += 1
            elif c == ")":
                depth -= 1
                if depth == 0:
                    j = i + 1
                    while j < n and text[j].isspace():
                        j += 1
                    if j < n and text[j] == "}":
                        end = j + 1
                        break
            i += 1
        if end < 0:
            break
        # Eat preceding inline whitespace + one preceding newline
        pre = start
        while pre > 0 and text[pre - 1] in " \t":
            pre -= 1
        if pre > 0 and text[pre - 1] == "\n":
            pre -= 1
        text = text[:pre] + text[end:]
    return text


# Long fallback block: {!page?.phone && !page?.email && !page?.address && !page?.officeHours && (...)}
def remove_generic_fallback(text: str) -> str:
    # Outer wrapper has space-y-6 div + 3 inner blocks — total many </div>s.
    # Easier: find the start, count braces forward to matching `)}`.
    start_re = re.compile(
        r"\{!page\?\.phone && !page\?\.email && !page\?\.address && !page\?\.officeHours && \("
    )
    m = start_re.search(text)
    if not m:
        return text
    start = m.start()
    # Walk forward tracking nesting depth from the opening `(`. End when we hit
    # the matching `)` followed by `}`.
    depth = 0
    i = m.end() - 1  # position of '('
    n = len(text)
    while i < n:
        c = text[i]
        if c == "(":
            depth += 1
        elif c == ")":
            depth -= 1
            if depth == 0:
                # expect a `}` after, possibly with whitespace
                j = i + 1
                while j < n and text[j].isspace():
                    j += 1
                if j < n and text[j] == "}":
                    end = j + 1
                    # Also chew preceding whitespace from `start`
                    pre = start
                    while pre > 0 and text[pre - 1] in " \t":
                        pre -= 1
                    # Drop the empty line that contained it
                    if pre > 0 and text[pre - 1] == "\n":
                        pre -= 1
                    return text[:pre] + text[end:]
        i += 1
    return text


def fix_generic(text: str) -> str:
    text = remove_generic_block(text, "phone")
    text = remove_generic_block(text, "address")
    text = remove_generic_block(text, "officeHours")
    text = remove_generic_fallback(text)
    return text


# ── SA-template remover ────────────────────────────────────────────────────

def remove_sa_contact_item(text: str, icon_name: str) -> str:
    """Remove <ContactItem icon={Phone}.../> blocks (multiline self-close)."""
    pattern = re.compile(
        r"\s*<ContactItem\s+icon=\{" + re.escape(icon_name) + r"\}[\s\S]*?/>",
        re.MULTILINE,
    )
    return pattern.sub("", text)


def remove_sa_unused_consts(text: str) -> str:
    """resolvedPhone / resolvedAddress / resolvedHours are unused after the
    Phone / Address / Office-hours ContactItem blocks are removed."""
    for var in ("resolvedPhone", "resolvedAddress", "resolvedHours"):
        text = re.sub(
            r"\s*const " + var + r"\s*=[^;]+;",
            "",
            text,
        )
    return text


def fix_sa(text: str) -> str:
    text = remove_sa_contact_item(text, "Phone")
    text = remove_sa_contact_item(text, "MapPin")
    text = remove_sa_contact_item(text, "Clock")
    text = remove_sa_unused_consts(text)
    return text


# ── NE-template remover ────────────────────────────────────────────────────

# NE contact pages have a stack of <div> siblings (Phone, Email, Address,
# OfficeHours) inside a `<div className="space-y-10">` container. Each item:
#   <div>
#     <span ...><Icon /> Phone</span>
#     <a ...>{resolvedPhone}</a>  (or <p>...)
#   </div>
def remove_ne_div_block(text: str, label_word: str) -> str:
    """Remove a <div>...<Icon/> Label ...</div> sibling. label_word ∈
    {"Phone","Address","Office Hours"}. Plain or wrapped in `{page?.X && (...)}`.
    """
    # Wrapped variant first (for Office Hours which is conditional)
    wrapped_keys = {"Office Hours": "officeHours"}
    if label_word in wrapped_keys:
        key = wrapped_keys[label_word]
        wrapped = re.compile(
            r"\s*\{page\?\." + re.escape(key) + r" && \(\s*<div>[\s\S]*?</div>\s*\)\}",
            re.MULTILINE,
        )
        text = wrapped.sub("", text)
    # Plain <div> siblings — match a <div> whose first child <span> contains the label word
    plain = re.compile(
        r"\s*<div>\s*<span[^>]*>\s*<\w+\s[^/]*/>\s*"
        + re.escape(label_word)
        + r"\s*</span>[\s\S]*?</div>",
        re.MULTILINE,
    )
    return plain.sub("", text)


def shrink_ne_email_font(text: str) -> str:
    """The NE email anchor currently uses block font-ne-display font-bold text-xl.
    Reduce to font-ne-body font-medium text-base so it reads as a normal value.
    """
    return text.replace(
        'className="block font-ne-display font-bold text-xl text-[#1A3650] uppercase hover:text-[#F97316] transition-colors break-all"',
        'className="block font-ne-body font-medium text-base text-[#1A3650] hover:text-[#F97316] transition-colors break-all"',
    )


def remove_ne_unused_consts(text: str) -> str:
    """resolvedPhone / resolvedAddress are unused after the blocks are gone."""
    text = re.sub(
        r"\s*const resolvedPhone = page\?\.phone \?\? config\.phone;",
        "",
        text,
    )
    text = re.sub(
        r"\s*const resolvedAddress = page\?\.address \?\? config\.address;",
        "",
        text,
    )
    return text


def swap_ne_urgent_call_to_email(text: str) -> str:
    """The urgent-call band uses `tel:${resolvedPhone}` — swap to mailto + email."""
    text = text.replace(
        'href={`tel:${resolvedPhone.replace(/[^\\d+]/g, "")}`}',
        "href={`mailto:${resolvedEmail}`}",
    )
    # Replace the icon + label inside that anchor: Phone icon + "Call our team"
    text = text.replace(
        '<Phone className="w-4 h-4" />\n                Call our team',
        '<Mail className="w-4 h-4" />\n                Email our team',
    )
    return text


def fix_ne(text: str) -> str:
    text = remove_ne_div_block(text, "Phone")
    text = remove_ne_div_block(text, "Address")
    text = remove_ne_div_block(text, "Office Hours")
    text = shrink_ne_email_font(text)
    text = swap_ne_urgent_call_to_email(text)
    text = remove_ne_unused_consts(text)
    return text


# ── orchestrator ───────────────────────────────────────────────────────────

def process(path: Path) -> tuple[bool, str]:
    original = path.read_text(encoding="utf-8")
    template = classify(original)
    if template == "generic":
        text = fix_generic(original)
    elif template == "sa":
        text = fix_sa(original)
    elif template == "ne":
        text = fix_ne(original)
    else:
        return False, "unknown"
    if text == original:
        return False, template
    path.write_text(text, encoding="utf-8")
    return True, template


def main() -> None:
    pages = collect_contact_pages()
    print(f"Processing {len(pages)} contact pages...\n")
    by_template = {"generic": 0, "sa": 0, "ne": 0}
    changed = 0
    for p in pages:
        did, template = process(p)
        marker = "[UPDATED]" if did else "[skip   ]"
        print(f"  {marker} ({template:<7}) {p.relative_to(ROOT)}")
        if did:
            changed += 1
            by_template[template] = by_template.get(template, 0) + 1
    print(f"\nDone. {changed}/{len(pages)} files updated.")
    for k, v in by_template.items():
        print(f"  {k}: {v}")


if __name__ == "__main__":
    main()
