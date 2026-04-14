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
import { StickyNavbar } from "@/components/sticky-navbar";
import { getAboutPage } from "@/lib/strapi-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getAboutPage("us");
  return {
    title: page?.metaTitle ?? "About CareLabs | Electrical Safety Experts",
    description:
      page?.metaDescription ??
      "Learn about CareLabs — our mission, values, and the team dedicated to electrical safety testing and compliance across the US.",
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
  const page = await getAboutPage("us");

  const headline = page?.heroHeadline ?? "Who We Are";
  const subtext =
    page?.heroSubtext ??
    "CareLabs is a trusted partner for electrical safety testing, calibration, inspection, and certification services across the United States.";

  return (
    <>
      <StickyNavbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-navy pt-32 pb-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              {subtext}
            </p>
          </div>
        </section>

        {/* Mission Section */}
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

        {/* Values Section */}
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

        {/* Team Section */}
        {page?.team && page.team.length > 0 && (
          <section className="bg-white py-20 px-4">
            <div className="mx-auto max-w-7xl">
              {page?.teamHeading && (
                <h2 className="text-3xl md:text-4xl font-bold text-navy mb-12 text-center">
                  {page.teamHeading}
                </h2>
              )}
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                {page.team.map((member, idx) => (
                  <div key={idx} className="rounded-xl bg-offWhite p-8">
                    <div className="w-12 h-12 rounded-full bg-navy flex items-center justify-center mb-4">
                      <span className="text-white font-bold text-lg">
                        {member.name.charAt(0)}
                      </span>
                    </div>
                    <h3 className="text-lg font-bold text-navy mb-1">
                      {member.name}
                    </h3>
                    <p className="text-sm font-medium text-orange-500 mb-3">
                      {member.role}
                    </p>
                    <p className="text-gray-600 text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Stats Section */}
        {page?.stats && page.stats.length > 0 && (
          <section className="bg-navy py-20 px-4">
            <div className="mx-auto max-w-7xl">
              {page?.statsHeading && (
                <h2 className="text-3xl md:text-4xl font-bold text-white mb-12 text-center">
                  {page.statsHeading}
                </h2>
              )}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {page.stats.map((stat, idx) => (
                  <div key={idx} className="text-center">
                    <p className="text-4xl md:text-5xl font-extrabold text-white mb-2">
                      {stat.value}
                    </p>
                    <p className="text-white/60 text-sm uppercase tracking-wide">
                      {stat.metric}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Certifications Section */}
        {page?.certifications && page.certifications.length > 0 && (
          <section className="bg-offWhite py-16 px-4">
            <div className="mx-auto max-w-5xl">
              <h2 className="text-2xl font-bold text-navy mb-8 text-center">
                Certifications &amp; Accreditations
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

        {/* CTA Banner */}
        <section className="bg-navy py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              {page?.ctaBannerHeading ?? "Partner with CareLabs"}
            </h2>
            {page?.ctaBannerSubtext && (
              <p className="text-white/70 text-lg mb-8">{page.ctaBannerSubtext}</p>
            )}
            {!page?.ctaBannerSubtext && (
              <p className="text-white/70 text-lg mb-8">
                Ready to elevate your safety standards? Talk to our experts today.
              </p>
            )}
            <Link
              href={page?.ctaBannerPrimaryHref ?? "/us/contact"}
              className="inline-flex items-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600"
            >
              {page?.ctaBannerPrimaryText ?? "Get in Touch"}
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slateCard py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
              <div className="md:col-span-2">
                <p className="text-white font-bold text-lg mb-2">CareLabs</p>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  Professional electrical safety testing, calibration, inspection,
                  and certification services across the United States.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Services</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/us/services" className="text-white/60 text-sm hover:text-white transition-colors">
                      All Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Company</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/us/about" className="text-white/60 text-sm hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/us/case-studies" className="text-white/60 text-sm hover:text-white transition-colors">
                      Case Studies
                    </Link>
                  </li>
                  <li>
                    <Link href="/us/contact" className="text-white/60 text-sm hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-white/40 text-sm text-center pt-8">
              © {new Date().getFullYear()} CareLabs. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
