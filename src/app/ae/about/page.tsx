export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getAboutPage } from "@/lib/strapi-pages";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

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
      <AENavbar config={config} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1100px] text-center">
          <p className="animate-fade-in-up animation-delay-100 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            About
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            {page?.heroHeadline ?? "Built for the UAE."}
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            {page?.heroSubtext ??
              "Carelabs is a specialised electrical safety and power system engineering firm serving the UAE and the wider Middle East."}
          </p>
        </div>
      </section>

      {/* MISSION */}
      {(page?.missionHeading || page?.missionBody) && (
        <section className="bg-white px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                Our Mission
              </p>
            </ScrollReveal>
            {page?.missionHeading && (
              <ScrollReveal delay={100}>
                <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-gray-900">
                  {page.missionHeading}
                </h2>
              </ScrollReveal>
            )}
            {page?.missionBody && (
              <ScrollReveal delay={200}>
                <p className="mt-8 text-lg leading-relaxed text-gray-600">
                  {page.missionBody}
                </p>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* VALUES — 2x2 grid with border-l accent */}
      {page?.values && page.values.length > 0 && (
        <section className="bg-[#F2F2F4] px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading
              eyebrow="What We Stand For"
              title={page.valuesHeading ?? "Our Values"}
            />
            <div className="mt-16 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {page.values.map((value, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="group h-full border-l-2 border-[#2575B6] bg-white p-8 transition-colors duration-300 hover:border-[#F15C30]">
                    <h3 className="font-display text-xl uppercase tracking-tight text-gray-900">
                      {value.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {value.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* STATS */}
      {page?.stats && page.stats.length > 0 && (
        <section className="bg-[#094D76] px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-[1280px]">
            <ScrollReveal>
              <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
                {page.statsHeading ?? "By the Numbers"}
              </p>
            </ScrollReveal>
            <div className="mt-12 grid grid-cols-2 gap-px bg-white/10 lg:grid-cols-4">
              {page.stats.map((stat, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="h-full bg-[#094D76] p-8 text-center">
                    <p className="font-display text-5xl text-white md:text-6xl">
                      {stat.value}
                    </p>
                    <p className="mt-3 text-xs uppercase tracking-[0.2em] text-white/60">
                      {stat.metric}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* CERTIFICATIONS */}
      {page?.certifications && page.certifications.length > 0 && (
        <section className="bg-white px-6 py-16">
          <div className="mx-auto max-w-[1100px] text-center">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                Standards We Follow
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <p className="mt-4 font-display text-2xl uppercase tracking-tight text-gray-900 md:text-3xl">
                {page.certifications.join(" · ")}
              </p>
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#094D76] py-24 lg:py-32">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <ScrollReveal>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
              Get Started
            </p>
          </ScrollReveal>
          <ScrollReveal delay={100}>
            <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-white">
              {page?.ctaBannerHeading ?? "Work With Us."}
            </h2>
          </ScrollReveal>
          {page?.ctaBannerSubtext && (
            <ScrollReveal delay={200}>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {page.ctaBannerSubtext}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={page?.ctaBannerPrimaryHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                {page?.ctaBannerPrimaryText ?? "Get in Touch"}
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
