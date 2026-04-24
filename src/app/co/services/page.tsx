import { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Zap } from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { SouthAmericaFooter } from "@/components/south-america-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["co"];
import { getServicesByRegion, ServicePage } from "@/lib/strapi";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electrical Safety Services Colombia | Carelabs",
  description:
    "Discover Carelabs' Colombia electrical safety services — arc flash studies, short circuit analysis, load flow analysis, and relay coordination aligned with RETIE and NTC 2050.",
  alternates: {
    canonical: "https://carelabz.com/co/service/",
    languages: {
      "en-CO": "https://carelabz.com/co/service/",
      "x-default": "https://carelabz.com/co/service/",
    },
  },
  openGraph: {
    title: "Power System Engineering Services in Colombia | Carelabs",
    description:
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across Colombia.",
    url: "https://carelabz.com/co/service/",
    siteName: "Carelabs",
    type: "website",
    locale: "en_CO",
  },
  twitter: {
    card: "summary_large_image",
    title: "Power System Engineering Services in Colombia | Carelabs",
    description:
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across Colombia.",
  },
};

function getServiceHref(service: ServicePage): string {
  const slug = service.slug;
  const urlSlug = slug.endsWith("-co") ? slug.slice(0, -3) : slug;
  return `/co/${urlSlug}/`;
}

export default async function COServicesIndexPage() {
  const services = await getServicesByRegion("co");

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: "co",
      countryName: "Colombia",
      countryIso2: "CO",
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      "https://carelabz.com/co/service/",
      "Power System Engineering Services in Colombia | Carelabs",
      "Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across Colombia.",
      "en-CO"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/co/" },
      { name: "Services", url: "https://carelabz.com/co/service/" },
    ]),
  ]);

  return (
    <div className="sa-root">
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* HERO */}
      <section
        className="sa-hero-bg relative overflow-hidden"
        style={{ paddingTop: "8rem", paddingBottom: "6rem" }}
      >
        <div className="sa-hero-shape" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          <div className="mx-auto max-w-3xl text-center">
            <span
              className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(241,92,48,0.18)",
                color: "#F15C30",
                fontFamily: "var(--sa-font-body)",
                fontWeight: 600,
              }}
            >
              Colombia Electrical Engineering
            </span>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                lineHeight: 1.1,
                letterSpacing: "-0.02em",
              }}
            >
              Power System Analysis for Your Specific Needs
            </h1>
            <p
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "1.125rem",
                lineHeight: 1.65,
                maxWidth: "44rem",
                margin: "0 auto",
              }}
            >
              Comprehensive electrical safety services designed to keep your
              facilities compliant with RETIE, your workers protected, and your
              operations running smoothly — delivered by certified engineers
              across Colombia.
            </p>
          </div>
        </div>
      </section>

      {/* SERVICES GRID */}
      <main id="main-content" style={{ backgroundColor: "#f2f2f4" }} className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          {services.length === 0 ? (
            <p
              className="text-center py-12"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "#9c9b9a",
              }}
            >
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article key={service.id} className="sa-card sa-card-accent p-8">
                  <div
                    className="mb-5 inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: "#e8f4fd",
                      color: "#2575B6",
                    }}
                  >
                    <Zap className="w-6 h-6" />
                  </div>
                  <h2
                    className="mb-3"
                    style={{
                      fontFamily: "var(--sa-font-heading)",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#094d76",
                    }}
                  >
                    {service.title}
                  </h2>
                  {service.metaDescription && (
                    <p
                      className="mb-6 line-clamp-3"
                      style={{
                        fontFamily: "var(--sa-font-body)",
                        color: "#5a5d66",
                        fontSize: "0.95rem",
                        lineHeight: 1.65,
                      }}
                    >
                      {service.metaDescription.length > 160
                        ? service.metaDescription.slice(0, 157) + "…"
                        : service.metaDescription}
                    </p>
                  )}
                  <Link
                    href={getServiceHref(service)}
                    className="inline-flex items-center gap-2 text-sm"
                    style={{
                      fontFamily: "var(--sa-font-body)",
                      fontWeight: 600,
                      color: "#F15C30",
                    }}
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      <SouthAmericaFooter config={config} />
    </div>
  );
}
