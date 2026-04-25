export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle, Plus } from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
import { getHomePage } from "@/lib/strapi-home";

const CC = "dk";
const config = COUNTRY_CONFIGS[CC];

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
      <main className="flex min-h-screen items-center justify-center bg-[#0B1A2F] text-white">
        <p className="font-condensed uppercase tracking-[0.2em] text-sm">
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

      {/* ---------------- HERO — navy, single statement ---------------- */}
      <section
        className="relative min-h-screen flex items-center justify-center bg-[#0B1A2F] overflow-hidden pt-24"
        aria-labelledby="hero-heading"
      >
        {/* grid-dot texture */}
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />

        <div className="relative text-center max-w-5xl mx-auto px-6">
          {page.heroEyebrow && (
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
              {page.heroEyebrow}
            </span>
          )}

          <h1
            id="hero-heading"
            className="font-condensed font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-[0.95] tracking-tight"
          >
            {page.heroHeadline ?? "Electrical Safety Demands"}
            <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
              {config.countryName}.
            </span>
          </h1>

          {page.heroSubtext && (
            <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              {page.heroSubtext}
            </p>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href={page.heroPrimaryCtaHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
            >
              {page.heroPrimaryCtaText ?? "Request a Study"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>

        <span
          className="absolute bottom-8 left-1/2 -translate-x-1/2 font-condensed text-xs uppercase tracking-[0.3em] text-white/30"
          aria-hidden="true"
        >
          Scroll ↓
        </span>
      </section>

      {/* ---------------- TRUST BAR — off-white ---------------- */}
      <section className="bg-[#F8FAFC] py-12 px-6 border-b border-[#0B1A2F]/5">
        <div className="max-w-[1400px] mx-auto flex flex-wrap justify-center gap-3">
          {config.standards.slice(0, 5).map((standard) => (
            <div
              key={standard}
              className="inline-flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.15em] text-[#0B1A2F]/70 border border-[#0B1A2F]/10 px-5 py-2 rounded-full bg-white"
            >
              <CheckCircle className="w-3.5 h-3.5 text-orange-500" />
              {standard}
            </div>
          ))}
        </div>
      </section>

      {/* ---------------- SERVICES — white, photography cards ---------------- */}
      {page.services && page.services.length > 0 && (
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-16">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                Our Services
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                {page.servicesHeading ?? "Comprehensive Electrical"}
                <span className="block font-accent italic font-normal normal-case text-orange-500 mt-2">
                  Safety.
                </span>
              </h2>
              {page.servicesSubtext && (
                <p className="font-body text-lg text-gray-600 mt-6 max-w-2xl leading-relaxed">
                  {page.servicesSubtext}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.services.slice(0, 6).map((service) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group rounded-2xl overflow-hidden bg-[#F8FAFC] hover:shadow-lg transition-all duration-300 block"
                >
                  <div
                    className="relative h-52 overflow-hidden bg-[#0B1A2F] group-hover:scale-[1.02] transition-transform duration-500"
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #F97316 1.5px, transparent 1.5px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
                      IEEE 1584 · {config.primaryStandard}
                    </span>
                    <h3 className="font-condensed font-bold text-xl uppercase text-[#0B1A2F] mt-2 group-hover:text-orange-500 transition-colors">
                      {service.title}
                    </h3>
                    <p className="font-body text-sm text-gray-600 mt-3 leading-relaxed line-clamp-3">
                      {service.description}
                    </p>
                    <span className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 mt-4 inline-flex items-center gap-2">
                      Learn More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- MANIFESTO — navy single sentence ---------------- */}
      <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
            We don&apos;t deliver reports.
            <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
              We deliver safety.
            </span>
          </h2>
          <div className="mt-12 flex flex-wrap justify-center gap-3">
            {["IEEE Certified", "50+ Countries", "25+ Years"].map((label) => (
              <span
                key={label}
                className="font-condensed text-xs uppercase tracking-[0.2em] text-white/50 border border-white/10 px-4 py-2 rounded-full"
              >
                {label}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* ---------------- INDUSTRIES — off-white marquee ---------------- */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#F8FAFC] py-16 overflow-hidden">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-10 text-center">
            <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
              Industries We Serve
            </span>
            {page.industriesHeading && (
              <h2 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-[#0B1A2F] leading-[0.95] mt-3">
                {page.industriesHeading}
              </h2>
            )}
          </div>

          <div className="relative overflow-hidden">
            <div className="animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dupe) => (
                <span key={dupe} className="inline-block">
                  {page.industries!.map((industry, i) => (
                    <span
                      key={`${dupe}-${i}`}
                      className="inline-block mx-6 font-condensed font-extrabold text-5xl md:text-7xl uppercase text-[#0B1A2F]/[0.08] tracking-tight"
                    >
                      {industry.name}
                      <span className="text-orange-500/40 mx-6">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>

          <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-12">
            <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 text-center">
              {page.industries.slice(0, 10).map((industry, i) => (
                <li
                  key={i}
                  className="font-body text-sm text-[#0B1A2F]/50"
                >
                  {industry.name}
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {/* ---------------- INSIGHTS — white cards ---------------- */}
      {page.insights && page.insights.length > 0 && (
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl mb-14">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                Latest
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                {page.insightsHeading ?? "Insights"}
                <span className="block font-accent italic font-normal normal-case text-orange-500 mt-2">
                  &amp; Field Notes.
                </span>
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {page.insights.slice(0, 3).map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group rounded-2xl overflow-hidden bg-[#F8FAFC] hover:shadow-lg transition-all duration-300"
                >
                  <div
                    className="relative h-48 bg-[#1E293B] overflow-hidden"
                    aria-hidden="true"
                  >
                    <div
                      className="absolute inset-0 opacity-10 group-hover:scale-105 transition-transform duration-500"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle, #F97316 1.5px, transparent 1.5px)",
                        backgroundSize: "20px 20px",
                      }}
                    />
                  </div>
                  <div className="p-6">
                    <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500">
                      {insight.category}
                    </span>
                    <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] mt-2 group-hover:text-orange-500 transition-colors">
                      {insight.title}
                    </h3>
                    <p className="font-body text-sm text-gray-600 mt-2 line-clamp-3 leading-relaxed">
                      {insight.description}
                    </p>
                    <span className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 mt-4 inline-flex items-center gap-2">
                      Read More <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FAQ ---------------- */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-10 text-center">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block">
                FAQ
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                Frequently Asked
                <span className="block font-accent italic font-normal normal-case text-orange-500 mt-2">
                  Questions.
                </span>
              </h2>
            </div>
            <div>
              {page.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-[#0B1A2F]/10 py-5"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-condensed font-bold text-base md:text-lg uppercase text-[#0B1A2F] tracking-tight">
                    <span>{faq.question}</span>
                    <Plus className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="font-body text-base text-gray-600 mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FINAL CTA — navy single sentence ---------------- */}
      <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
            {page.ctaBannerHeading ?? "Ready to schedule a"}
            <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
              Study?
            </span>
          </h2>
          <div className="mt-10 flex justify-center">
            <Link
              href={page.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
            >
              {page.ctaBannerPrimaryText ?? "Request a Quote"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <NEFooter config={config} />
    </>
  );
}
