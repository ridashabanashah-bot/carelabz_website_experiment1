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
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import { JsonLd } from "@/components/JsonLd";
import { getHomePage } from "@/lib/strapi-home";

// ── Icon helpers ────────────────────────────────────────────────────────────

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

// ── Metadata ────────────────────────────────────────────────────────────────

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage("us");
  return {
    title: page?.metaTitle ?? "CareLabs — Electrical Safety & Power System Studies | USA",
    description:
      page?.metaDescription ??
      "CareLabs provides IEEE 1584 arc flash studies, NFPA 70E compliance, short circuit analysis, and power system engineering across the United States.",
    keywords: page?.seoKeywords ?? undefined,
    openGraph: page?.ogImage
      ? { images: [page.ogImage] }
      : undefined,
  };
}

// ── Page ────────────────────────────────────────────────────────────────────

export default async function USHomePage() {
  const page = await getHomePage("us");

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-navy text-white">
        <p className="text-lg">Page content unavailable</p>
      </main>
    );
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "CareLabs",
    description: page.metaDescription,
    url: "https://carelabz.com/us/",
    telephone: page.footerPhone,
    email: page.footerEmail,
    address: {
      "@type": "PostalAddress",
      addressLocality: page.footerAddress,
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <StickyNavbar />

      {/* ── Hero ─────────────────────────────────────────────────────────── */}
      <section className="relative min-h-screen bg-[#EEF4FF] overflow-hidden flex items-center">
        {/* Circuit SVG pattern background */}
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
            {/* Left column */}
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

              {/* CTA Buttons */}
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

              {/* Trust badges */}
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

            {/* Right column — hero image */}
            {page.heroImage && (
              <div className="relative">
                {/* Orange glow */}
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

      {/* ── Services ─────────────────────────────────────────────────────── */}
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

      {/* ── Why CareLabs ─────────────────────────────────────────────────── */}
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

      {/* ── Industries ───────────────────────────────────────────────────── */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              {page.industriesHeading && (
                <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                  {page.industriesHeading}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {page.industries.map((industry, i) => (
                <div
                  key={i}
                  className="group relative aspect-[4/3] rounded-xl overflow-hidden"
                >
                  <Image
                    src={industry.image}
                    alt={industry.alt}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <p className="text-white font-semibold text-sm">
                      {industry.name}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── Insights ─────────────────────────────────────────────────────── */}
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

      {/* ── CTA Banner ───────────────────────────────────────────────────── */}
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

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-navy border-t border-white/10">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
            {/* Column 1 — Logo + blurb */}
            <div>
              <Link href="/us/" className="inline-block mb-4">
                <Image
                  src="/images/logo/carelabs-logo.png"
                  alt="CareLabs"
                  width={866}
                  height={288}
                  className="h-8 w-auto"
                />
              </Link>
              {page.footerDescription && (
                <p className="text-sm text-white/60 leading-relaxed">
                  {page.footerDescription}
                </p>
              )}
            </div>

            {/* Column 2 — Services */}
            {page.services && page.services.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
                  Services
                </h4>
                <ul className="space-y-2">
                  {page.services.map((service, i) => (
                    <li key={i}>
                      <Link
                        href={service.href}
                        className="text-sm text-white/70 transition-colors hover:text-orange-400"
                      >
                        {service.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 3 — Industries */}
            {page.industries && page.industries.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
                  Industries
                </h4>
                <ul className="space-y-2">
                  {page.industries.map((industry, i) => (
                    <li key={i}>
                      <span className="text-sm text-white/70">
                        {industry.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Column 4 — Contact */}
            <div>
              <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
                Contact
              </h4>
              <ul className="space-y-3">
                {page.footerAddress && (
                  <li className="flex items-start gap-2">
                    <MapPin className="w-4 h-4 text-orange-400 mt-0.5 shrink-0" />
                    <span className="text-sm text-white/70">
                      {page.footerAddress}
                    </span>
                  </li>
                )}
                {page.footerPhone && (
                  <li className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-orange-400 shrink-0" />
                    <a
                      href={`tel:${page.footerPhone}`}
                      className="text-sm text-white/70 hover:text-orange-400 transition-colors"
                    >
                      {page.footerPhone}
                    </a>
                  </li>
                )}
                {page.footerEmail && (
                  <li className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                    <a
                      href={`mailto:${page.footerEmail}`}
                      className="text-sm text-white/70 hover:text-orange-400 transition-colors"
                    >
                      {page.footerEmail}
                    </a>
                  </li>
                )}
              </ul>
            </div>
          </div>

          {/* Bottom row */}
          <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
            <p className="text-xs text-white/40">
              &copy; {new Date().getFullYear()} CareLabs. All rights reserved.
            </p>
            <div className="flex items-center gap-6">
              <Link
                href="/privacy/"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Privacy Policy
              </Link>
              <Link
                href="/terms/"
                className="text-xs text-white/40 hover:text-white/70 transition-colors"
              >
                Terms of Service
              </Link>
              <div className="flex items-center gap-3">
                <a
                  href="https://www.linkedin.com/company/carelabz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="text-white/40 hover:text-orange-400 transition-colors"
                >
                  <Linkedin className="w-4 h-4" />
                </a>
                <a
                  href="https://twitter.com/carelabz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Twitter"
                  className="text-white/40 hover:text-orange-400 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                </a>
                <a
                  href="https://www.facebook.com/carelabz"
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="text-white/40 hover:text-orange-400 transition-colors"
                >
                  <Facebook className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
