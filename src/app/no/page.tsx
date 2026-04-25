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

const CC = "no";
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

export default async function HomePage() {
  const page = await getHomePage(CC);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#1A3650] text-white">
        <p className="font-ne-display uppercase tracking-[0.2em] text-sm">
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

      {/* ---------------- HERO — split layout ---------------- */}
      <section className="relative bg-[#1A3650] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 items-center">
            <div className="lg:col-span-3">
              {page.heroEyebrow && (
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold mb-6 block">
                  {page.heroEyebrow}
                </span>
              )}
              <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-6xl uppercase text-white leading-[0.95]">
                {page.heroHeadline ?? "Electrical Safety"}
                <br />
                <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                  Demands Precision.
                </span>
              </h1>
              {page.heroSubtext && (
                <p className="font-ne-body text-lg text-white/50 mt-8 max-w-xl leading-relaxed">
                  {page.heroSubtext}
                </p>
              )}
              <div className="mt-10">
                <Link
                  href={page.heroPrimaryCtaHref ?? config.contactPath}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
                >
                  {page.heroPrimaryCtaText ?? "Request a Study"}
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
            <div
              className="hidden lg:block lg:col-span-2 relative h-80"
              aria-hidden="true"
            >
              <div className="absolute top-0 right-0 w-64 h-64 border border-orange-500/20 rounded-full" />
              <div className="absolute top-12 right-12 w-48 h-48 border border-[#4A7C9B]/30 rounded-full" />
              <div className="absolute bottom-0 right-8 w-32 h-32 bg-orange-500/10 rounded-full" />
              <div className="absolute top-1/2 right-1/2 w-2 h-2 bg-orange-500 rounded-full" />
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BAR — inline text, no pills ---------------- */}
      <div className="bg-[#F9F7F3] py-6 px-6 border-b border-[#1A3650]/5">
        <p className="text-center font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40">
          {config.standards.slice(0, 5).join("  ·  ")}
        </p>
      </div>

      {/* ---------------- SERVICES — editorial numbered list ---------------- */}
      {page.services && page.services.length > 0 && (
        <section className="bg-[#F9F7F3] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-16 gap-6">
              <div>
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold mb-4 block">
                  What We Do
                </span>
                <h2 className="font-ne-display font-black text-4xl md:text-5xl uppercase text-[#1A3650] leading-[0.95]">
                  Our Services
                </h2>
              </div>
              <Link
                href={config.servicesIndexPath}
                className="font-ne-nav text-sm uppercase tracking-[0.18em] text-orange-500 hover:text-orange-600 inline-flex items-center gap-2 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {page.services.slice(0, 6).map((service, i) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group flex items-start gap-6 py-8 px-4 border-b border-[#1A3650]/10 hover:bg-[#F0EBE1] transition-colors"
                >
                  <span className="font-ne-display font-black text-3xl text-[#1A3650]/10 leading-none shrink-0 w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-ne-display font-bold text-lg uppercase text-[#1A3650] group-hover:text-orange-500 transition-colors">
                      {service.title}
                    </h3>
                    {service.description && (
                      <p className="font-ne-body text-sm text-gray-500 mt-2 leading-relaxed line-clamp-2">
                        {service.description}
                      </p>
                    )}
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-orange-500 transition-colors shrink-0 mt-1" />
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- MANIFESTO — asymmetric left-aligned ---------------- */}
      <section className="bg-[#1A3650] py-20 lg:py-28 px-6">
        <div className="max-w-[1400px] mx-auto lg:px-12">
          <div className="max-w-3xl">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-6 block">
              Our Promise
            </span>
            <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
              We don&apos;t deliver reports.
            </h2>
            <p className="font-ne-accent italic text-3xl md:text-4xl text-orange-500 mt-4">
              We deliver safety.
            </p>
          </div>
        </div>
      </section>

      {/* ---------------- INDUSTRIES — marquee only ---------------- */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#F0EBE1] py-16 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-8">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500 font-semibold">
              Industries We Serve
            </span>
          </div>
          <div className="relative overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dupe) => (
                <span key={dupe} className="inline-block">
                  {page.industries!.map((industry, i) => (
                    <span
                      key={`${dupe}-${i}`}
                      className="inline-block mx-6 font-ne-display font-black text-5xl md:text-7xl uppercase text-[#1A3650]/[0.08]"
                    >
                      {industry.name}
                      <span className="text-orange-500/40 mx-6">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- INSIGHTS — editorial rows ---------------- */}
      {page.insights && page.insights.length > 0 && (
        <section className="bg-[#1A3650] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between mb-14 gap-6">
              <div>
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                  Latest
                </span>
                <h2 className="font-ne-display font-black text-3xl md:text-5xl uppercase text-white leading-[0.95]">
                  Insights &amp; Field Notes
                </h2>
              </div>
              <Link
                href={config.blogIndexPath}
                className="font-ne-nav text-sm uppercase tracking-[0.18em] text-orange-500 hover:text-orange-400 inline-flex items-center gap-2 transition-colors"
              >
                View All <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="divide-y divide-[#4A7C9B]/20">
              {page.insights.slice(0, 5).map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 hover:pl-2 transition-all"
                >
                  <h3 className="font-ne-display font-bold text-lg uppercase text-white group-hover:text-orange-500 transition-colors">
                    {cleanTitle(insight.title)}
                  </h3>
                  <div className="flex items-center gap-6 shrink-0">
                    {insight.category && (
                      <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-white/30">
                        {insight.category}
                      </span>
                    )}
                    <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FAQ — navy left-aligned ---------------- */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#1A3650] py-16 lg:py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-10">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                FAQ
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-white leading-[0.95]">
                Common Questions
              </h2>
            </div>
            <div>
              {page.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-white/10 py-5"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ne-display font-bold text-base md:text-lg uppercase text-white/90">
                    <span>{faq.question}</span>
                    <Plus className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="font-ne-body text-base text-white/60 mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FINAL CTA — single-line understated ---------------- */}
      <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6">
        <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
          <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
            {page.ctaBannerHeading ?? "Ready to protect your facility?"}
          </h2>
          <div className="mt-8">
            <Link
              href={page.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
