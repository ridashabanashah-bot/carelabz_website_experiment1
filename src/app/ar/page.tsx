export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Award,
  Clock,
  Zap,
  Search,
  Thermometer,
  BarChart,
  Settings,
  CheckCircle,
  ArrowRight,
  Phone,
} from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["ar"];
import { JsonLd } from "@/components/JsonLd";
import { ServiceFaqAccordion } from "@/components/service-page/faq-accordion-new";
import { getHomePage } from "@/lib/strapi-home";

type LucideProps = React.ComponentProps<typeof Zap>;

function ServiceIcon({
  name,
  ...props
}: { name: string } & LucideProps) {
  switch (name) {
    case "zap":
      return <Zap {...props} />;
    case "search":
      return <Search {...props} />;
    case "thermometer":
      return <Thermometer {...props} />;
    case "bar-chart":
      return <BarChart {...props} />;
    case "settings":
      return <Settings {...props} />;
    default:
      return <Zap {...props} />;
  }
}

function WhyIcon({ name, ...props }: { name: string } & LucideProps) {
  switch (name) {
    case "shield":
      return <Shield {...props} />;
    case "award":
      return <Award {...props} />;
    case "clock":
      return <Clock {...props} />;
    default:
      return <Shield {...props} />;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage("ar");
  return {
    title: page?.metaTitle ?? "Carelabs — Electrical Safety & Power System Studies | Argentina",
    description:
      page?.metaDescription ??
      "Carelabs provides IEEE 1584 arc flash studies, AEA 90364 compliance, short circuit analysis, and power system engineering across Argentina.",
    keywords: page?.seoKeywords ?? undefined,
    alternates: {
      canonical: "https://carelabz.com/ar/",
      languages: {
        "en-AR": "https://carelabz.com/ar/",
        "x-default": "https://carelabz.com/ar/",
      },
    },
    openGraph: {
      title: page?.metaTitle ?? "Carelabs Argentina — Electrical Safety & Power System Studies",
      description:
        page?.metaDescription ?? "IEEE 1584 arc flash studies, AEA 90364 compliance, and power system engineering across Argentina.",
      url: "https://carelabz.com/ar/",
      siteName: "Carelabs",
      type: "website",
      locale: "en_AR",
    },
    twitter: {
      card: "summary_large_image",
      title: page?.metaTitle ?? "Carelabs Argentina — Electrical Safety & Power System Studies",
      description:
        page?.metaDescription ?? "IEEE 1584 arc flash studies, AEA 90364 compliance, and power system engineering across Argentina.",
    },
  };
}

export default async function ARHomePage() {
  const page = await getHomePage("ar");

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#EEF4FF] text-[#1A2538]">
        <p className="text-lg">Page content unavailable</p>
      </main>
    );
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Carelabs",
    description: page.metaDescription,
    url: "https://carelabz.com/ar/",
    telephone: page.footerPhone ?? "+1-800-456-7890",
    email: page.footerEmail ?? "info@carelabz.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: page.footerAddress ?? "Toronto, ON, Argentina",
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <RegionNavbar config={config} />

      <section className="relative min-h-screen bg-[#EEF4FF] overflow-hidden flex items-center">
        <div className="absolute inset-0 opacity-10" aria-hidden="true">
          <svg
            className="w-full h-full"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 800 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <defs>
              <pattern
                id="circuit"
                x="0"
                y="0"
                width="80"
                height="80"
                patternUnits="userSpaceOnUse"
              >
                <path
                  d="M10 10 h20 v20 h20 v-20 h20 M50 10 v60 M10 50 h60"
                  stroke="#F97316"
                  strokeWidth="1"
                  fill="none"
                />
                <circle cx="10" cy="10" r="2" fill="#F97316" />
                <circle cx="50" cy="50" r="2" fill="#F97316" />
                <circle cx="70" cy="10" r="2" fill="#F97316" />
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#circuit)" />
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-24 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {page.heroEyebrow && (
                <span className="text-xs font-semibold uppercase tracking-widest text-orange-400 mb-4 block">
                  {page.heroEyebrow}
                </span>
              )}
              {page.heroHeadline && (
                <h1 className="text-4xl sm:text-5xl font-bold text-[#1A2538] leading-tight mb-6">
                  {page.heroHeadline}
                </h1>
              )}
              {page.heroSubtext && (
                <p className="text-lg text-[#374151] mb-8 leading-relaxed">
                  {page.heroSubtext}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mb-10">
                {page.heroPrimaryCtaText && page.heroPrimaryCtaHref && (
                  <Link
                    href={page.heroPrimaryCtaHref}
                    className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-orange-600"
                  >
                    {page.heroPrimaryCtaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {page.heroSecondaryCtaText && page.heroSecondaryCtaHref && (
                  <Link
                    href={page.heroSecondaryCtaHref}
                    className="inline-flex items-center gap-2 rounded-lg border-2 border-[#1A2538]/30 px-6 py-3 text-sm font-semibold text-[#1A2538] transition-colors hover:border-[#1A2538]/60 hover:bg-[#1A2538]/5"
                  >
                    {page.heroSecondaryCtaText}
                  </Link>
                )}
              </div>

              {page.trustBadges && page.trustBadges.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {page.trustBadges.map((badge, i) => (
                    <div
                      key={i}
                      className="rounded-lg bg-white border border-blue-100 p-4 flex items-center gap-2"
                    >
                      <CheckCircle className="w-4 h-4 text-orange-400 shrink-0" />
                      <span className="text-xs text-[#0050B3] font-medium">
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {page.heroImage && (
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-2xl bg-orange-500/20 blur-3xl"
                  aria-hidden="true"
                />
                <div className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image
                    src={page.heroImage}
                    alt={page.heroImageAlt ?? "Hero image"}
                    fill
                    priority
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 50vw"
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#EEF4FF] py-16 px-4">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold text-[#1A2538] mb-6">Proactive Risk Assessment Solutions Tailored to Your Needs</h2>
          <p className="text-lg text-[#374151] max-w-3xl mx-auto">
            At Carelabs, we understand the importance of identifying risks and mitigating them to enhance the performance and safety of your power system and your people. We are committed to ensuring that your power system is compliant with Argentinan standards of electrical safety by integrating technical expertise with high-end tools like ETAP.
          </p>
        </div>
      </section>

      {page.services && page.services.length > 0 && (
        <section className="bg-offWhite py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              {page.servicesHeading && (
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
                  {page.servicesHeading}
                </h2>
              )}
              {page.servicesSubtext && (
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  {page.servicesSubtext}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {page.services.map((service, i) => (
                <div
                  key={i}
                  className="group rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-orange-500/50 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 text-orange-500">
                    <ServiceIcon name={service.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {service.title}
                  </h3>
                  <p className="text-slate-600 mb-6 leading-relaxed">
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 transition-colors hover:text-orange-600"
                  >
                    Learn more
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.whyFeatures && page.whyFeatures.length > 0 && (
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              {page.whyHeading && (
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
                  {page.whyHeading}
                </h2>
              )}
              {page.whySubtext && (
                <p className="text-lg text-slate-600 max-w-2xl mx-auto">
                  {page.whySubtext}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {page.whyFeatures.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-200 hover:shadow-lg hover:border-orange-500/50 hover:-translate-y-1"
                >
                  <div className="mb-4 inline-flex items-center justify-center w-12 h-12 rounded-lg bg-orange-50 text-orange-500">
                    <WhyIcon name={feature.icon} className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-semibold text-navy mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-slate-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#EEF4FF] py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              {page.industriesHeading && (
                <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2538] mb-4">
                  {page.industriesHeading}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {page.industries.map((industry, i) => (
                <div
                  key={i}
                  className="bg-white border-l-4 border-[#0050B3] rounded-r-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <p className="text-[#1A2538] font-semibold text-sm">
                    {industry.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.insights && page.insights.length > 0 && (
        <section className="bg-offWhite py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              {page.insightsHeading && (
                <h2 className="text-3xl sm:text-4xl font-bold text-navy mb-4">
                  {page.insightsHeading}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {page.insights.map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-200 hover:shadow-lg"
                >
                  <div className="relative aspect-[16/9] overflow-hidden">
                    <Image
                      src={insight.image}
                      alt={insight.alt}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                  </div>
                  <div className="p-6">
                    <span className="text-xs font-semibold uppercase tracking-widest text-orange-500">
                      {insight.category}
                    </span>
                    <h3 className="text-lg font-semibold text-navy mt-2 mb-3">
                      {insight.title}
                    </h3>
                    <p className="text-slate-600 text-sm leading-relaxed mb-4">
                      {insight.description}
                    </p>
                    <span className="inline-flex items-center gap-2 text-sm font-semibold text-orange-500 group-hover:text-orange-600 transition-colors">
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#EEF4FF] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] text-center mb-12">
              {page.faqsHeading ?? "Customer Queries"}
            </h2>
            <ServiceFaqAccordion faqs={page.faqs} />
          </div>
        </section>
      )}

      <section id="contact" className="relative py-24 overflow-hidden">
        <div
          className="absolute inset-0 bg-gradient-to-r from-orange-500 to-navy"
          aria-hidden="true"
        />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          {page.ctaBannerHeading && (
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              {page.ctaBannerHeading}
            </h2>
          )}
          {page.ctaBannerSubtext && (
            <p className="text-lg text-white/80 max-w-2xl mx-auto mb-10">
              {page.ctaBannerSubtext}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {page.ctaBannerPrimaryText && page.ctaBannerPrimaryHref && (
              <Link
                href={page.ctaBannerPrimaryHref}
                className="inline-flex items-center gap-2 rounded-lg bg-white text-navy px-6 py-3 text-sm font-semibold transition-colors hover:bg-white/90"
              >
                {page.ctaBannerPrimaryText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {page.ctaBannerSecondaryText && page.ctaBannerSecondaryHref && (
              <Link
                href={page.ctaBannerSecondaryHref}
                className="inline-flex items-center gap-2 rounded-lg border-2 border-white/50 text-white px-6 py-3 text-sm font-semibold transition-colors hover:border-white hover:bg-white/10"
              >
                <Phone className="w-4 h-4" />
                {page.ctaBannerSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </section>

      <RegionFooter config={config} />
    </>
  );
}
