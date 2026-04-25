export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getCaseStudies } from "@/lib/strapi-pages";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Case Studies | Carelabs UAE`,
  description: `UAE electrical safety case studies — arc flash studies, power system analysis, and DEWA compliance projects from the Carelabs engineering team.`,
  alternates: {
    canonical: `https://carelabz.com/${CC}/case-studies/`,
    languages: {
      [config.hreflang]: `https://carelabz.com/${CC}/case-studies/`,
      "x-default": `https://carelabz.com/${CC}/case-studies/`,
    },
  },
  openGraph: {
    title: `Case Studies | Carelabs UAE`,
    description: `UAE engagement portfolio from the Carelabs power system engineering team.`,
    url: `https://carelabz.com/${CC}/case-studies/`,
    siteName: "Carelabs",
    type: "website",
    locale: "en_AE",
  },
};

export default async function CaseStudiesPage() {
  const studies = await getCaseStudies(CC);

  return (
    <>
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-6">
            Portfolio
          </p>
          <h1 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            Case Studies
          </h1>
          <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            Selected UAE projects from the Carelabs power system engineering team.
          </p>
        </div>
      </section>

      <main id="main-content" className="bg-[#EBF2F8] py-20 lg:py-28 px-6">
        <div className="max-w-[1200px] mx-auto">
          {studies.length === 0 ? (
            <div className="bg-white border border-[#D4E3F0] p-12 lg:p-16 max-w-3xl mx-auto">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-4 block">
                Coming Soon
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl text-[#0F2847] leading-[0.95]">
                Case studies are being compiled.
              </h2>
              <p className="font-ae-body text-base text-[#0F2847]/60 mt-6 leading-relaxed">
                Our UAE engagement portfolio will be published shortly — arc flash studies, power system analysis, and {config.primaryStandard} compliance projects. In the meantime, reach out to discuss your specific requirements.
              </p>
              <div className="mt-8">
                <Link
                  href={config.contactPath}
                  className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
                >
                  Discuss Your Project
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {studies.map((study) => (
                <Link
                  key={study.id}
                  href={`/${CC}/case-studies/${study.slug.replace(/-ae$/, "")}/`}
                  className="group bg-white border border-[#D4E3F0] p-8 hover:border-[#2D7AB8] transition-colors"
                >
                  {study.industry && (
                    <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.15em] text-[#2D7AB8]">
                      {study.industry}
                    </span>
                  )}
                  <h2 className="font-ae-display text-2xl text-[#0F2847] mt-3 leading-tight group-hover:text-[#1E5A8A] transition-colors">
                    {study.title}
                  </h2>
                  {study.excerpt && (
                    <p className="font-ae-body text-sm text-[#0F2847]/60 mt-4 leading-relaxed line-clamp-3">
                      {study.excerpt}
                    </p>
                  )}
                  <span className="font-ae-nav font-medium text-sm uppercase tracking-[0.12em] text-[#2D7AB8] mt-6 inline-flex items-center gap-2">
                    Read Case Study <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      <section className="bg-[#0F2847] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            Ready to start a project?
          </h2>
          <div className="mt-10">
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
