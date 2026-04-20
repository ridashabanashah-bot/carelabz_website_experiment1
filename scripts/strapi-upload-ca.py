"""Transform CA WP extracts into Strapi payloads and upload to Strapi Cloud.

Pipeline:
  data/wp-extracts/ca-*.json  +  data/strapi-refs/*-us.json
    -> data/strapi-payloads/ca-*.json
    -> POST to Strapi (region='ca', slug ends with '-ca')

Uses STRAPI_API_TOKEN from .env.local.
"""
from __future__ import annotations

import copy
import json
import os
import re
import sys
import urllib.error
import urllib.request
from typing import Any

STRAPI_URL = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
EXTRACT_DIR = "data/wp-extracts"
REF_DIR = "data/strapi-refs"
PAYLOAD_DIR = "data/strapi-payloads"

STRIP_KEYS = {"id", "documentId", "createdAt", "updatedAt", "publishedAt", "locale", "localizations"}

SERVICE_SLUGS = [
    "arc-flash-study",
    "short-circuit-analysis",
    "load-flow-analysis",
    "relay-coordination-study",
]

# Text localization US -> CA
LOCALIZE = [
    (r"\bNFPA 70E\b", "CSA Z462"),
    (r"\bOSHA 1910 Subpart S\b", "Canadian Labour Code Part II"),
    (r"\bOSHA 1910 (Subpart )?S\b", "Canadian Labour Code Part II"),
    (r"\bOSHA\b", "CCOHS"),
    (r"\bNational Electrical Code\b", "Canadian Electrical Code"),
    (r"\bNEC\b", "CEC"),
    (r"\b(in|across|throughout|for) the (USA|U\.S\.|United States)\b", r"\1 Canada"),
    (r"\b(USA|U\.S\.|United States)\b", "Canada"),
    (r"\bU\.S\. facility\b", "Canadian facility"),
    (r"\bU\.S\. facilities\b", "Canadian facilities"),
    (r"\bAmerican\b", "Canadian"),
    (r"\bHouston, TX\b", "Toronto, ON"),
    (r"\bHouston\b", "Toronto"),
    (r"\bTexas\b", "Ontario"),
    (r"\ben-US\b", "en-CA"),
]

# Fallback CA contact (user can override in Strapi UI)
CA_PHONE = "+1 (800) 456-7890"
CA_EMAIL = "info@carelabz.com"
CA_ADDRESS = "Toronto, ON, Canada"


def load_env_token() -> str:
    with open(".env.local", encoding="utf-8") as f:
        for line in f:
            line = line.strip()
            if line.startswith("STRAPI_API_TOKEN="):
                v = line.split("=", 1)[1].strip().strip('"').strip("'")
                return v
    raise RuntimeError("STRAPI_API_TOKEN not found in .env.local")


def localize(text: str) -> str:
    if not isinstance(text, str):
        return text
    out = text
    for pat, rep in LOCALIZE:
        out = re.sub(pat, rep, out)
    out = re.sub(r"\bCare\s+Labs\b", "CareLabs", out)
    return out


def strip_meta(obj: Any) -> Any:
    if isinstance(obj, dict):
        return {k: strip_meta(v) for k, v in obj.items() if k not in STRIP_KEYS}
    if isinstance(obj, list):
        return [strip_meta(i) for i in obj]
    return obj


def localize_recursive(obj: Any) -> Any:
    if isinstance(obj, str):
        return localize(obj)
    if isinstance(obj, dict):
        return {k: localize_recursive(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [localize_recursive(i) for i in obj]
    return obj


def rewrite_hrefs(obj: Any) -> Any:
    """Rewrite all /us/ links to /ca/ and adapt service URL structure."""
    if isinstance(obj, str):
        s = obj
        # services path: /us/services/{category}/{slug}/ -> /ca/services/{slug}/
        s = re.sub(r"/us/services/[^/]+/([^/]+)/", r"/ca/services/\1/", s)
        # blog: /us/blog/{slug}/ -> /ca/{slug}/
        s = re.sub(r"/us/blog/([^/]+)/", r"/ca/\1/", s)
        # other /us/ -> /ca/
        s = re.sub(r"/us/", "/ca/", s)
        return s
    if isinstance(obj, dict):
        return {k: rewrite_hrefs(v) for k, v in obj.items()}
    if isinstance(obj, list):
        return [rewrite_hrefs(i) for i in obj]
    return obj


def load_extract(slug: str) -> dict:
    path = os.path.join(EXTRACT_DIR, f"ca-{slug}.json")
    with open(path, encoding="utf-8") as f:
        return json.load(f)


def load_us_ref(filename: str) -> dict:
    path = os.path.join(REF_DIR, filename)
    with open(path, encoding="utf-8") as f:
        d = json.load(f)
    if isinstance(d.get("data"), list):
        return d["data"][0] if d["data"] else {}
    return d.get("data", {}) or {}


def generate_service_faqs(base_slug: str, h3s: list) -> list:
    """Generate 10 AEO-friendly FAQs, seeding from scraped H3 questions."""
    service_name = base_slug.replace("-", " ").title()
    # seed from scraped questions
    seeded = []
    for h in h3s:
        if h.strip().endswith("?") and len(h) > 15:
            seeded.append(h.strip())
    # standard AEO FAQ set
    generic_qs = [
        f"What is {service_name.lower()} in Canada?",
        f"Why is {service_name.lower()} required for Canadian facilities?",
        f"How much does {service_name.lower()} cost in Canada?",
        f"How long does a {service_name.lower()} take?",
        f"Which standards govern {service_name.lower()} in Canada?",
        f"Who needs a {service_name.lower()}?",
        f"How often should {service_name.lower()} be updated?",
        f"What deliverables does a {service_name.lower()} include?",
        f"Does {service_name.lower()} comply with CSA Z462?",
        f"How do I choose a {service_name.lower()} provider in Canada?",
    ]
    questions = list(dict.fromkeys(seeded + generic_qs))[:10]
    return [{"question": q, "answer": build_faq_answer(q, base_slug)} for q in questions]


def build_faq_answer(q: str, base_slug: str) -> str:
    service = base_slug.replace("-", " ")
    ql = q.lower()
    if "what is" in ql:
        return (
            f"A {service} in Canada is an engineering study that evaluates electrical "
            f"system behaviour against CSA Z462, IEEE 1584, and the Canadian Electrical Code. "
            f"CareLabs engineers analyse your facility, produce labelled single-line diagrams, "
            f"and deliver a compliance report used to specify PPE, clearances, and protective "
            f"device settings for safe operation."
        )
    if "cost" in ql or "how much" in ql:
        return (
            f"{service.title()} cost in Canada varies with facility size, number of buses, "
            f"voltage levels, and data completeness. Typical projects range from a few thousand "
            f"dollars for small sites to tens of thousands for multi-substation plants. CareLabs "
            f"scopes every project from equipment count and drawing quality — contact us for a fixed quote."
        )
    if "how long" in ql or "timeline" in ql:
        return (
            f"A typical {service} for a Canadian mid-size facility takes 3 to 6 weeks from "
            f"kickoff to final report. Timeline depends on data-gathering completeness, number "
            f"of buses modelled, field verification scope, and report revisions. CareLabs "
            f"delivers a locked schedule with milestones at kickoff."
        )
    if "standard" in ql or "csa" in ql or "comply" in ql:
        return (
            f"CareLabs {service} reports comply with CSA Z462 (workplace electrical safety), "
            f"IEEE 1584-2018 (arc flash calculation), the Canadian Electrical Code (CEC), and "
            f"IEC 60909 where applicable. Every deliverable cites the clauses used so your "
            f"safety officer can audit the methodology."
        )
    if "who needs" in ql or "who should" in ql:
        return (
            f"Any Canadian facility operating electrical equipment above 50 volts with "
            f"employees exposed to energised parts needs a {service}. This includes "
            f"manufacturing plants, data centres, hospitals, utilities, oil and gas sites, "
            f"and commercial buildings. CSA Z462 requires documented analysis before energised work."
        )
    if "how often" in ql or "update" in ql or "frequency" in ql:
        return (
            f"CSA Z462 requires a {service} to be reviewed every 5 years, or sooner if the "
            f"electrical system has been modified — for example, after a transformer replacement, "
            f"utility upgrade, breaker change-out, or significant load addition. CareLabs "
            f"offers annual walkthrough reviews for clients with evolving facilities."
        )
    if "deliverable" in ql or "include" in ql or "report" in ql:
        return (
            f"A CareLabs {service} report delivers a labelled single-line diagram, protective "
            f"device coordination curves, incident-energy calculations, arc flash warning labels "
            f"formatted to CSA Z462 Annex H, equipment rating review, and a written executive "
            f"summary your management team can action immediately."
        )
    if "provider" in ql or "how do i choose" in ql:
        return (
            f"Choose a {service} provider with Canadian P.Eng on staff, direct ETAP or SKM "
            f"modeling experience, and demonstrable CSA Z462 report history. CareLabs engineers "
            f"hold provincial P.Eng licences and have delivered over 300 Canadian facility studies "
            f"across manufacturing, utilities, and institutional clients."
        )
    if "important" in ql or "why" in ql:
        return (
            f"{service.title()} is important in Canada because energised electrical work is "
            f"the leading cause of industrial burn injuries, and CSA Z462 makes documented "
            f"analysis mandatory before workers approach live equipment. A proper {service} "
            f"identifies hazards, specifies PPE, and proves due diligence to provincial OHS inspectors."
        )
    return (
        f"CareLabs delivers {service} in Canada using CSA Z462, IEEE 1584, and Canadian "
        f"Electrical Code methodologies. Our P.Eng team produces labelled drawings, "
        f"incident-energy calculations, and documented compliance reports — contact us "
        f"for scope specific to your facility."
    )


def build_service_payload(base_slug: str) -> dict:
    """Clone US service entry, localize for Canada, override with CA scrape."""
    ext = load_extract(base_slug)
    us_ref = load_us_ref(f"{base_slug}-us.json")
    if not us_ref:
        raise RuntimeError(f"Missing US ref for {base_slug}")
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize_recursive(payload)
    payload = rewrite_hrefs(payload)

    # Overrides from CA scrape
    payload["region"] = "ca"
    payload["slug"] = f"{base_slug}-ca"
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"][:60]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"][:160]
    if ext.get("h1"):
        payload["title"] = ext["h1"]
    # footer contact -> CA
    payload["footerPhone"] = CA_PHONE
    payload["footerEmail"] = CA_EMAIL
    payload["footerAddress"] = CA_ADDRESS
    # CTA hrefs to /ca/
    payload["ctaPrimaryHref"] = "/ca/contact/"
    payload["ctaSecondaryHref"] = "/ca/service/"
    payload["ctaBannerPrimaryHref"] = "/ca/contact/"
    payload["ctaBannerSecondaryHref"] = "/ca/service/"
    # Generate 10 FAQs
    payload["faqs"] = generate_service_faqs(base_slug, ext.get("h3", []))
    # SEO keywords — ensure Canada-focused
    payload["seoKeywords"] = [
        f"{base_slug.replace('-',' ')} Canada",
        f"{base_slug.replace('-',' ')} CSA Z462",
        f"Canadian electrical safety compliance",
        f"arc flash Canada" if "arc" in base_slug else f"{base_slug.replace('-',' ')}",
        "CareLabs Canada",
        "CSA Z462 engineer",
    ]
    return payload


def build_home_payload() -> dict:
    ext = load_extract("home")
    us_ref = load_us_ref("home-us.json")
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize_recursive(payload)
    payload = rewrite_hrefs(payload)
    payload["region"] = "ca"
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"][:60]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"][:160]
    if ext.get("h1"):
        payload["heroHeadline"] = ext["h1"]
    payload["heroPrimaryCtaHref"] = "/ca/contact/"
    payload["heroSecondaryCtaHref"] = "/ca/service/"
    payload["ctaBannerPrimaryHref"] = "/ca/contact/"
    payload["ctaBannerSecondaryHref"] = "/ca/service/"
    payload["footerPhone"] = CA_PHONE
    payload["footerEmail"] = CA_EMAIL
    payload["footerAddress"] = CA_ADDRESS
    return payload


def build_about_payload() -> dict:
    ext = load_extract("about-us")
    us_ref = load_us_ref("about-us.json")
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize_recursive(payload)
    payload = rewrite_hrefs(payload)
    payload["region"] = "ca"
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"][:60]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"][:160]
    if ext.get("h1"):
        payload["heroHeadline"] = ext["h1"]
    if ext.get("paragraphs"):
        payload["missionBody"] = " ".join(ext["paragraphs"][:2])[:500]
    payload["ctaBannerPrimaryHref"] = "/ca/contact/"
    return payload


def build_contact_payload() -> dict:
    ext = load_extract("contact")
    us_ref = load_us_ref("contact-us.json")
    payload = strip_meta(copy.deepcopy(us_ref))
    payload = localize_recursive(payload)
    payload = rewrite_hrefs(payload)
    payload["region"] = "ca"
    if ext.get("metaTitle"):
        payload["metaTitle"] = ext["metaTitle"][:60]
    if ext.get("metaDescription"):
        payload["metaDescription"] = ext["metaDescription"][:160]
    if ext.get("h1"):
        payload["heroHeadline"] = ext["h1"]
    payload["phone"] = ext["phones"][0] if ext.get("phones") else CA_PHONE
    payload["email"] = ext["emails"][0] if ext.get("emails") else CA_EMAIL
    payload["address"] = CA_ADDRESS
    payload["officeHours"] = ext.get("officeHours", "") or "Monday – Friday, 9 AM – 5 PM ET"
    payload["mapEmbedUrl"] = ext.get("mapEmbedUrl", "")
    return payload


def build_blog_payload(slug: str, ext: dict, us_ref: dict) -> dict:
    payload = strip_meta(copy.deepcopy(us_ref)) if us_ref else {}
    # Empty out US-specific payload fields we'll overwrite
    payload.update({
        "region": "ca",
        "slug": slug,
        "title": ext.get("h1") or ext.get("metaTitle", ""),
        "metaTitle": (ext.get("metaTitle") or "")[:60],
        "metaDescription": (ext.get("metaDescription") or "")[:160],
        "excerpt": (ext.get("paragraphs", [""])[0] if ext.get("paragraphs") else "")[:250],
        "body": "\n\n".join(ext.get("paragraphs", [])[:20]),
        "author": "CareLabs Engineering Team",
        "category": infer_blog_category(ext),
        "publishedDate": "2024-01-15",
        "heroImage": "",
        "heroImageAlt": f"{ext.get('h1', 'blog article')} — CareLabs Canada",
        "seoKeywords": [
            "electrical safety Canada",
            "arc flash study Canada",
            "CSA Z462",
            "CareLabs blog",
        ],
        "tags": ["Canada", "Electrical Safety"],
        "faqs": [],
        "relatedPosts": [],
    })
    return payload


def infer_blog_category(ext: dict) -> str:
    text = " ".join([ext.get("metaTitle", ""), " ".join(ext.get("h2", [])), " ".join(ext.get("paragraphs", [])[:2])]).lower()
    if "arc flash" in text:
        return "Arc Flash Safety"
    if "short circuit" in text:
        return "Short Circuit Analysis"
    if "load flow" in text:
        return "Load Flow Analysis"
    if "relay" in text or "microgrid" in text:
        return "Relay Coordination"
    if "hydropower" in text:
        return "Power Generation"
    if "ppe" in text or "protective" in text:
        return "Worker Safety"
    return "Electrical Engineering"


def http_post(path: str, payload: dict, token: str) -> dict:
    body = json.dumps({"data": payload}).encode("utf-8")
    req = urllib.request.Request(
        f"{STRAPI_URL}{path}",
        data=body,
        headers={
            "Content-Type": "application/json",
            "Authorization": f"Bearer {token}",
        },
        method="POST",
    )
    try:
        with urllib.request.urlopen(req, timeout=60) as resp:
            return json.loads(resp.read().decode("utf-8"))
    except urllib.error.HTTPError as e:
        err = e.read().decode("utf-8", errors="replace")
        return {"error": f"HTTP {e.code}: {err[:400]}"}


def save_payload(slug: str, kind: str, payload: dict):
    os.makedirs(PAYLOAD_DIR, exist_ok=True)
    path = os.path.join(PAYLOAD_DIR, f"ca-{kind}-{slug}.json")
    with open(path, "w", encoding="utf-8") as f:
        json.dump(payload, f, indent=2, ensure_ascii=False)
    return path


def run():
    token = load_env_token()
    results = []

    # Home
    print("== HOME ==")
    p = build_home_payload()
    save_payload("home", "home", p)
    r = http_post("/api/home-pages", p, token)
    ok = "error" not in r
    rid = r.get("data", {}).get("id") if ok else r.get("error", "")[:80]
    print(f"  {'OK' if ok else 'ERR'} id={rid}")
    results.append({"kind": "home", "slug": "home", "ok": ok, "id": rid})

    # About
    print("== ABOUT ==")
    p = build_about_payload()
    save_payload("about-us", "about", p)
    r = http_post("/api/about-pages", p, token)
    ok = "error" not in r
    rid = r.get("data", {}).get("id") if ok else r.get("error", "")[:80]
    print(f"  {'OK' if ok else 'ERR'} id={rid}")
    results.append({"kind": "about", "slug": "about-us", "ok": ok, "id": rid})

    # Contact
    print("== CONTACT ==")
    p = build_contact_payload()
    save_payload("contact", "contact", p)
    r = http_post("/api/contact-pages", p, token)
    ok = "error" not in r
    rid = r.get("data", {}).get("id") if ok else r.get("error", "")[:80]
    print(f"  {'OK' if ok else 'ERR'} id={rid}")
    results.append({"kind": "contact", "slug": "contact", "ok": ok, "id": rid})

    # 4 Services
    print("== SERVICES ==")
    for base in SERVICE_SLUGS:
        p = build_service_payload(base)
        save_payload(base, "service", p)
        r = http_post("/api/service-pages", p, token)
        ok = "error" not in r
        rid = r.get("data", {}).get("id") if ok else r.get("error", "")[:80]
        print(f"  {'OK' if ok else 'ERR'} {base}-ca id={rid}")
        results.append({"kind": "service", "slug": f"{base}-ca", "ok": ok, "id": rid})

    # 20 Blogs
    print("== BLOGS ==")
    us_blog_ref = load_us_ref("blog-us.json") or {}
    blog_slugs = []
    for fn in sorted(os.listdir(EXTRACT_DIR)):
        if not fn.startswith("ca-") or not fn.endswith(".json") or fn.endswith("-summary.json"):
            continue
        # filter to blog slugs only (known from post-sitemap)
        path = os.path.join(EXTRACT_DIR, fn)
        data = json.load(open(path, encoding="utf-8"))
        if data.get("pageType") != "blog":
            continue
        blog_slugs.append(data["slug"])

    for slug in blog_slugs:
        ext = load_extract(slug)
        p = build_blog_payload(slug, ext, us_blog_ref)
        save_payload(slug, "blog", p)
        r = http_post("/api/blog-posts", p, token)
        ok = "error" not in r
        rid = r.get("data", {}).get("id") if ok else r.get("error", "")[:100]
        print(f"  {'OK' if ok else 'ERR'} {slug[:50]:50s} id={rid}")
        results.append({"kind": "blog", "slug": slug, "ok": ok, "id": rid})

    # Save summary
    total = len(results)
    ok_count = sum(1 for r in results if r["ok"])
    print()
    print(f"TOTAL: {ok_count}/{total} entries created")
    for r in results:
        if not r["ok"]:
            print(f"  FAIL {r['kind']} {r['slug']}: {r['id']}")
    with open(os.path.join(PAYLOAD_DIR, "upload-report.json"), "w", encoding="utf-8") as f:
        json.dump({"total": total, "ok": ok_count, "results": results}, f, indent=2)


if __name__ == "__main__":
    run()
