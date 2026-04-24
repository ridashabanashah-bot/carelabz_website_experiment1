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
  CheckCircle2,
  Wrench,
  BarChart2,
  Clock,
  Lightbulb,
  ArrowRight,
} from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getAboutPage } from "@/lib/strapi-pages";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const CC = "br";
const COUNTRY_NAME = "Brazil";
const HREFLANG = "en-BR";
const config = COUNTRY_CONFIGS[CC];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage(CC);
  return {
    title:
      page?.metaTitle ??
      `About Carelabs | ${COUNTRY_NAME} Electrical Safety Experts`,
    description:
      page?.metaDescription ??
      `Learn about Carelabs — our mission, values, and the team dedicated to electrical safety testing and ${config.primaryStandard} compliance across ${COUNTRY_NAME}.`,
    alternates: {
      canonical: `https://carelabz.com/${CC}/about-us/`,
      languages: {
        [HREFLANG]: `https://carelabz.com/${CC}/about-us/`,
        "x-default": `https://carelabz.com/${CC}/about-us/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `About Carelabs — Power System Consultants ${COUNTRY_NAME}`,
      description:
        page?.metaDescription ??
        `Carelabs is a leading electrical safety engineering firm in ${COUNTRY_NAME}.`,
      url: `https://carelabz.com/${CC}/about-us/`,
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `About Carelabs — Power System Consultants ${COUNTRY_NAME}`,
      description:
        page?.metaDescription ??
        `Carelabs is a leading electrical safety engineering firm in ${COUNTRY_NAME}.`,
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
  check: CheckCircle2,
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

function splitAccent(headline: string): { lead: string; accent: string } {
  const words = headline.trim().split(/\s+/);
  if (words.length <= 1) return { lead: "", accent: headline };
  return {
    lead: words.slice(0, -1).join(" "),
    accent: words[words.length - 1],
  };
}

export default async function BRAboutPage() {
  const page = await getAboutPage(CC);

  const headline = page?.heroHeadline ?? "About Carelabs";
  const { lead: headlineLead, accent: headlineAccent } = splitAccent(headline);

  const subtext =
    page?.heroSubtext ??
    `Carelabs is a trusted partner for electrical safety testing, calibration, inspection, and certification services across ${COUNTRY_NAME}.`;

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: COUNTRY_NAME,
      countryIso2: CC.toUpperCase(),
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com/${CC}/about-us/`,
      page?.metaTitle ??
        `About Carelabs — Power System Consultants ${COUNTRY_NAME}`,
      page?.metaDescription ??
        `Carelabs is a leading electrical safety engineering firm in ${COUNTRY_NAME}.`,
      HREFLANG
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "About", url: `https://carelabz.com/${CC}/about-us/` },
    ]),
  ]);

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* HERO */}
        <section className="relative bg-[#0B1A2F] py-20 lg:py-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-tight tracking-tight">
              {headlineLead && <>{headlineLead} </>}
              <span className="font-accent italic font-normal normal-case text-orange-500">
                {headlineAccent}
              </span>
            </h1>
            <p className="font-body text-lg text-white/70 max-w-2xl mx-auto mt-6">
              {subtext}
            </p>
          </div>
        </section>

        {/* MISSION */}
        {(page?.missionHeading || page?.missionBody) && (
          <section className="bg-[#F8FAFC] py-16 lg:py-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                Our Mission
              </p>
              {page?.missionHeading && (
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase max-w-3xl leading-tight">
                  {page.missionHeading}
                </h2>
              )}
              {page?.missionBody && (
                <p className="font-body text-lg text-gray-600 leading-relaxed max-w-3xl mt-8">
                  {page.missionBody}
                </p>
              )}
            </div>
          </section>
        )}

        {/* VALUES */}
        {page?.values && page.values.length > 0 && (
          <section className="bg-white py-16 lg:py-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="mb-12">
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  What Drives Us
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase">
                  {page.valuesHeading ?? "Our Values"}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {page.values.map((value, idx) => {
                  const Icon = resolveIcon(value.icon);
                  return (
                    <div
                      key={idx}
                      className="rounded-2xl rounded-tr-none bg-[#F8FAFC] p-8 border border-gray-100"
                    >
                      <Icon className="text-orange-500 w-8 h-8 mb-4" />
                      <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] mt-2">
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

        {/* CERTIFICATIONS */}
        {page?.certifications && page.certifications.length > 0 && (
          <section className="bg-[#0B1A2F] py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <h2 className="font-condensed font-extrabold text-2xl md:text-3xl text-white uppercase text-center mb-8">
                Standards We Follow
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {page.certifications.map((cert, idx) => (
                  <span
                    key={idx}
                    className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-5 py-2.5 hover:bg-white/15 transition-colors"
                  >
                    <Award className="w-4 h-4 text-orange-500 shrink-0" />
                    <span className="font-body text-sm text-white">
                      {cert}
                    </span>
                  </span>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase leading-tight">
              {page?.ctaBannerHeading ?? "Partner with Carelabs"}
            </h2>
            {page?.ctaBannerSubtext && (
              <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
                {page.ctaBannerSubtext}
              </p>
            )}
            <Link
              href={page?.ctaBannerPrimaryHref ?? config.contactPath}
              className="mt-8 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide"
            >
              {page?.ctaBannerPrimaryText ?? "Get in Touch"}
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <SAFooter config={config} />
    </div>
  );
}
