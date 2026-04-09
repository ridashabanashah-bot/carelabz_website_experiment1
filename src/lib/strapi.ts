const STRAPI_URL = process.env.STRAPI_URL || "http://localhost:1337";

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

interface StrapiItem<T> {
  id: number;
  documentId: string;
  attributes: T;
}

export interface FaqItem {
  question: string;
  answer: string;
}

export interface ServicePageAttributes {
  title: string;
  slug: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  faqs: FaqItem[];
}

export async function getServicePageBySlug(
  slug: string
): Promise<ServicePageAttributes | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/service-pages?filters[slug][$eq]=${slug}&populate=faqs`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<StrapiItem<ServicePageAttributes>[]> =
    await res.json();

  if (!json.data || json.data.length === 0) return null;

  // Strapi 5 returns flat data (no nested attributes)
  const item = json.data[0];
  return {
    title: item.title ?? item.attributes?.title,
    slug: item.slug ?? item.attributes?.slug,
    body: item.body ?? item.attributes?.body,
    metaTitle: item.metaTitle ?? item.attributes?.metaTitle,
    metaDescription: item.metaDescription ?? item.attributes?.metaDescription,
    faqs: item.faqs ?? item.attributes?.faqs ?? [],
  } as ServicePageAttributes;
}
