export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ClipboardList } from "lucide-react";
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
              Real-World Impact
            </p>
            <h1 className="font-condensed font-extrabold text-4xl md:text-5xl uppercase text-white leading-tight tracking-tight">
              Case{" "}
              <span className="font-accent italic font-normal normal-case text-orange-500">
                Studies
              </span>
            </h1>
            <p className="font-body text-lg text-white/70 mt-6 max-w-2xl mx-auto">
              Real-world examples of our electrical safety projects across{" "}
              {COUNTRY_NAME}.
            </p>
          </div>
        </section>

        {/* COMING SOON */}
        <section className="bg-[#F8FAFC] py-24">
          <div className="max-w-2xl mx-auto rounded-2xl rounded-tr-none bg-white p-12 text-center border border-gray-100">
            <ClipboardList className="text-orange-500 w-12 h-12 mx-auto mb-6" />
            <h2 className="font-condensed font-bold text-2xl text-[#0B1A2F] uppercase">
              Coming Soon
            </h2>
            <p className="font-body text-gray-600 mt-4 max-w-md mx-auto leading-relaxed">
              We&apos;re preparing a library of case studies showing our
              electrical safety work across {COUNTRY_NAME} — including arc flash
              studies, {config.primaryStandard} compliance audits, and power
              system upgrades. Check back soon, or reach out now to discuss your
              project.
            </p>
            <Link
              href={config.contactPath}
              className="mt-8 inline-flex items-center gap-3 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold uppercase px-8 py-3 rounded-full transition-colors text-sm tracking-wide"
            >
              Discuss Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase leading-tight">
              Have a Project in Mind?
            </h2>
            <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
              Talk to our engineers about your next power system study.
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
