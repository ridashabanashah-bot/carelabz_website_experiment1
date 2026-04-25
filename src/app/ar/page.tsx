export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, CheckCircle2 } from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
import { getHomePage } from "@/lib/strapi-home";
import { getServicesByRegion } from "@/lib/strapi";
import { getBlogPosts } from "@/lib/strapi-blog";

const CC = "ar";
const COUNTRY_NAME = "Argentina";
const HREFLANG = "en-AR";
const config = COUNTRY_CONFIGS[CC];

// ── Fallback constants (BR-specific) ──────────────────────────────────────

const FALLBACK_INDUSTRIES = [
  "Manufacturing",
  "Commercial Buildings",
  "Data Centers",
  "Utilities",
  "Oil & Gas",
  "Healthcare",
  "Education",
  "Government",
  "Mining",
  "Energy",
];

const FALLBACK_PROCESS_STEPS = [
  {
    title: "Discovery",
    description:
      "Comprehensive analysis of your electrical infrastructure and current compliance status.",
  },
  {
    title: "Analysis",
    description:
      "Detailed power system studies including arc flash, short circuit, and load flow analysis.",
  },
  {
    title: "Reporting",
    description:
      "Complete technical documentation with findings, risk assessments, and actionable recommendations.",
  },
  {
    title: "Compliance",
    description: `Full regulatory compliance with ${config.primaryStandard}, IEEE 1584, and international standards.`,
  },
];

// ── Metadata ──────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage(CC);
  return {
    title:
      page?.metaTitle ??
      `Carelabs — Electrical Safety & Power System Studies | ${COUNTRY_NAME}`,
    description:
      page?.metaDescription ??
      `Carelabs provides IEEE 1584 arc flash studies, ${config.primaryStandard} compliance, short circuit analysis, and power system engineering across ${COUNTRY_NAME}.`,
    keywords: page?.seoKeywords ?? undefined,
    alternates: {
      canonical: `https://carelabz.com/${CC}/`,
      languages: {
        [HREFLANG]: `https://carelabz.com/${CC}/`,
        "x-default": `https://carelabz.com/${CC}/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `Carelabs ${COUNTRY_NAME} — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `IEEE 1584 arc flash studies, ${config.primaryStandard} compliance, and power system engineering across ${COUNTRY_NAME}.`,
      url: `https://carelabz.com/${CC}/`,
      siteName: "Carelabs",
      type: "website",
      locale: HREFLANG.replace("-", "_"),
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `Carelabs ${COUNTRY_NAME} — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `IEEE 1584 arc flash studies, ${config.primaryStandard} compliance, and power system engineering across ${COUNTRY_NAME}.`,
    },
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────

function splitAccent(headline: string): { lead: string; accent: string } {
  const words = headline.trim().split(/\s+/);
  if (words.length <= 1) return { lead: "", accent: headline };
  const last = words[words.length - 1];
  return { lead: words.slice(0, -1).join(" "), accent: last };
}

function trimTo(text: string | null | undefined, max: number): string {
  if (!text) return "";
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  return clean.slice(0, max - 1).trimEnd() + "…";
}

function formatDate(value: string | null | undefined): string {
  if (!value) return "";
  try {
    return new Date(value).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return "";
  }
}

// ── Page ──────────────────────────────────────────────────────────────────

export default async function ARHomePage() {
  const [page, servicePages, allPosts] = await Promise.all([
    getHomePage(CC),
    getServicesByRegion(CC),
    getBlogPosts(CC),
  ]);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#0B1A2F] font-body">
        <p className="text-lg">Page content unavailable</p>
      </main>
    );
  }

  const headlineRaw = page.heroHeadline ?? "Electrical Safety Experts";
  const { lead: headlineLead } = splitAccent(headlineRaw);
  const heroLead = headlineLead || headlineRaw;

  const heroSubtext =
    page.heroSubtext ??
    `Industry-leading power systems engineering and arc flash studies for ${COUNTRY_NAME}.`;

  const heroPrimaryText = page.heroPrimaryCtaText ?? "Request a Study";
  const heroPrimaryHref = page.heroPrimaryCtaHref ?? config.contactPath;

  // Trust / certification pills (prefer Strapi, fallback to config.standards)
  const trustBadgesForHero: string[] =
    page.trustBadges && page.trustBadges.length > 0
      ? page.trustBadges.map((b) => b.label)
      : config.standards.slice(0, 6);

  // Services: always derive from ServicePage query so every card href points
  // to a slug that actually exists in Strapi. Using page.services (the
  // HomePage content type) is fragile — editors can publish hrefs that do
  // not map to any ServicePage, causing 404s on click. ServicePage-derived
  // cards are guaranteed to resolve via the /{cc}/[slug] route.
  const knownSlugs = new Set(
    servicePages.map((s) =>
      s.slug.endsWith(`-${CC}`) ? s.slug.slice(0, -3) : s.slug
    )
  );

  const servicePageCards = servicePages.slice(0, 8).map((s) => {
    const urlSlug = s.slug.endsWith(`-${CC}`) ? s.slug.slice(0, -3) : s.slug;
    return {
      title: s.title,
      description: trimTo(s.metaDescription, 140),
      href: `/${CC}/${urlSlug}/`,
    };
  });

  const homeServiceCards = (page.services ?? [])
    .map((s) => ({ title: s.title, description: s.description, href: s.href }))
    .filter((s) => {
      const m = s.href.match(/^\/[a-z]{2}\/([^/]+)\/?$/);
      return m ? knownSlugs.has(m[1]) : false;
    });

  // Prefer Strapi-authored cards only if every one of them resolves to a
  // real ServicePage; otherwise fall through to ServicePage-derived cards.
  const servicesToShow =
    homeServiceCards.length > 0 &&
    homeServiceCards.length === (page.services?.length ?? 0)
      ? homeServiceCards.slice(0, 8)
      : servicePageCards;

  // Process steps — prefer Strapi service-level processSteps if they exist at
  // the service scope; home page has no dedicated field, so use BR fallbacks
  const processSteps = FALLBACK_PROCESS_STEPS;

  // Industries marquee
  const industriesForMarquee: string[] =
    page.industries && page.industries.length > 0
      ? page.industries.map((i) => i.name)
      : FALLBACK_INDUSTRIES;

  // Insights / blog: Strapi insights[] first, else blog posts
  const insightsForList: Array<{
    category: string | null;
    title: string;
    description: string;
    href: string;
    image?: string | null;
    date?: string | null;
  }> = (() => {
    if (page.insights && page.insights.length > 0) {
      return page.insights.slice(0, 3).map((i) => ({
        category: i.category,
        title: i.title,
        description: i.description,
        href: i.href,
        image: i.image,
      }));
    }
    const sorted = [...allPosts].sort(
      (a, b) =>
        new Date(b.publishedDate ?? b.publishedAt).getTime() -
        new Date(a.publishedDate ?? a.publishedAt).getTime()
    );
    return sorted.slice(0, 3).map((p) => {
      const urlSlug = p.slug.endsWith(`-${CC}`) ? p.slug.slice(0, -3) : p.slug;
      return {
        category: p.category,
        title: p.title,
        description: trimTo(p.excerpt ?? p.metaDescription, 140),
        href: `/${CC}/${urlSlug}/`,
        image: p.heroImage,
        date: p.publishedDate ?? p.publishedAt,
      };
    });
  })();

  // CTA
  const ctaHeading = [
    page.ctaBannerHeading ?? "Ready to",
    page.ctaBannerSubtext ? "" : "Get Started?",
  ]
    .filter(Boolean)
    .join(" ");
  const ctaSubtext = page.ctaBannerSubtext ?? null;
  const ctaButtonText = page.ctaBannerPrimaryText ?? "Contact Us";
  const ctaButtonHref = page.ctaBannerPrimaryHref ?? config.contactPath;

  // How-It-Works heading (two-part: condensed lead + italic accent)
  const serviceHeadingRaw = page.servicesHeading ?? "Our Core Services";
  const serviceHeading = splitAccent(serviceHeadingRaw);

  // JSON-LD
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
    <div className="bg-white">
      <JsonLd data={jsonLdData} />

      {/* Fixed header: ticker + navbar */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* 1. HERO — typographic, full-viewport, navy */}
        <section className="relative min-h-[calc(100vh-112px)] bg-[#0B1A2F] overflow-hidden flex items-center justify-center">
          {/* subtle grid texture at 4% opacity */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />

          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-24 text-center">
            <h1 className="font-condensed font-extrabold text-5xl sm:text-6xl md:text-7xl lg:text-8xl uppercase text-white leading-[0.95] tracking-tight">
              {heroLead}
              <span className="text-orange-500 block">{COUNTRY_NAME}</span>
            </h1>
            <p className="font-body text-lg text-white/70 max-w-2xl mx-auto mt-8">
              {heroSubtext}
            </p>
            <div className="mt-10">
              <Link
                href={heroPrimaryHref}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold uppercase tracking-wide px-10 py-4 rounded-full text-base hover:scale-105 transition-all"
              >
                {heroPrimaryText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

        {/* 2. TRUST BAR — certification pills only */}
        {trustBadgesForHero.length > 0 && (
          <section className="bg-[#1E293B] py-12">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="flex flex-wrap lg:flex-nowrap justify-center gap-4">
                {trustBadgesForHero.map((badge, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 hover:bg-white/15 hover:scale-[1.02] transition-all"
                  >
                    <CheckCircle2 className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="text-sm font-semibold text-white font-body whitespace-nowrap">
                      {badge}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 3. SERVICES — folder-tab horizontal scroll */}
        {servicesToShow.length > 0 && (
          <section id="services" className="bg-[#F8FAFC] py-20 lg:py-28">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="mb-12 max-w-3xl">
                <h2 className="text-3xl md:text-5xl leading-tight">
                  {serviceHeading.lead && (
                    <span className="font-condensed font-extrabold uppercase text-[#0B1A2F]">
                      {serviceHeading.lead}{" "}
                    </span>
                  )}
                  <span className="font-accent italic text-orange-500">
                    {serviceHeading.accent}
                  </span>
                </h2>
                {page.servicesSubtext && (
                  <p className="font-body text-lg text-gray-600 mt-6 max-w-2xl">
                    {page.servicesSubtext}
                  </p>
                )}
              </div>

              <div className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scrollbar-hide -mx-6 px-6 lg:-mx-12 lg:px-12">
                {servicesToShow.map((service, i) => {
                  const featured = i === 0;
                  const cardBg = featured
                    ? "bg-[#0B1A2F] text-white"
                    : "bg-white border border-gray-200 text-[#0B1A2F]";
                  return (
                    <Link
                      key={i}
                      href={service.href}
                      className={`snap-start shrink-0 w-[280px] sm:w-[320px] rounded-2xl rounded-tr-none overflow-hidden min-h-[380px] flex flex-col ${cardBg} hover:shadow-2xl transition-shadow group`}
                    >
                      <div className="p-6 pb-0">
                        <span
                          className={`inline-block font-condensed text-xs uppercase tracking-widest font-semibold ${
                            featured ? "text-orange-500" : "text-orange-500"
                          }`}
                        >
                          {String(i + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-condensed font-bold text-xl uppercase mt-4 px-6 leading-tight">
                        {service.title}
                      </h3>
                      <p
                        className={`font-body text-sm leading-relaxed mt-3 px-6 flex-grow ${
                          featured ? "text-white/70" : "text-gray-600"
                        }`}
                      >
                        {service.description}
                      </p>
                      <span className="px-6 pb-6 mt-4 font-condensed font-semibold uppercase tracking-wider text-orange-500 group-hover:text-orange-400 inline-flex items-center gap-2">
                        View Details <ArrowRight className="w-4 h-4" />
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* 4. HOW IT WORKS — editorial numbered flow */}
        <section className="bg-white py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
              How It Works
            </p>
            <h2 className="font-condensed font-extrabold text-4xl md:text-6xl text-[#0B1A2F] uppercase max-w-4xl leading-tight">
              From messy{" "}
              <span className="font-accent italic font-normal text-orange-500 normal-case">
                power systems
              </span>{" "}
              to total{" "}
              <span className="font-accent italic font-normal text-orange-500 normal-case">
                compliance
              </span>
              .
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mt-16">
              {processSteps.map((step, i) => (
                <div key={i} className="border-t-2 border-orange-500 pt-6">
                  <div className="font-condensed font-extrabold text-6xl text-orange-500/20 leading-none">
                    {String(i + 1).padStart(2, "0")}
                  </div>
                  <h3 className="font-condensed font-bold text-xl text-[#0B1A2F] uppercase mt-2">
                    {step.title}
                  </h3>
                  <p className="font-body text-sm text-gray-600 leading-relaxed mt-3">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 5. INDUSTRIES — marquee only */}
        <section id="industries" className="bg-[#0B1A2F] py-12">
          <p className="text-center font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-6">
            Industries We Serve
          </p>
          <div className="overflow-hidden">
            <div className="animate-marquee-slow whitespace-nowrap">
              {Array.from({ length: 3 }).map((_, setIdx) => (
                <span key={setIdx} className="inline-flex items-center">
                  {industriesForMarquee.map((industry, i) => (
                    <span key={i} className="inline-flex items-center">
                      <span className="font-condensed font-extrabold text-4xl md:text-6xl uppercase text-white/10 mx-8">
                        {industry}
                      </span>
                      <span className="text-orange-500 text-3xl">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 6. INSIGHTS — folder-tab cards */}
        {insightsForList.length > 0 && (
          <section id="blog" className="bg-white py-20 lg:py-28">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-6 mb-12">
                <h2 className="text-3xl md:text-5xl leading-tight">
                  <span className="font-condensed font-extrabold uppercase text-[#0B1A2F]">
                    From the{" "}
                  </span>
                  <span className="font-accent italic text-orange-500">
                    Blog
                  </span>
                </h2>
                <Link
                  href={config.blogIndexPath}
                  className="inline-flex items-center gap-2 font-condensed font-semibold uppercase tracking-wider text-orange-500 hover:text-orange-400"
                >
                  View All Articles <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {insightsForList.map((post, i) => (
                  <Link
                    key={i}
                    href={post.href}
                    className="group rounded-2xl rounded-tr-none overflow-hidden border border-gray-200 bg-white hover:shadow-2xl transition-shadow flex flex-col"
                  >
                    {post.image && post.image.startsWith("http") ? (
                      <div className="relative h-48 overflow-hidden">
                        <Image
                          src={post.image}
                          alt={post.title}
                          fill
                          sizes="(max-width: 768px) 100vw, 33vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      </div>
                    ) : (
                      <div className="relative h-48 bg-[#0B1A2F]" />
                    )}
                    {post.category && (
                      <span className="font-condensed text-xs uppercase tracking-wider text-orange-500 mt-4 px-6 font-semibold">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-condensed font-bold text-lg text-[#0B1A2F] mt-2 px-6 uppercase leading-tight">
                      {post.title}
                    </h3>
                    <p className="font-body text-sm text-gray-600 mt-2 px-6 line-clamp-3 flex-grow">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between px-6 pb-6 mt-4">
                      {post.date && (
                        <span className="font-body text-xs text-gray-500">
                          {formatDate(post.date)}
                        </span>
                      )}
                      <span className="font-condensed font-semibold uppercase tracking-wider text-orange-500 inline-flex items-center gap-2">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 7. FAQ */}
        {page.faqs && page.faqs.length > 0 && (
          <section className="bg-[#F8FAFC] py-20 lg:py-28">
            <div className="max-w-3xl mx-auto px-6 lg:px-12">
              <div className="mb-10 text-center">
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  FAQ
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase">
                  {page.faqsHeading ?? "Frequently Asked Questions"}
                </h2>
              </div>
              <div className="space-y-4">
                {page.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-2xl p-6 border border-gray-200 open:shadow-lg transition-shadow"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="font-condensed font-bold uppercase text-[#0B1A2F] pr-6">
                        {faq.question}
                      </span>
                      <span className="text-orange-500 text-2xl transition-transform group-open:rotate-45 shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 text-gray-600 font-body leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* 8. CTA BANNER — full-width gradient, centered */}
        <section
          id="contact"
          className="relative py-24 lg:py-32 overflow-hidden bg-gradient-to-r from-orange-500 to-[#0B1A2F]"
        >
          <div className="relative max-w-4xl mx-auto text-center px-6">
            <h2 className="font-condensed font-extrabold text-4xl md:text-6xl text-white uppercase leading-tight">
              {ctaHeading}
            </h2>
            {ctaSubtext && (
              <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
                {ctaSubtext}
              </p>
            )}
            <Link
              href={ctaButtonHref}
              className="mt-10 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide"
            >
              {ctaButtonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      {/* 9. FOOTER */}
      <SAFooter config={config} email={page.footerEmail} />
    </div>
  );
}
