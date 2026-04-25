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

const CC = "uk";
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
        {/* ---------------- STATEMENT HERO ---------------- */}
        <section className="relative bg-[#1A3650] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 pb-20 lg:pt-40 lg:pb-28">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
              Portfolio
            </span>
            <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
              Case<br />
              <span className="font-ne-accent italic font-normal text-[#F97316]">
                Studies.
              </span>
            </h1>
            <p className="font-ne-body text-base text-white/40 mt-10 max-w-2xl leading-relaxed">
              Selected {config.countryName} projects from the Carelabs power
              system engineering team.
            </p>
          </div>
        </section>

        {/* ---------------- COMING SOON STATEMENT ---------------- */}
        <section className="bg-[#F0EBE1] py-24 lg:py-32 px-6">
          <div className="max-w-[1200px] mx-auto lg:px-12">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
              Coming Soon
            </span>
            <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-[#1A3650] uppercase leading-[0.95] max-w-3xl">
              Case studies are being
            </h2>
            <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-3">
              compiled.
            </p>
            <p className="font-ne-body text-base md:text-lg text-[#1A3650]/60 mt-10 max-w-2xl leading-relaxed">
              Our {config.countryName} engagement portfolio will be published
              shortly — arc flash studies, power system analysis, and{" "}
              {config.primaryStandard} compliance projects. In the meantime,
              reach out to discuss your specific requirements.
            </p>
            <div className="mt-12">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#243E54] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
              >
                Discuss Your Project
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#1A3650] py-24 lg:py-32 px-6">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
              Ready to start
            </h2>
            <p className="font-ne-accent italic text-3xl md:text-4xl text-[#F97316] mt-3">
              a project?
            </p>
            <div className="mt-12">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
