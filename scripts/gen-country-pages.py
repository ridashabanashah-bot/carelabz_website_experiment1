"""Generate Next.js country page files by forking /ca/ templates.

Each country reuses the shared RegionNavbar/RegionFooter components driven by
src/lib/countries-config.ts. This script replaces CA-specific imports and
content references with the shared, config-driven equivalents, then writes
the files into src/app/{cc}/.

Usage:
    python3 scripts/gen-country-pages.py --cc mx --country-name Mexico \\
        --hreflang en-MX --about-slug about-us --contact-slug contact-us \\
        --blog-index-slug blogs --service-layout flat \\
        --primary-standard "NOM-029-STPS-2011" \\
        --local-code "Mexican Electrical Code (NOM-001-SEDE)"

service-layout:
    flat   — /{cc}/{slug}/ catch-all dispatches service OR blog (Mexico, India, UK, AU)
    nested — /{cc}/services/{slug}/ for service; /{cc}/{slug}/ for blog (Canada, Germany)
"""
from __future__ import annotations

import argparse
import os
import re
import shutil

CA_ROOT = "src/app/ca"
COMPONENTS_ROOT = "src/components"
OUT_ROOT_BASE = "src/app"


def read(path: str) -> str:
    with open(path, encoding="utf-8") as f:
        return f.read()


def write(path: str, content: str):
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w", encoding="utf-8", newline="\n") as f:
        f.write(content)


def substitute_common(src: str, cc: str, country_name: str, hreflang: str,
                      about_slug: str, contact_slug: str, blog_index_slug: str,
                      primary_standard: str, local_code: str) -> str:
    """Swap CA-specific text to target-country equivalents."""
    out = src

    # URLs
    out = re.sub(r"/ca/about-us/", f"/{cc}/{about_slug}/", out)
    out = re.sub(r"/ca/contact/", f"/{cc}/{contact_slug}/", out)
    out = re.sub(r"/ca/blogs/", f"/{cc}/{blog_index_slug}/", out)
    out = re.sub(r"/ca/case-study/", f"/{cc}/case-study/", out)
    out = re.sub(r"/ca/service/", f"/{cc}/service/", out)
    out = re.sub(r"/ca/services/", f"/{cc}/services/", out)
    out = re.sub(r"/ca/", f"/{cc}/", out)

    # Language / hreflang
    out = re.sub(r'"en-CA"', f'"{hreflang}"', out)
    out = re.sub(r'"en_CA"', f'"{hreflang.replace("-","_")}"', out)

    # Carelabs spellings / brand tagline
    out = re.sub(r"\bCarelabs Canada\b", f"Carelabs {country_name}", out)
    out = re.sub(r"\bCanadian Electrical Code\b", local_code, out)
    out = re.sub(r"\bCSA Z462\b", primary_standard, out)
    out = re.sub(r"\bCanadian facilit(y|ies)\b", lambda m: f"{country_name} facilit" + ("y" if m.group(1) == "y" else "ies"), out)
    out = re.sub(r"\bCanadian\b", country_name + "n" if country_name.endswith("a") else country_name, out)  # rough
    out = re.sub(r"\bCanada\b", country_name, out)
    out = re.sub(r"\bCA\b(?=\s*hreflang|\s*locale|[\" ]*[,}])", country_name, out)  # conservative
    out = re.sub(r'locale: "en_CA"', f'locale: "{hreflang.replace("-","_")}"', out)

    # Imports: ca-navbar, ca-footer → shared region components + config
    out = re.sub(
        r'import\s+\{\s*CAStickyNavbar\s*\}\s+from\s+"@/components/ca-navbar";?',
        f'import {{ RegionNavbar }} from "@/components/region-navbar";\nimport {{ RegionFooter }} from "@/components/region-footer";\nimport {{ COUNTRY_CONFIGS }} from "@/lib/countries-config";\nconst config = COUNTRY_CONFIGS["{cc}"];',
        out,
    )
    out = re.sub(r'import\s+CAFooter\s+from\s+"@/components/ca-footer";?\n?', "", out)

    # Replace CAStickyNavbar & CAFooter JSX usages
    out = re.sub(r"<CAStickyNavbar\s*/>", "<RegionNavbar config={config} />", out)
    out = re.sub(r"<CAFooter\s*/>", "<RegionFooter config={config} />", out)

    # jsonld: CA-specific org schema → generic region org
    out = re.sub(
        r'\bgetOrganizationSchemaCA\b',
        "getRegionOrganizationSchema",
        out,
    )
    # import statement: just ensure it's the region helper. The named export
    # getRegionOrganizationSchema needs to replace getOrganizationSchemaCA in
    # import lists.
    out = re.sub(
        r"(import\s+\{[^}]*?)getOrganizationSchemaCA([^}]*?\}\s+from\s+\"@/lib/jsonld\";)",
        r"\1getRegionOrganizationSchema\2",
        out,
    )

    # Functions calling getRegionOrganizationSchema() need country args.
    # Replace zero-arg call with { cc, countryName, ... } call.
    org_arg = (
        f"{{ cc: \"{cc}\", countryName: \"{country_name}\", countryIso2: \"{cc.upper()}\", "
        f"phone: config.phone, email: config.email, addressLocality: config.address }}"
    )
    out = re.sub(r"getRegionOrganizationSchema\(\s*\)", f"getRegionOrganizationSchema({org_arg})", out)

    # Component / function names: CAHomePage → country-specific
    out = re.sub(r"\bCAHomePage\b", f"{cc.upper()}HomePage", out)
    out = re.sub(r"\bCAContactPage\b", f"{cc.upper()}ContactPage", out)
    out = re.sub(r"\bCAAboutPage\b", f"{cc.upper()}AboutPage", out)
    out = re.sub(r"\bCABlogIndexPage\b", f"{cc.upper()}BlogIndexPage", out)
    out = re.sub(r"\bCABlogPostPage\b", f"{cc.upper()}BlogPostPage", out)
    out = re.sub(r"\bCACaseStudiesPage\b", f"{cc.upper()}CaseStudiesPage", out)
    out = re.sub(r"\bCAServicesIndexPage\b", f"{cc.upper()}ServicesIndexPage", out)
    out = re.sub(r"\bCAServiceDetailPage\b", f"{cc.upper()}ServiceDetailPage", out)
    out = re.sub(r"\bCAServicePageProps\b", f"{cc.upper()}ServicePageProps", out)

    # Strapi region fetches: getHomePage("ca") → getHomePage("{cc}")
    out = re.sub(r'getHomePage\("ca"\)', f'getHomePage("{cc}")', out)
    out = re.sub(r'getAboutPage\("ca"\)', f'getAboutPage("{cc}")', out)
    out = re.sub(r'getContactPage\("ca"\)', f'getContactPage("{cc}")', out)
    out = re.sub(r'getServicesByRegion\("ca"\)', f'getServicesByRegion("{cc}")', out)
    out = re.sub(r'getBlogPosts\("ca"\)', f'getBlogPosts("{cc}")', out)
    out = re.sub(r'getBlogPost\("ca",', f'getBlogPost("{cc}",', out)

    # Service slug suffix: `${params.slug}-ca` → `${params.slug}-{cc}`
    out = re.sub(r"`\$\{params\.slug\}-ca`", f"`${{params.slug}}-{cc}`", out)
    # toLowerCase country code strings
    out = re.sub(r'en-CA', hreflang, out)

    # Contact page fallback iso2 "CA" → country ISO
    out = re.sub(
        r'getCountryFromHeaders\(headersList, "CA"\)',
        f'getCountryFromHeaders(headersList, "{cc.upper()}")',
        out,
    )

    # Meta/alt strings with "CareLabs" drift
    out = re.sub(r"\bCareLabs\b", "Carelabs", out)

    return out


def gen_country(cc: str, country_name: str, hreflang: str, about_slug: str,
                contact_slug: str, blog_index_slug: str, primary_standard: str,
                local_code: str, service_layout: str, include_case_study: bool):
    def tx(text: str) -> str:
        return substitute_common(text, cc, country_name, hreflang, about_slug,
                                  contact_slug, blog_index_slug, primary_standard, local_code)

    out_root = os.path.join(OUT_ROOT_BASE, cc)

    # 1. Home
    src = read(os.path.join(CA_ROOT, "page.tsx"))
    write(os.path.join(out_root, "page.tsx"), tx(src))

    # 2. About
    src = read(os.path.join(CA_ROOT, "about-us/page.tsx"))
    write(os.path.join(out_root, about_slug, "page.tsx"), tx(src))

    # 3. Contact
    src = read(os.path.join(CA_ROOT, "contact/page.tsx"))
    write(os.path.join(out_root, contact_slug, "page.tsx"), tx(src))

    # 4. Blog index
    src = read(os.path.join(CA_ROOT, "blogs/page.tsx"))
    write(os.path.join(out_root, blog_index_slug, "page.tsx"), tx(src))

    # 5. Services index
    src = read(os.path.join(CA_ROOT, "service/page.tsx"))
    write(os.path.join(out_root, "service/page.tsx"), tx(src))

    # 6. Case study (optional)
    if include_case_study:
        src = read(os.path.join(CA_ROOT, "case-study/page.tsx"))
        write(os.path.join(out_root, "case-study/page.tsx"), tx(src))

    if service_layout == "nested":
        # /{cc}/services/[slug]/page.tsx — service detail
        src = read(os.path.join(CA_ROOT, "services/[slug]/page.tsx"))
        write(os.path.join(out_root, "services/[slug]/page.tsx"), tx(src))
        # /{cc}/[slug]/page.tsx — blog catch-all (pure blog)
        src = read(os.path.join(CA_ROOT, "[slug]/page.tsx"))
        write(os.path.join(out_root, "[slug]/page.tsx"), tx(src))
    else:
        # flat: /{cc}/[slug]/page.tsx is the CA services/[slug] template adapted to
        # fall back to blog rendering when no service matches the slug. We use the
        # CA service template as the base and patch two spots: (1) if service is
        # null, look up a blog post and render that view; (2) pass `slug` to the
        # service page URL because there's no `category` folder.
        svc = read(os.path.join(CA_ROOT, "services/[slug]/page.tsx"))
        blog = read(os.path.join(CA_ROOT, "[slug]/page.tsx"))
        merged = build_flat_dispatcher(svc, blog, cc, country_name, hreflang,
                                        about_slug, contact_slug, blog_index_slug,
                                        primary_standard, local_code, tx)
        write(os.path.join(out_root, "[slug]/page.tsx"), merged)

    print(f"  [ok] generated {cc}/ ({'nested' if service_layout == 'nested' else 'flat'}): home, {about_slug}, {contact_slug}, {blog_index_slug}, service{', case-study' if include_case_study else ''}, [slug]")


def build_flat_dispatcher(service_src: str, blog_src: str, cc: str, country_name: str, hreflang: str,
                          about_slug: str, contact_slug: str, blog_index_slug: str,
                          primary_standard: str, local_code: str, tx) -> str:
    """Combined [slug] page: tries service lookup first, else blog, else 404."""
    # Build the blog render body from the CA blog template (already applies tx).
    blog_transformed = tx(blog_src)
    # Extract the blog template's main JSX body (inside the PageProps handler)
    # by locating the `export default async function CABlogPostPage` block.
    m = re.search(r"export default async function \w+\([^{]+\{(.*)\n\}\s*$", blog_transformed, re.DOTALL)
    blog_body = m.group(1) if m else ""
    # Build service body the same way
    svc_transformed = tx(service_src)
    m = re.search(r"export default async function \w+\([^{]+\{(.*)\n\}\s*$", svc_transformed, re.DOTALL)
    svc_body = m.group(1) if m else ""

    # Pull all import lines from both (dedup)
    import_lines = set()
    for src_file in (svc_transformed, blog_transformed):
        for line in src_file.splitlines():
            if line.startswith("import ") or line.startswith("export const dynamic"):
                import_lines.add(line.strip())
    # Strip any existing default export / ctor signature; we'll write our own.
    # Also remove `interface PageProps {...}` duplicates later by regex.

    imports_block = "\n".join(sorted(import_lines))

    # Strip `const strapiSlug = ...; const service = await ...` and `const post = await ...`
    # from the bodies — we'll inject data via closure.
    svc_body = re.sub(r"const strapiSlug = `\$\{params\.slug\}-[a-z]+`;\s*", "", svc_body)
    svc_body = re.sub(r"const service = await getServicePageBySlug\(strapiSlug\);\s*", "", svc_body)
    svc_body = re.sub(r"if\s*\(!service\)\s*\{\s*notFound\(\);\s*\}", "", svc_body)
    blog_body = re.sub(r"const post = await getBlogPost\(\"[a-z]+\",\s*params\.slug\);\s*", "", blog_body)
    blog_body = re.sub(r"if\s*\(!post\)\s*\{\s*notFound\(\);\s*\}", "", blog_body)

    # Wrap each body in an inner render function so we can call them from the dispatcher
    out = f"""{imports_block}

interface PageProps {{
  params: {{ slug: string }};
}}

export async function generateMetadata({{ params }}: PageProps): Promise<Metadata> {{
  const pageUrl = `https://carelabz.com/{cc}/${{params.slug}}/`;
  const service = await getServicePageBySlug(`${{params.slug}}-{cc}`);
  if (service) {{
    return {{
      title: service.metaTitle || `${{service.title}} | Carelabs {country_name}`,
      description: service.metaDescription || undefined,
      keywords: service.seoKeywords?.join(", "),
      alternates: {{ canonical: pageUrl, languages: {{ "{hreflang}": pageUrl, "x-default": pageUrl }} }},
      openGraph: {{ title: service.metaTitle || `${{service.title}} | Carelabs {country_name}`, description: service.metaDescription || undefined, url: pageUrl, type: "website" }},
      twitter: {{ card: "summary_large_image", title: service.metaTitle || `${{service.title}} | Carelabs {country_name}`, description: service.metaDescription || undefined }},
    }};
  }}
  const post = await getBlogPost("{cc}", params.slug);
  if (post) {{
    return {{
      title: post.metaTitle ?? `${{post.title}} | Carelabs {country_name}`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      keywords: post.seoKeywords ?? undefined,
      alternates: {{ canonical: pageUrl, languages: {{ "{hreflang}": pageUrl, "x-default": pageUrl }} }},
      openGraph: {{ title: post.metaTitle ?? `${{post.title}} | Carelabs {country_name}`, description: post.metaDescription ?? post.excerpt ?? undefined, url: pageUrl, siteName: "Carelabs", type: "article" }},
      twitter: {{ card: "summary_large_image", title: post.metaTitle ?? `${{post.title}} | Carelabs {country_name}`, description: post.metaDescription ?? post.excerpt ?? undefined }},
    }};
  }}
  return {{ title: "Not Found | Carelabs {country_name}" }};
}}

async function ServiceBody({{ params, service }}: {{ params: {{ slug: string }}; service: ServicePage }}) {{
{svc_body}
}}

async function BlogBody({{ params, post }}: {{ params: {{ slug: string }}; post: BlogPost }}) {{
{blog_body}
}}

export default async function Page({{ params }}: PageProps) {{
  const service = await getServicePageBySlug(`${{params.slug}}-{cc}`);
  if (service) return <ServiceBody params={{params}} service={{service}} />;
  const post = await getBlogPost("{cc}", params.slug);
  if (post) return <BlogBody params={{params}} post={{post}} />;
  notFound();
}}
"""
    return out


def write_shared_views(cc: str, country_name: str, hreflang: str, primary_standard: str, local_code: str):
    """Write _service-view.tsx and _blog-view.tsx for flat-layout countries."""
    # service view — derived from CA services/[slug]/page.tsx but receives `service` as prop
    # Keep this minimal: re-render the existing design using the shared components.
    pass  # implemented inline below when called


if __name__ == "__main__":
    ap = argparse.ArgumentParser()
    ap.add_argument("--cc", required=True)
    ap.add_argument("--country-name", required=True)
    ap.add_argument("--hreflang", required=True)
    ap.add_argument("--about-slug", default="about-us")
    ap.add_argument("--contact-slug", default="contact-us")
    ap.add_argument("--blog-index-slug", default="blogs")
    ap.add_argument("--primary-standard", required=True)
    ap.add_argument("--local-code", required=True)
    ap.add_argument("--service-layout", choices=["flat", "nested"], default="flat")
    ap.add_argument("--include-case-study", action="store_true")
    args = ap.parse_args()

    gen_country(
        args.cc, args.country_name, args.hreflang,
        args.about_slug, args.contact_slug, args.blog_index_slug,
        args.primary_standard, args.local_code,
        args.service_layout, args.include_case_study,
    )
