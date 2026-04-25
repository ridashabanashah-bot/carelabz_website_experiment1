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

const CC = "se";
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

      {/* ---------------- STATEMENT HERO ---------------- */}
      <section className="relative min-h-[60vh] flex items-center bg-[#1A3650] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 py-32">
          <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
            {config.countryName} · Engineering
          </span>
          <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Our<br />
            <span className="font-ne-accent italic font-normal text-[#F97316]">
              Services.
            </span>
          </h1>
          <p className="font-ne-body text-base text-white/40 mt-10 max-w-xl leading-relaxed">
            Comprehensive electrical safety services designed to keep your
            facilities compliant with {config.primaryStandard}, your workers
            protected, and your operations running smoothly.
          </p>
        </div>
      </section>

      {/* ---------------- STATEMENT BAND ---------------- */}
      <section className="bg-[#F97316] py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="font-ne-display font-black text-xl md:text-2xl lg:text-3xl text-white uppercase leading-tight tracking-tight">
            {config.standards.slice(0, 5).join(" · ")}
          </p>
        </div>
      </section>

      {/* ---------------- SERVICES — full-width alternating rows ---------------- */}
      <main id="main-content">
        {services.length === 0 ? (
          <section className="bg-[#F9F7F3] py-32 px-6 text-center">
            <p className="font-ne-body text-base text-[#1A3650]/50">
              Services are currently being loaded. Please check back shortly.
            </p>
          </section>
        ) : (
          <section>
            {services.map((service, i) => (
              <Link
                key={service.id}
                href={getServiceHref(service)}
                className={`group block ${
                  i % 2 === 0 ? "bg-[#F9F7F3]" : "bg-[#F0EBE1]"
                }`}
              >
                <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                  <div className="flex items-start gap-8 flex-1 min-w-0">
                    <span className="font-ne-display font-black text-5xl lg:text-6xl text-[#1A3650]/[0.08] leading-none shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div>
                      <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold">
                        IEEE 1584 · {config.primaryStandard}
                      </span>
                      <h2 className="font-ne-display font-black text-2xl lg:text-3xl text-[#1A3650] uppercase leading-tight mt-2 group-hover:text-[#F97316] transition-colors">
                        {service.title}
                      </h2>
                      {service.metaDescription && (
                        <p className="font-ne-body text-sm text-[#1A3650]/50 mt-3 max-w-xl leading-relaxed">
                          {service.metaDescription.length > 160
                            ? service.metaDescription.slice(0, 157) + "…"
                            : service.metaDescription}
                        </p>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-3 shrink-0">
                    <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore
                    </span>
                    <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-[#F97316] transition-colors" />
                  </div>
                </div>
              </Link>
            ))}
          </section>
        )}
      </main>

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="bg-[#1A3650] py-24 lg:py-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
            Ready to schedule
          </h2>
          <p className="font-ne-accent italic text-3xl md:text-4xl text-[#F97316] mt-3">
            a study?
          </p>
          <div className="mt-12">
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
