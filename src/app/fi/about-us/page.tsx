export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
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

const CC = "fi";
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
        {/* ---------------- STATEMENT HERO ---------------- */}
        <section className="relative min-h-[60vh] flex items-center bg-[#1A3650] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 py-32">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
              About
            </span>
            <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
              {headline}<br />
              <span className="font-ne-accent italic font-normal text-[#F97316]">
                Carelabs.
              </span>
            </h1>
            <p className="font-ne-body text-base text-white/40 mt-10 max-w-2xl leading-relaxed">
              {subtext}
            </p>
          </div>
        </section>

        {/* ---------------- STATEMENT BAND ---------------- */}
        <section className="bg-[#F97316] py-8 lg:py-10">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <p className="font-ne-display font-black text-xl md:text-2xl lg:text-3xl text-white uppercase leading-tight tracking-tight">
              Test · Calibrate · Inspect · Certify · {config.countryName}
            </p>
          </div>
        </section>

        {/* ---------------- MISSION — sand band ---------------- */}
        {(page?.missionHeading || page?.missionBody) && (
          <section className="bg-[#F0EBE1] py-20 lg:py-28 px-6">
            <div className="max-w-[1200px] mx-auto lg:px-12">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-4 block">
                Our Mission
              </span>
              {page?.missionHeading && (
                <h2 className="font-ne-display font-black text-3xl md:text-5xl text-[#1A3650] uppercase leading-[0.95] max-w-3xl">
                  {page.missionHeading}
                </h2>
              )}
              {page?.missionBody && (
                <p className="font-ne-body text-lg text-[#1A3650]/60 mt-8 max-w-3xl leading-relaxed">
                  {page.missionBody}
                </p>
              )}
            </div>
          </section>
        )}

        {/* ---------------- VALUES — full-width alternating rows ---------------- */}
        {page?.values && page.values.length > 0 && (
          <>
            <section className="bg-[#1A3650] py-16 lg:py-20 px-6">
              <div className="max-w-[1200px] mx-auto lg:px-12">
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-4 block">
                  Our Values
                </span>
                {page?.valuesHeading && (
                  <h2 className="font-ne-display font-black text-3xl md:text-5xl text-white uppercase leading-[0.95]">
                    {page.valuesHeading}
                  </h2>
                )}
              </div>
            </section>
            <section>
              {page.values.map((value, idx) => (
                <div
                  key={idx}
                  className={`${idx % 2 === 0 ? "bg-[#F9F7F3]" : "bg-[#F0EBE1]"}`}
                >
                  <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-12 lg:py-16 flex flex-col md:flex-row gap-8 md:items-baseline">
                    <span className="font-ne-display font-black text-5xl lg:text-6xl text-[#1A3650]/[0.08] leading-none shrink-0 md:w-32">
                      {String(idx + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-ne-display font-black text-2xl lg:text-3xl text-[#1A3650] uppercase leading-tight">
                        {value.title}
                      </h3>
                      <p className="font-ne-body text-base text-[#1A3650]/60 mt-3 max-w-2xl leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </section>
          </>
        )}

        {/* ---------------- TEAM — simple text list ---------------- */}
        {page?.team && page.team.length > 0 && (
          <section className="bg-[#243E54] py-20 lg:py-28 px-6">
            <div className="max-w-[1200px] mx-auto lg:px-12">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/60 mb-4 block">
                {page?.teamHeading ?? "The Team"}
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-5xl text-white uppercase leading-[0.95] mb-12">
                Engineers · Auditors · Consultants
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-0">
                {page.team.map((member, i) => (
                  <div
                    key={i}
                    className="py-6 border-b border-[#4A7C9B]/20"
                  >
                    <h3 className="font-ne-display font-bold text-xl text-white uppercase">
                      {member.name}
                    </h3>
                    <p className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mt-1">
                      {member.role}
                    </p>
                    {member.bio && (
                      <p className="font-ne-body text-sm text-white/50 mt-3 leading-relaxed">
                        {member.bio}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- CERTIFICATIONS — single line on sand ---------------- */}
        {page?.certifications && page.certifications.length > 0 && (
          <section className="bg-[#F0EBE1] py-16 px-6">
            <div className="max-w-[1400px] mx-auto lg:px-12">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-4 block">
                Standards We Follow
              </span>
              <p className="font-ne-display font-black text-lg md:text-2xl text-[#1A3650]/70 uppercase leading-tight">
                {page.certifications.join(" · ")}
              </p>
            </div>
          </section>
        )}

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#1A3650] py-24 lg:py-32 px-6">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
              {page?.ctaBannerHeading ?? "Partner with Carelabs"}
            </h2>
            <p className="font-ne-accent italic text-3xl md:text-4xl text-[#F97316] mt-3">
              {config.countryName}.
            </p>
            {page?.ctaBannerSubtext && (
              <p className="font-ne-body text-base text-white/40 mt-8 max-w-xl leading-relaxed">
                {page.ctaBannerSubtext}
              </p>
            )}
            <div className="mt-12">
              <Link
                href={page?.ctaBannerPrimaryHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
