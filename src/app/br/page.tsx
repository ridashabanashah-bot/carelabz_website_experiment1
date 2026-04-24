export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ArrowRight,
  Award,
  Globe,
  Clock,
  Shield,
  CheckCircle2,
} from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
import { getHomePage } from "@/lib/strapi-home";
import { getServicesByRegion } from "@/lib/strapi";
import { getBlogPosts } from "@/lib/strapi-blog";

const CC = "br";
const COUNTRY_NAME = "Brazil";
const HREFLANG = "en-BR";
const config = COUNTRY_CONFIGS[CC];

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

const MANIFESTO_CREDENTIALS = [
  { icon: Award, title: "IEEE Certified", label: "Industry Standards" },
  { icon: Globe, title: "Global Reach", label: "50+ Countries" },
  { icon: Clock, title: "25+ Years", label: "Experience" },
];

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

function splitHeadline(headline: string): {
  lead: string;
  accent: string;
  watermark: string;
} {
  const words = headline.trim().split(/\s+/);
  if (words.length <= 1) {
    return { lead: "", accent: headline, watermark: "POWER" };
  }
  const last = words[words.length - 1];
  const lead = words.slice(0, -1).join(" ");
  const firstWord = words[0].toUpperCase();
  return { lead, accent: last, watermark: firstWord };
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

export default async function BRHomePage() {
  const [page, servicePages, allPosts] = await Promise.all([
    getHomePage(CC),
    getServicesByRegion(CC),
    getBlogPosts(CC),
  ]);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-white text-[#094d76] font-sans">
        <p className="text-lg">Page content unavailable</p>
      </main>
    );
  }

  const headlineRaw = page.heroHeadline ?? "Electrical Safety Experts";
  const { lead, accent, watermark } = splitHeadline(headlineRaw);

  const heroSubtext =
    page.heroSubtext ??
    `Industry-leading power systems engineering and arc flash studies for ${COUNTRY_NAME}.`;

  const heroPrimaryText = page.heroPrimaryCtaText ?? "Request a Study";
  const heroPrimaryHref = page.heroPrimaryCtaHref ?? config.contactPath;
  const heroSecondaryText = page.heroSecondaryCtaText ?? "Our Services";
  const heroSecondaryHref =
    page.heroSecondaryCtaHref ?? config.servicesIndexPath;

  // Trust / certification pills for hero (prefer Strapi, fallback to config.standards)
  const trustBadgesForHero: string[] =
    page.trustBadges && page.trustBadges.length > 0
      ? page.trustBadges.map((b) => b.label)
      : config.standards.slice(0, 6);

  // Services for editorial list: prefer Strapi home.services, fallback to ServicePage rows
  const servicesForList: Array<{
    title: string;
    description: string;
    href: string;
  }> = (() => {
    if (page.services && page.services.length > 0) {
      return page.services.slice(0, 6).map((s) => ({
        title: s.title,
        description: s.description,
        href: s.href,
      }));
    }
    return servicePages.slice(0, 6).map((s) => {
      const urlSlug = s.slug.endsWith(`-${CC}`) ? s.slug.slice(0, -3) : s.slug;
      return {
        title: s.title,
        description: trimTo(s.metaDescription, 120),
        href: `/${CC}/${urlSlug}/`,
      };
    });
  })();

  // WhyUs: whyFeatures first, else synthesize from services
  const whyFeaturesData: Array<{
    title: string;
    description: string;
  }> = (() => {
    if (page.whyFeatures && page.whyFeatures.length >= 3) {
      return page.whyFeatures.slice(0, 3).map((w) => ({
        title: w.title,
        description: w.description,
      }));
    }
    if (servicesForList.length >= 3) {
      return servicesForList.slice(0, 3).map((s) => ({
        title: s.title,
        description: s.description,
      }));
    }
    return [
      {
        title: "Industry Certified Engineers",
        description:
          "Our engineers hold PE licenses and maintain certifications aligned with IEEE, NETA, and NFPA standards.",
      },
      {
        title: "Precision Results",
        description:
          "We use industry-leading software like ETAP and EasyPower for reliable results every time.",
      },
      {
        title: "Practical Solutions",
        description:
          "Actionable recommendations that balance safety, compliance, and operational continuity.",
      },
    ];
  })();

  const whyIcons = [Award, Shield, CheckCircle2];

  // Industries marquee
  const industriesForMarquee: string[] =
    page.industries && page.industries.length > 0
      ? page.industries.map((i) => i.name)
      : FALLBACK_INDUSTRIES;

  // Insights: Strapi insights[] first, else blog posts
  const insightsForList: Array<{
    category: string | null;
    title: string;
    description: string;
    href: string;
    date?: string | null;
  }> = (() => {
    if (page.insights && page.insights.length > 0) {
      return page.insights.slice(0, 3).map((i) => ({
        category: i.category,
        title: i.title,
        description: i.description,
        href: i.href,
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
        date: p.publishedDate ?? p.publishedAt,
      };
    });
  })();

  const hasInsights = insightsForList.length > 0;
  const featuredInsight = insightsForList[0];
  const sideInsights = insightsForList.slice(1);

  // Manifesto
  const manifestoHeading =
    page.whyHeading ??
    page.servicesHeading ??
    "We believe every worker deserves to go home safely.";
  const manifestoBody =
    page.whySubtext ??
    trimTo(
      heroSubtext,
      240
    ) ??
    `Carelabs is at the forefront of electrical safety engineering in ${COUNTRY_NAME}. Our team brings deep expertise and a commitment to excellence.`;

  // CTA split section
  const ctaLeadText = page.ctaBannerHeading ?? "Ready to";
  const ctaTailText = page.ctaBannerSubtext
    ? trimTo(page.ctaBannerSubtext, 16)
    : "Get Started?";
  const ctaButtonText = page.ctaBannerPrimaryText ?? "Contact Us";
  const ctaButtonHref = page.ctaBannerPrimaryHref ?? config.contactPath;

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
    <main className="bg-white font-sans">
      <JsonLd data={jsonLdData} />

      {/* 1. ANNOUNCEMENT TICKER */}
      <SAAnnouncementTicker
        countryName={COUNTRY_NAME}
        standards={config.standards}
      />

      {/* 2. NAVBAR */}
      <SANavbar config={config} />

      {/* 3. HERO */}
      <section className="relative bg-[#f2f2f4] overflow-hidden">
        {/* Warm SA texture overlay */}
        <div
          className="absolute inset-0 pointer-events-none"
          style={{
            backgroundImage:
              "radial-gradient(circle at 2px 2px, rgba(241,92,48,0.08) 1.2px, transparent 0)",
            backgroundSize: "26px 26px",
          }}
          aria-hidden="true"
        />

        {/* Watermark */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none">
          <span className="font-serif font-black text-[20vw] text-[#e8f4fd] leading-none whitespace-nowrap">
            {watermark}
          </span>
        </div>

        {/* Geometric circles top-right */}
        <div className="absolute top-20 right-[10%] w-64 h-64 border-[3px] border-[#2575B6]/30 rounded-full" />
        <div className="absolute top-32 right-[15%] w-48 h-48 bg-[#3d8fd4]/20 rounded-full" />
        <div className="absolute top-10 right-[5%] w-32 h-32 border-[3px] border-[#1a5fa0]/20 rounded-full" />

        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 py-24 lg:py-40">
          <div className="max-w-4xl">
            <h1 className="font-serif font-black text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-[#094d76] leading-tight tracking-tight">
              {lead && <>{lead} </>}
              <span className="text-[#2575B6] block">{accent}</span>
            </h1>
            <p className="mt-10 text-lg text-[#9c9b9a] max-w-md leading-relaxed font-sans">
              {heroSubtext}
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4">
              <Link
                href={heroPrimaryHref}
                className="inline-flex items-center justify-center gap-3 bg-[#F15C30] text-white font-sans font-semibold px-8 py-4 rounded-full hover:bg-[#c44a1f] transition-colors"
              >
                {heroPrimaryText}
                <ArrowRight className="w-5 h-5" />
              </Link>
              <Link
                href={heroSecondaryHref}
                className="inline-flex items-center justify-center gap-3 border-2 border-[#094d76] text-[#094d76] font-sans font-semibold px-8 py-4 rounded-full hover:bg-[#094d76] hover:text-white transition-colors"
              >
                {heroSecondaryText}
              </Link>
            </div>

            {/* Trust / certification pills */}
            {trustBadgesForHero.length > 0 && (
              <div className="mt-12">
                <p className="text-[#094d76]/60 text-xs uppercase tracking-widest font-serif font-semibold mb-4">
                  Standards We Follow
                </p>
                <div className="flex flex-wrap lg:flex-nowrap gap-3">
                  {trustBadgesForHero.map((badge, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 rounded-full bg-white border border-[#094d76]/10 px-5 py-2.5 shadow-sm hover:shadow-md hover:border-[#F15C30]/40 hover:scale-[1.02] transition-all"
                    >
                      <CheckCircle2 className="w-4 h-4 text-[#F15C30] shrink-0" />
                      <span className="text-sm font-semibold text-[#094d76] font-sans whitespace-nowrap">
                        {badge}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* 4. INTRO */}
      <section className="bg-white py-20 lg:py-24">
        <div className="max-w-4xl mx-auto px-6 lg:px-12 text-center">
          <div className="w-1 h-16 bg-[#F15C30] mx-auto mb-8" />
          <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-[#094d76] tracking-tight mb-6">
            Proactive Risk Assessment Tailored to Your Facility
          </h2>
          <p className="text-lg text-[#9c9b9a] leading-relaxed font-sans max-w-3xl mx-auto">
            Carelabs identifies and mitigates electrical risk to keep your{" "}
            {COUNTRY_NAME} facility compliant with {config.primaryStandard} and
            international standards. Our engineers pair deep technical
            expertise with industry tools like ETAP to deliver reports you and
            your regulators can act on.
          </p>
        </div>
      </section>

      {/* 5. SERVICES EDITORIAL LIST */}
      {servicesForList.length > 0 && (
        <section id="services" className="py-24 lg:py-40 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="mb-20">
              <span className="text-[#F15C30] text-sm uppercase tracking-widest font-semibold font-serif">
                What We Do
              </span>
              <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#094d76] mt-4 tracking-tight">
                {page.servicesHeading ?? "Our Services"}
              </h2>
              {page.servicesSubtext && (
                <p className="mt-6 max-w-2xl text-[#9c9b9a] font-sans leading-relaxed">
                  {page.servicesSubtext}
                </p>
              )}
            </div>
            <div className="divide-y divide-[#094d76]/10">
              {servicesForList.map((service, index) => (
                <Link
                  key={index}
                  href={service.href}
                  className="group relative flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-12 py-8 lg:py-10 hover:bg-[#e8f4fd] -mx-6 lg:-mx-12 px-6 lg:px-12 transition-colors cursor-pointer border-l-4 border-transparent hover:border-[#F15C30]"
                >
                  <span className="font-serif font-black text-6xl lg:text-7xl text-[#f2f2f4] group-hover:text-[#e8f4fd] transition-colors w-24 flex-shrink-0">
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-serif font-bold text-2xl lg:text-3xl text-[#094d76] flex-1">
                    {service.title}
                  </h3>
                  <p className="text-[#9c9b9a] max-w-sm leading-relaxed hidden lg:block font-sans">
                    {service.description}
                  </p>
                  <div className="text-[#F15C30] transform group-hover:translate-x-2 transition-transform">
                    <ArrowRight className="w-6 h-6" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 6. MANIFESTO */}
      <section
        id="about"
        className="relative py-24 lg:py-40 bg-[#094d76] overflow-hidden"
      >
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none"
          aria-hidden="true"
        >
          <span className="font-serif font-black text-[15vw] text-white/5 leading-none whitespace-nowrap">
            CARELABS
          </span>
        </div>
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="max-w-3xl">
            <div className="w-1 h-24 bg-[#F15C30] mb-10" />
            <h2 className="font-serif font-black text-3xl sm:text-4xl lg:text-5xl text-white leading-tight">
              {manifestoHeading}
            </h2>
            <p className="mt-10 text-lg text-white/70 leading-relaxed max-w-2xl font-sans">
              {manifestoBody}
            </p>
            <div className="mt-12 grid sm:grid-cols-3 gap-6 sm:gap-8">
              {MANIFESTO_CREDENTIALS.map((cred, i) => {
                const Icon = cred.icon;
                return (
                  <div key={i} className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-[#F15C30] rounded-xl flex items-center justify-center flex-shrink-0">
                      <Icon className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <div className="font-serif font-bold text-white text-lg">
                        {cred.title}
                      </div>
                      <div className="text-white/50 text-sm font-sans">
                        {cred.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* SA curved wave divider at bottom */}
        <svg
          className="absolute bottom-0 left-0 w-full pointer-events-none"
          viewBox="0 0 1440 60"
          fill="none"
          preserveAspectRatio="none"
          aria-hidden="true"
        >
          <path
            d="M0,30 Q360,0 720,30 T1440,30 L1440,60 L0,60 Z"
            fill="#f2f2f4"
          />
          <path
            d="M0,30 Q360,0 720,30 T1440,30"
            stroke="#F15C30"
            strokeWidth="2"
            fill="none"
            opacity="0.6"
          />
        </svg>
      </section>

      {/* 7. WHY US */}
      <section className="py-24 lg:py-40 bg-[#f2f2f4]">
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
          <div className="mb-16">
            <span className="text-[#F15C30] text-sm uppercase tracking-widest font-semibold font-serif">
              {page.whyHeading ? "Why Choose Us" : "Why Choose Us"}
            </span>
            <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#094d76] mt-4 tracking-tight">
              Engineering Excellence
            </h2>
          </div>
          <div className="grid lg:grid-cols-2 gap-6">
            <div className="bg-white p-10 lg:p-14 rounded-3xl hover:shadow-2xl transition-shadow">
              <div className="w-20 h-20 bg-[#e8f4fd] rounded-2xl flex items-center justify-center mb-8">
                {(() => {
                  const Icon = whyIcons[0];
                  return <Icon className="w-10 h-10 text-[#2575B6]" />;
                })()}
              </div>
              <h3 className="font-serif font-bold text-3xl lg:text-4xl text-[#094d76] mb-6">
                {whyFeaturesData[0].title}
              </h3>
              <p className="text-[#9c9b9a] text-lg leading-relaxed font-sans">
                {whyFeaturesData[0].description}
              </p>
            </div>
            <div className="space-y-6">
              {whyFeaturesData.slice(1, 3).map((feature, index) => {
                const Icon = whyIcons[index + 1] ?? Shield;
                return (
                  <div
                    key={index}
                    className="bg-white p-8 lg:p-10 rounded-3xl hover:shadow-2xl transition-shadow"
                  >
                    <div className="flex items-start gap-6">
                      <div className="w-16 h-16 bg-[#e8f4fd] rounded-2xl flex items-center justify-center flex-shrink-0">
                        <Icon className="w-8 h-8 text-[#2575B6]" />
                      </div>
                      <div>
                        <h3 className="font-serif font-bold text-2xl text-[#094d76] mb-3">
                          {feature.title}
                        </h3>
                        <p className="text-[#9c9b9a] leading-relaxed font-sans">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* 8. INDUSTRIES MARQUEE */}
      <section
        id="industries"
        className="py-24 lg:py-32 bg-[#094d76] overflow-hidden"
      >
        <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mb-12">
          <span className="text-[#F15C30] text-sm uppercase tracking-widest font-semibold font-serif">
            Industries We Serve
          </span>
          <h2 className="font-serif font-black text-4xl sm:text-5xl text-white mt-4 tracking-tight">
            {page.industriesHeading ?? "Trusted Across Sectors"}
          </h2>
        </div>
        <div className="relative">
          <div className="animate-marquee-slow whitespace-nowrap py-8">
            {[...Array(3)].map((_, setIndex) => (
              <span key={setIndex} className="inline-flex items-center">
                {industriesForMarquee.map((industry, index) => (
                  <span key={index} className="inline-flex items-center">
                    <span className="text-white font-serif font-bold text-2xl lg:text-3xl mx-8">
                      {industry}
                    </span>
                    <span className="text-[#F15C30] text-2xl">•</span>
                  </span>
                ))}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* 9. INSIGHTS */}
      {hasInsights && featuredInsight && (
        <section id="insights" className="py-24 lg:py-40 bg-white">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="flex flex-col lg:flex-row lg:items-end lg:justify-between gap-8 mb-16">
              <div>
                <span className="text-[#F15C30] text-sm uppercase tracking-widest font-semibold font-serif">
                  Insights
                </span>
                <h2 className="font-serif font-black text-4xl sm:text-5xl lg:text-6xl text-[#094d76] mt-4 tracking-tight">
                  {page.insightsHeading ?? "Latest Articles"}
                </h2>
              </div>
              <Link
                href={config.blogIndexPath}
                className="group inline-flex items-center gap-3 text-[#094d76] font-serif font-semibold hover:text-[#F15C30] transition-colors"
              >
                View All Articles
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
            <div className="grid lg:grid-cols-2 gap-8">
              <Link
                href={featuredInsight.href}
                className="group bg-[#094d76] rounded-3xl p-10 lg:p-14 flex flex-col justify-end min-h-[500px] relative overflow-hidden"
              >
                {/* Dot pattern */}
                <div
                  className="absolute inset-0 opacity-10"
                  style={{
                    backgroundImage:
                      "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                    backgroundSize: "32px 32px",
                  }}
                  aria-hidden="true"
                />
                {/* SA warm gradient overlay */}
                <div
                  className="absolute inset-0 pointer-events-none"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(241,92,48,0.08) 0%, transparent 60%)",
                  }}
                  aria-hidden="true"
                />
                <div className="relative">
                  {featuredInsight.category && (
                    <span className="text-[#F15C30] text-sm font-semibold uppercase tracking-wider font-serif">
                      {featuredInsight.category}
                    </span>
                  )}
                  <h3 className="font-serif font-bold text-3xl lg:text-4xl text-white mt-4 mb-6 group-hover:text-[#F15C30] transition-colors">
                    {featuredInsight.title}
                  </h3>
                  <p className="text-white/70 leading-relaxed mb-6 font-sans">
                    {featuredInsight.description}
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-white/50 text-sm font-sans">
                      {formatDate(featuredInsight.date)}
                    </span>
                    <ArrowRight className="w-5 h-5 text-white group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </Link>
              <div className="space-y-8">
                {sideInsights.map((post, index) => (
                  <Link
                    key={index}
                    href={post.href}
                    className="group block p-8 lg:p-10 border border-[#094d76]/10 rounded-3xl hover:border-[#094d76]/30 transition-colors"
                  >
                    {post.category && (
                      <span className="text-[#F15C30] text-sm font-semibold uppercase tracking-wider font-serif">
                        {post.category}
                      </span>
                    )}
                    <h3 className="font-serif font-bold text-2xl text-[#094d76] mt-3 mb-4 group-hover:text-[#2575B6] transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-[#9c9b9a] leading-relaxed mb-4 font-sans">
                      {post.description}
                    </p>
                    <div className="flex items-center justify-between">
                      <span className="text-[#9c9b9a] text-sm font-sans">
                        {formatDate(post.date)}
                      </span>
                      <ArrowRight className="w-5 h-5 text-[#094d76] group-hover:translate-x-2 transition-transform" />
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}

      {/* FAQ (kept from Strapi if present) */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="py-24 lg:py-32 bg-[#f2f2f4]">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="mb-12 text-center">
              <span className="text-[#F15C30] text-sm uppercase tracking-widest font-semibold font-serif">
                FAQ
              </span>
              <h2 className="font-serif font-black text-4xl sm:text-5xl text-[#094d76] mt-4 tracking-tight">
                {page.faqsHeading ?? "Frequently Asked Questions"}
              </h2>
            </div>
            <div className="space-y-4">
              {page.faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group bg-white rounded-2xl p-6 open:shadow-lg transition-shadow"
                >
                  <summary className="flex items-center justify-between cursor-pointer list-none">
                    <span className="font-serif font-bold text-[#094d76] text-lg pr-6">
                      {faq.question}
                    </span>
                    <span className="text-[#F15C30] text-2xl transition-transform group-open:rotate-45">
                      +
                    </span>
                  </summary>
                  <p className="mt-4 text-[#9c9b9a] font-sans leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* 10. CTA SPLIT SECTION */}
      <section id="contact" className="relative">
        <div className="flex flex-col lg:flex-row">
          <div className="flex-1 bg-[#F15C30] py-24 lg:py-40 px-6 lg:px-12 flex items-center justify-center lg:justify-end">
            <h2 className="font-serif font-black text-5xl lg:text-7xl text-white text-center lg:text-right lg:pr-8 lg:mr-20">
              {ctaLeadText}
            </h2>
          </div>
          <div className="flex-1 bg-[#094d76] py-24 lg:py-40 px-6 lg:px-12 flex items-center justify-center lg:justify-start">
            <h2 className="font-serif font-black text-5xl lg:text-7xl text-white text-center lg:text-left lg:pl-8 lg:ml-20">
              {ctaTailText}
            </h2>
          </div>
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href={ctaButtonHref}
              className="inline-flex items-center gap-3 bg-white text-[#094d76] font-serif font-bold px-8 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base"
            >
              {ctaButtonText}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* 11. FOOTER */}
      <SAFooter
        config={config}
        phone={page.footerPhone}
        email={page.footerEmail}
        address={page.footerAddress}
        description={page.footerDescription}
      />
    </main>
  );
}
