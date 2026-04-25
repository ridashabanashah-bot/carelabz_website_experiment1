export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Shield, Target, Users, RefreshCw, Award } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getAboutPage } from "@/lib/strapi-pages";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

const ICON_MAP: Record<string, React.ElementType> = {
  shield: Shield,
  target: Target,
  users: Users,
  refreshcw: RefreshCw,
  award: Award,
};

function resolveIcon(name: string | null | undefined): React.ElementType {
  if (!name) return Shield;
  return ICON_MAP[name.toLowerCase().replace(/[^a-z]/g, "")] ?? Shield;
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage(CC);
  return {
    title: page?.metaTitle ?? `About Carelabs UAE — Electrical Safety Engineering`,
    description:
      page?.metaDescription ??
      `Learn about Carelabs — a specialised electrical safety and power system engineering firm serving the UAE with DEWA-compliant studies and testing services.`,
    alternates: {
      canonical: `https://carelabz.com/${CC}/about/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/about/`,
        "x-default": `https://carelabz.com/${CC}/about/`,
      },
    },
    openGraph: {
      title: page?.metaTitle ?? `About Carelabs UAE`,
      description: page?.metaDescription ?? `Specialised electrical safety engineering in the UAE.`,
      url: `https://carelabz.com/${CC}/about/`,
      siteName: "Carelabs",
      type: "website",
      locale: "en_AE",
    },
  };
}

export default async function AboutPage() {
  const page = await getAboutPage(CC);

  return (
    <>
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-6">
            About
          </p>
          <h1 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            {page?.heroHeadline ?? "Built for the UAE."}
          </h1>
          <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            {page?.heroSubtext ??
              "Carelabs is a specialised electrical safety and power system engineering firm serving the UAE and the wider Middle East."}
          </p>
        </div>
      </section>

      {/* MISSION */}
      {(page?.missionHeading || page?.missionBody) && (
        <section className="bg-[#F2EDE6] py-20 lg:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
              {page?.missionHeading ? "Our Mission" : ""}
            </span>
            {page?.missionHeading && (
              <h2 className="font-ae-display text-3xl md:text-5xl text-[#0F2847] leading-[0.95]">
                {page.missionHeading}
              </h2>
            )}
            {page?.missionBody && (
              <p className="font-ae-body text-base md:text-lg text-[#0F2847]/70 mt-8 leading-relaxed">
                {page.missionBody}
              </p>
            )}
          </div>
        </section>
      )}

      {/* VALUES */}
      {page?.values && page.values.length > 0 && (
        <section className="bg-[#EBF2F8] py-20 lg:py-28 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                What We Stand For
              </span>
              <h2 className="font-ae-display text-3xl md:text-5xl text-[#0F2847]">
                {page.valuesHeading ?? "Our Values"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {page.values.map((value, i) => {
                const Icon = resolveIcon(value.icon);
                return (
                  <div key={i} className="bg-white border border-[#D4E3F0] p-8">
                    <div className="w-10 h-10 bg-[#EBF2F8] flex items-center justify-center mb-5">
                      <Icon className="w-5 h-5 text-[#1E5A8A]" />
                    </div>
                    <h3 className="font-ae-body font-semibold text-lg text-[#0F2847]">
                      {value.title}
                    </h3>
                    <p className="font-ae-body text-sm text-[#0F2847]/60 mt-3 leading-relaxed">
                      {value.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      {page?.stats && page.stats.length > 0 && (
        <section className="bg-[#163560] py-20 lg:py-28 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8]/60 mb-4 block">
                {page.statsHeading ?? "By the Numbers"}
              </span>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-px bg-[#1E5A8A]/20">
              {page.stats.map((stat, i) => (
                <div key={i} className="bg-[#163560] p-8 text-center">
                  <p className="font-ae-display text-5xl md:text-6xl text-white">
                    {stat.value}
                  </p>
                  <p className="font-ae-nav text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mt-3">
                    {stat.metric}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {page?.certifications && page.certifications.length > 0 && (
        <section className="bg-[#F8F5F0] py-16 px-6">
          <div className="max-w-[1100px] mx-auto text-center">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
              Standards We Follow
            </span>
            <p className="font-ae-display text-2xl md:text-3xl text-[#0F2847] leading-snug">
              {page.certifications.join(" · ")}
            </p>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#0F2847] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            {page?.ctaBannerHeading ?? "Work With Us."}
          </h2>
          {page?.ctaBannerSubtext && (
            <p className="font-ae-body text-lg text-[#5A8FB4] mt-6 max-w-xl mx-auto">
              {page.ctaBannerSubtext}
            </p>
          )}
          <div className="mt-10">
            <Link
              href={page?.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              {page?.ctaBannerPrimaryText ?? "Get in Touch"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
