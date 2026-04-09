---
name: wp-content-extraction
description: >
  Extract content, metadata, images, and structure from live WordPress pages for migration to a headless CMS.
  Use this skill whenever the user mentions scraping a WordPress page, pulling content from WP, extracting
  metadata or SEO tags from an existing site, downloading images from WordPress, analyzing WordPress page
  structure, or any task involving getting content OUT of a WordPress site. Also trigger when the user
  references a carelabz.com URL and wants to capture its content, or says things like "grab the content
  from the old page", "what's on the current site", or "extract from WordPress".
---

# WordPress Content Extraction

This skill handles extracting content from live WordPress sites for migration purposes. It covers both the WordPress REST API approach and direct HTML scraping, because not all content is exposed through the API (custom fields, page builder layouts, etc.).

## When to use which approach

**WordPress REST API** (`/wp-json/wp/v2/`) — Use when:
- The site has the REST API enabled (most WordPress sites do by default)
- You need structured data: title, content, excerpt, featured image, categories, tags
- You want clean HTML without theme/plugin wrapper markup

**Direct HTML scraping** — Use when:
- The REST API is disabled or restricted
- You need content from ACF (Advanced Custom Fields), Elementor, WPBakery, or other page builders
- You need exact on-page SEO metadata (title tags, meta descriptions, OG tags, canonical URLs)
- You need to capture the visual structure and heading hierarchy as rendered

## Extraction workflow

### Step 1: Probe the WordPress REST API

Before scraping, always check if the REST API is available:

```bash
curl -s "https://<domain>/wp-json/wp/v2/pages?slug=<page-slug>" | python3 -m json.tool
```

If this returns valid JSON with page content, use the API. If it returns a 403, 404, or HTML, fall back to scraping.

For the carelabz.com project specifically:
- Old URL: `carelabz.com/arc-flash-study-analysis/`
- API endpoint to try: `https://carelabz.com/wp-json/wp/v2/pages?slug=arc-flash-study-analysis`

### Step 2: Extract content via API (if available)

From the API response, extract these fields:

| API Field | Maps to | Notes |
|-----------|---------|-------|
| `title.rendered` | Page title | May contain HTML entities — decode them |
| `content.rendered` | Body HTML | Strip theme-specific classes, keep semantic HTML |
| `excerpt.rendered` | Meta description seed | Often auto-generated — verify against actual meta |
| `featured_media` | Hero image ID | Fetch full URL via `/wp-json/wp/v2/media/<id>` |
| `yoast_head_json` | SEO metadata | Only if Yoast SEO plugin is installed |
| `acf` | Custom fields | Only if ACF-to-REST-API plugin is active |

### Step 3: Extract via HTML scraping (fallback or supplement)

Use Python with `requests` + `beautifulsoup4` to scrape the rendered page:

```python
import requests
from bs4 import BeautifulSoup

url = "https://carelabz.com/arc-flash-study-analysis/"
response = requests.get(url, headers={"User-Agent": "Mozilla/5.0"})
soup = BeautifulSoup(response.text, "html.parser")
```

**What to extract:**

1. **SEO metadata:**
   - `<title>` tag
   - `<meta name="description">` content
   - `<link rel="canonical">` href
   - All `<meta property="og:*">` tags
   - All `<meta name="twitter:*">` tags
   - JSON-LD structured data (`<script type="application/ld+json">`)

2. **Page content:**
   - Main content area (usually inside `<main>`, `<article>`, or a div with class like `entry-content`, `page-content`, `elementor-widget-container`)
   - Heading hierarchy (h1, h2, h3...) — preserve the structure
   - All `<img>` tags with their `src`, `alt`, `width`, `height` attributes
   - Internal links (for future migration mapping)
   - Lists, tables, blockquotes — preserve semantic HTML

3. **Images:**
   - Download all images referenced in the content
   - Save original filenames
   - Note dimensions and alt text for each

### Step 4: Clean and structure the output

Produce a structured JSON output:

```json
{
  "source_url": "https://carelabz.com/arc-flash-study-analysis/",
  "extracted_at": "2026-04-09T12:00:00Z",
  "seo": {
    "title": "...",
    "meta_description": "...",
    "canonical_url": "...",
    "og_tags": {},
    "twitter_tags": {},
    "json_ld": {}
  },
  "content": {
    "h1": "...",
    "body_html": "...",
    "body_markdown": "...",
    "heading_structure": [
      {"level": 2, "text": "..."},
      {"level": 3, "text": "..."}
    ],
    "images": [
      {
        "original_url": "...",
        "alt_text": "...",
        "local_path": "...",
        "width": null,
        "height": null
      }
    ],
    "internal_links": ["..."]
  }
}
```

### Step 5: Convert HTML to Markdown

For easier content editing and Strapi ingestion, convert the body HTML to clean Markdown. Use the `markdownify` Python library or write a custom converter that:
- Preserves heading levels
- Converts `<img>` tags to markdown image syntax with alt text
- Converts `<a>` tags to markdown links
- Preserves lists (ordered and unordered)
- Strips WordPress-specific CSS classes and inline styles

## Important considerations

- **Respect robots.txt** — Check `<domain>/robots.txt` before scraping. For your own company's site this is generally fine, but be aware of rate limiting.
- **Image licensing** — When downloading images, verify they're owned by the company (not stock photos with usage restrictions that don't transfer).
- **Content accuracy** — Always have a human verify the extracted content against the live page. Automated extraction can miss dynamic content loaded via JavaScript.
- **Character encoding** — WordPress typically uses UTF-8. Decode HTML entities (`&amp;` → `&`, `&#8217;` → `'`, etc.) during extraction.

## Python dependencies

```
requests
beautifulsoup4
markdownify
```

Install with: `pip install requests beautifulsoup4 markdownify --break-system-packages`
