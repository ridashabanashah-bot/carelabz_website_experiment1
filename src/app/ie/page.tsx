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

const CC = "ie";
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

function splitCountrySuffix(
  headline: string,
  countryName: string
): { lead: string; connector: string; tail: string } | null {
  const escaped = countryName.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const inPattern = new RegExp(
    `\\s+(?:in|across|for|throughout)\\s+(?:the\\s+)?${escaped}\\.?\\s*$`,
    "i"
  );
  const inMatch = headline.match(inPattern);
  if (inMatch && inMatch.index !== undefined) {
    const lead = headline.slice(0, inMatch.index).replace(/[\s.,;:]+$/, "");
    const connector = inMatch[0].trim().split(/\s+/)[0].toLowerCase();
    return { lead, connector: ` ${connector} `, tail: countryName };
  }
  const tailPattern = new RegExp(`\\s+${escaped}\\.?\\s*$`, "i");
  const tailMatch = headline.match(tailPattern);
  if (tailMatch && tailMatch.index !== undefined) {
    const lead = headline.slice(0, tailMatch.index).replace(/[\s.,;:]+$/, "");
    return { lead, connector: " ", tail: countryName };
  }
  return null;
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

  const fallbackProcess = [
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
  const processSteps = fallbackProcess;

  return (
    <>
      <JsonLd data={jsonLdData} />
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />

      {/* ═══════ 1 · HERO — Nobl: centered statement, full viewport ═══════ */}
      <section className="min-h-screen flex items-center justify-center bg-[#1A3650] px-6">
        <div className="text-center max-w-5xl py-24">
          {(() => {
            const headlineRaw =
              page.heroHeadline ?? "Electrical Safety Demands Certainty.";
            const split = splitCountrySuffix(headlineRaw, config.countryName);
            return (
              <>
                <h1 className="font-ne-display font-black text-5xl sm:text-6xl md:text-7xl lg:text-[6rem] text-white leading-[0.92]">
                  {split ? (
                    <>
                      {split.lead}
                      {split.connector}
                      <span className="font-ne-accent italic font-normal text-[#F97316]">
                        {split.tail}.
                      </span>
                    </>
                  ) : (
                    headlineRaw
                  )}
                </h1>
                {!split && (
                  <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-6">
                    {config.countryName}.
                  </p>
                )}
              </>
            );
          })()}
          {page.heroSubtext && (
            <p className="font-ne-body text-base md:text-lg text-white/35 mt-10 max-w-2xl mx-auto leading-relaxed">
              {page.heroSubtext}
            </p>
          )}
        </div>
      </section>

      {/* ═══════ 2 · BRAND STATEMENT — Nobl's red block → our orange block ═══════ */}
      <section className="bg-[#F97316] py-14 lg:py-20 px-6">
        <div className="max-w-5xl mx-auto text-center">
          <p className="font-ne-display font-black text-2xl md:text-3xl lg:text-4xl text-white leading-snug">
            We&apos;re Carelabs. We protect people and facilities through rigorous power system engineering.
          </p>
        </div>
      </section>

      {/* ═══════ 3 · SERVICES — stacked rows on sand ═══════ */}
      {page.services && page.services.length > 0 && (
        <section className="bg-[#F0EBE1] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] mb-4 block">
                Capabilities
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-5xl text-[#1A3650] leading-[0.95]">
                What We Do
              </h2>
            </div>
            <div className="divide-y divide-[#1A3650]/10">
              {page.services.slice(0, 6).map((service, i) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group flex items-center justify-between py-7 gap-6"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-ne-display font-black text-3xl text-[#1A3650]/10 w-12 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-ne-display font-black text-xl md:text-2xl text-[#1A3650] uppercase group-hover:text-[#F97316] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#1A3650]/15 group-hover:text-[#F97316] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={config.servicesIndexPath}
                className="font-ne-nav text-sm uppercase tracking-[0.15em] text-[#F97316] hover:text-orange-600 inline-flex items-center gap-2 transition-colors"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 4 · MANIFESTO — Nobl's single sentence viewport ═══════ */}
      <section className="bg-[#1A3650] flex items-center justify-center px-6 py-28 lg:py-40">
        <div className="text-center max-w-4xl">
          <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-7xl text-white leading-[0.92]">
            We don&apos;t deliver reports.
          </h2>
          <p className="font-ne-accent italic text-3xl md:text-4xl lg:text-5xl text-[#F97316] mt-5">
            We deliver safety.
          </p>
        </div>
      </section>

      {/* ═══════ 5 · METHODOLOGY — Nobl's dark panels ═══════ */}
      <section className="bg-[#243E54] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-4 block">
              Methodology
            </span>
            <h2 className="font-ne-display font-black text-3xl md:text-5xl text-white leading-[0.95]">
              How We Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#4A7C9B]/20">
            {processSteps.map((step, i) => (
              <div key={i} className="bg-[#243E54] p-8">
                <span className="font-ne-display font-black text-5xl text-[#F97316]/15 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-ne-display font-black text-xl text-white uppercase mt-6">
                  {step.title}
                </h3>
                <p className="font-ne-body text-sm text-white/40 mt-4 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 6 · INDUSTRIES MARQUEE ═══════ */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#F9F7F3] py-12 overflow-hidden">
          <div className="relative">
            <div className="animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dupe) => (
                <span key={dupe} className="inline-block">
                  {page.industries!.map((industry, i) => (
                    <span
                      key={`${dupe}-${i}`}
                      className="inline-block mx-8 font-ne-display font-black text-6xl md:text-8xl uppercase text-[#1A3650]/[0.06]"
                    >
                      {industry.name}
                      <span className="text-[#F97316]/20 mx-8">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 7 · INSIGHTS — Nobl's editorial list ═══════ */}
      {page.insights && page.insights.length > 0 && (
        <section className="bg-[#F0EBE1] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] mb-4 block">
                Insights
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-5xl text-[#1A3650] leading-[0.95]">
                From the Blog
              </h2>
            </div>
            <div className="divide-y divide-[#1A3650]/10">
              {page.insights.slice(0, 5).map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group flex items-center justify-between py-6 gap-6"
                >
                  <h3 className="font-ne-display font-bold text-lg md:text-xl text-[#1A3650] group-hover:text-[#F97316] transition-colors">
                    {cleanTitle(insight.title)}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-[#1A3650]/15 group-hover:text-[#F97316] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={config.blogIndexPath}
                className="font-ne-nav text-sm uppercase tracking-[0.15em] text-[#F97316] hover:text-orange-600 inline-flex items-center gap-2 transition-colors"
              >
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 8 · FAQ ═══════ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#F9F7F3] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316] mb-4 block">
                FAQ
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-4xl text-[#1A3650]">
                Common Questions
              </h2>
            </div>
            {page.faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[#1A3650]/10 py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ne-display font-bold text-base md:text-lg text-[#1A3650]">
                  <span>{faq.question}</span>
                  <Plus className="w-5 h-5 text-[#F97316] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                </summary>
                <p className="font-ne-body text-base text-[#1A3650]/50 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ 9 · CTA — Nobl's "Let's Talk." ═══════ */}
      <section className="bg-[#F0EBE1] py-28 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ne-display font-black text-5xl md:text-6xl lg:text-7xl text-[#1A3650] leading-[0.92]">
            Let&apos;s Talk.
          </h2>
          <div className="mt-12">
            <Link
              href={page.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 rounded-full transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <NEFooter config={config} />
    </>
  );
}
