export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicesByRegion } from "@/lib/strapi";
import type { ServicePage } from "@/lib/strapi";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

const CC = "ie";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Electrical Safety Services ${config.countryName} | Carelabs`,
  description: `Discover Carelabs' ${config.countryName} electrical safety services — arc flash studies, short circuit analysis, load flow analysis, and relay coordination aligned with ${config.primaryStandard}.`,
  alternates: {
    canonical: `https://carelabz.com${config.servicesIndexPath}`,
    languages: {
      [config.hreflang]: `https://carelabz.com${config.servicesIndexPath}`,
      "x-default": `https://carelabz.com${config.servicesIndexPath}`,
    },
  },
  openGraph: {
    title: `Power System Engineering Services in ${config.countryName} | Carelabs`,
    description: `Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across ${config.countryName}.`,
    url: `https://carelabz.com${config.servicesIndexPath}`,
    siteName: "Carelabs",
    type: "website",
    locale: config.hreflang.replace("-", "_"),
  },
  twitter: {
    card: "summary_large_image",
    title: `Power System Engineering Services in ${config.countryName} | Carelabs`,
    description: `Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across ${config.countryName}.`,
  },
};

function getServiceHref(service: ServicePage): string {
  const suffix = `-${CC}`;
  const urlSlug = service.slug.endsWith(suffix)
    ? service.slug.slice(0, -suffix.length)
    : service.slug;
  return config.serviceDetailPattern.replace("{slug}", urlSlug);
}

export default async function ServicesIndexPage() {
  const services = await getServicesByRegion(CC);

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: config.countryName,
      countryIso2: config.dialCodeCountryIso2,
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com${config.servicesIndexPath}`,
      `Power System Engineering Services in ${config.countryName} | Carelabs`,
      `Professional electrical safety services including arc flash studies, short circuit analysis, and power system engineering across ${config.countryName}.`,
      config.hreflang
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      {
        name: "Services",
        url: `https://carelabz.com${config.servicesIndexPath}`,
      },
    ]),
  ]);

  return (
    <>
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* ---------------- HERO ---------------- */}
      <section className="relative bg-[#0B1A2F] pt-36 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-4xl mx-auto text-center">
          <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
            {config.countryName} Electrical Engineering
          </span>
          <h1 className="font-condensed font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase text-white leading-[0.95] tracking-tight">
            Our
            <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
              Services.
            </span>
          </h1>
          <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
            Comprehensive electrical safety services designed to keep your
            facilities compliant with {config.primaryStandard}, your workers
            protected, and your operations running smoothly.
          </p>
        </div>
      </section>

      {/* ---------------- SERVICES GRID ---------------- */}
      <main id="main-content" className="bg-[#F8FAFC] py-20 lg:py-28 px-6">
        <div className="max-w-[1400px] mx-auto">
          {services.length === 0 ? (
            <p className="text-center font-body text-gray-500 py-12">
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={getServiceHref(service)}
                  className="group rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 block"
                >
                  <div
                    className="relative h-48 overflow-hidden bg-[#0B1A2F]"
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0 opacity-10 group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #F97316 1.5px, transparent 1.5px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
                      IEEE 1584 · {config.primaryStandard}
                    </span>
                    <h2 className="font-condensed font-bold text-xl uppercase text-[#0B1A2F] mt-2 group-hover:text-orange-500 transition-colors leading-tight">
                      {service.title}
                    </h2>
                    {service.metaDescription && (
                      <p className="font-body text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                        {service.metaDescription.length > 160
                          ? service.metaDescription.slice(0, 157) + "…"
                          : service.metaDescription}
                      </p>
                    )}
                    <span className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 mt-4 inline-flex items-center gap-2">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
            Ready to Schedule a
            <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
              Study?
            </span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <NEFooter config={config} />
    </>
  );
}
