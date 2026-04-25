export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getCaseStudy, type CaseStudy } from "@/lib/strapi-pages";
import { JsonLd } from "@/components/JsonLd";

const CC = "ae";
const COUNTRY_NAME = "United Arab Emirates";
const HREFLANG = "en-AE";
const config = COUNTRY_CONFIGS[CC];

interface PageProps {
  params: { slug: string };
}

async function fetchWithFallback(slug: string): Promise<CaseStudy | null> {
  const withSuffix = await getCaseStudy(CC, `${slug}-${CC}`);
  if (withSuffix) return withSuffix;
  return getCaseStudy(CC, slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const study = await fetchWithFallback(params.slug);
  if (!study) return { title: `Not Found | Carelabs ${COUNTRY_NAME}` };
  const url = `https://carelabz.com/${CC}/case-studies/${params.slug}/`;
  return {
    title: study.metaTitle ?? `${study.title} | Carelabs ${COUNTRY_NAME}`,
    description: study.metaDescription ?? study.excerpt ?? undefined,
    alternates: {
      canonical: url,
      languages: { [HREFLANG]: url, "x-default": url },
    },
    openGraph: {
      title: study.metaTitle ?? `${study.title} | Carelabs ${COUNTRY_NAME}`,
      description: study.metaDescription ?? study.excerpt ?? undefined,
      url,
      siteName: "Carelabs",
      type: "article",
      locale: "en_AE",
    },
  };
}

export default async function CaseStudyPage({ params }: PageProps) {
  const study = await fetchWithFallback(params.slug);
  if (!study) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: study.title,
    description: study.metaDescription ?? study.excerpt ?? undefined,
    inLanguage: HREFLANG,
    publisher: {
      "@type": "Organization",
      name: "Carelabs",
      url: "https://carelabz.com",
    },
    url: `https://carelabz.com/${CC}/case-studies/${params.slug}/`,
  };

  return (
    <>
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-20 lg:pt-44 lg:pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-3xl mx-auto relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-ae-nav text-xs uppercase tracking-[0.15em] text-white/40 mb-6 flex-wrap">
            <Link href={`/${CC}/`} className="hover:text-[#2D7AB8] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={config.caseStudyPath ?? "/ae/case-studies/"} className="hover:text-[#2D7AB8] transition-colors">Case Studies</Link>
          </nav>
          {study.industry && (
            <span className="inline-block font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-4">
              {study.industry}
            </span>
          )}
          <h1 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-white leading-[0.95]">
            {study.title}
          </h1>
          {study.client && (
            <p className="font-ae-body text-base text-white/40 mt-6">Client: <span className="text-white/70">{study.client}</span></p>
          )}
        </div>
      </section>

      {/* RESULTS BAND */}
      {study.results && study.results.length > 0 && (
        <section className="bg-[#163560] py-12 px-6">
          <div className="max-w-[1200px] mx-auto grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-px bg-[#1E5A8A]/20">
            {study.results.map((r, i) => (
              <div key={i} className="bg-[#163560] p-6 text-center">
                <p className="font-ae-display text-3xl md:text-4xl text-white">{r.value}</p>
                <p className="font-ae-nav text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mt-2">
                  {r.metric}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* BODY */}
      {study.body && (
        <section className="bg-[#FAFBFC] py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:font-ae-display prose-headings:text-[#0F2847] prose-headings:font-normal prose-p:text-[#0F2847]/70 prose-p:font-ae-body prose-strong:text-[#0F2847] prose-a:text-[#2D7AB8] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: marked(study.body) as string }}
            />
          </div>
        </section>
      )}

      {/* CHALLENGE / SOLUTION */}
      {(study.challenge || study.solution) && (
        <section className="bg-[#EBF2F8] py-20 lg:py-28 px-6">
          <div className="max-w-[1100px] mx-auto grid lg:grid-cols-2 gap-10">
            {study.challenge && (
              <div>
                <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                  Challenge
                </span>
                <p className="font-ae-body text-base text-[#0F2847]/70 leading-relaxed">
                  {study.challenge}
                </p>
              </div>
            )}
            {study.solution && (
              <div>
                <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                  Solution
                </span>
                <p className="font-ae-body text-base text-[#0F2847]/70 leading-relaxed">
                  {study.solution}
                </p>
              </div>
            )}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#0F2847] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            {study.ctaText ?? "Have a similar challenge?"}
          </h2>
          <p className="font-ae-body text-lg text-[#5A8FB4] mt-6">
            Tell us about your facility — we&apos;ll respond within one business day.
          </p>
          <div className="mt-10">
            <Link
              href={study.ctaHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              Discuss Your Project
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
