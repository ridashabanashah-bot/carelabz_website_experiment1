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
        {/* ---------------- HERO ---------------- */}
        <section className="relative bg-[#0B1A2F] pt-36 pb-24 px-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
              About
            </span>
            <h1 className="font-condensed font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase text-white leading-[0.95] tracking-tight">
              {headline}
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Carelabs.
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              {subtext}
            </p>
          </div>
        </section>

        {/* ---------------- MISSION ---------------- */}
        {(page?.missionHeading || page?.missionBody) && (
          <section className="bg-[#F8FAFC] py-20 lg:py-28 px-6">
            <div className="max-w-3xl mx-auto text-center">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                Our Mission
              </span>
              {page?.missionHeading && (
                <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                  {page.missionHeading}
                </h2>
              )}
              {page?.missionBody && (
                <p className="font-body text-lg text-gray-600 mt-6 leading-relaxed">
                  {page.missionBody}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ---------------- VALUES ---------------- */}
        {page?.values && page.values.length > 0 && (
          <section className="bg-white py-20 lg:py-28 px-6">
            <div className="max-w-[1400px] mx-auto">
              <div className="text-center mb-14 max-w-3xl mx-auto">
                <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                  Our Values
                </span>
                {page?.valuesHeading && (
                  <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                    {page.valuesHeading}
                  </h2>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {page.values.map((value, idx) => {
                  const Icon = resolveIcon(value.icon);
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl bg-[#F8FAFC] p-8 hover:shadow-lg transition-shadow"
                    >
                      <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center mb-5">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] tracking-tight">
                        {value.title}
                      </h3>
                      <p className="font-body text-sm text-gray-600 mt-3 leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- CERTIFICATIONS ---------------- */}
        {page?.certifications && page.certifications.length > 0 && (
          <section className="bg-[#0B1A2F] py-16 px-6">
            <div className="max-w-5xl mx-auto text-center">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                Standards
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-white leading-[0.95] mb-10">
                Standards We Follow
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {page.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.15em] text-white/70 border border-white/10 px-4 py-2 rounded-full"
                  >
                    <Award className="w-3.5 h-3.5 text-orange-500" />
                    {cert}
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- CTA ---------------- */}
        <section className="bg-[#F8FAFC] py-24 lg:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-[#0B1A2F] leading-[0.95]">
              {page?.ctaBannerHeading ?? "Partner with Carelabs"}
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                {config.countryName}.
              </span>
            </h2>
            {page?.ctaBannerSubtext && (
              <p className="font-body text-lg text-gray-600 mt-6 max-w-2xl mx-auto leading-relaxed">
                {page.ctaBannerSubtext}
              </p>
            )}
            <div className="mt-10 flex justify-center">
              <Link
                href={page?.ctaBannerPrimaryHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
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
