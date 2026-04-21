import { Metadata } from "next";
import Link from "next/link";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["kr"];
import { getServicesByRegion } from "@/lib/strapi";
import { ServicePage } from "@/lib/strapi";
import { buildJsonLd, getRegionOrganizationSchema, getWebPageSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electrical Safety Services South Korea | Carelabs",
  description:
    "Discover Carelabs' South Korean electrical safety services — arc flash studies, short circuit analysis, load flow analysis, and relay coordination aligned with KEC and the KEC.",
  alternates: {
    canonical: "https://carelabz.com/kr/our-services/",
    languages: {
      "en-KR": "https://carelabz.com/kr/our-services/",
      "x-default": "https://carelabz.com/kr/our-services/",
    },
  },
  openGraph: {
    title: "Power System Engineering Services in South Korea | Carelabs",
    description:
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across South Korea.",
    url: "https://carelabz.com/kr/our-services/",
    siteName: "Carelabs",
    type: "website",
    locale: "en_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power System Engineering Services in South Korea | Carelabs",
    description:
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across South Korea.",
  },
};

function getServiceHref(service: ServicePage): string {
  const slug = service.slug;
  const urlSlug = slug.endsWith("-ca") ? slug.slice(0, -3) : slug;
  return `/kr/services/${urlSlug}/`;
}

export default async function KRServicesIndexPage() {
  const services = await getServicesByRegion("kr");

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({ cc: "kr", countryName: "South Korea", countryIso2: "KR", phone: config.phone, email: config.email, addressLocality: config.address }),
    getWebPageSchema(
      "https://carelabz.com/kr/our-services/",
      "Power System Engineering Services in South Korea | Carelabs",
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across South Korea.",
      "en-KR"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/kr/" },
      { name: "Services", url: "https://carelabz.com/kr/our-services/" },
    ]),
  ]);

  return (
    <>
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="bg-[#EEF4FF] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-3">
              South Korean Electrical Engineering
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#1A2538] sm:text-5xl lg:text-6xl mb-6">
              Power System Analysis for Your Specific Needs
            </h1>
            <p className="text-lg text-[#374151] leading-relaxed">
              Comprehensive electrical safety services designed to keep your
              facilities compliant with KEC, your workers protected, and
              your operations running smoothly — delivered by certified engineers across South Korea.
            </p>
          </div>
        </div>
      </section>

      <main id="main-content" className="bg-offWhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <p className="text-center text-slate-500 py-12">
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-bold text-navy mb-3">
                    {service.title}
                  </h2>
                  {service.metaDescription && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {service.metaDescription.length > 160
                        ? service.metaDescription.slice(0, 157) + "…"
                        : service.metaDescription}
                    </p>
                  )}
                  <Link
                    href={getServiceHref(service)}
                    className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Learn More →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <RegionFooter config={config} />
    </>
  );
}
