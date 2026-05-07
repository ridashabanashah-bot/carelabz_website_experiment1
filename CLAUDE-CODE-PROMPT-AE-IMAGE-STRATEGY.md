# Claude Code Prompt — AE Image Strategy: Source, Upload, Place

Copy everything below the line into Claude Code.

---

## Task: Add professional imagery across all AE pages — sourced, uploaded to Strapi, and placed with best practices

Read `CLAUDE.md` before starting.

**Branch:** `enhancement/ae-images`

---

## Context

The AE site currently has very few images. The project has 14 images in `public/images/` (hero, industries, insights, safety) but most Strapi entries have empty image fields. The site looks text-heavy and needs professional imagery to build trust and break up content.

### How Images Work in This Project

- Strapi stores images as **string URLs** (not media relations) in fields like `heroImage`, `safetyImage`, `ogImage`, and in component arrays (`industries[].image`, `insights[].image`)
- Pages check `image && image.startsWith("http")` before rendering
- All images use `next/image` with `fill`, `sizes`, and `object-cover`
- If no image URL is set, a fallback solid-color div renders

### Image Fields Available in Strapi

**HomePage:** `ogImage`, `services[].icon`, `industries[].image`, `insights[].image`
**ServicePage:** `heroImage`, `heroImageAlt`, `heroImagePath`, `safetyImage`, `safetyImageAlt`, `reportsImage`, `reportsImageAlt`, `industries[].image`, `insights[].image`
**BlogPost:** `heroImage`, `heroImageAlt`
**CaseStudy:** `heroImage`, `heroImageAlt`
**AboutPage:** `heroImage`, `heroImageAlt`
**ContactPage:** (no image fields currently)

---

## Step 1: Inventory Existing Images

These images already exist in `public/images/` and should be uploaded to Strapi's media library first:

| File | Size | Best Use |
|------|------|----------|
| `hero-arc-flash.jpg` | 58KB | Homepage hero, Arc Flash service hero |
| `arc-flash-report.jpg` | 52KB | Service detail pages — reports section |
| `safety-assessment.jpg` | 55KB | Safety sections, about page |
| `industries/commercial-real-estate.jpg` | 59KB | Industry cards |
| `industries/data-centers.jpg` | 88KB | Industry cards |
| `industries/education.jpg` | 74KB | Industry cards |
| `industries/government.jpg` | 66KB | Industry cards |
| `industries/healthcare.jpg` | 68KB | Industry cards |
| `industries/manufacturing.jpg` | 125KB | Industry cards |
| `industries/oil-and-gas.jpg` | 80KB | Industry cards |
| `industries/utilities.jpg` | 79KB | Industry cards |
| `insights/dewa-requirements-for-arc-f.jpg` | 54KB | Blog card thumbnail |
| `insights/reducing-incident-energy-in.jpg` | 82KB | Blog card thumbnail |
| `insights/understanding-ieee-1584-2018.jpg` | 56KB | Blog card thumbnail |

---

## Step 2: Download Free Stock Images

Download high-quality stock images from **Unsplash** (free, no attribution required for commercial use). Use the Unsplash API or direct download URLs.

**Important rules:**
- Only use Unsplash (unsplash.com) — the license allows commercial use without attribution
- Download at 1200px width (not full resolution — keeps files under 150KB per CLAUDE.md)
- Save to `public/images/ae/` directory
- Use descriptive filenames with kebab-case

### Images to Download

Use `curl` to download from Unsplash. Search for these specific types of images:

```bash
mkdir -p public/images/ae

# Hero / Header images
# Search: "electrical engineering" "power systems" "electrical switchgear" "control panel"
# Need: 3-4 high-quality images of electrical infrastructure, switchgear, control panels

# About page
# Search: "engineering team" "engineers working" "professional team UAE"  
# Need: 1-2 team/professional images

# Services
# Search: "thermal imaging electrical" "circuit breaker" "electrical testing" "power station"
# Need: 6 images, one per core service

# Contact page
# Search: "Dubai skyline" "Dubai business district" "UAE office"
# Need: 1 image for contact hero

# Blog thumbnails
# Search: "electrical safety" "power grid" "energy infrastructure"
# Need: 5-6 additional blog thumbnails for posts that don't have images
```

**Practical download approach — use Unsplash Source API:**

```bash
# These URLs redirect to random relevant Unsplash photos at specified dimensions
# The ?sig= parameter ensures different images for each request

# Hero images
curl -L "https://unsplash.com/photos/VUOiQW5v5pQ/download?w=1200" -o public/images/ae/hero-switchgear.jpg 2>/dev/null || true
curl -L "https://unsplash.com/photos/3s5MZhaxbmo/download?w=1200" -o public/images/ae/hero-control-panel.jpg 2>/dev/null || true

# Service images  
curl -L "https://unsplash.com/photos/Im7lZjxeLhg/download?w=1200" -o public/images/ae/service-thermal-imaging.jpg 2>/dev/null || true
curl -L "https://unsplash.com/photos/dTFkXj3PiA4/download?w=1200" -o public/images/ae/service-electrical-testing.jpg 2>/dev/null || true

# Dubai / UAE
curl -L "https://unsplash.com/photos/ZmDMvJFSdYs/download?w=1200" -o public/images/ae/dubai-skyline.jpg 2>/dev/null || true
```

**If Unsplash direct URLs are blocked by the network**, use an alternative approach — search and download via the Unsplash API with the project's network access, OR use `wget` from allowed CDN domains. If all external downloads fail, document which images are needed and their intended placement so the user can download them manually.

**Fallback if downloads fail:** Create a `data/image-shopping-list.md` file listing every image needed with search terms so the user can download them from unsplash.com manually.

### Resize & Optimize

After downloading, optimize all images:

```bash
# Install sharp-cli for optimization if not available
npx sharp-cli --input "public/images/ae/*.jpg" --output "public/images/ae/" --resize 1200 --quality 80 --format jpg 2>/dev/null || \
python3 -c "
from PIL import Image
import os, glob
for f in glob.glob('public/images/ae/*.jpg'):
    img = Image.open(f)
    if img.width > 1200:
        ratio = 1200 / img.width
        img = img.resize((1200, int(img.height * ratio)), Image.LANCZOS)
    img.save(f, 'JPEG', quality=80, optimize=True)
    size_kb = os.path.getsize(f) / 1024
    print(f'{os.path.basename(f)}: {size_kb:.0f}KB')
" 2>/dev/null || echo "Manual optimization needed — ensure all images are under 150KB"
```

---

## Step 3: Upload All Images to Strapi Media Library

Upload every image to Strapi's media library so they're manageable from the CMS. Strapi returns a URL for each uploaded file.

```python
#!/usr/bin/env python3
"""Upload images to Strapi media library and get URLs back."""

import os, sys, glob, json, subprocess, time

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {"Authorization": f"Bearer {STRAPI_TOKEN}"}

def upload_image(filepath):
    """Upload a single image to Strapi media library. Returns the full URL."""
    filename = os.path.basename(filepath)
    
    with open(filepath, "rb") as f:
        files = {"files": (filename, f, "image/jpeg")}
        r = requests.post(
            f"{STRAPI_BASE}/api/upload",
            headers=HEADERS,
            files=files,
            timeout=30,
        )
    
    if r.status_code == 200:
        data = r.json()
        if isinstance(data, list) and len(data) > 0:
            url = data[0].get("url", "")
            # Strapi Cloud returns relative URLs — prepend base
            if url.startswith("/"):
                url = f"{STRAPI_BASE}{url}"
            print(f"  ✓ {filename} → {url}")
            return url
    
    print(f"  ✗ {filename} — {r.status_code}: {r.text[:200]}")
    return None

def main():
    # Collect all images to upload
    image_dirs = [
        "public/images/ae/",           # New stock images
        "public/images/industries/",     # Existing industry images
        "public/images/insights/",       # Existing blog thumbnails
    ]
    
    # Also upload individual files
    individual_files = [
        "public/images/hero-arc-flash.jpg",
        "public/images/arc-flash-report.jpg",
        "public/images/safety-assessment.jpg",
    ]
    
    all_files = list(individual_files)
    for d in image_dirs:
        if os.path.isdir(d):
            all_files.extend(glob.glob(os.path.join(d, "*.jpg")))
            all_files.extend(glob.glob(os.path.join(d, "*.png")))
            all_files.extend(glob.glob(os.path.join(d, "*.webp")))
    
    # Deduplicate
    all_files = list(set(f for f in all_files if os.path.exists(f)))
    
    print(f"Uploading {len(all_files)} images to Strapi media library...\n")
    
    url_map = {}
    for filepath in sorted(all_files):
        url = upload_image(filepath)
        if url:
            url_map[os.path.basename(filepath)] = url
        time.sleep(0.5)  # Rate limit
    
    # Save the URL map for Step 4
    with open("data/ae-image-urls.json", "w") as f:
        json.dump(url_map, f, indent=2)
    
    print(f"\nDone. {len(url_map)}/{len(all_files)} uploaded successfully.")
    print(f"URL map saved to data/ae-image-urls.json")

if __name__ == "__main__":
    main()
```

Run it:

```bash
source .env.local
mkdir -p data
python3 scripts/ae-upload-images.py
```

---

## Step 4: Link Images to Strapi Content Entries

After uploading, update each Strapi content entry with the correct image URLs. Use the URL map from Step 3.

```python
#!/usr/bin/env python3
"""Link uploaded images to Strapi content entries."""

import os, sys, json, subprocess, time

try:
    import requests
except ImportError:
    subprocess.check_call([sys.executable, "-m", "pip", "install", "requests", "--break-system-packages", "-q"])
    import requests

STRAPI_BASE = "https://rational-cheese-8e8c4f80ea.strapiapp.com/api"
STRAPI_TOKEN = os.environ.get("STRAPI_API_TOKEN", "")
HEADERS = {
    "Authorization": f"Bearer {STRAPI_TOKEN}",
    "Content-Type": "application/json",
}
REGION = "ae"

# Load URL map from Step 3
with open("data/ae-image-urls.json") as f:
    URLS = json.load(f)

def get_url(filename):
    """Look up an uploaded image URL by filename."""
    return URLS.get(filename, "")

def put_strapi(content_type, doc_id, data):
    """PUT update to a Strapi entry."""
    r = requests.put(
        f"{STRAPI_BASE}/{content_type}/{doc_id}",
        headers=HEADERS,
        json={"data": data},
        timeout=15,
    )
    if r.status_code == 200:
        print(f"  ✓ {content_type}/{doc_id}")
    else:
        print(f"  ✗ {content_type}/{doc_id} — {r.status_code}: {r.text[:200]}")
    time.sleep(0.3)

def update_homepage():
    """Set images on the AE homepage entry."""
    print("\n=== Homepage ===")
    r = requests.get(f"{STRAPI_BASE}/home-pages?filters[region][$eq]={REGION}&populate=*", headers=HEADERS)
    pages = r.json().get("data", [])
    if not pages:
        print("  No AE homepage found")
        return
    
    page = pages[0]
    doc_id = page["documentId"]
    
    # Update OG image
    update = {}
    hero_url = get_url("hero-arc-flash.jpg") or get_url("hero-switchgear.jpg")
    if hero_url:
        update["ogImage"] = hero_url
    
    # Update industry images if the industries array exists
    industries = page.get("industries", [])
    industry_image_map = {
        "Oil & Gas": "oil-and-gas.jpg",
        "Oil and Gas": "oil-and-gas.jpg",
        "Healthcare": "healthcare.jpg",
        "Data Centers": "data-centers.jpg",
        "Data Center": "data-centers.jpg",
        "Manufacturing": "manufacturing.jpg",
        "Commercial": "commercial-real-estate.jpg",
        "Commercial Real Estate": "commercial-real-estate.jpg",
        "Government": "government.jpg",
        "Education": "education.jpg",
        "Utilities": "utilities.jpg",
    }
    
    updated_industries = []
    for ind in industries:
        new_ind = dict(ind)
        # Remove nested id to avoid Strapi v5 component error
        new_ind.pop("id", None)
        title = ind.get("title", "")
        for key, filename in industry_image_map.items():
            if key.lower() in title.lower():
                url = get_url(filename)
                if url:
                    new_ind["image"] = url
                break
        updated_industries.append(new_ind)
    
    if updated_industries:
        update["industries"] = updated_industries
    
    # Update insights images
    insights = page.get("insights", [])
    insight_images = [
        "dewa-requirements-for-arc-f.jpg",
        "reducing-incident-energy-in.jpg",
        "understanding-ieee-1584-2018.jpg",
    ]
    updated_insights = []
    for i, ins in enumerate(insights):
        new_ins = dict(ins)
        new_ins.pop("id", None)
        if i < len(insight_images):
            url = get_url(insight_images[i])
            if url:
                new_ins["image"] = url
        updated_insights.append(new_ins)
    
    if updated_insights:
        update["insights"] = updated_insights
    
    if update:
        put_strapi("home-pages", doc_id, update)

def update_service_pages():
    """Set images on all AE service pages."""
    print("\n=== Service Pages ===")
    r = requests.get(
        f"{STRAPI_BASE}/service-pages?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*",
        headers=HEADERS,
    )
    pages = r.json().get("data", [])
    
    # Map service types to appropriate images
    service_image_map = {
        "arc-flash": {"hero": "hero-arc-flash.jpg", "safety": "safety-assessment.jpg", "reports": "arc-flash-report.jpg"},
        "short-circuit": {"hero": "hero-switchgear.jpg", "safety": "safety-assessment.jpg"},
        "load-flow": {"hero": "hero-control-panel.jpg", "safety": "safety-assessment.jpg"},
        "relay": {"hero": "hero-switchgear.jpg", "safety": "safety-assessment.jpg"},
        "thermograph": {"hero": "service-thermal-imaging.jpg", "safety": "safety-assessment.jpg"},
        "circuit-breaker": {"hero": "service-electrical-testing.jpg", "safety": "safety-assessment.jpg"},
        "cable": {"hero": "service-electrical-testing.jpg", "safety": "safety-assessment.jpg"},
        "calibration": {"hero": "hero-control-panel.jpg"},
        "transformer": {"hero": "hero-switchgear.jpg"},
        "motor": {"hero": "hero-control-panel.jpg"},
        "ground": {"hero": "service-electrical-testing.jpg"},
        "power-quality": {"hero": "hero-control-panel.jpg"},
        "protection": {"hero": "hero-switchgear.jpg"},
    }
    
    for page in pages:
        doc_id = page["documentId"]
        slug = page.get("slug", "")
        update = {}
        
        # Find matching image set
        for keyword, images in service_image_map.items():
            if keyword in slug:
                for field, filename in images.items():
                    url = get_url(filename)
                    if url:
                        if field == "hero":
                            update["heroImage"] = url
                            update["heroImageAlt"] = page.get("title", "Carelabs service")
                        elif field == "safety":
                            update["safetyImage"] = url
                            update["safetyImageAlt"] = "Electrical safety assessment"
                        elif field == "reports":
                            update["reportsImage"] = url
                            update["reportsImageAlt"] = "Engineering report"
                break
        
        # Fallback: if no match, use generic hero
        if "heroImage" not in update:
            url = get_url("hero-arc-flash.jpg") or get_url("hero-switchgear.jpg")
            if url:
                update["heroImage"] = url
                update["heroImageAlt"] = page.get("title", "Carelabs service")
        
        if update:
            put_strapi("service-pages", doc_id, update)

def update_blog_posts():
    """Set hero images on AE blog posts that don't have one."""
    print("\n=== Blog Posts ===")
    r = requests.get(
        f"{STRAPI_BASE}/blog-posts?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*",
        headers=HEADERS,
    )
    posts = r.json().get("data", [])
    
    # Rotate through available blog images
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
        current_hero = post.get("heroImage", "")
        
        # Only update if no image set or image doesn't start with http
        if not current_hero or not current_hero.startswith("http"):
            url = get_url(blog_images[img_idx % len(blog_images)])
            if url:
                put_strapi("blog-posts", doc_id, {
                    "heroImage": url,
                    "heroImageAlt": post.get("title", "Carelabs blog post"),
                })
            img_idx += 1

def update_about_page():
    """Set hero image on the AE about page."""
    print("\n=== About Page ===")
    r = requests.get(
        f"{STRAPI_BASE}/about-pages?filters[region][$eq]={REGION}&populate=*",
        headers=HEADERS,
    )
    pages = r.json().get("data", [])
    if not pages:
        return
    
    page = pages[0]
    doc_id = page["documentId"]
    
    url = get_url("safety-assessment.jpg") or get_url("hero-arc-flash.jpg")
    if url:
        put_strapi("about-pages", doc_id, {
            "heroImage": url,
            "heroImageAlt": "Carelabs engineering team",
        })

def update_case_studies():
    """Set hero images on AE case studies."""
    print("\n=== Case Studies ===")
    r = requests.get(
        f"{STRAPI_BASE}/case-studies?filters[region][$eq]={REGION}&pagination[pageSize]=100&populate=*",
        headers=HEADERS,
    )
    studies = r.json().get("data", [])
    
    for study in studies:
        doc_id = study["documentId"]
        current = study.get("heroImage", "")
        if not current or not current.startswith("http"):
            url = get_url("hero-arc-flash.jpg") or get_url("hero-switchgear.jpg")
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
```

Save as `scripts/ae-link-images.py` and run:

```bash
source .env.local
python3 scripts/ae-link-images.py
```

---

## Step 5: Update Page Components to Render Images

Now that Strapi entries have image URLs, ensure every page component actually renders them. Follow these best-practice placements:

### 5A. Homepage (`src/app/ae/page.tsx`)

**Where images go (frontend design best practices):**

1. **Hero section** — NO full-bleed background image (keep the dark blue + grid pattern from v0 design). Images in heroes compete with text readability on engineering sites. The grid pattern provides visual texture without distraction.

2. **Industries section** — YES, add images. Each industry card gets a thumbnail:
```tsx
{page.industries?.map((ind) => (
  <div key={ind.title} className="group relative overflow-hidden">
    {ind.image && ind.image.startsWith("http") && (
      <div className="relative h-48 overflow-hidden">
        <Image
          src={ind.image}
          alt={ind.alt ?? ind.title}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
      </div>
    )}
    <div className="relative p-6">
      <h3>{ind.title}</h3>
    </div>
  </div>
))}
```

3. **Insights/blog preview** — YES, add thumbnails to each article card:
```tsx
{post.image && post.image.startsWith("http") ? (
  <div className="relative h-48 overflow-hidden">
    <Image
      src={post.image}
      alt={post.title}
      fill
      sizes="(max-width: 768px) 100vw, 33vw"
      className="object-cover transition-transform duration-500 group-hover:scale-105"
    />
  </div>
) : (
  <div className="relative h-48 bg-gradient-to-br from-[#094D76] to-[#2575B6]" />
)}
```

4. **About section** — Consider a half-width image alongside the brand text (in the two-column layout, the right column could show a professional image instead of / above the values grid)

### 5B. Service Detail Pages (`src/app/ae/services/[slug]/page.tsx`)

**Where images go:**

1. **Hero** — Add a half-hero image alongside the text. Split layout: left = text content, right = hero image
```tsx
<section className="bg-[#094D76] py-20 lg:py-28">
  <div className="mx-auto max-w-7xl px-6 lg:px-8">
    <div className="grid items-center gap-12 lg:grid-cols-2">
      {/* Left: text */}
      <div>
        {/* breadcrumb, eyebrow, title, description, CTA */}
      </div>
      {/* Right: image */}
      {service.heroImage && service.heroImage.startsWith("http") && (
        <div className="relative hidden aspect-[4/3] overflow-hidden lg:block">
          <Image
            src={service.heroImage}
            alt={service.heroImageAlt ?? service.title}
            fill
            priority
            sizes="50vw"
            className="object-cover"
          />
        </div>
      )}
    </div>
  </div>
</section>
```

2. **Safety section** — Image alongside safety content (two-column: image left, text right)
```tsx
{service.safetyImage && service.safetyImage.startsWith("http") && (
  <div className="relative aspect-[4/3] overflow-hidden">
    <Image
      src={service.safetyImage}
      alt={service.safetyImageAlt ?? "Safety assessment"}
      fill
      sizes="(max-width: 1024px) 100vw, 50vw"
      className="object-cover"
    />
  </div>
)}
```

3. **Reports section** — Small image showing a sample report

### 5C. Blog Detail Pages (`src/app/ae/blog/[slug]/page.tsx`)

**Where the image goes:**

1. **Below the headline, above the body** — full-width hero image with 16:9 aspect ratio (this is already partially implemented):
```tsx
{post.heroImage && post.heroImage.startsWith("http") && (
  <div className="relative aspect-[16/9] overflow-hidden">
    <Image
      src={post.heroImage}
      alt={post.heroImageAlt ?? post.title}
      fill
      priority
      sizes="(max-width: 768px) 100vw, 768px"
      className="object-cover"
    />
  </div>
)}
```

### 5D. Blog Index (`src/app/ae/blog/page.tsx`)

**Where images go:**

1. **Each blog card** — thumbnail at top of card, 16:9 or 3:2 aspect ratio with hover scale effect

### 5E. About Page (`src/app/ae/about/page.tsx`)

**Where images go:**

1. **Hero** — Split hero with image on one side (same pattern as service detail)
2. **Team/culture section** — If there's a mission section, pair it with a team image

### 5F. Contact Page (`src/app/ae/contact/page.tsx`)

**Where images go:**

1. **Hero or sidebar** — Dubai skyline image as a visual anchor. Can be a subtle background image with dark overlay, or a side panel next to the contact form.

### 5G. Case Study Detail (`src/app/ae/case-studies/[slug]/page.tsx`)

**Where images go:**

1. **Hero** — Full-width hero image (same as blog detail)
2. **Results section** — Could include before/after or data visualization images

---

## Image Best Practices Checklist (MUST follow)

1. **Always use `next/image`** with `fill` + `sizes` + `object-cover` — never `<img>`
2. **Always set `sizes` prop** — prevents browser downloading oversized images:
   - Full-width: `sizes="100vw"`
   - Half-width: `sizes="(max-width: 1024px) 100vw, 50vw"`
   - Card thumbnail: `sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"`
3. **Set `priority` on above-the-fold images** (hero images only) — triggers preload
4. **Never set `priority` on below-the-fold images** — let lazy loading work
5. **Always add `alt` text** — from Strapi `*Alt` fields with fallback to title
6. **Always add fallback** — solid color or gradient div if image is missing
7. **Keep all images under 150KB** (per CLAUDE.md)
8. **Use `object-cover`** on all images inside `fill` containers — prevents stretching
9. **Add hover effects on interactive images** — `group-hover:scale-105` with `transition-transform duration-500` and `overflow-hidden` on container
10. **Add gradient overlays on images with text** — `bg-gradient-to-t from-black/60 to-transparent` ensures text readability
11. **Use aspect ratios** — `aspect-[16/9]` for hero images, `aspect-[4/3]` for side images, `aspect-square` for thumbnails
12. **No decorative images in hero sections of B2B sites** — the v0 design deliberately uses color + pattern instead of stock photos in the hero. Keep it.

---

## Verification

1. `npx tsc --noEmit` — zero errors
2. `npm run build` — all routes compile
3. Spot-check: visit `/ae/` → scroll to industries section → images should load
4. Spot-check: visit any service page → hero should show image on right side
5. Spot-check: visit `/ae/blog/` → each card should have a thumbnail
6. Check Network tab: images should load as WebP (Next.js auto-converts)
7. Check Lighthouse: no CLS from images (all have fixed aspect ratios)
8. Verify non-AE pages unaffected
9. Commit: `enhancement(ae): add images — Strapi upload + page component updates`
10. Push: `git push origin enhancement/ae-images`

---

## Scripts Delivered

| Script | Purpose |
|--------|---------|
| `scripts/ae-upload-images.py` | Upload all images to Strapi media library |
| `scripts/ae-link-images.py` | Link uploaded image URLs to Strapi content entries |
| `data/ae-image-urls.json` | Map of filename → Strapi URL (generated by upload script) |
| `data/image-shopping-list.md` | Fallback: manual download list if network blocks Unsplash |
