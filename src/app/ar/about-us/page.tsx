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
import { RegionNavbar } from "@/components/region-navbar";
import { SouthAmericaFooter } from "@/components/south-america-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["ar"];
import { getAboutPage } from "@/lib/strapi-pages";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage("ar");
  return {
    title:
      page?.metaTitle ?? "About Carelabs | Argentina Electrical Safety Experts",
    description:
      page?.metaDescription ??
      "Learn about Carelabs — our mission, values, and the team dedicated to electrical safety testing and AEA 90364 compliance across Argentina.",
    alternates: {
      canonical: "https://carelabz.com/ar/about-us/",
      languages: {
        "en-AR": "https://carelabz.com/ar/about-us/",
        "x-default": "https://carelabz.com/ar/about-us/",
      },
    },
    openGraph: {
      title: page?.metaTitle ?? "About Carelabs — Power System Consultants Argentina",
      description:
        page?.metaDescription ??
        "Carelabs is a leading electrical safety engineering firm in Argentina.",
      url: "https://carelabz.com/ar/about-us/",
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page?.metaTitle ?? "About Carelabs — Power System Consultants Argentina",
      description:
        page?.metaDescription ??
        "Carelabs is a leading electrical safety engineering firm in Argentina.",
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

export default async function ARAboutPage() {
  const page = await getAboutPage("ar");

  const headline = page?.heroHeadline ?? "Who We Are";
  const subtext =
    page?.heroSubtext ??
    "Carelabs is a trusted partner for electrical safety testing, calibration, inspection, and certification services across Argentina.";

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: "ar",
      countryName: "Argentina",
      countryIso2: "AR",
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      "https://carelabz.com/ar/about-us/",
      page?.metaTitle ?? "About Carelabs — Power System Consultants Argentina",
      page?.metaDescription ??
        "Carelabs is a leading electrical safety engineering firm in Argentina.",
      "en-AR"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/ar/" },
      { name: "About", url: "https://carelabz.com/ar/about-us/" },
    ]),
  ]);

  return (
    <div className="sa-root">
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* HERO */}
        <section
          className="sa-hero-bg relative overflow-hidden"
          style={{ paddingTop: "8rem", paddingBottom: "5rem" }}
        >
          <div className="sa-hero-shape" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-8 text-center">
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                lineHeight: 1.1,
              }}
            >
              {headline}
            </h1>
            <p
              className="mx-auto"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "1.125rem",
                lineHeight: 1.65,
                maxWidth: "42rem",
              }}
            >
              {subtext}
            </p>
          </div>
        </section>

        {/* MISSION */}
        {(page?.missionHeading || page?.missionBody) && (
          <section style={{ backgroundColor: "#ffffff" }} className="py-20 px-4">
            <div className="mx-auto max-w-3xl text-center">
              <span className="sa-accent-rule" aria-hidden="true" />
              {page?.missionHeading && (
                <h2
                  className="mb-6"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                    color: "#094d76",
                  }}
                >
                  {page.missionHeading}
                </h2>
              )}
              {page?.missionBody && (
                <p
                  style={{
                    fontFamily: "var(--sa-font-body)",
                    color: "#5a5d66",
                    fontSize: "1.125rem",
                    lineHeight: 1.7,
                  }}
                >
                  {page.missionBody}
                </p>
              )}
            </div>
          </section>
        )}

        {/* VALUES */}
        {page?.values && page.values.length > 0 && (
          <section style={{ backgroundColor: "#f2f2f4" }} className="py-20 px-4">
            <div className="mx-auto max-w-7xl">
              {page?.valuesHeading && (
                <h2
                  className="mb-12 text-center"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(2rem, 3.5vw, 2.5rem)",
                    color: "#094d76",
                  }}
                >
                  {page.valuesHeading}
                </h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {page.values.map((value, idx) => {
                  const Icon = resolveIcon(value.icon);
                  return (
                    <div key={idx} className="sa-card sa-card-accent p-8">
                      <div
                        className="mb-5 inline-flex items-center justify-center rounded-xl"
                        style={{
                          width: "3rem",
                          height: "3rem",
                          backgroundColor: "#e8f4fd",
                          color: "#2575B6",
                        }}
                      >
                        <Icon className="w-6 h-6" />
                      </div>
                      <h3
                        className="mb-3"
                        style={{
                          fontFamily: "var(--sa-font-heading)",
                          fontWeight: 700,
                          fontSize: "1.125rem",
                          color: "#094d76",
                        }}
                      >
                        {value.title}
                      </h3>
                      <p
                        className="text-sm"
                        style={{
                          fontFamily: "var(--sa-font-body)",
                          color: "#5a5d66",
                          lineHeight: 1.65,
                        }}
                      >
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
          <section style={{ backgroundColor: "#ffffff" }} className="py-16 px-4">
            <div className="mx-auto max-w-5xl">
              <h2
                className="mb-8 text-center"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "1.5rem",
                  color: "#094d76",
                }}
              >
                Standards We Follow
              </h2>
              <div className="flex flex-wrap justify-center gap-3">
                {page.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 px-5 py-3 rounded-full"
                    style={{
                      backgroundColor: "#e8f4fd",
                      border: "1px solid rgba(37,117,182,0.2)",
                    }}
                  >
                    <Award
                      className="w-4 h-4 flex-shrink-0"
                      style={{ color: "#F15C30" }}
                    />
                    <span
                      className="text-sm"
                      style={{
                        fontFamily: "var(--sa-font-body)",
                        fontWeight: 500,
                        color: "#094d76",
                      }}
                    >
                      {cert}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="py-24 px-4 relative overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #F15C30 0%, #c44a1f 100%)",
          }}
        >
          <div className="relative mx-auto max-w-4xl text-center">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
              }}
            >
              {page?.ctaBannerHeading ?? "Partner with Carelabs Argentina"}
            </h2>
            <p
              className="mb-10 mx-auto max-w-2xl"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.075rem",
                lineHeight: 1.65,
              }}
            >
              {page?.ctaBannerSubtext ??
                "Ready to elevate your safety standards? Talk to our Argentina experts today."}
            </p>
            <Link
              href={page?.ctaBannerPrimaryHref ?? "/ar/contact-us/"}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#ffffff",
                color: "#c44a1f",
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 600,
              }}
            >
              {page?.ctaBannerPrimaryText ?? "Get in Touch"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <SouthAmericaFooter config={config} />
    </div>
  );
}
