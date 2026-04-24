export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";

const CC = "br";
const COUNTRY_NAME = "Brazil";
const HREFLANG = "en-BR";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Case Studies | Carelabs ${COUNTRY_NAME}`,
  description: `Explore Carelabs electrical safety case studies and project results in ${COUNTRY_NAME}.`,
  alternates: {
    canonical: `https://carelabz.com/${CC}/case-studies/`,
    languages: {
      [HREFLANG]: `https://carelabz.com/${CC}/case-studies/`,
      "x-default": `https://carelabz.com/${CC}/case-studies/`,
    },
  },
  openGraph: {
    title: `Case Studies | Carelabs ${COUNTRY_NAME}`,
    description: `Explore Carelabs electrical safety case studies and project results in ${COUNTRY_NAME}.`,
    url: `https://carelabz.com/${CC}/case-studies/`,
    siteName: "Carelabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Case Studies | Carelabs ${COUNTRY_NAME}`,
    description: `Explore Carelabs electrical safety case studies and project results in ${COUNTRY_NAME}.`,
  },
};

export default function BRCaseStudiesPage() {
  return (
    <div className="bg-white">
      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* Hero */}
        <section className="relative bg-[#0B1A2F] overflow-hidden flex items-center justify-center py-24 lg:py-32">
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
              Real-World Impact
            </p>
            <h1 className="font-condensed font-extrabold text-4xl md:text-5xl text-white uppercase leading-tight">
              Case Studies
            </h1>
          </div>
        </section>

        {/* Placeholder */}
        <section className="bg-[#F8FAFC] py-24 lg:py-32">
          <div className="max-w-3xl mx-auto px-6 lg:px-12 text-center">
            <div className="w-1 h-16 bg-orange-500 mx-auto mb-8" />
            <h2 className="font-condensed font-extrabold text-2xl md:text-3xl text-[#0B1A2F] uppercase mb-6">
              Coming Soon
            </h2>
            <p className="font-body text-lg text-gray-600 leading-relaxed">
              Case studies coming soon. Check back for real-world examples of
              our electrical safety projects across {COUNTRY_NAME}.
            </p>
            <Link
              href={config.contactPath}
              className="mt-10 inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold uppercase tracking-wide px-10 py-4 rounded-full transition-colors"
            >
              Discuss Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <SAFooter config={config} />
    </div>
  );
}
