"""Clone redesigned BR pages to CO/CL/AR/PE with country-specific token swaps."""
import os
import re
import shutil

ROOT = os.path.abspath(os.path.join(os.path.dirname(__file__), ".."))
BR_DIR = os.path.join(ROOT, "src", "app", "br")

COUNTRIES = {
    "co": {
        "name": "Colombia",
        "upper": "CO",
        "hreflang": "en-CO",
        "locale": "en_CO",
        "primary_std": "RETIE",
        "secondary_std": "NTC 2050",
    },
    "cl": {
        "name": "Chile",
        "upper": "CL",
        "hreflang": "en-CL",
        "locale": "en_CL",
        "primary_std": "NCh Elec. 4/2003",
        "secondary_std": "NSEG 5 En. 71",
    },
    "ar": {
        "name": "Argentina",
        "upper": "AR",
        "hreflang": "en-AR",
        "locale": "en_AR",
        "primary_std": "AEA 90364",
        "secondary_std": "IRAM 2281",
    },
    "pe": {
        "name": "Peru",
        "upper": "PE",
        "hreflang": "en-PE",
        "locale": "en_PE",
        "primary_std": "RM 111-2013-MEM",
        "secondary_std": "CNE",
    },
}

# BR tokens in order of application (more-specific first so we don't
# corrupt partial matches).
def transform(text: str, cc: str) -> str:
    c = COUNTRIES[cc]
    name = c["name"]
    upper = c["upper"]
    hreflang = c["hreflang"]
    locale = c["locale"]
    primary = c["primary_std"]
    secondary = c["secondary_std"]

    subs = [
        # Standards first (most specific)
        (r"\bABNT NBR 5410\b", secondary),
        (r"\bNR-10\b", primary),
        # Locale strings
        (r"\ben-BR\b", hreflang),
        (r"\ben_BR\b", locale),
        # Config / identifier strings
        (r'COUNTRY_CONFIGS\["br"\]', f'COUNTRY_CONFIGS["{cc}"]'),
        (r'CC = "br"', f'CC = "{cc}"'),
        (r'COUNTRY_NAME = "Brazil"', f'COUNTRY_NAME = "{name}"'),
        (r'HREFLANG = "en-BR"', f'HREFLANG = "{hreflang}"'),
        (r'countryName: "Brazil"', f'countryName: "{name}"'),
        (r'countryIso2: "BR"', f'countryIso2: "{upper}"'),
        (r'getCountryFromHeaders\(headersList, "BR"\)',
         f'getCountryFromHeaders(headersList, "{upper}")'),
        (r'const countryName = "Brazil";',
         f'const countryName = "{name}";'),
        # Strapi fetchers — any `("br")` call
        (r'getHomePage\("br"\)', f'getHomePage("{cc}")'),
        (r'getAboutPage\("br"\)', f'getAboutPage("{cc}")'),
        (r'getContactPage\("br"\)', f'getContactPage("{cc}")'),
        (r'getBlogPosts\("br"\)', f'getBlogPosts("{cc}")'),
        (r'getServicesByRegion\("br"\)', f'getServicesByRegion("{cc}")'),
        # JSON-LD helper `cc: "br",`
        (r'cc: "br",', f'cc: "{cc}",'),
        # URL paths
        (r"/br/", f"/{cc}/"),
        (r"carelabz\.com/br/", f"carelabz.com/{cc}/"),
        # Function names
        (r"\bBRHomePage\b", f"{upper}HomePage"),
        (r"\bBRServicesIndexPage\b", f"{upper}ServicesIndexPage"),
        (r"\bBRBlogIndexPage\b", f"{upper}BlogIndexPage"),
        (r"\bBRAboutPage\b", f"{upper}AboutPage"),
        (r"\bBRContactPage\b", f"{upper}ContactPage"),
        # Human-visible "Brazil" word
        (r"\bBrazil\b", name),
        # toLocaleDateString locale
        (r'"en-BR"', f'"{hreflang}"'),
        # Alt / title text "Carelabs Brazil Office" already caught by \bBrazil\b
        # Remaining literal slugs with -br suffix
        (r'slug\.endsWith\("-br"\)', f'slug.endsWith("-{cc}")'),
        (r"\$\{params\.slug\}-br", f"${{params.slug}}-{cc}"),
        # Bare "br" const refs inside strings — last resort
        (r'Carelabs Brazil Office', f'Carelabs {name} Office'),
    ]

    out = text
    for pat, rep in subs:
        out = re.sub(pat, rep, out)
    return out


FILES = [
    "page.tsx",
    "services/page.tsx",
    "blogs/page.tsx",
    "about-us/page.tsx",
    "contact-us/page.tsx",
    "[slug]/page.tsx",
]


def clone():
    for cc in COUNTRIES:
        dest_base = os.path.join(ROOT, "src", "app", cc)
        for rel in FILES:
            src = os.path.join(BR_DIR, rel)
            dst = os.path.join(dest_base, rel)
            os.makedirs(os.path.dirname(dst), exist_ok=True)
            with open(src, "r", encoding="utf-8") as f:
                content = f.read()
            out = transform(content, cc)
            with open(dst, "w", encoding="utf-8", newline="\n") as f:
                f.write(out)
            print(f"[{cc}] wrote {rel}")


if __name__ == "__main__":
    clone()
    print("\nDone.")
