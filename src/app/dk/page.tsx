export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus } from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
import { getHomePage } from "@/lib/strapi-home";

const CC = "dk";
const config = COUNTRY_CONFIGS[CC];

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(
      /\s*-\s*Carelabs\s*(UK|United Kingdom|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i,
      ""
    )
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage(CC);
  return {
    title:
      page?.metaTitle ??
      `Carelabs ${config.countryName} — Electrical Safety & Power System Studies`,
    description:
      page?.metaDescription ??
      `Carelabs delivers ${config.primaryStandard} arc flash studies, ${config.localCodeName} compliance, and full power system engineering across ${config.countryName}.`,
    keywords: page?.seoKeywords ?? undefined,
    alternates: {
      canonical: `https://carelabz.com/${CC}/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/`,
        "x-default": `https://carelabz.com/${CC}/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `Carelabs ${config.countryName} — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `IEEE 1584 arc flash studies, ${config.primaryStandard} compliance, and power system engineering across ${config.countryName}.`,
      url: `https://carelabz.com/${CC}/`,
      siteName: "Carelabs",
      type: "website",
      locale: config.hreflang.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `Carelabs ${config.countryName} — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `IEEE 1584 arc flash studies, ${config.primaryStandard} compliance, and power system engineering across ${config.countryName}.`,
    },
  };
}

const FALLBACK_PROCESS = [
  {
    title: "Discovery",
    description:
      "Deep-dive into your electrical infrastructure and compliance posture.",
  },
  {
    title: "Analysis",
    description:
      "Arc flash, short circuit, load flow — the full IEEE 1584 study suite.",
  },
  {
    title: "Reporting",
    description:
      "Actionable documentation with risk scores, labels, and remediation steps.",
  },
  {
    title: "Compliance",
    description: `Full alignment with ${config.primaryStandard} and international standards.`,
  },
];

export default async function HomePage() {
  const page = await getHomePage(CC);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1A3650] text-white">
        <p className="font-ne-nav uppercase tracking-[0.18em] text-sm">
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

  return (
    <>
      <JsonLd data={jsonLdData} />
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />

      {/* ---------------- 1 · STATEMENT HERO (Nobl) ---------------- */}
      <section className="relative min-h-[85vh] flex items-center bg-[#1A3650] overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "80px 80px",
          }}
        />
        <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 py-32">
          {page.heroEyebrow && (
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
              {page.heroEyebrow}
            </span>
          )}
          <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.95]">
            {page.heroHeadline ?? "Electrical Safety Demands"}
            <br />
            <span className="font-ne-accent italic font-normal text-[#F97316]">
              {config.countryName}.
            </span>
          </h1>
          {page.heroSubtext && (
            <p className="font-ne-body text-base text-white/40 mt-10 max-w-lg leading-relaxed">
              {page.heroSubtext}
            </p>
          )}
          <div className="mt-12">
            <Link
              href={page.heroPrimaryCtaHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-4 transition-colors"
            >
              {page.heroPrimaryCtaText ?? "Request a Study"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ---------------- 2 · STATEMENT BAND (Aleia) ---------------- */}
      <section className="bg-[#F97316] py-8 lg:py-10">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <p className="font-ne-display font-black text-xl md:text-2xl lg:text-3xl text-white uppercase leading-tight tracking-tight">
            {config.primaryStandard} · IEEE 1584 · Arc Flash Studies · Power System Engineering · {config.countryName}
          </p>
        </div>
      </section>

      {/* ---------------- 3 · SERVICES — full-width alternating rows ---------------- */}
      {page.services && page.services.length > 0 && (
        <section>
          {page.services.slice(0, 6).map((service, i) => (
            <Link
              key={service.href}
              href={service.href}
              className={`group block ${
                i % 2 === 0 ? "bg-[#F9F7F3]" : "bg-[#F0EBE1]"
              }`}
            >
              <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
                <div className="flex items-start gap-8 flex-1 min-w-0">
                  <span className="font-ne-display font-black text-5xl lg:text-6xl text-[#1A3650]/[0.08] leading-none shrink-0">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div>
                    <h2 className="font-ne-display font-black text-2xl lg:text-3xl text-[#1A3650] uppercase leading-tight group-hover:text-[#F97316] transition-colors">
                      {service.title}
                    </h2>
                    {service.description && (
                      <p className="font-ne-body text-sm text-[#1A3650]/50 mt-3 max-w-xl leading-relaxed">
                        {service.description}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] opacity-0 group-hover:opacity-100 transition-opacity">
                    Explore
                  </span>
                  <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-[#F97316] transition-colors" />
                </div>
              </div>
            </Link>
          ))}
        </section>
      )}

      {/* ---------------- 4 · SINGLE-SENTENCE VIEWPORT (Nobl) ---------------- */}
      <section className="bg-[#1A3650] min-h-[60vh] flex items-center px-6">
        <div className="max-w-[1000px] mx-auto py-20 lg:py-0">
          <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl xl:text-7xl text-white leading-[0.95]">
            We don&apos;t deliver reports.
          </h2>
          <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-4 leading-[1.05]">
            We deliver safety.
          </p>
        </div>
      </section>

      {/* ---------------- 5 · PROCESS PANELS (Nobl methodology) ---------------- */}
      <section className="bg-[#243E54] py-20 lg:py-28">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-8 block">
            How We Work
          </span>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-0 divide-y lg:divide-y-0 lg:divide-x divide-[#4A7C9B]/20">
            {FALLBACK_PROCESS.map((step, i) => (
              <div
                key={i}
                className="py-8 lg:py-0 lg:px-8 first:lg:pl-0 last:lg:pr-0"
              >
                <span className="font-ne-display font-black text-4xl text-[#F97316]/20">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-ne-display font-black text-xl text-white uppercase mt-4">
                  {step.title}
                </h3>
                <p className="font-ne-body text-sm text-white/40 mt-3 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- 6 · INDUSTRIES MARQUEE (Pilates Collective) ---------------- */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#F0EBE1] py-10 overflow-hidden">
          <div className="relative">
            <div className="animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dupe) => (
                <span key={dupe} className="inline-block">
                  {page.industries!.map((industry, i) => (
                    <span
                      key={`${dupe}-${i}`}
                      className="inline-block mx-6 font-ne-display font-black text-5xl md:text-7xl uppercase text-[#1A3650]/[0.07] tracking-tight"
                    >
                      {industry.name}
                      <span className="text-[#F97316]/30 mx-6">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 7 · INSIGHTS — editorial line list ---------------- */}
      {page.insights && page.insights.length > 0 && (
        <section className="bg-[#1A3650] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col md:flex-row md:items-end md:justify-between mb-12 gap-4">
              <div>
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-4 block">
                  From the Blog
                </span>
                <h2 className="font-ne-display font-black text-3xl md:text-4xl text-white uppercase">
                  Latest Insights
                </h2>
              </div>
              <Link
                href={config.blogIndexPath}
                className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] hover:text-[#F97316]/70 inline-flex items-center gap-2 transition-colors"
              >
                View All <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
            <div className="divide-y divide-[#4A7C9B]/20">
              {page.insights.slice(0, 5).map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group flex items-center justify-between py-6 gap-6"
                >
                  <h3 className="font-ne-display font-bold text-lg md:text-xl text-white uppercase group-hover:text-[#F97316] transition-colors">
                    {cleanTitle(insight.title)}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-white/20 group-hover:text-[#F97316] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- 8 · FAQ ---------------- */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#F0EBE1] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-3 block">
              FAQ
            </span>
            <h2 className="font-ne-display font-black text-3xl md:text-4xl text-[#1A3650] uppercase mb-10">
              Common Questions
            </h2>
            {page.faqs.map((faq, i) => (
              <details
                key={i}
                className="group border-b border-[#1A3650]/10 py-5"
              >
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ne-display font-bold text-base md:text-lg text-[#1A3650] uppercase">
                  <span>{faq.question}</span>
                  <Plus className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                </summary>
                <p className="font-ne-body text-base text-[#1A3650]/60 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ---------------- 9 · FINAL CTA (Nobl) ---------------- */}
      <section className="bg-[#1A3650] py-24 lg:py-32 px-6">
        <div className="max-w-[1000px] mx-auto">
          <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
            {page.ctaBannerHeading ?? "Let\u2019s talk about"}
          </h2>
          <p className="font-ne-accent italic text-3xl md:text-4xl text-[#F97316] mt-3">
            your facility.
          </p>
          <div className="mt-12">
            <Link
              href={page.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              {page.ctaBannerPrimaryText ?? "Get in Touch"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <NEFooter config={config} />
    </>
  );
}
