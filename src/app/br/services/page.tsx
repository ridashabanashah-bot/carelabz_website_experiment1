import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicesByRegion, ServicePage } from "@/lib/strapi";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const CC = "br";
const COUNTRY_NAME = "Brazil";
const HREFLANG = "en-BR";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Electrical Safety Services ${COUNTRY_NAME} | Carelabs`,
  description: `Discover Carelabs' ${COUNTRY_NAME} electrical safety services — arc flash studies, short circuit analysis, load flow analysis, and relay coordination aligned with ${config.primaryStandard}.`,
  alternates: {
    canonical: `https://carelabz.com/${CC}/service/`,
    languages: {
      [HREFLANG]: `https://carelabz.com/${CC}/service/`,
      "x-default": `https://carelabz.com/${CC}/service/`,
    },
  },
  openGraph: {
    title: `Power System Engineering Services in ${COUNTRY_NAME} | Carelabs`,
    description: `Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across ${COUNTRY_NAME}.`,
    url: `https://carelabz.com/${CC}/service/`,
    siteName: "Carelabs",
    type: "website",
    locale: HREFLANG.replace("-", "_"),
  },
  twitter: {
    card: "summary_large_image",
    title: `Power System Engineering Services in ${COUNTRY_NAME} | Carelabs`,
    description: `Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across ${COUNTRY_NAME}.`,
  },
};

function getServiceHref(service: ServicePage): string {
  const slug = service.slug;
  const urlSlug = slug.endsWith(`-${CC}`) ? slug.slice(0, -3) : slug;
  return `/${CC}/${urlSlug}/`;
}

export default async function BRServicesIndexPage() {
  const services = await getServicesByRegion(CC);

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: COUNTRY_NAME,
      countryIso2: CC.toUpperCase(),
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com/${CC}/service/`,
      `Power System Engineering Services in ${COUNTRY_NAME} | Carelabs`,
      `Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across ${COUNTRY_NAME}.`,
      HREFLANG
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "Services", url: `https://carelabz.com/${CC}/service/` },
    ]),
  ]);

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* HERO */}
        <section className="relative bg-[#0B1A2F] py-20 lg:py-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
              {COUNTRY_NAME} Electrical Engineering
            </p>
            <h1 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-tight tracking-tight">
              Our{" "}
              <span className="font-accent italic font-normal normal-case text-orange-500">
                Services
              </span>
            </h1>
            <p className="font-body text-lg text-white/70 mt-6 max-w-2xl mx-auto">
              Comprehensive electrical safety services designed to keep your
              facilities compliant with {config.primaryStandard}, your workers
              protected, and your operations running smoothly.
            </p>
          </div>
        </section>

        {/* SERVICES GRID */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            {services.length === 0 ? (
              <p className="font-body text-center py-12 text-gray-500">
                Services are currently being loaded. Please check back shortly.
              </p>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {services.map((service, i) => (
                  <Link
                    key={service.id}
                    href={getServiceHref(service)}
                    className="relative rounded-2xl rounded-tr-none overflow-hidden bg-white border border-gray-100 hover:shadow-lg transition-shadow p-6 pt-4 block group"
                  >
                    <span
                      className="font-condensed font-extrabold text-5xl text-orange-500/15 absolute top-4 right-4 leading-none"
                      aria-hidden="true"
                    >
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h2 className="font-condensed font-bold text-xl text-[#0B1A2F] uppercase mt-2 pr-12">
                      {service.title}
                    </h2>
                    {service.metaDescription && (
                      <p className="font-body text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                        {service.metaDescription.length > 200
                          ? service.metaDescription.slice(0, 197) + "…"
                          : service.metaDescription}
                      </p>
                    )}
                    <span className="font-condensed font-semibold text-orange-500 group-hover:text-orange-600 mt-4 inline-flex items-center gap-1 uppercase tracking-wider text-sm">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase leading-tight">
              Ready to Get Started?
            </h2>
            <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
              Schedule a free consultation with our certified engineers.
            </p>
            <Link
              href={config.contactPath}
              className="mt-8 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide"
            >
              Contact Us
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <SAFooter config={config} />
    </div>
  );
}
