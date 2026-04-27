export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getCaseStudies } from "@/lib/strapi-pages";
import { ScrollReveal } from "@/components/scroll-reveal";

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
      <AENavbar config={config} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1100px] text-center">
          <p className="animate-fade-in-up animation-delay-100 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            Portfolio
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            Case Studies
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            Selected UAE projects from the Carelabs power system engineering team.
          </p>
        </div>
      </section>

      <main id="main-content" className="bg-[#F2F2F4] px-6 py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px]">
          {studies.length === 0 ? (
            <ScrollReveal>
              <div className="mx-auto max-w-3xl border-l-2 border-[#2575B6] bg-white p-12 lg:p-16">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                  Coming Soon
                </p>
                <h2 className="mt-3 font-display text-display-md uppercase tracking-tight text-gray-900">
                  Case studies are being compiled.
                </h2>
                <p className="mt-6 text-base leading-relaxed text-gray-600">
                  Our UAE engagement portfolio will be published shortly — arc flash studies, power system analysis, and {config.primaryStandard} compliance projects. In the meantime, reach out to discuss your specific requirements.
                </p>
                <div className="mt-8">
                  <Link
                    href={config.contactPath}
                    className="inline-flex items-center gap-2 bg-[#F15C30] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
                  >
                    Discuss Your Project
                    <ArrowRight className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </ScrollReveal>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-gray-300 md:grid-cols-2 lg:grid-cols-3">
              {studies.map((study, i) => (
                <ScrollReveal key={study.id} delay={(i % 6) * 80}>
                  <Link
                    href={`/${CC}/case-studies/${study.slug.replace(/-ae$/, "")}/`}
                    className="group flex h-full flex-col bg-white p-8 transition-colors duration-300 hover:bg-[#F2F2F4]"
                  >
                    {study.industry && (
                      <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2575B6]">
                        {study.industry}
                      </span>
                    )}
                    <h2 className="mt-4 flex-1 font-display text-xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6]">
                      {study.title}
                    </h2>
                    {study.excerpt && (
                      <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-gray-600">
                        {study.excerpt}
                      </p>
                    )}
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#F15C30]">
                      Read Case Study
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-[#094D76] py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
              Get Started
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-white">
              Ready to start a project?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <div className="mt-10">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
