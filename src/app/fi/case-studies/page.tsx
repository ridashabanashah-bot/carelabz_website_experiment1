export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ClipboardList, ArrowRight } from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

const CC = "fi";
const config = COUNTRY_CONFIGS[CC];
const PAGE_URL = `https://carelabz.com/${CC}/case-studies/`;

export const metadata: Metadata = {
  title: `Case Studies | Carelabs ${config.countryName}`,
  description: `${config.countryName} electrical safety case studies — arc flash studies, power system analysis, and ${config.primaryStandard} compliance projects. Full portfolio coming soon.`,
  alternates: {
    canonical: PAGE_URL,
    languages: {
      [config.hreflang]: PAGE_URL,
      "x-default": PAGE_URL,
    },
  },
  openGraph: {
    title: `Case Studies | Carelabs ${config.countryName}`,
    description: `${config.countryName} electrical safety case studies from the Carelabs engineering team.`,
    url: PAGE_URL,
    siteName: "Carelabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Case Studies | Carelabs ${config.countryName}`,
    description: `${config.countryName} electrical safety case studies from the Carelabs engineering team.`,
  },
};

export default function CaseStudiesPage() {
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
      PAGE_URL,
      `Case Studies | Carelabs ${config.countryName}`,
      `${config.countryName} electrical safety case studies from the Carelabs engineering team.`,
      config.hreflang
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "Case Studies", url: PAGE_URL },
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

      <main id="main-content">
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
              Portfolio
            </span>
            <h1 className="font-condensed font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase text-white leading-[0.95] tracking-tight">
              Case
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Studies.
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              Selected {config.countryName} projects from the Carelabs power
              system engineering team.
            </p>
          </div>
        </section>

        {/* ---------------- PLACEHOLDER ---------------- */}
        <section className="bg-[#F8FAFC] py-20 lg:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="rounded-2xl bg-white p-10 lg:p-14 text-center border border-[#0B1A2F]/5">
              <div className="w-16 h-16 mx-auto rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8">
                <ClipboardList className="w-7 h-7 text-orange-500" />
              </div>
              <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-4 block">
                Coming Soon
              </span>
              <h2 className="font-condensed font-extrabold text-2xl md:text-4xl uppercase text-[#0B1A2F] leading-[0.95] tracking-tight">
                Case studies are being
                <span className="block font-accent italic font-normal normal-case text-orange-500 mt-2">
                  compiled.
                </span>
              </h2>
              <p className="font-body text-base text-gray-600 mt-6 leading-relaxed max-w-xl mx-auto">
                Our {config.countryName} engagement portfolio will be published
                shortly — arc flash studies, power system analysis, and{" "}
                {config.primaryStandard} compliance projects. In the meantime,
                reach out to discuss your specific requirements.
              </p>
              <div className="mt-8 flex justify-center">
                <Link
                  href={config.contactPath}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
                >
                  Discuss Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
              Ready to Start a
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Project?
              </span>
            </h2>
            <div className="mt-10 flex justify-center">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
              >
                Contact Us
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <NEFooter config={config} />
    </>
  );
}
