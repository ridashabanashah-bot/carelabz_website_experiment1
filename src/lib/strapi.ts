function getStrapiUrl(): string {
  const raw = process.env.NEXT_PUBLIC_STRAPI_URL || "http://localhost:1337";
  if (raw.startsWith("http://") || raw.startsWith("https://")) return raw;
  return `https://${raw}`;
}

const STRAPI_URL = getStrapiUrl();

export interface FaqItem {
  id?: number;
  question: string;
  answer: string;
}

export interface TrustBadge {
  label: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface ProcessStep {
  number: number;
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

export interface NavLink {
  label: string;
  href: string;
}

export interface ServicePage {
  id: number;
  documentId: string;
  title: string;
  slug: string;
  body: string;
  metaTitle: string;
  metaDescription: string;
  faqs: FaqItem[];
  eyebrow: string | null;
  heroImagePath: string | null;
  heroImageAlt: string | null;
  ctaPrimaryText: string | null;
  ctaPrimaryHref: string | null;
  ctaSecondaryText: string | null;
  ctaSecondaryHref: string | null;
  trustBadges: TrustBadge[] | null;
  featuresHeading: string | null;
  featuresSubtext: string | null;
  features: FeatureItem[] | null;
  safetyEyebrow: string | null;
  safetyHeading: string | null;
  safetyBody: string | null;
  safetyBullets: string[] | null;
  safetyImage: string | null;
  safetyImageAlt: string | null;
  reportsEyebrow: string | null;
  reportsHeading: string | null;
  reportsBody: string | null;
  reportsBullets: string[] | null;
  reportsImage: string | null;
  reportsImageAlt: string | null;
  processHeading: string | null;
  processSteps: ProcessStep[] | null;
  industriesHeading: string | null;
  industries: IndustryItem[] | null;
  insightsHeading: string | null;
  insights: InsightItem[] | null;
  ctaBannerHeading: string | null;
  ctaBannerBody: string | null;
  ctaBannerPrimaryText: string | null;
  ctaBannerPrimaryHref: string | null;
  ctaBannerSecondaryText: string | null;
  ctaBannerSecondaryHref: string | null;
  footerDescription: string | null;
  footerPhone: string | null;
  footerEmail: string | null;
  footerAddress: string | null;
  region: string | null;
  navLinks: NavLink[] | null;
  definitionalLede: string | null;
  lastUpdated: string | null;
  seoKeywords: string[] | null;
  faqSectionHeading: string | null;
  createdAt: string;
  updatedAt: string;
  publishedAt: string;
}

interface StrapiResponse<T> {
  data: T;
  meta: Record<string, unknown>;
}

export async function getServicePageBySlug(
  slug: string
): Promise<ServicePage | null> {
  const res = await fetch(
    `${STRAPI_URL}/api/service-pages?filters[slug][$eq]=${slug}&populate=*`,
    {
      headers: {
        Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
      },
      next: { revalidate: 60 },
    }
  );

  if (!res.ok) return null;

  const json: StrapiResponse<ServicePage[]> = await res.json();

  if (!json.data || json.data.length === 0) return null;

  return json.data[0];
}

export async function getServicesByRegion(region: string): Promise<ServicePage[]> {
  try {
    const res = await fetch(
      `${STRAPI_URL}/api/service-pages?filters[region][$eq]=${region}&populate=*`,
      {
        headers: {
          Authorization: `Bearer ${process.env.STRAPI_API_TOKEN}`,
        },
        next: { revalidate: 60 },
      }
    );

    if (!res.ok) return [];

    const json: StrapiResponse<ServicePage[]> = await res.json();

    if (!json.data || json.data.length === 0) return [];

    return json.data;
  } catch {
    return [];
  }
}
