function getStrapiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

const STRAPI_URL = getStrapiUrl();

export interface TrustBadge {
  label: string;
}

export interface ServiceItem {
  href: string;
  icon: string;
  title: string;
  description: string;
}

export interface WhyFeature {
  icon: string;
  title: string;
  description: string;
}

export interface IndustryItem {
  name: string;
  image: string;
  alt: string;
}

export interface InsightItem {
  category: string;
  title: string;
  description: string;
  image: string;
  alt: string;
  href: string;
}

export interface HomePage {
  id: number;
  documentId: string;
  region: string;
  heroEyebrow: string | null;
  heroHeadline: string | null;
  heroSubtext: string | null;
  heroImage: string | null;
  heroImageAlt: string | null;
  heroPrimaryCtaText: string | null;
  heroPrimaryCtaHref: string | null;
  heroSecondaryCtaText: string | null;
  heroSecondaryCtaHref: string | null;
  trustBadges: TrustBadge[] | null;
  servicesHeading: string | null;
  servicesSubtext: string | null;
  services: ServiceItem[] | null;
  whyHeading: string | null;
  whySubtext: string | null;
  whyFeatures: WhyFeature[] | null;
  industriesHeading: string | null;
  industries: IndustryItem[] | null;
  insightsHeading: string | null;
  insights: InsightItem[] | null;
  ctaBannerHeading: string | null;
  ctaBannerSubtext: string | null;
  ctaBannerPrimaryText: string | null;
  ctaBannerPrimaryHref: string | null;
  ctaBannerSecondaryText: string | null;
  ctaBannerSecondaryHref: string | null;
  footerDescription: string | null;
  footerPhone: string | null;
  footerEmail: string | null;
  footerAddress: string | null;
  metaTitle: string | null;
  metaDescription: string | null;
  seoKeywords: string[] | null;
  ogImage: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export async function getHomePage(region: string): Promise<HomePage | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/home-pages?filters[region][$eq]=${region}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<HomePage[]> = await res.json();

  if (!json.data || json.data.length === 0) return null;

  return json.data[0];
}
