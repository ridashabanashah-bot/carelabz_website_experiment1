export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import {
  ShieldCheck,
  Zap,
  Users,
  Star,
  Heart,
  Globe,
  Award,
  CheckCircle,
  Wrench,
  BarChart2,
  Clock,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getAboutPage } from "@/lib/strapi-pages";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

const CC = "no";
const config = COUNTRY_CONFIGS[CC];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage(CC);
  return {
    title:
      page?.metaTitle ??
      `About Carelabs | ${config.countryName} Electrical Safety Experts`,
    description:
      page?.metaDescription ??
      `Learn about Carelabs — our mission, values, and the team dedicated to electrical safety testing and ${config.primaryStandard} compliance across ${config.countryName}.`,
    alternates: {
      canonical: `https://carelabz.com/${CC}/about-us/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/about-us/`,
        "x-default": `https://carelabz.com/${CC}/about-us/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `About Carelabs — Power System Consultants ${config.countryName}`,
      description:
        page?.metaDescription ??
        `Carelabs is a leading electrical safety engineering firm in ${config.countryName}.`,
      url: `https://carelabz.com/${CC}/about-us/`,
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `About Carelabs — Power System Consultants ${config.countryName}`,
      description:
        page?.metaDescription ??
        `Carelabs is a leading electrical safety engineering firm in ${config.countryName}.`,
    },
  };
}

const ICON_MAP: Record<string, React.ElementType> = {
  shield: ShieldCheck,
  zap: Zap,
  users: Users,
  star: Star,
  heart: Heart,
  globe: Globe,
  award: Award,
  check: CheckCircle,
  wrench: Wrench,
  bar: BarChart2,
  clock: Clock,
  lightbulb: Lightbulb,
};

function resolveIcon(iconName: string | null | undefined): React.ElementType {
  if (!iconName) return Star;
  const key = iconName.toLowerCase().replace(/[^a-z]/g, "");
  return ICON_MAP[key] ?? Star;
}

export default async function AboutPage() {
  const page = await getAboutPage(CC);

  const headline = page?.heroHeadline ?? "Who We Are";
  const subtext =
    page?.heroSubtext ??
    `Carelabs is a trusted partner for electrical safety testing, calibration, inspection, and certification services across ${config.countryName}.`;

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: config.countryName,
      countryIso2: config.dialCodeCountryIso2,
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com/${CC}/about-us/`,
      page?.metaTitle ??
        `About Carelabs — Power System Consultants ${config.countryName}`,
      page?.metaDescription ??
        `Carelabs is a leading electrical safety engineering firm in ${config.countryName}.`,
      config.hreflang
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "About", url: `https://carelabz.com/${CC}/about-us/` },
    ]),
  ]);

  return (
    <>
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* ---------------- HERO — left-aligned ---------------- */}
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
            <div className="max-w-3xl">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-6 block">
                About
              </span>
              <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-6xl uppercase text-white leading-[0.95]">
                {headline}<br />
                <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                  Carelabs.
                </span>
              </h1>
              <p className="font-ne-body text-lg text-white/50 mt-8 max-w-2xl leading-relaxed">
                {subtext}
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- MISSION — white ---------------- */}
        {(page?.missionHeading || page?.missionBody) && (
          <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6 border-b border-[#1A3650]/5">
            <div className="max-w-[1400px] mx-auto lg:px-12">
              <div className="max-w-3xl">
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                  Our Mission
                </span>
                {page?.missionHeading && (
                  <h2 className="font-ne-display font-black text-3xl md:text-5xl uppercase text-[#1A3650] leading-[0.95]">
                    {page.missionHeading}
                  </h2>
                )}
                {page?.missionBody && (
                  <p className="font-ne-body text-lg text-gray-600 mt-6 leading-relaxed">
                    {page.missionBody}
                  </p>
                )}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- VALUES — navy editorial list ---------------- */}
        {page?.values && page.values.length > 0 && (
          <section className="bg-[#1A3650] py-20 lg:py-28 px-6">
            <div className="max-w-[1400px] mx-auto lg:px-12">
              <div className="mb-14 max-w-3xl">
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                  Our Values
                </span>
                {page?.valuesHeading && (
                  <h2 className="font-ne-display font-black text-3xl md:text-5xl uppercase text-white leading-[0.95]">
                    {page.valuesHeading}
                  </h2>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                {page.values.map((value, idx) => {
                  const Icon = resolveIcon(value.icon);
                  return (
                    <div
                      key={idx}
                      className="flex items-start gap-6 py-8 px-4 border-b border-white/10"
                    >
                      <Icon className="w-6 h-6 text-orange-500 shrink-0 mt-1" />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-ne-display font-bold text-lg uppercase text-white">
                          {value.title}
                        </h3>
                        <p className="font-ne-body text-sm text-white/60 mt-2 leading-relaxed">
                          {value.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- CERTIFICATIONS — white inline ---------------- */}
        {page?.certifications && page.certifications.length > 0 && (
          <section className="bg-[#F9F7F3] py-16 px-6 border-b border-[#1A3650]/5">
            <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                Standards
              </span>
              <p className="font-ne-nav text-sm uppercase tracking-[0.18em] text-[#1A3650]/60">
                {page.certifications.join("  ·  ")}
              </p>
            </div>
          </section>
        )}

        {/* ---------------- FINAL CTA — single-line ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
            <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
              {page?.ctaBannerHeading ?? `Partner with Carelabs ${config.countryName}.`}
            </h2>
            {page?.ctaBannerSubtext && (
              <p className="font-ne-body text-base text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
                {page.ctaBannerSubtext}
              </p>
            )}
            <div className="mt-8">
              <Link
                href={page?.ctaBannerPrimaryHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
              >
                {page?.ctaBannerPrimaryText ?? "Get in Touch"}
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <NEFooter config={config} />
    </>
  );
}
