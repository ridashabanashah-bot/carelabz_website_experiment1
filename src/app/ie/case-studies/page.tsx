export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const CC = "ie";
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
                Portfolio
              </span>
              <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-6xl uppercase text-white leading-[0.95]">
                Case<br />
                <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                  Studies.
                </span>
              </h1>
              <p className="font-ne-body text-lg text-white/50 mt-8 max-w-2xl leading-relaxed">
                Selected {config.countryName} projects from the Carelabs power
                system engineering team.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- COMING SOON — left-aligned editorial ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12">
            <div className="max-w-3xl border-t border-b border-[#1A3650]/10 py-14">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 font-semibold mb-4 block">
                Coming Soon
              </span>
              <h2 className="font-ne-display font-black text-2xl md:text-4xl uppercase text-[#1A3650] leading-[0.95]">
                Case studies are being{" "}
                <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                  compiled.
                </span>
              </h2>
              <p className="font-ne-body text-base text-gray-600 mt-6 leading-relaxed">
                Our {config.countryName} engagement portfolio will be published
                shortly — arc flash studies, power system analysis, and{" "}
                {config.primaryStandard} compliance projects. In the meantime,
                reach out to discuss your specific requirements.
              </p>
              <div className="mt-8">
                <Link
                  href={config.contactPath}
                  className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
                >
                  Discuss Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6 border-t border-[#1A3650]/5">
          <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
            <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
              Ready to start a project?
            </h2>
            <div className="mt-8">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
