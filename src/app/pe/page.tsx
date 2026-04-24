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
import { SouthAmericaFooter } from "@/components/south-america-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["pe"];
import { JsonLd } from "@/components/JsonLd";
import { ServiceFaqAccordion } from "@/components/service-page/faq-accordion-new";
import { getHomePage } from "@/lib/strapi-home";

type LucideProps = React.ComponentProps<typeof Zap>;

function ServiceIcon({ name, ...props }: { name: string } & LucideProps) {
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
  const page = await getHomePage("pe");
  return {
    title:
      page?.metaTitle ??
      "Carelabs — Electrical Safety & Power System Studies | Peru",
    description:
      page?.metaDescription ??
      "Carelabs provides IEEE 1584 arc flash studies, RM 111-2013-MEM compliance, short circuit analysis, and power system engineering across Peru.",
    keywords: page?.seoKeywords ?? undefined,
    alternates: {
      canonical: "https://carelabz.com/pe/",
      languages: {
        "en-PE": "https://carelabz.com/pe/",
        "x-default": "https://carelabz.com/pe/",
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        "Carelabs Peru — Electrical Safety & Power System Studies",
      description:
        page?.metaDescription ??
        "IEEE 1584 arc flash studies, RM 111-2013-MEM compliance, and power system engineering across Peru.",
      url: "https://carelabz.com/pe/",
      siteName: "Carelabs",
      type: "website",
      locale: "en_PE",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        "Carelabs Peru — Electrical Safety & Power System Studies",
      description:
        page?.metaDescription ??
        "IEEE 1584 arc flash studies, RM 111-2013-MEM compliance, and power system engineering across Peru.",
    },
  };
}

export default async function PEHomePage() {
  const page = await getHomePage("pe");

  if (!page) {
    return (
      <main className="sa-root flex min-h-screen items-center justify-center bg-white text-[#094d76]">
        <p className="text-lg">Page content unavailable</p>
      </main>
    );
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Carelabs",
    description: page.metaDescription,
    url: "https://carelabz.com/pe/",
    telephone: page.footerPhone ?? config.phone,
    email: page.footerEmail ?? config.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: page.footerAddress ?? config.address,
    },
  };

  return (
    <div className="sa-root">
      <JsonLd data={jsonLdData} />
      <RegionNavbar config={config} />

      {/* HERO */}
      <section
        className="sa-hero-bg relative overflow-hidden flex items-center"
        style={{ minHeight: "85vh" }}
      >
        <div className="sa-hero-shape" aria-hidden="true" />

        <div className="relative mx-auto w-full max-w-7xl px-4 sm:px-8 lg:px-16 py-24 pt-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              {page.heroEyebrow && (
                <span
                  className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest"
                  style={{
                    backgroundColor: "rgba(241,92,48,0.18)",
                    color: "#F15C30",
                    fontFamily: "var(--sa-font-body)",
                    fontWeight: 600,
                  }}
                >
                  {page.heroEyebrow}
                </span>
              )}
              {page.heroHeadline && (
                <h1
                  className="text-white mb-6"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(2.8rem, 5vw, 4.2rem)",
                    lineHeight: 1.05,
                    letterSpacing: "-0.02em",
                    maxWidth: "32rem",
                  }}
                >
                  {page.heroHeadline}
                </h1>
              )}
              {page.heroSubtext && (
                <p
                  className="mb-10"
                  style={{
                    fontFamily: "var(--sa-font-body)",
                    color: "rgba(255,255,255,0.82)",
                    fontSize: "1.125rem",
                    lineHeight: 1.6,
                    maxWidth: "34rem",
                  }}
                >
                  {page.heroSubtext}
                </p>
              )}

              <div className="flex flex-wrap gap-4 mb-12">
                {page.heroPrimaryCtaText && page.heroPrimaryCtaHref && (
                  <Link href={page.heroPrimaryCtaHref} className="sa-btn-primary">
                    {page.heroPrimaryCtaText}
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                )}
                {page.heroSecondaryCtaText && page.heroSecondaryCtaHref && (
                  <Link
                    href={page.heroSecondaryCtaHref}
                    className="sa-btn-ghost"
                  >
                    {page.heroSecondaryCtaText}
                  </Link>
                )}
              </div>

              {page.trustBadges && page.trustBadges.length > 0 && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-lg">
                  {page.trustBadges.map((badge, i) => (
                    <div
                      key={i}
                      className="rounded-xl p-3 flex items-center gap-2"
                      style={{
                        backgroundColor: "rgba(255,255,255,0.08)",
                        border: "1px solid rgba(255,255,255,0.15)",
                        backdropFilter: "blur(8px)",
                      }}
                    >
                      <CheckCircle
                        className="w-4 h-4 shrink-0"
                        style={{ color: "#F15C30" }}
                      />
                      <span
                        className="text-xs text-white/95"
                        style={{
                          fontFamily: "var(--sa-font-body)",
                          fontWeight: 500,
                        }}
                      >
                        {badge.label}
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="relative hidden lg:block">
              {page.heroImage ? (
                <div className="relative">
                  <div
                    className="absolute -inset-6 rounded-[32px]"
                    style={{
                      background:
                        "radial-gradient(circle at 30% 30%, rgba(241,92,48,0.3), transparent 65%)",
                      filter: "blur(40px)",
                    }}
                    aria-hidden="true"
                  />
                  <div className="relative aspect-[4/3] rounded-[24px] overflow-hidden shadow-2xl">
                    <Image
                      src={page.heroImage}
                      alt={page.heroImageAlt ?? "Power system engineering"}
                      fill
                      priority
                      className="object-cover"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative aspect-[4/3]">
                  <div
                    className="absolute inset-0 rounded-full"
                    style={{
                      background:
                        "radial-gradient(circle, rgba(61,143,212,0.4) 0%, transparent 70%)",
                    }}
                  />
                  <div
                    className="absolute top-10 right-10 w-64 h-64 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(241,92,48,0.3), rgba(241,92,48,0.05))",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                  <div
                    className="absolute bottom-16 left-16 w-48 h-48 rounded-full"
                    style={{
                      background:
                        "linear-gradient(135deg, rgba(61,143,212,0.45), rgba(37,117,182,0.15))",
                      border: "1px solid rgba(255,255,255,0.15)",
                    }}
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* INTRO */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-20 px-4">
        <div className="mx-auto max-w-3xl text-center">
          <span className="sa-accent-rule" aria-hidden="true" />
          <h2
            className="mb-6"
            style={{
              fontFamily: "var(--sa-font-heading)",
              fontWeight: 800,
              fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
              color: "#094d76",
            }}
          >
            Proactive Risk Assessment Tailored to Your Facility
          </h2>
          <p
            style={{
              fontFamily: "var(--sa-font-body)",
              color: "#5a5d66",
              fontSize: "1.075rem",
              lineHeight: 1.7,
            }}
          >
            Carelabs identifies and mitigates electrical risk to keep your
            Peru facility compliant with RM 111-2013-MEM and CNE. Our
            engineers pair deep technical expertise with industry tools like
            ETAP to deliver reports you and your regulators can act on.
          </p>
        </div>
      </section>

      {/* SERVICES */}
      {page.services && page.services.length > 0 && (
        <section style={{ backgroundColor: "#f2f2f4" }} className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              {page.servicesHeading && (
                <h2
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    color: "#094d76",
                    marginBottom: "1rem",
                  }}
                >
                  {page.servicesHeading}
                </h2>
              )}
              {page.servicesSubtext && (
                <p
                  style={{
                    fontFamily: "var(--sa-font-body)",
                    color: "#9c9b9a",
                    fontSize: "1.075rem",
                    lineHeight: 1.65,
                  }}
                >
                  {page.servicesSubtext}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.services.map((service, i) => (
                <div key={i} className="sa-card sa-card-accent p-8">
                  <div
                    className="mb-5 inline-flex items-center justify-center rounded-xl"
                    style={{
                      width: "3rem",
                      height: "3rem",
                      backgroundColor: "#e8f4fd",
                      color: "#2575B6",
                    }}
                  >
                    <ServiceIcon name={service.icon} className="w-6 h-6" />
                  </div>
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "var(--sa-font-heading)",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#094d76",
                    }}
                  >
                    {service.title}
                  </h3>
                  <p
                    className="mb-6"
                    style={{
                      fontFamily: "var(--sa-font-body)",
                      color: "#5a5d66",
                      lineHeight: 1.65,
                    }}
                  >
                    {service.description}
                  </p>
                  <Link
                    href={service.href}
                    className="inline-flex items-center gap-2 text-sm transition-colors"
                    style={{
                      fontFamily: "var(--sa-font-body)",
                      fontWeight: 600,
                      color: "#F15C30",
                    }}
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

      {/* WHY CARELABS */}
      {page.whyFeatures && page.whyFeatures.length > 0 && (
        <section style={{ backgroundColor: "#ffffff" }} className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              <span className="sa-accent-rule" aria-hidden="true" />
              {page.whyHeading && (
                <h2
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    color: "#094d76",
                    marginBottom: "1rem",
                  }}
                >
                  {page.whyHeading}
                </h2>
              )}
              {page.whySubtext && (
                <p
                  style={{
                    fontFamily: "var(--sa-font-body)",
                    color: "#9c9b9a",
                    fontSize: "1.075rem",
                    lineHeight: 1.65,
                  }}
                >
                  {page.whySubtext}
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
              {page.whyFeatures.map((feature, i) => (
                <div key={i} className="text-center">
                  <div
                    className="mx-auto mb-5 inline-flex items-center justify-center rounded-full"
                    style={{
                      width: "4rem",
                      height: "4rem",
                      backgroundColor: "#e8f4fd",
                      color: "#2575B6",
                    }}
                  >
                    <WhyIcon name={feature.icon} className="w-7 h-7" />
                  </div>
                  <h3
                    className="mb-3"
                    style={{
                      fontFamily: "var(--sa-font-heading)",
                      fontWeight: 700,
                      fontSize: "1.25rem",
                      color: "#094d76",
                    }}
                  >
                    {feature.title}
                  </h3>
                  <p
                    style={{
                      fontFamily: "var(--sa-font-body)",
                      color: "#9c9b9a",
                      lineHeight: 1.65,
                    }}
                  >
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INDUSTRIES */}
      {page.industries && page.industries.length > 0 && (
        <section
          className="py-20 relative overflow-hidden"
          style={{
            background:
              "linear-gradient(135deg, #094d76 0%, #2575B6 100%)",
          }}
        >
          <div
            className="absolute top-0 right-0 w-[500px] h-[500px] rounded-full pointer-events-none"
            style={{
              background:
                "radial-gradient(circle, rgba(241,92,48,0.15), transparent 70%)",
              transform: "translate(30%,-30%)",
            }}
            aria-hidden="true"
          />
          <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-14 max-w-2xl mx-auto">
              {page.industriesHeading && (
                <h2
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    color: "#ffffff",
                  }}
                >
                  {page.industriesHeading}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {page.industries.map((industry, i) => (
                <div
                  key={i}
                  className="rounded-2xl p-6 transition-all hover:scale-[1.02]"
                  style={{
                    backgroundColor: "rgba(255,255,255,0.08)",
                    border: "1px solid rgba(255,255,255,0.15)",
                    backdropFilter: "blur(10px)",
                  }}
                >
                  <p
                    className="text-white"
                    style={{
                      fontFamily: "var(--sa-font-heading)",
                      fontWeight: 600,
                      fontSize: "0.95rem",
                    }}
                  >
                    {industry.name}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* INSIGHTS */}
      {page.insights && page.insights.length > 0 && (
        <section style={{ backgroundColor: "#f7f5f3" }} className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-14">
              {page.insightsHeading && (
                <h2
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                    color: "#094d76",
                  }}
                >
                  {page.insightsHeading}
                </h2>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {page.insights.map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="sa-card overflow-hidden group block"
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
                    <span
                      className="inline-block mb-3 px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                      style={{
                        backgroundColor: "#fde8e2",
                        color: "#F15C30",
                        fontFamily: "var(--sa-font-body)",
                        fontWeight: 600,
                      }}
                    >
                      {insight.category}
                    </span>
                    <h3
                      className="mb-3"
                      style={{
                        fontFamily: "var(--sa-font-heading)",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: "#094d76",
                        lineHeight: 1.35,
                      }}
                    >
                      {insight.title}
                    </h3>
                    <p
                      className="mb-4 text-sm"
                      style={{
                        fontFamily: "var(--sa-font-body)",
                        color: "#9c9b9a",
                        lineHeight: 1.6,
                      }}
                    >
                      {insight.description}
                    </p>
                    <span
                      className="inline-flex items-center gap-2 text-sm"
                      style={{
                        fontFamily: "var(--sa-font-body)",
                        fontWeight: 600,
                        color: "#F15C30",
                      }}
                    >
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

      {/* FAQ */}
      {page.faqs && page.faqs.length > 0 && (
        <section style={{ backgroundColor: "#ffffff" }} className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-12">
              <span className="sa-accent-rule" aria-hidden="true" />
              <h2
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                  color: "#094d76",
                }}
              >
                {page.faqsHeading ?? "Frequently Asked Questions"}
              </h2>
            </div>
            <ServiceFaqAccordion faqs={page.faqs} />
          </div>
        </section>
      )}

      {/* CTA BANNER */}
      <section
        id="contact"
        className="relative py-24 overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #F15C30 0%, #c44a1f 100%)",
        }}
      >
        <div className="relative mx-auto max-w-4xl px-4 sm:px-8 text-center">
          {page.ctaBannerHeading && (
            <h2
              className="text-white mb-5"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                lineHeight: 1.15,
              }}
            >
              {page.ctaBannerHeading}
            </h2>
          )}
          {page.ctaBannerSubtext && (
            <p
              className="mx-auto mb-10"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.125rem",
                lineHeight: 1.65,
                maxWidth: "42rem",
              }}
            >
              {page.ctaBannerSubtext}
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-4">
            {page.ctaBannerPrimaryText && page.ctaBannerPrimaryHref && (
              <Link
                href={page.ctaBannerPrimaryHref}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#c44a1f",
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 600,
                }}
              >
                {page.ctaBannerPrimaryText}
                <ArrowRight className="w-4 h-4" />
              </Link>
            )}
            {page.ctaBannerSecondaryText && page.ctaBannerSecondaryHref && (
              <Link
                href={page.ctaBannerSecondaryHref}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 border-2 border-white text-white hover:bg-white/10 transition-colors"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 600,
                }}
              >
                <Phone className="w-4 h-4" />
                {page.ctaBannerSecondaryText}
              </Link>
            )}
          </div>
        </div>
      </section>

      <SouthAmericaFooter config={config} />
    </div>
  );
}
