#!/usr/bin/env python3
"""Link uploaded images to Strapi content entries (AE region)."""

import os, sys, json, subprocess, time
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

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json",
}
REGION = "ae"

with open("data/ae-image-urls.json") as f:
    URLS = json.load(f)


def get_url(filename):
    return URLS.get(filename, "")


def put_strapi(content_type, doc_id, data):
    r = requests.put(
        f"{STRAPI_BASE}/{content_type}/{doc_id}",
        headers=HEADERS,
        json={"data": data},
        timeout=30,
    )
    if r.status_code in (200, 201):
        print(f"  OK {content_type}/{doc_id}")
    else:
        print(f"  FAIL {content_type}/{doc_id} ({r.status_code}): {r.text[:200]}")
    time.sleep(0.3)


def strip_component_ids(items):
    """Strapi v5 rejects PUTs that include component ids; drop them."""
    out = []
    for it in items or []:
        new = dict(it)
        new.pop("id", None)
        out.append(new)
    return out


def update_homepage():
    print("\n=== Homepage ===")
    r = requests.get(
        f"{STRAPI_BASE}/home-pages?filters[region][$eq]={REGION}&populate=*",
        headers=HEADERS,
    )
    pages = r.json().get("data", [])
    if not pages:
        print("  No AE homepage found")
        return

    page = pages[0]
    doc_id = page["documentId"]

    update = {}
    hero_url = get_url("hero-arc-flash.jpg")
    if hero_url:
        update["ogImage"] = hero_url

    industries = page.get("industries", [])
    industry_image_map = {
        "oil & gas": "oil-and-gas.jpg",
        "oil and gas": "oil-and-gas.jpg",
        "healthcare": "healthcare.jpg",
        "data center": "data-centers.jpg",
        "data centers": "data-centers.jpg",
        "manufacturing": "manufacturing.jpg",
        "commercial": "commercial-real-estate.jpg",
        "real estate": "commercial-real-estate.jpg",
        "government": "government.jpg",
        "education": "education.jpg",
        "utilities": "utilities.jpg",
    }

    if industries:
        updated_industries = []
        for ind in industries:
            new_ind = dict(ind)
            new_ind.pop("id", None)
            name = (ind.get("name") or ind.get("title") or "").lower()
            for key, filename in industry_image_map.items():
                if key in name:
                    url = get_url(filename)
                    if url:
                        new_ind["image"] = url
                    break
            updated_industries.append(new_ind)
        update["industries"] = updated_industries

    insights = page.get("insights", [])
    insight_images = [
        "dewa-requirements-for-arc-f.jpg",
        "reducing-incident-energy-in.jpg",
        "understanding-ieee-1584-2018.jpg",
    ]
    if insights:
        updated_insights = []
        for i, ins in enumerate(insights):
            new_ins = dict(ins)
            new_ins.pop("id", None)
            current = new_ins.get("image", "")
            if not current or not current.startswith("http"):
                url = get_url(insight_images[i % len(insight_images)])
                if url:
                    new_ins["image"] = url
            updated_insights.append(new_ins)
        update["insights"] = updated_insights

    if update:
        put_strapi("home-pages", doc_id, update)


def update_service_pages():
    print("\n=== Service Pages ===")
    r = requests.get(
        f"{STRAPI_BASE}/service-pages?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*",
        headers=HEADERS,
    )
    pages = r.json().get("data", [])

    service_image_map = {
        "arc-flash": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg", "reports": "arc-flash-report.jpg"},
        "short-circuit": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"},
        "load-flow": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"},
        "relay": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"},
        "thermograph": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"},
        "circuit-breaker": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"},
        "cable": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"},
        "calibration": {"hero": "hero-arc-flash.jpg"},
        "transformer": {"hero": "hero-arc-flash.jpg"},
        "motor": {"hero": "hero-arc-flash.jpg"},
        "ground": {"hero": "hero-arc-flash.jpg"},
        "power-quality": {"hero": "hero-arc-flash.jpg"},
        "protection": {"hero": "hero-arc-flash.jpg"},
    }

    for page in pages:
        doc_id = page["documentId"]
        slug = page.get("slug", "")
        title = page.get("title", "Carelabs service")
        update = {}

        matched = None
        for keyword in service_image_map:
            if keyword in slug:
                matched = service_image_map[keyword]
                break

        if not matched:
            matched = {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg"}

        for field, filename in matched.items():
            url = get_url(filename)
            if not url:
                continue
            if field == "hero":
                # ServicePage schema uses heroImagePath (not heroImage)
                current = (page.get("heroImagePath") or "")
                if not current.startswith("http"):
                    update["heroImagePath"] = url
                    update["heroImageAlt"] = title
            elif field == "safety":
                current = (page.get("safetyImage") or "")
                if not current.startswith("http"):
                    update["safetyImage"] = url
                    update["safetyImageAlt"] = "Electrical safety assessment"
            elif field == "reports":
                current = (page.get("reportsImage") or "")
                if not current.startswith("http"):
                    update["reportsImage"] = url
                    update["reportsImageAlt"] = "Engineering report sample"

        if update:
            put_strapi("service-pages", doc_id, update)


def update_blog_posts():
    print("\n=== Blog Posts ===")
    r = requests.get(
        f"{STRAPI_BASE}/blog-posts?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*",
        headers=HEADERS,
    )
    posts = r.json().get("data", [])

    blog_images = [
        "dewa-requirements-for-arc-f.jpg",
        "reducing-incident-energy-in.jpg",
        "understanding-ieee-1584-2018.jpg",
        "hero-arc-flash.jpg",
        "safety-assessment.jpg",
        "arc-flash-report.jpg",
    ]

    img_idx = 0
    for post in posts:
        doc_id = post["documentId"]
        current = post.get("heroImage", "") or ""
        if current.startswith("http"):
            continue
        url = get_url(blog_images[img_idx % len(blog_images)])
        if url:
            put_strapi("blog-posts", doc_id, {
                "heroImage": url,
                "heroImageAlt": post.get("title", "Carelabs blog post"),
            })
        img_idx += 1


def update_about_page():
    print("\n=== About Page ===")
    r = requests.get(
        f"{STRAPI_BASE}/about-pages?filters[region][$eq]={REGION}&populate=*",
        headers=HEADERS,
    )
    pages = r.json().get("data", [])
    if not pages:
        print("  No AE about page")
        return

    page = pages[0]
    doc_id = page["documentId"]
    current = page.get("heroImage", "") or ""
    if current.startswith("http"):
        print("  Already has heroImage, skipping")
        return

    url = get_url("safety-assessment.jpg") or get_url("hero-arc-flash.jpg")
    if url:
        put_strapi("about-pages", doc_id, {
            "heroImage": url,
            "heroImageAlt": "Carelabs UAE engineering team",
        })


def update_case_studies():
    print("\n=== Case Studies ===")
    r = requests.get(
        f"{STRAPI_BASE}/case-studies?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*",
        headers=HEADERS,
    )
    studies = r.json().get("data", [])

    for study in studies:
        doc_id = study["documentId"]
        current = study.get("heroImage", "") or ""
        if current.startswith("http"):
            continue
        url = get_url("hero-arc-flash.jpg")
        if url:
            put_strapi("case-studies", doc_id, {
                "heroImage": url,
                "heroImageAlt": study.get("title", "Carelabs case study"),
            })


if __name__ == "__main__":
    update_homepage()
    update_service_pages()
    update_blog_posts()
    update_about_page()
    update_case_studies()
    print("\nDone.")
