function getStrapiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

const STRAPI_URL = getStrapiUrl();

export interface BlogPost {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  region: string | null;
  category: string | null;
  excerpt: string | null;
  body: string;
  heroImage: string | null;
  heroImageAlt: string | null;
  author: string | null;
  publishedDate: string | null;
  tags: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  seoKeywords: string[] | null;
  faqs: { question: string; answer: string }[] | null;
  relatedPosts: { title: string; slug: string; excerpt: string }[] | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export async function getBlogPosts(region: string): Promise<BlogPost[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/blog-posts?filters[region][$eq]=${region}&populate=*&sort=publishedDate:desc`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return [];

  const json: StrapiResponse<BlogPost[]> = await res.json();

  if (!json.data || json.data.length === 0) return [];

  return json.data;
}

export async function getBlogPost(
  region: string,
  slug: string
): Promise<BlogPost | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/blog-posts?filters[region][$eq]=${region}&filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<BlogPost[]> = await res.json();

  if (!json.data || json.data.length === 0) return null;

  return json.data[0];
}
