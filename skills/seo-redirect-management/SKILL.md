---
name: seo-redirect-management
description: >
  Configure 301 redirects, meta tags, Open Graph tags, canonical URLs, JSON-LD structured data, and
  SEO best practices for a Next.js 14 site migrating from WordPress. Use this skill whenever the user
  mentions redirects, 301 redirect, SEO migration, meta tags, meta description, Open Graph, og:image,
  Twitter cards, canonical URL, JSON-LD, structured data, schema markup, sitemap, robots.txt, SEO audit,
  search console, or any task related to preserving or improving search engine rankings during a site
  migration. Also trigger when the user says "old URL to new URL", "redirect the old page", "SEO parity",
  "don't lose rankings", or asks about Google indexing of the new site.
---

# SEO & Redirect Management

This skill handles everything related to search engine optimization during the WordPress → Next.js migration. The primary goal is to preserve existing search rankings while setting up a clean SEO foundation for the new site.

## The critical redirect: old → new URL

This is the single most important SEO task for the migration:

```
OLD: carelabz.com/arc-flash-study-analysis/
NEW: carelabz.com/ae/services/study-analysis/arc-flash-study/
```

A **301 permanent redirect** tells search engines that the page has permanently moved and to transfer all ranking signals (link equity, authority) to the new URL.

### Configuring in Next.js

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  async redirects() {
    return [
      {
        source: '/arc-flash-study-analysis',
        destination: '/ae/services/study-analysis/arc-flash-study',
        permanent: true, // 301 redirect
      },
      // Handle trailing slash variant too
      {
        source: '/arc-flash-study-analysis/',
        destination: '/ae/services/study-analysis/arc-flash-study',
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
```

As you migrate more pages, add each old → new mapping to this array. For large-scale migrations (50+ pages), consider using a JSON file or database to manage the redirect map:

```javascript
// next.config.mjs
import redirectMap from './redirects.json' assert { type: 'json' };

const nextConfig = {
  async redirects() {
    return redirectMap.map(({ source, destination }) => ({
      source,
      destination,
      permanent: true,
    }));
  },
};
```

### Redirect verification

After deploying, verify redirects work correctly:

```bash
# Should return 301 with Location header pointing to new URL
curl -I https://carelabz.com/arc-flash-study-analysis/

# Expected output includes:
# HTTP/2 301
# location: /ae/services/study-analysis/arc-flash-study
```

Also verify in a browser that the redirect chain is clean (no double redirects, no redirect loops).

## Meta tags with Next.js 14 Metadata API

Next.js 14 App Router uses the `Metadata` export for SEO tags. This is the recommended approach over `<Head>`:

### Static metadata (for known pages)

```typescript
// src/app/ae/services/study-analysis/arc-flash-study/page.tsx
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Arc Flash Study & Analysis | CareLAbz',
  description: 'Professional arc flash study and analysis services...',
  alternates: {
    canonical: 'https://carelabz.com/ae/services/study-analysis/arc-flash-study',
  },
  openGraph: {
    title: 'Arc Flash Study & Analysis | CareLAbz',
    description: 'Professional arc flash study and analysis services...',
    url: 'https://carelabz.com/ae/services/study-analysis/arc-flash-study',
    siteName: 'CareLAbz',
    type: 'website',
    images: [
      {
        url: 'https://carelabz.com/og-image-arc-flash.jpg',
        width: 1200,
        height: 630,
        alt: 'Arc Flash Study & Analysis',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Arc Flash Study & Analysis | CareLAbz',
    description: 'Professional arc flash study and analysis services...',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### Dynamic metadata (from Strapi)

When metadata comes from the CMS, use `generateMetadata`:

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicePageBySlug('arc-flash-study');
  if (!page?.seo) return {};

  const { seo } = page;
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carelabz.com';

  return {
    title: seo.meta_title || page.title,
    description: seo.meta_description || page.excerpt,
    alternates: {
      canonical: seo.canonical_url || `${SITE_URL}/ae/services/study-analysis/arc-flash-study`,
    },
    openGraph: {
      title: seo.meta_title || page.title,
      description: seo.meta_description || '',
      url: `${SITE_URL}/ae/services/study-analysis/arc-flash-study`,
      siteName: 'CareLAbz',
      type: 'website',
      images: seo.og_image ? [getStrapiMediaUrl(seo.og_image.url)] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title: seo.meta_title || page.title,
      description: seo.meta_description || '',
    },
    robots: {
      index: !seo.no_index,
      follow: true,
    },
  };
}
```

## JSON-LD Structured Data

Add structured data to help search engines understand the page content. For a service page:

```typescript
// src/components/JsonLd.tsx
export default function JsonLd({ data }: { data: Record<string, unknown> }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
```

```typescript
// In the page component:
const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Service',
  name: page.title,
  description: page.seo?.meta_description || page.excerpt,
  provider: {
    '@type': 'Organization',
    name: 'CareLAbz',
    url: 'https://carelabz.com',
  },
  url: 'https://carelabz.com/ae/services/study-analysis/arc-flash-study',
  serviceType: 'Arc Flash Study & Analysis',
};

// Add to JSX:
<JsonLd data={jsonLd} />
```

## Sitemap generation

Create a dynamic sitemap that pulls from Strapi:

```typescript
// src/app/sitemap.ts
import { MetadataRoute } from 'next';
import { getAllServicePages } from '@/lib/strapi';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carelabz.com';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Get all service pages from Strapi
  const servicePages = await getAllServicePages();

  const servicePageUrls = servicePages.map((page) => ({
    url: `${SITE_URL}/ae/services/study-analysis/${page.slug}`,
    lastModified: new Date(page.updatedAt || page.publishedAt),
    changeFrequency: 'monthly' as const,
    priority: 0.8,
  }));

  return [
    {
      url: SITE_URL,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 1.0,
    },
    ...servicePageUrls,
  ];
}
```

## Robots.txt

```typescript
// src/app/robots.ts
import { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'https://carelabz.com';

  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/admin/'],
    },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
```

## SEO migration checklist

Before going live with a migrated page, verify:

1. **301 redirect works** — `curl -I` returns 301 with correct Location header
2. **Title tag** — Matches or improves on the old page's title
3. **Meta description** — Present and under 160 characters
4. **Canonical URL** — Points to the new URL (not the old one)
5. **Open Graph tags** — Title, description, image, and URL all present
6. **H1 tag** — Exactly one H1, matches the page topic
7. **Internal links** — Any other pages linking to the old URL should be updated (or the redirect handles it)
8. **Images** — All images have `alt` text, are properly sized, and load correctly
9. **Page speed** — Run Lighthouse and aim for 90+ performance score
10. **JSON-LD** — Valid structured data (test at https://search.google.com/test/rich-results)
11. **Sitemap** — New URL appears in `sitemap.xml`
12. **Google Search Console** — Submit the new sitemap and request indexing of the new URL

## Post-migration monitoring

After the redirect is live:
- Monitor Google Search Console for crawl errors on the old URL
- Check that the new URL is being indexed (use `site:carelabz.com/ae/services/study-analysis/arc-flash-study`)
- Watch for ranking drops in the first 2-4 weeks (some temporary fluctuation is normal)
- Verify analytics tracking is working on the new URL
