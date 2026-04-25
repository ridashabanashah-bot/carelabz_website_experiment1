export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus, Shield } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
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

const FALLBACK_BADGES: { label: string }[] = [
  { label: "DEWA Approved" },
  { label: "IEEE 1584 Certified" },
  { label: "NFPA 70E Compliant" },
  { label: "IEC 61482 Aligned" },
];

export default async function HomePage() {
  const page = await getHomePage(CC);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A1628] text-white">
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

  const trustBadges: { label: string }[] = (page.trustBadges ?? FALLBACK_BADGES) as { label: string }[];

  return (
    <>
      <JsonLd data={jsonLdData} />
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />

      {/* 1 · HERO */}
      <section className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="text-center max-w-5xl py-24 relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-8">
            Power System Engineering
          </p>
          <h1 className="font-ae-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.95] tracking-tight">
            {page.heroHeadline ?? "Electrical Safety Demands Precision."}
          </h1>
          <p className="font-ae-body text-lg md:text-xl text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            {page.heroSubtext ??
              "DEWA-compliant arc flash studies, power system analysis, and electrical safety engineering across the UAE."}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={page.heroPrimaryCtaHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
            >
              {page.heroPrimaryCtaText ?? "Get a Quote"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={page.heroSecondaryCtaHref ?? config.servicesIndexPath}
              className="inline-flex items-center gap-2 border border-[#1E5A8A] hover:border-[#2D7AB8] text-white/70 hover:text-white font-ae-nav font-medium text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
            >
              {page.heroSecondaryCtaText ?? "Our Services"}
            </Link>
          </div>
        </div>
      </section>

      {/* 2 · TRUST BAR */}
      <section className="bg-[#163560] py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {trustBadges.map((badge, i) => (
            <div key={i} className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#F97316]" />
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.12em] text-white/50">
                {badge.label}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* 3 · BRAND STATEMENT */}
      <section className="bg-[#F2EDE6] py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-ae-display text-2xl md:text-3xl lg:text-4xl text-[#0F2847] leading-snug">
            We protect people, facilities, and operations through rigorous power system engineering and DEWA-compliant safety studies.
          </p>
        </div>
      </section>

      {/* 4 · SERVICES */}
      {page.services && page.services.length > 0 && (
        <section className="bg-[#EBF2F8] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                Capabilities
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-[#0F2847] leading-[0.95]">
                What We Do
              </h2>
            </div>
            <div className="divide-y divide-[#0F2847]/10">
              {page.services.slice(0, 8).map((service, i) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group flex items-center justify-between py-6 gap-6"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-ae-display text-3xl text-[#0F2847]/10 w-12 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-ae-body font-semibold text-lg md:text-xl text-[#0F2847] group-hover:text-[#1E5A8A] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#0F2847]/15 group-hover:text-[#2D7AB8] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={config.servicesIndexPath}
                className="font-ae-nav font-medium text-sm uppercase tracking-[0.15em] text-[#2D7AB8] hover:text-[#1E5A8A] inline-flex items-center gap-2 transition-colors"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 5 · MANIFESTO */}
      <section className="bg-[#0F2847] flex items-center justify-center px-6 py-28 lg:py-40">
        <div className="text-center max-w-4xl">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            We don&apos;t deliver reports.
          </h2>
          <p className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-[#2D7AB8] mt-5 leading-[0.95]">
            We deliver certainty.
          </p>
        </div>
      </section>

      {/* 6 · METHODOLOGY */}
      <section className="bg-[#163560] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8]/60 mb-4 block">
              Methodology
            </span>
            <h2 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-white leading-[0.95]">
              How We Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1E5A8A]/20">
            {FALLBACK_PROCESS.map((step, i) => (
              <div key={i} className="bg-[#163560] p-8">
                <span className="font-ae-display text-5xl text-[#2D7AB8]/15 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-ae-body font-semibold text-lg text-white uppercase mt-6 tracking-wide">
                  {step.title}
                </h3>
                <p className="font-ae-body text-sm text-white/35 mt-4 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 7 · INDUSTRIES MARQUEE */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#F8F5F0] py-12 overflow-hidden">
          <div className="relative">
            <div className="animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dupe) => (
                <span key={dupe} className="inline-block">
                  {page.industries!.map((industry, i) => (
                    <span
                      key={`${dupe}-${i}`}
                      className="inline-block mx-8 font-ae-display text-6xl md:text-8xl uppercase text-[#0F2847]/[0.05]"
                    >
                      {industry.name}
                      <span className="text-[#2D7AB8]/15 mx-8">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 8 · INSIGHTS */}
      {page.insights && page.insights.length > 0 && (
        <section className="bg-[#D4E3F0] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#1E5A8A] mb-4 block">
                Insights
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-[#0F2847] leading-[0.95]">
                From the Blog
              </h2>
            </div>
            <div className="divide-y divide-[#0F2847]/10">
              {page.insights.slice(0, 5).map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group flex items-center justify-between py-6 gap-6"
                >
                  <h3 className="font-ae-body font-semibold text-lg md:text-xl text-[#0F2847] group-hover:text-[#1E5A8A] transition-colors">
                    {cleanTitle(insight.title)}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-[#0F2847]/15 group-hover:text-[#2D7AB8] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={config.blogIndexPath}
                className="font-ae-nav font-medium text-sm uppercase tracking-[0.15em] text-[#1E5A8A] hover:text-[#0F2847] inline-flex items-center gap-2 transition-colors"
              >
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* 9 · FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#F8F5F0] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                FAQ
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl text-[#0F2847]">
                Common Questions
              </h2>
            </div>
            {page.faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[#0F2847]/10 py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ae-body font-semibold text-base md:text-lg text-[#0F2847]">
                  <span>{faq.question}</span>
                  <Plus className="w-5 h-5 text-[#2D7AB8] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                </summary>
                <p className="font-ae-body text-base text-[#0F2847]/50 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* 10 · CTA */}
      <section className="bg-[#0F2847] py-28 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.92]">
            Let&apos;s Talk.
          </h2>
          <p className="font-ae-body text-lg text-[#5A8FB4] mt-6 max-w-xl mx-auto">
            Tell us about your facility and compliance requirements.
          </p>
          <div className="mt-10">
            <Link
              href={page.ctaBannerPrimaryHref ?? config.contactPath}
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
