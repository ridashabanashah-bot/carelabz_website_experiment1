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

const CC = "fi";
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

      {/* ---------------- HERO — left-aligned ---------------- */}
      <section className="relative bg-[#1A3650] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-6 block">
              {config.countryName} · Engineering
            </span>
            <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-6xl uppercase text-white leading-[0.95]">
              Our<br />
              <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                Services.
              </span>
            </h1>
            <p className="font-ne-body text-lg text-white/50 mt-8 max-w-2xl leading-relaxed">
              Comprehensive electrical safety services designed to keep your
              facilities compliant with {config.primaryStandard}, your workers
              protected, and your operations running smoothly.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BAR ---------------- */}
      <div className="bg-[#F9F7F3] py-6 px-6 border-b border-[#1A3650]/5">
        <p className="text-center font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40">
          {config.standards.slice(0, 5).join("  ·  ")}
        </p>
      </div>

      {/* ---------------- SERVICES — editorial numbered list ---------------- */}
      <main id="main-content" className="bg-[#F9F7F3] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          {services.length === 0 ? (
            <p className="text-center font-ne-body text-gray-500 py-12">
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {services.map((service, i) => (
                <Link
                  key={service.id}
                  href={getServiceHref(service)}
                  className="group flex items-start gap-6 py-8 px-4 border-b border-[#1A3650]/10 hover:bg-[#F0EBE1] transition-colors"
                >
                  <span className="font-ne-display font-black text-3xl text-[#1A3650]/10 leading-none shrink-0 w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 font-semibold">
                      IEEE 1584 · {config.primaryStandard}
                    </span>
                    <h2 className="font-ne-display font-bold text-lg uppercase text-[#1A3650] mt-2 group-hover:text-orange-500 transition-colors">
                      {service.title}
                    </h2>
                    {service.metaDescription && (
                      <p className="font-ne-body text-sm text-gray-500 mt-2 line-clamp-2 leading-relaxed">
                        {service.metaDescription.length > 160
                          ? service.metaDescription.slice(0, 157) + "…"
                          : service.metaDescription}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6 border-t border-[#1A3650]/5">
        <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
          <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
            Ready to schedule a study?
          </h2>
          <div className="mt-8">
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
