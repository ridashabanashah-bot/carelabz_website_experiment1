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
} from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["cn"];
import { getAboutPage } from "@/lib/strapi-pages";
import { buildJsonLd, getRegionOrganizationSchema, getWebPageSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage("cn");
  return {
    title: page?.metaTitle ?? "About Carelabs | Chinan Electrical Safety Experts",
    description:
      page?.metaDescription ??
      "Learn about Carelabs — our mission, values, and the team dedicated to electrical safety testing and GB 50054 compliance across China.",
    alternates: {
      canonical: "https://carelabz.com/cn/about-us/",
      languages: {
        "en-CN": "https://carelabz.com/cn/about-us/",
        "x-default": "https://carelabz.com/cn/about-us/",
      },
    },
    openGraph: {
      title: page?.metaTitle ?? "About Carelabs — Power System Consultants China",
      description:
        page?.metaDescription ?? "Carelabs is a leading electrical safety engineering firm in China.",
      url: "https://carelabz.com/cn/about-us/",
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page?.metaTitle ?? "About Carelabs — Power System Consultants China",
      description:
        page?.metaDescription ?? "Carelabs is a leading electrical safety engineering firm in China.",
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

export default async function CNAboutPage() {
  const page = await getAboutPage("cn");

  const headline = page?.heroHeadline ?? "Who We Are";
  const subtext =
    page?.heroSubtext ??
    "Carelabs is a trusted partner for electrical safety testing, calibration, inspection, and certification services across China.";

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({ cc: "cn", countryName: "China", countryIso2: "CN", phone: config.phone, email: config.email, addressLocality: config.address }),
    getWebPageSchema(
      "https://carelabz.com/cn/about-us/",
      page?.metaTitle ?? "About Carelabs — Power System Consultants China",
      page?.metaDescription ?? "Carelabs is a leading electrical safety engineering firm in China.",
      "en-CN"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/cn/" },
      { name: "About", url: "https://carelabz.com/cn/about-us/" },
    ]),
  ]);

  return (
    <>
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        <section className="bg-[#EEF4FF] pt-32 pb-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A2538] mb-6">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-[#374151] max-w-2xl mx-auto">
              {subtext}
            </p>
          </div>
        </section>

        {(page?.missionHeading || page?.missionBody) && (
          <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-3xl text-center">
              {page?.missionHeading && (
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-6">
                  {page.missionHeading}
                </h2>
              )}
              {page?.missionBody && (
                <p className="text-gray-600 text-xl leading-relaxed">
                  {page.missionBody}
                </p>
              )}
            </div>
          </section>
        )}

        {page?.values && page.values.length > 0 && (
          <section className="bg-offWhite py-20 px-4">
            <div className="mx-auto max-w-7xl">
              {page?.valuesHeading && (
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 text-center">
                  {page.valuesHeading}
                </h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {page.values.map((value, idx) => {
                  const Icon = resolveIcon(value.icon);
                  return (
                    <div
                      key={idx}
                      className="rounded-xl border border-gray-100 bg-white p-8"
                    >
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center mb-4">
                        <Icon className="w-6 h-6 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {value.title}
                      </h3>
                      <p className="text-gray-600 text-sm leading-relaxed">
                        {value.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {page?.certifications && page.certifications.length > 0 && (
          <section className="bg-offWhite py-16 px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold text-navy mb-8 text-center">
                Standards We Follow
              </h2>
              <div className="flex flex-wrap justify-center gap-4">
                {page.certifications.map((cert, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 bg-white border border-gray-200 rounded-lg px-5 py-3 shadow-sm"
                  >
                    <Award className="w-5 h-5 text-orange-500 flex-shrink-0" />
                    <span className="text-sm font-medium text-navy">{cert}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {page?.ctaBannerHeading ?? "Partner with Carelabs China"}
            </h2>
            {page?.ctaBannerSubtext ? (
              <p className="text-white/70 text-lg mb-8">{page.ctaBannerSubtext}</p>
            ) : (
              <p className="text-white/70 text-lg mb-8">
                Ready to elevate your safety standards? Talk to our Chinan experts today.
              </p>
            )}
            <Link
              href={page?.ctaBannerPrimaryHref ?? "/cn/contact-us/"}
              className="inline-flex items-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600"
            >
              {page?.ctaBannerPrimaryText ?? "Get in Touch"}
            </Link>
          </div>
        </section>
      </main>
      <RegionFooter config={config} />
    </>
  );
}
