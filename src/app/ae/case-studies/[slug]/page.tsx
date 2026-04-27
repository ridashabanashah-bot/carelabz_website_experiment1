export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getCaseStudy, type CaseStudy } from "@/lib/strapi-pages";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/scroll-reveal";

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
      <AENavbar config={config} />
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-20 pt-36 lg:pb-24 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="animate-fade-in-up animation-delay-100 mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/40"
          >
            <Link href={`/${CC}/`} className="transition-colors duration-300 hover:text-white">
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={config.caseStudyPath ?? "/ae/case-studies/"}
              className="transition-colors duration-300 hover:text-white"
            >
              Case Studies
            </Link>
          </nav>
          {study.industry && (
            <span className="animate-fade-in-up animation-delay-200 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
              {study.industry}
            </span>
          )}
          <h1 className="animate-fade-in-up animation-delay-300 mt-4 font-display text-display-hero uppercase tracking-tight text-white">
            {study.title}
          </h1>
          {study.client && (
            <p className="animate-fade-in-up animation-delay-400 mt-6 text-base text-white/40">
              Client: <span className="text-white/70">{study.client}</span>
            </p>
          )}
        </div>
      </section>

      {/* RESULTS BAND */}
      {study.results && study.results.length > 0 && (
        <section className="bg-white py-12">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="grid grid-cols-2 gap-px bg-gray-200 md:grid-cols-3 lg:grid-cols-6">
              {study.results.map((r, i) => (
                <ScrollReveal key={i} delay={i * 80}>
                  <div className="h-full bg-white p-6 text-center">
                    <p className="font-display text-3xl text-[#2575B6] md:text-4xl">
                      {r.value}
                    </p>
                    <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                      {r.metric}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* BODY */}
      {study.body && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <div
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-gray-900 prose-headings:font-normal prose-p:text-gray-600 prose-strong:text-gray-900 prose-a:text-[#2575B6] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: marked(study.body) as string }}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CHALLENGE / SOLUTION */}
      {(study.challenge || study.solution) && (
        <section className="bg-[#F2F2F4] px-6 py-24 lg:py-32">
          <div className="mx-auto grid max-w-[1100px] gap-4 lg:grid-cols-2">
            {study.challenge && (
              <ScrollReveal>
                <div className="h-full border-l-2 border-[#2575B6] bg-white p-8 transition-colors duration-300 hover:border-[#F15C30]">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                    Challenge
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-gray-600">
                    {study.challenge}
                  </p>
                </div>
              </ScrollReveal>
            )}
            {study.solution && (
              <ScrollReveal delay={100}>
                <div className="h-full border-l-2 border-[#2575B6] bg-white p-8 transition-colors duration-300 hover:border-[#F15C30]">
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                    Solution
                  </p>
                  <p className="mt-4 text-base leading-relaxed text-gray-600">
                    {study.solution}
                  </p>
                </div>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

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
              {study.ctaText ?? "Have a similar challenge?"}
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Tell us about your facility — we&apos;ll respond within one business day.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={study.ctaHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Discuss Your Project
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
