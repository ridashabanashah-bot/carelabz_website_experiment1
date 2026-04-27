export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ChevronDown, Plus } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";
import { RotatingWord } from "@/components/rotating-word";
import { getHomePage } from "@/lib/strapi-home";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(/\s*-\s*Carelabs\s*(UAE|United Arab Emirates|Dubai)\s*$/i, "")
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage(CC);
  return {
    title:
      page?.metaTitle ?? `Carelabs UAE — Electrical Safety & Power System Studies`,
    description:
      page?.metaDescription ??
      `Carelabs delivers DEWA-compliant arc flash studies, IEEE 1584 analysis, and full power system engineering across the United Arab Emirates.`,
    keywords: page?.seoKeywords ?? undefined,
    alternates: {
      canonical: `https://carelabz.com/${CC}/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/`,
        "x-default": `https://carelabz.com/${CC}/`,
      },
    },
    openGraph: {
      title: page?.metaTitle ?? `Carelabs UAE — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.`,
      url: `https://carelabz.com/${CC}/`,
      siteName: "Carelabs",
      type: "website",
      locale: "en_AE",
    },
    twitter: {
      card: "summary_large_image",
      title: page?.metaTitle ?? `Carelabs UAE — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.`,
    },
  };
}

const FALLBACK_PROCESS = [
  { title: "Discovery", description: "Deep-dive into your electrical infrastructure and compliance posture." },
  { title: "Analysis", description: "Arc flash, short circuit, load flow — the full IEEE 1584 study suite." },
  { title: "Reporting", description: "Actionable documentation with risk scores, labels, and remediation steps." },
  { title: "Compliance", description: "Full alignment with DEWA regulations and international standards." },
];

const FALLBACK_VALUES = [
  { title: "Precision", description: "Every calculation reviewed twice. Every drawing red-lined." },
  { title: "Compliance", description: "DEWA, IEEE 1584, NFPA 70E — every report aligns to spec." },
  { title: "Speed", description: "First draft inside two weeks. Final inside four." },
  { title: "Partnership", description: "Engineers stay engaged through commissioning and beyond." },
];

const FALLBACK_STATS = [
  { value: "50+", metric: "Countries" },
  { value: "1000+", metric: "Projects" },
  { value: "15+", metric: "Years" },
];

const FALLBACK_STANDARDS = [
  { label: "DEWA", description: "Approved" },
  { label: "IEEE 1584", description: "Certified" },
  { label: "NFPA 70E", description: "Compliant" },
  { label: "IEC 61482", description: "Aligned" },
];

const HERO_ROTATING = ["Safety", "Precision", "Compliance", "Excellence"];

export default async function HomePage() {
  const page = await getHomePage(CC);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#094D76] text-white">
        <p className="font-ae-nav uppercase tracking-[0.18em] text-sm">
          Content unavailable — please try again shortly
        </p>
      </main>
    );
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Carelabs",
    description: page.metaDescription,
    url: `https://carelabz.com/${CC}/`,
    telephone: page.footerPhone ?? config.phone,
    email: page.footerEmail ?? config.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: page.footerAddress ?? config.address,
    },
  };

  const trustBadges = (page.trustBadges ?? []) as { label: string }[];
  const standards =
    trustBadges.length > 0
      ? trustBadges.map((b) => ({ label: b.label, description: "Standard" }))
      : FALLBACK_STANDARDS;

  const services = page.services ?? [];
  const insights = page.insights ?? [];
  const faqs = page.faqs ?? [];
  const stats = FALLBACK_STATS;
  const values = FALLBACK_VALUES;
  const process = FALLBACK_PROCESS;

  const heroEyebrow = "Power System Engineering";
  const heroHeadline = page.heroHeadline ?? "Electrical";
  const heroSubtext =
    page.heroSubtext ??
    "DEWA-compliant arc flash studies, power system analysis, and electrical safety engineering across the UAE.";

  return (
    <>
      <JsonLd data={jsonLdData} />
      <AENavbar config={config} />

      {/* 1 · HERO */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-[#094D76] px-6 pt-32 pb-24">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-5xl text-center">
          <p className="animate-fade-in-up animation-delay-100 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            {heroEyebrow}
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            {heroHeadline}{" "}
            <RotatingWord words={HERO_ROTATING} className="text-[#F15C30]" />
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            {heroSubtext}
          </p>
          <div className="animate-fade-in-up animation-delay-400 mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Link
              href={page.heroPrimaryCtaHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F15C30] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
            >
              {page.heroPrimaryCtaText ?? "Get a Quote"}
              <ArrowRight className="h-4 w-4" />
            </Link>
            <Link
              href={page.heroSecondaryCtaHref ?? config.servicesIndexPath}
              className="inline-flex items-center gap-2 border border-white/20 px-8 py-3.5 text-sm font-medium uppercase tracking-[0.1em] text-white/80 transition-all duration-300 hover:border-white/60 hover:text-white"
            >
              {page.heroSecondaryCtaText ?? "Our Services"}
            </Link>
          </div>

          {/* Stats row */}
          <div className="animate-fade-in-up animation-delay-500 mx-auto mt-16 grid max-w-2xl grid-cols-3 gap-8 border-t border-white/10 pt-10">
            {stats.map((s) => (
              <div key={s.metric} className="text-center">
                <p className="font-display text-3xl text-white sm:text-4xl">{s.value}</p>
                <p className="mt-2 text-xs uppercase tracking-[0.2em] text-white/50">
                  {s.metric}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-bounce text-white/40">
          <ChevronDown className="h-6 w-6" />
        </div>
      </section>

      {/* 2 · TRUST BAR */}
      <section className="border-b border-gray-200 bg-white py-12">
        <div className="mx-auto max-w-[1280px] px-6">
          <ScrollReveal>
            <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
              {standards.map((s) => (
                <div
                  key={s.label}
                  className="text-center transition-transform duration-300 hover:-translate-y-1"
                >
                  <p className="font-display text-3xl uppercase tracking-tight text-[#094D76] sm:text-4xl">
                    {s.label}
                  </p>
                  <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                    {s.description}
                  </p>
                </div>
              ))}
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* 3 · SERVICES (horizontal list) */}
      {services.length > 0 && (
        <section className="bg-[#F2F2F4] py-24 lg:py-32">
          <div className="mx-auto max-w-[1280px] px-6">
            <SectionHeading
              eyebrow="Capabilities"
              title="What We Do"
              description="Power system engineering, electrical safety studies, and DEWA-compliant testing across the UAE."
            />
            <div className="mt-16 border-t border-gray-300">
              {services.slice(0, 8).map((service, i) => (
                <ScrollReveal key={service.href} delay={i * 50}>
                  <Link
                    href={service.href}
                    className="group flex items-center gap-6 border-b border-gray-300 py-6 md:gap-10"
                  >
                    <span className="font-display text-2xl text-[#F15C30] md:text-3xl shrink-0 w-12">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-display text-xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6] md:text-2xl flex-1">
                      {service.title}
                    </h3>
                    <span className="hidden flex-1 text-sm leading-relaxed text-gray-600 md:block">
                      {service.description ?? ""}
                    </span>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#2575B6] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
            <ScrollReveal>
              <div className="mt-12 text-center">
                <Link
                  href={config.servicesIndexPath}
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2575B6] hover:text-[#094D76]"
                >
                  View All Services
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </div>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* 4 · ABOUT / VALUES */}
      <section className="bg-white py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <div className="grid gap-16 lg:grid-cols-2 lg:gap-24">
            {/* Left: brand story + stats */}
            <div>
              <ScrollReveal>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                  About
                </p>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-gray-900">
                  Engineered for the UAE.
                </h2>
              </ScrollReveal>
              <ScrollReveal delay={200}>
                <p className="mt-6 text-lg leading-relaxed text-gray-600">
                  Carelabs is a specialised electrical safety and power system engineering firm. We deliver DEWA-compliant studies, arc flash analysis, and protection coordination across the UAE.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={300}>
                <p className="mt-4 text-lg leading-relaxed text-gray-600">
                  Every study aligns to IEEE 1584, NFPA 70E, and IEC 60364 — backed by 15+ years of field-tested engineering across more than 1,000 projects.
                </p>
              </ScrollReveal>
              <ScrollReveal delay={400}>
                <div className="mt-10 grid grid-cols-3 gap-8 border-t border-gray-200 pt-10">
                  {stats.map((s) => (
                    <div key={s.metric}>
                      <p className="font-display text-3xl text-[#2575B6] sm:text-4xl">
                        {s.value}
                      </p>
                      <p className="mt-2 text-xs uppercase tracking-[0.2em] text-gray-500">
                        {s.metric}
                      </p>
                    </div>
                  ))}
                </div>
              </ScrollReveal>
            </div>

            {/* Right: values 2x2 */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {values.map((v, i) => (
                <ScrollReveal key={v.title} delay={i * 100}>
                  <div className="group h-full border-l-2 border-[#2575B6] bg-[#F2F2F4] p-8 transition-colors duration-300 hover:border-[#F15C30]">
                    <h3 className="font-display text-xl uppercase tracking-tight text-gray-900">
                      {v.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {v.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 5 · PROCESS / METHODOLOGY */}
      <section className="bg-[#F2F2F4] py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          <SectionHeading
            eyebrow="Methodology"
            title="How We Work"
            description="A four-stage delivery process refined over a decade and a thousand engagements."
          />
          <div className="mt-16 grid grid-cols-1 gap-px bg-gray-200 md:grid-cols-2 lg:grid-cols-4">
            {process.map((step, i) => (
              <ScrollReveal key={step.title} delay={i * 100}>
                <div className="h-full bg-white p-8 transition-colors duration-300 hover:bg-white">
                  <span className="block font-display text-6xl text-[#F15C30]/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-6 font-display text-xl uppercase tracking-tight text-gray-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-gray-600">
                    {step.description}
                  </p>
                </div>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · INSIGHTS / BLOG */}
      {insights.length > 0 && (
        <section className="bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-[1280px] px-6">
            <div className="flex flex-col items-start justify-between gap-6 md:flex-row md:items-end">
              <ScrollReveal>
                <div>
                  <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                    Insights
                  </p>
                  <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-gray-900">
                    From the Field
                  </h2>
                </div>
              </ScrollReveal>
              <ScrollReveal delay={100}>
                <Link
                  href={config.blogIndexPath}
                  className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2575B6] hover:text-[#094D76]"
                >
                  All Articles
                  <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
              </ScrollReveal>
            </div>

            <div className="mt-12 grid grid-cols-1 gap-px bg-gray-200 md:grid-cols-2 lg:grid-cols-3">
              {insights.slice(0, 3).map((insight, i) => (
                <ScrollReveal key={insight.href ?? i} delay={i * 100}>
                  <Link
                    href={insight.href}
                    className="group block h-full bg-white p-8 transition-colors duration-300 hover:bg-[#F2F2F4]"
                  >
                    <div className="flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.15em] text-[#2575B6]">
                      <span>Article</span>
                    </div>
                    <h3 className="mt-4 font-display text-xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6]">
                      {cleanTitle(insight.title)}
                    </h3>
                    <span className="mt-6 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#F15C30]">
                      Read More
                      <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                    </span>
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 7 · FAQ */}
      {faqs.length > 0 && (
        <section className="bg-[#F2F2F4] py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading
              eyebrow="FAQ"
              title="Common Questions"
            />
            <div className="mt-12 space-y-4">
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <details className="group bg-white px-8 py-6 [&[open]_h3]:text-[#2575B6]">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <h3 className="font-display text-base uppercase tracking-tight text-gray-900 transition-colors duration-300 md:text-lg">
                        {faq.question}
                      </h3>
                      <Plus className="h-5 w-5 shrink-0 text-[#F15C30] transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="mt-4 text-base leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8 · CTA BANNER */}
      <section className="bg-[#094D76] py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
              Get Started
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-white">
              Let&apos;s Talk.
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Tell us about your facility and compliance requirements. Our UAE engineering team responds within one business day.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={page.ctaBannerPrimaryHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Contact Us
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={config.servicesIndexPath}
                className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-sm font-medium uppercase tracking-[0.1em] text-white/80 transition-all duration-300 hover:border-white/60 hover:text-white"
              >
                Our Services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
