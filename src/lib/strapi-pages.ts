function getStrapiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

const STRAPI_URL = getStrapiUrl();

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export interface CaseStudy {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  region: string | null;
  client: string | null;
  industry: string | null;
  challenge: string | null;
  solution: string | null;
  results: { metric: string; value: string; description: string }[] | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  body: string | null;
  tags: string[] | null;
  metaTitle: string | null;
  metaDescription: string | null;
  publishedDate: string | null;
  excerpt: string | null;
  ctaText: string | null;
  ctaHref: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface AboutPage {
  id: number;
  documentId: string;
  region: string;
  heroHeadline: string | null;
  heroSubtext: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  missionHeading: string | null;
  missionBody: string | null;
  valuesHeading: string | null;
  values: { title: string; description: string; icon: string }[] | null;
  teamHeading: string | null;
  team: { name: string; role: string; bio: string }[] | null;
  statsHeading: string | null;
  stats: { metric: string; value: string }[] | null;
  certifications: string[] | null;
  ctaBannerHeading: string | null;
  ctaBannerSubtext: string | null;
  ctaBannerPrimaryText: string | null;
  ctaBannerPrimaryHref: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export interface ContactPage {
  id: number;
  documentId: string;
  region: string;
  heroHeadline: string | null;
  heroSubtext: string | null;
  phone: string | null;
  email: string | null;
  address: string | null;
  mapEmbedUrl: string | null;
  officeHours: string | null;
  formHeading: string | null;
  formSubtext: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

export async function getCaseStudies(region: string): Promise<CaseStudy[]> {
  const res = await fetch(
    `${STRAPI_URL}/api/case-studies?filters[region][$eq]=${region}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return [];

  const json: StrapiResponse<CaseStudy[]> = await res.json();

  if (!json.data) return [];

  return json.data;
}

export async function getCaseStudy(
  region: string,
  slug: string
): Promise<CaseStudy | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/case-studies?filters[region][$eq]=${region}&filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<CaseStudy[]> = await res.json();

  if (!json.data || json.data.length === 0) return null;

  return json.data[0];
}

export async function getAboutPage(region: string): Promise<AboutPage | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/about-pages?filters[region][$eq]=${region}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<AboutPage[]> = await res.json();

  if (!json.data || json.data.length === 0) return null;

  return json.data[0];
}

export async function getContactPage(
  region: string
): Promise<ContactPage | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/contact-pages?filters[region][$eq]=${region}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<ContactPage[]> = await res.json();

  if (!json.data || json.data.length === 0) return null;

  return json.data[0];
}
