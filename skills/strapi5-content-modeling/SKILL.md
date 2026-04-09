---
name: strapi5-content-modeling
description: >
  Set up and configure Strapi 5 content types, components, dynamic zones, API permissions, and plugins
  for a headless CMS powering a Next.js frontend. Use this skill whenever the user mentions Strapi 5,
  content types, collection types, single types, components in Strapi, dynamic zones, Strapi API
  configuration, Strapi permissions, Strapi plugins (especially strapi-plugin-seo), or any task involving
  the Strapi admin panel or content-type builder. Also trigger when the user asks about modeling content
  for a headless CMS, creating API endpoints in Strapi, or connecting Strapi to a frontend. If the user
  mentions "CMS setup", "content model", "headless CMS", or "Strapi" in any context, use this skill.
---

# Strapi 5 Content Modeling & API

Strapi 5 introduced significant changes from Strapi 4. This skill covers the Strapi 5-specific patterns for content modeling, API usage, and plugin configuration relevant to the carelabz.com migration project.

## Key differences from Strapi 4

These are critical to get right — much online content still references Strapi 4 patterns:

1. **Document Service API** replaces Entity Service API — use `strapi.documents()` instead of `strapi.entityService`
2. **Content types** now use the new content-type builder with improved relations
3. **Draft & Publish** is built-in and works differently — documents have `status: 'draft' | 'published'`
4. **API response format** changed — data is no longer nested under `data.attributes`, fields are directly on the object
5. **TypeScript support** is first-class in Strapi 5
6. **No more `data.attributes` wrapping** — API responses are flatter

## Content type design for carelabz.com

For the arc-flash-study page migration, you need a content type that can represent service pages. Here's the recommended approach:

### Service Page Collection Type

Create a collection type called `service-page` with these fields:

```
service-page/
├── title (Text, required) — page title
├── slug (UID, linked to title, required) — URL-friendly identifier
├── excerpt (Text, long text) — short description for cards/listings
├── content (Rich Text / Blocks) — main page body
├── seo (Component: shared.seo) — SEO metadata
├── hero_image (Media, single) — page hero/banner image
├── service_category (Relation → service-category) — parent category
├── key_features (Component: shared.feature-item, repeatable) — feature list
├── cta (Component: shared.call-to-action) — page CTA section
├── faqs (Component: shared.faq-item, repeatable) — FAQ section
├── published_at (DateTime) — publish date
└── order (Number, integer) — display order within category
```

### Shared Components

Components are reusable field groups. Create these in the `shared` category:

**shared.seo**
```
├── meta_title (Text) — browser tab title, max 60 chars
├── meta_description (Text, long) — meta description, max 160 chars
├── canonical_url (Text) — canonical URL override
├── og_image (Media, single) — Open Graph image
├── no_index (Boolean, default: false) — robots noindex flag
└── json_ld (JSON) — structured data override
```

**shared.feature-item**
```
├── title (Text, required)
├── description (Rich Text)
└── icon (Text) — icon name or identifier
```

**shared.call-to-action**
```
├── heading (Text, required)
├── description (Text)
├── button_text (Text, required)
├── button_url (Text, required)
└── style (Enumeration: primary, secondary, outline)
```

**shared.faq-item**
```
├── question (Text, required)
└── answer (Rich Text, required)
```

## Creating content types via CLI

Strapi 5 supports generating content types from the command line:

```bash
cd carelabz-cms
npx strapi generate content-type
```

Follow the interactive prompts. However, for complex types, it's often easier to create them through the admin panel and then version-control the resulting schema files.

### Schema file locations

After creating content types, the schemas live in:
```
src/api/<content-type>/content-types/<content-type>/schema.json
```

For components:
```
src/components/<category>/<component-name>.json
```

Always commit these to Git so your content model is version-controlled.

## API configuration

### Enable public access

By default, Strapi 5 blocks all API access. Configure permissions in the admin panel:

1. Go to Settings → Users & Permissions → Roles → Public
2. For `service-page`: enable `find` and `findOne`
3. Save

### API endpoints (Strapi 5 format)

```
GET /api/service-pages                          — list all service pages
GET /api/service-pages/:documentId              — get one by document ID
GET /api/service-pages?filters[slug][$eq]=arc-flash-study  — find by slug
GET /api/service-pages?populate=*               — include all relations
GET /api/service-pages?populate[seo]=*&populate[hero_image]=*  — selective populate
```

The `populate` parameter is essential — Strapi 5 does NOT include relations/components by default.

### Strapi 5 response format

```json
{
  "data": [
    {
      "id": 1,
      "documentId": "abc123def456",
      "title": "Arc Flash Study & Analysis",
      "slug": "arc-flash-study",
      "content": "...",
      "createdAt": "...",
      "updatedAt": "...",
      "publishedAt": "...",
      "seo": {
        "meta_title": "...",
        "meta_description": "..."
      }
    }
  ],
  "meta": {
    "pagination": {
      "page": 1,
      "pageSize": 25,
      "pageCount": 1,
      "total": 1
    }
  }
}
```

Note: fields are directly on the object, NOT under `data.attributes` like in Strapi 4.

## Plugin setup

### strapi-plugin-seo (optional)

If using the SEO plugin instead of a custom SEO component:

```bash
cd carelabz-cms
npm install @strapi/plugin-seo
```

Then rebuild: `npm run build && npm run develop`

However, for this project, the custom `shared.seo` component approach gives you more control and is recommended.

### Upload plugin (media)

Strapi 5 comes with a built-in upload plugin. For production, configure cloud storage:

```javascript
// config/plugins.js
module.exports = ({ env }) => ({
  upload: {
    config: {
      provider: 'cloudinary', // or 'aws-s3'
      providerOptions: {
        cloud_name: env('CLOUDINARY_NAME'),
        api_key: env('CLOUDINARY_KEY'),
        api_secret: env('CLOUDINARY_SECRET'),
      },
    },
  },
});
```

## Environment configuration

### Development (.env)
```
HOST=0.0.0.0
PORT=1337
APP_KEYS=<generate-random-keys>
API_TOKEN_SALT=<generate-random>
ADMIN_JWT_SECRET=<generate-random>
JWT_SECRET=<generate-random>
TRANSFER_TOKEN_SALT=<generate-random>
```

### Connecting to the Next.js frontend

Create an API token in Strapi admin (Settings → API Tokens) with read-only access. Use this token in your Next.js `.env.local`:

```
STRAPI_API_URL=http://localhost:1337
STRAPI_API_TOKEN=<your-read-only-token>
```

## Common pitfalls

- **Forgetting `populate`** — The single biggest source of "my data is missing" issues. Always specify what to populate.
- **Using Strapi 4 response format** — Don't access `data.attributes.title`, just use `data.title` in Strapi 5.
- **Not setting permissions** — New content types default to no public access.
- **Media URLs** — In development, Strapi returns relative URLs for media. Prepend `STRAPI_API_URL` on the frontend.
- **Draft vs Published** — Content must be explicitly published. Drafts won't appear in API responses unless you filter for them.

## Reference: read more

For the latest Strapi 5 documentation, consult:
- Content-type builder: `https://docs.strapi.io/dev-docs/content-type-builder`
- REST API: `https://docs.strapi.io/dev-docs/api/rest`
- Document Service API: `https://docs.strapi.io/dev-docs/api/document-service`
