---
name: content-migration-pipeline
description: >
  End-to-end workflow for migrating pages from WordPress to Strapi 5 + Next.js 14, including content
  extraction, transformation, CMS loading, frontend verification, and go-live. Use this skill whenever
  the user wants to migrate a page, migrate content, run the full migration workflow, move a page from
  WordPress to the new site, or asks "how do I migrate the next page". Also trigger when the user says
  "migrate", "move content", "transfer from WordPress", "port the page", "rebuild this page", or wants
  to plan the migration of multiple pages. This is the orchestration skill that ties together extraction,
  Strapi loading, frontend building, SEO setup, and deployment into one repeatable process.
---

# Content Migration Pipeline

This skill is the orchestration layer — the repeatable, step-by-step process for migrating any page from the old WordPress carelabz.com site to the new Next.js + Strapi 5 stack. Think of it as a runbook that you follow for each page.

## The migration for the first page

The first page being migrated is:
- **Old URL:** `carelabz.com/arc-flash-study-analysis/`
- **New URL:** `carelabz.com/ae/services/study-analysis/arc-flash-study/`

## Per-page migration workflow

For every page you migrate, follow these 7 phases in order. Each phase builds on the previous one.

### Phase 1: Extract content from WordPress

**Goal:** Get all content and metadata out of the old page into a structured format.

1. Attempt WordPress REST API extraction first:
   ```bash
   curl -s "https://carelabz.com/wp-json/wp/v2/pages?slug=arc-flash-study-analysis" | python3 -m json.tool
   ```

2. Scrape the live page for SEO metadata and rendered content:
   ```python
   # Use the wp-content-extraction skill for detailed instructions
   # Output: extracted_content.json with seo, content, and images
   ```

3. Download all images used on the page to a local `assets/` directory

4. Convert body HTML to clean Markdown for easier editing

**Deliverable:** `extracted_content.json` file with all page data

### Phase 2: Design the Strapi content model

**Goal:** Ensure the Strapi content type can hold all the extracted content.

1. Review `extracted_content.json` — identify all content sections (hero, body, features, CTAs, FAQs, etc.)
2. Check if the `service-page` content type already exists in Strapi. If not, create it.
3. Create or update shared components (`shared.seo`, `shared.feature-item`, etc.)
4. Set API permissions for the new content type

**Deliverable:** Content type schema committed to `carelabz-cms/src/api/`

Refer to the `strapi5-content-modeling` skill for detailed instructions on content type creation.

### Phase 3: Load content into Strapi

**Goal:** Create the page entry in Strapi with all content populated.

You can load content two ways:

**Option A: Manual via Admin Panel**
1. Open Strapi admin (`http://localhost:1337/admin`)
2. Go to Content Manager → Service Pages → Create New Entry
3. Fill in all fields from `extracted_content.json`
4. Upload images via the Media Library
5. Save and Publish

**Option B: Scripted via API** (better for reproducibility)
```python
import requests
import json

STRAPI_URL = "http://localhost:1337"
API_TOKEN = "<your-admin-api-token>"

headers = {
    "Authorization": f"Bearer {API_TOKEN}",
    "Content-Type": "application/json"
}

# Load extracted content
with open("extracted_content.json") as f:
    content = json.load(f)

# Create the page
payload = {
    "data": {
        "title": content["content"]["h1"],
        "slug": "arc-flash-study",
        "content": content["content"]["body_html"],
        "excerpt": content["seo"]["meta_description"],
        "seo": {
            "meta_title": content["seo"]["title"],
            "meta_description": content["seo"]["meta_description"],
            "canonical_url": "https://carelabz.com/ae/services/study-analysis/arc-flash-study"
        }
    }
}

response = requests.post(
    f"{STRAPI_URL}/api/service-pages",
    headers=headers,
    json=payload
)
print(response.status_code, response.json())
```

Then upload images separately via the upload endpoint and link them to the entry.

**Deliverable:** Content entry visible and published in Strapi admin

### Phase 4: Build the Next.js page

**Goal:** Create the frontend page that renders the Strapi content.

1. Create the route directory: `src/app/ae/services/study-analysis/arc-flash-study/`
2. Build `page.tsx` as a server component that fetches from Strapi
3. Implement section components (Hero, Features, CTA, FAQ)
4. Style with Tailwind CSS
5. Add `generateMetadata()` for SEO tags

Refer to the `nextjs-strapi-integration` skill for code patterns and examples.

**Deliverable:** Page renders correctly at `localhost:3000/ae/services/study-analysis/arc-flash-study`

### Phase 5: Configure SEO and redirects

**Goal:** Set up the 301 redirect and verify all SEO elements.

1. Add the redirect in `next.config.mjs`:
   ```javascript
   { source: '/arc-flash-study-analysis', destination: '/ae/services/study-analysis/arc-flash-study', permanent: true }
   ```

2. Verify metadata output:
   - View page source and check `<title>`, `<meta>` tags, OG tags
   - Test JSON-LD at Google's Rich Results Test

3. Run through the SEO migration checklist (see `seo-redirect-management` skill)

**Deliverable:** All SEO checklist items pass

### Phase 6: Deploy to Vercel

**Goal:** Get the page live on the real domain.

1. Commit all changes to git
2. Push to a feature branch
3. Review the Vercel preview deployment
4. Test the redirect on the preview URL
5. Merge to `main` for production deploy
6. Verify at `https://carelabz.com/ae/services/study-analysis/arc-flash-study`

Refer to the `vercel-deployment` skill for detailed instructions.

**Deliverable:** Page is live and accessible at the production URL

### Phase 7: Post-launch verification

**Goal:** Confirm everything works in production.

Run through this checklist within 24 hours of going live:

- [ ] New page loads correctly at production URL
- [ ] Old URL redirects to new URL (test with `curl -I`)
- [ ] All images load correctly
- [ ] Page passes Lighthouse audit (aim for 90+ on all scores)
- [ ] Meta tags are correct (use browser dev tools or SEO extension)
- [ ] JSON-LD is valid
- [ ] Sitemap includes the new URL
- [ ] Google Search Console: submit new sitemap, request indexing
- [ ] Analytics tracking fires on the new page
- [ ] Mobile rendering looks correct
- [ ] Page loads within 3 seconds on mobile (3G)

## Scaling to multiple pages

Once the first page is migrated successfully, the process repeats for each additional page. To scale efficiently:

### Create a migration tracker

Track the status of every page in a spreadsheet or JSON file:

```json
[
  {
    "old_url": "/arc-flash-study-analysis/",
    "new_url": "/ae/services/study-analysis/arc-flash-study/",
    "status": "live",
    "migrated_date": "2026-04-15",
    "verified": true
  },
  {
    "old_url": "/short-circuit-study/",
    "new_url": "/ae/services/study-analysis/short-circuit-study/",
    "status": "in-progress",
    "migrated_date": null,
    "verified": false
  }
]
```

### Batch migration tips

- **Reuse the content type** — Most service pages share the same structure. The `service-page` collection type should handle them all.
- **Script the extraction** — After the first manual extraction, create a script that can extract any WordPress page given a URL.
- **Script the Strapi loading** — Same for CMS loading. Create a reusable script.
- **Template the frontend** — For pages that share a layout, use a single dynamic route (`[slug]/page.tsx`) instead of separate directories.
- **Bulk redirects** — Maintain a `redirects.json` file with all old → new mappings.

### Dynamic routing for scale

Once you have multiple service pages, switch from individual page files to a dynamic route:

```
src/app/ae/services/study-analysis/[slug]/page.tsx
```

```typescript
// src/app/ae/services/study-analysis/[slug]/page.tsx
import { getServicePageBySlug, getAllServicePages } from '@/lib/strapi';

export async function generateStaticParams() {
  const pages = await getAllServicePages();
  return pages.map((page) => ({ slug: page.slug }));
}

export default async function ServicePage({ params }: { params: { slug: string } }) {
  const page = await getServicePageBySlug(params.slug);
  if (!page) notFound();
  // ... render page
}
```

This way, adding a new page is just adding content in Strapi — no code changes needed.

## Migration timeline estimate

For a single page (like the arc-flash page), expect:
- Phase 1 (Extract): 1-2 hours
- Phase 2 (Content model): 1-2 hours (first time; minutes for subsequent pages)
- Phase 3 (Load content): 30 minutes
- Phase 4 (Build page): 2-4 hours (first time; faster with reusable components)
- Phase 5 (SEO): 1 hour
- Phase 6 (Deploy): 30 minutes
- Phase 7 (Verify): 1 hour

**Total for first page: ~8-12 hours**
**Subsequent pages: ~3-5 hours each** (once components and patterns are established)
