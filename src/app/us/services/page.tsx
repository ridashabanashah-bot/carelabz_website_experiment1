import { Metadata } from "next";
import Link from "next/link";
import { StickyNavbar } from "@/components/sticky-navbar";
import USFooter from "@/components/us-footer";
import { getServicesByRegion } from "@/lib/strapi";
import { ServicePage } from "@/lib/strapi";
import { buildJsonLd, getOrganizationSchema, getWebPageSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Achieve Compliance with OSHA and IEEE Standards | CareLabs USA",
  description:
    "Discover our comprehensive electrical safety services ensuring compliance with USA standards. Arc flash studies, short circuit analysis, and power system engineering.",
  alternates: {
    canonical: "https://carelabz.com/us/services/",
    languages: {
      "en-US": "https://carelabz.com/us/services/",
      "x-default": "https://carelabz.com/us/services/",
    },
  },
  openGraph: {
    title: "Power System Engineering Services in the USA | CareLabs",
    description:
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across the USA.",
    url: "https://carelabz.com/us/services/",
    siteName: "CareLabs",
    type: "website",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power System Engineering Services in the USA | CareLabs",
    description:
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across the USA.",
  },
};

// Map Strapi slug to URL path
function getServiceHref(service: ServicePage): string {
  const slug = service.slug;
  // Strip "-us" suffix
  const urlSlug = slug.endsWith("-us") ? slug.slice(0, -3) : slug;
  // Determine category
  if (urlSlug === "electrical-safety-inspection") {
    return `/us/services/inspection/${urlSlug}/`;
  }
  return `/us/services/study-analysis/${urlSlug}/`;
}

export default async function ServicesIndexPage() {
  const services = await getServicesByRegion("us");

  const jsonLd = buildJsonLd([
    getOrganizationSchema(),
    getWebPageSchema(
      "https://carelabz.com/us/services/",
      "Power System Engineering Services in the USA | CareLabs",
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across the USA."
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/us/" },
      { name: "Services", url: "https://carelabz.com/us/services/" },
    ]),
  ]);

  return (
    <>
      <StickyNavbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Section */}
      <section className="bg-[#EEF4FF] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-3">
              USA Electrical Engineering
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#1A2538] sm:text-5xl lg:text-6xl mb-6">
              Power System Analysis for Your Specific Needs
            </h1>
            <p className="text-lg text-[#374151] leading-relaxed">
              Comprehensive electrical safety services designed to keep your
              facilities compliant, your workers protected, and your operations
              running smoothly — delivered by certified engineers across the
              United States.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
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

      <USFooter />
    </>
  );
}
