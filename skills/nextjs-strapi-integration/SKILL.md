---
name: nextjs-strapi-integration
description: >
  Build Next.js 14 App Router pages that fetch data from Strapi 5, with TypeScript types, server
  components, and Tailwind CSS styling. Use this skill whenever the user mentions Next.js pages,
  App Router routing, fetching from Strapi in Next.js, server components, TypeScript interfaces for
  Strapi data, dynamic routes in Next.js, layout components, Tailwind styling for pages, or building
  the frontend of the carelabz.com site. Also trigger when the user asks about ISR, SSG, static
  generation with Strapi, page metadata in Next.js, or "how to display Strapi content in Next.js".
  If the user mentions "frontend", "page component", "route", or "layout" in the context of this
  project, use this skill.
---

# Next.js 14 App Router + Strapi 5 Integration

This skill covers building the Next.js frontend that consumes Strapi 5 content. It uses the App Router (not Pages Router), server components by default, and TypeScript throughout.

## Project structure

For the carelabz.com rebuild, the App Router file structure maps directly to URLs:

```
src/
├── app/
│   ├── layout.tsx                          — root layout (header, footer)
│   ├── page.tsx                            — homepage (carelabz.com/)
│   └── ae/
│       └── services/
│           └── study-analysis/
│               └── arc-flash-study/
│                   └── page.tsx            — the migrated page
├── components/
│   ├── ui/                                 — reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   └── Section.tsx
│   ├── layout/                             — layout components
│   │   ├── Header.tsx
│   │   ├── Footer.tsx
│   │   └── Navigation.tsx
│   └── sections/                           — page section components
│       ├── HeroSection.tsx
│       ├── FeatureList.tsx
│       ├── CTASection.tsx
│       └── FAQSection.tsx
├── lib/
│   ├── strapi.ts                           — Strapi API client
│   └── types.ts                            — TypeScript interfaces
└── styles/
    └── globals.css                          — Tailwind base + custom styles
```

## Strapi API client

Create a typed API client that handles all Strapi communication:

```typescript
// src/lib/strapi.ts

const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';
const STRAPI_TOKEN = process.env.STRAPI_API_TOKEN;

interface StrapiResponse<T> {
  data: T;
  meta: {
    pagination?: {
      page: number;
      pageSize: number;
      pageCount: number;
      total: number;
    };
  };
}

async function fetchStrapi<T>(
  endpoint: string,
  params?: Record<string, string>
): Promise<StrapiResponse<T>> {
  const url = new URL(`/api${endpoint}`, STRAPI_URL);

  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      url.searchParams.set(key, value);
    });
  }

  const response = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${STRAPI_TOKEN}`,
    },
    next: { revalidate: 60 }, // ISR: revalidate every 60 seconds
  });

  if (!response.ok) {
    throw new Error(`Strapi API error: ${response.status} ${response.statusText}`);
  }

  return response.json();
}

export async function getServicePageBySlug(slug: string) {
  const response = await fetchStrapi<ServicePage[]>('/service-pages', {
    'filters[slug][$eq]': slug,
    'populate[seo][populate]': '*',
    'populate[hero_image]': '*',
    'populate[key_features]': '*',
    'populate[cta]': '*',
    'populate[faqs]': '*',
  });

  return response.data[0] || null;
}

export async function getAllServicePages() {
  const response = await fetchStrapi<ServicePage[]>('/service-pages', {
    'fields[0]': 'slug',
    'fields[1]': 'title',
    'pagination[pageSize]': '100',
  });

  return response.data;
}
```

## TypeScript interfaces

Define types that match your Strapi 5 content model:

```typescript
// src/lib/types.ts

export interface StrapiImage {
  id: number;
  url: string;
  alternativeText: string | null;
  width: number;
  height: number;
  formats?: {
    thumbnail?: StrapiImageFormat;
    small?: StrapiImageFormat;
    medium?: StrapiImageFormat;
    large?: StrapiImageFormat;
  };
}

interface StrapiImageFormat {
  url: string;
  width: number;
  height: number;
}

export interface SEO {
  meta_title: string | null;
  meta_description: string | null;
  canonical_url: string | null;
  og_image: StrapiImage | null;
  no_index: boolean;
  json_ld: Record<string, unknown> | null;
}

export interface FeatureItem {
  id: number;
  title: string;
  description: string;
  icon: string | null;
}

export interface CallToAction {
  heading: string;
  description: string | null;
  button_text: string;
  button_url: string;
  style: 'primary' | 'secondary' | 'outline';
}

export interface FAQItem {
  id: number;
  question: string;
  answer: string;
}

export interface ServicePage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  seo: SEO | null;
  hero_image: StrapiImage | null;
  key_features: FeatureItem[];
  cta: CallToAction | null;
  faqs: FAQItem[];
  publishedAt: string;
  createdAt: string;
  updatedAt: string;
}
```

## Building the arc-flash-study page

The page at `/ae/services/study-analysis/arc-flash-study/` is a server component by default in App Router:

```typescript
// src/app/ae/services/study-analysis/arc-flash-study/page.tsx

import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { getServicePageBySlug } from '@/lib/strapi';
import HeroSection from '@/components/sections/HeroSection';
import FeatureList from '@/components/sections/FeatureList';
import CTASection from '@/components/sections/CTASection';
import FAQSection from '@/components/sections/FAQSection';

const SLUG = 'arc-flash-study';
const STRAPI_URL = process.env.STRAPI_API_URL || 'http://localhost:1337';

// Generate metadata from Strapi SEO fields
export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicePageBySlug(SLUG);
  if (!page) return {};

  const seo = page.seo;
  return {
    title: seo?.meta_title || page.title,
    description: seo?.meta_description || page.excerpt || '',
    alternates: {
      canonical: seo?.canonical_url || '/ae/services/study-analysis/arc-flash-study',
    },
    openGraph: {
      title: seo?.meta_title || page.title,
      description: seo?.meta_description || '',
      images: seo?.og_image
        ? [`${STRAPI_URL}${seo.og_image.url}`]
        : [],
    },
  };
}

export default async function ArcFlashStudyPage() {
  const page = await getServicePageBySlug(SLUG);

  if (!page) {
    notFound();
  }

  return (
    <main>
      <HeroSection
        title={page.title}
        description={page.excerpt}
        image={page.hero_image}
      />

      {/* Main content from Strapi rich text */}
      <section className="mx-auto max-w-4xl px-4 py-12">
        <div
          className="prose prose-lg max-w-none"
          dangerouslySetInnerHTML={{ __html: page.content }}
        />
      </section>

      {/* Key features */}
      {page.key_features?.length > 0 && (
        <FeatureList features={page.key_features} />
      )}

      {/* Call to action */}
      {page.cta && <CTASection cta={page.cta} />}

      {/* FAQs */}
      {page.faqs?.length > 0 && <FAQSection faqs={page.faqs} />}
    </main>
  );
}
```

## Handling Strapi media URLs

Strapi returns relative URLs for media in development. Create a utility:

```typescript
// src/lib/strapi.ts (add to existing file)

export function getStrapiMediaUrl(url: string | null): string {
  if (!url) return '';
  if (url.startsWith('http')) return url;
  return `${STRAPI_URL}${url}`;
}
```

Use it in components with `next/image`:

```tsx
import Image from 'next/image';
import { getStrapiMediaUrl } from '@/lib/strapi';

<Image
  src={getStrapiMediaUrl(image.url)}
  alt={image.alternativeText || ''}
  width={image.width}
  height={image.height}
  className="rounded-lg object-cover"
/>
```

Remember to add Strapi's domain to `next.config.mjs`:

```javascript
// next.config.mjs
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '1337',
      },
      {
        protocol: 'https',
        hostname: 'your-strapi-production-domain.com',
      },
    ],
  },
};
```

## Data fetching patterns

**Static Generation (recommended for service pages):**
Next.js 14 App Router caches `fetch()` by default. The `revalidate: 60` in the Strapi client means pages regenerate every 60 seconds via ISR (Incremental Static Regeneration). This gives you fast page loads with near-real-time content updates.

**On-demand Revalidation:**
For instant updates when content changes in Strapi, set up a webhook:

```typescript
// src/app/api/revalidate/route.ts
import { revalidatePath } from 'next/cache';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const secret = request.headers.get('x-revalidation-secret');
  if (secret !== process.env.REVALIDATION_SECRET) {
    return NextResponse.json({ message: 'Invalid secret' }, { status: 401 });
  }

  const body = await request.json();
  // Revalidate the specific page when Strapi content changes
  revalidatePath('/ae/services/study-analysis/arc-flash-study');

  return NextResponse.json({ revalidated: true });
}
```

Configure this URL as a webhook in Strapi admin (Settings → Webhooks).

## Tailwind CSS setup

The project uses Tailwind CSS. For the service pages, use the `@tailwindcss/typography` plugin to style rich text content from Strapi:

```bash
npm install @tailwindcss/typography
```

```typescript
// tailwind.config.ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        // Define carelabz brand colors here
        brand: {
          primary: '#1a365d',   // adjust to actual brand colors
          secondary: '#e53e3e',
          accent: '#f6ad55',
        },
      },
    },
  },
  plugins: [require('@tailwindcss/typography')],
};

export default config;
```

The `prose` classes from `@tailwindcss/typography` handle styling for `dangerouslySetInnerHTML` content from Strapi's rich text fields.

## Common patterns and pitfalls

- **Server vs Client components** — Keep data-fetching components as server components (the default). Only add `'use client'` for interactive elements (accordions, forms, etc.).
- **Error handling** — Always handle the case where Strapi is unreachable. Use `notFound()` for missing pages, and consider an error boundary for API failures.
- **Environment variables** — `STRAPI_API_URL` and `STRAPI_API_TOKEN` must be set in `.env.local` for development and in Vercel's environment variables for production. They should NOT be prefixed with `NEXT_PUBLIC_` since they're used in server components only.
- **Trailing slashes** — Be consistent. Next.js 14 defaults to no trailing slash. Configure in `next.config.mjs` if needed.
