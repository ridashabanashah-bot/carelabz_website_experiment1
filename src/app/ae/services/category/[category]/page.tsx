export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, ChevronRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicesByRegion, type ServicePage } from "@/lib/strapi";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/scroll-reveal";
import {
  AE_CATEGORIES_ORDER,
  CATEGORY_TO_SLUG,
  SLUG_TO_CATEGORY,
  CATEGORY_TAGLINES,
  groupServicesByCategory,
} from "@/lib/ae-service-categories";
import { cleanServiceTitle, shortServiceLabel } from "@/lib/clean-service-title";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

interface PageProps {
  params: { category: string };
}

export async function generateStaticParams() {
  return AE_CATEGORIES_ORDER.map((cat) => ({ category: CATEGORY_TO_SLUG[cat] }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const cat = SLUG_TO_CATEGORY[params.category];
  if (!cat) return { title: `Not Found | Carelabs UAE` };
  const url = `https://carelabz.com/${CC}/services/category/${params.category}/`;
  return {
    title: `${cat} Services | Carelabs UAE`,
    description: `${cat} services from the Carelabs UAE engineering team — DEWA-compliant, IEEE 1584-aligned electrical safety work across the United Arab Emirates.`,
    alternates: {
      canonical: url,
      languages: { [config.hreflang]: url, "x-default": url },
    },
    openGraph: {
      title: `${cat} Services | Carelabs UAE`,
      description: `Browse all ${cat.toLowerCase()} services from Carelabs in the United Arab Emirates.`,
      url,
      siteName: "Carelabs",
      type: "website",
      locale: "en_AE",
    },
  };
}

function cleanSlug(svc: ServicePage): string {
  const suffix = `-${CC}`;
  return svc.slug.endsWith(suffix) ? svc.slug.slice(0, -suffix.length) : svc.slug;
}

export default async function ServiceCategoryPage({ params }: PageProps) {
  const category = SLUG_TO_CATEGORY[params.category];
  if (!category) notFound();

  const services = await getServicesByRegion(CC);
  const mapped = services.map((s) => ({
    slug: cleanSlug(s),
    title: cleanServiceTitle(s.title),
    metaDescription: s.metaDescription ?? "",
    rawSlug: s.slug,
  }));
  const grouped = groupServicesByCategory(mapped);
  const list = grouped[category] ?? [];

  return (
    <>
      <AENavbar config={config} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: `Carelabs UAE — ${category}`,
          url: `https://carelabz.com/${CC}/services/category/${params.category}/`,
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1280px]">
          <nav
            aria-label="Breadcrumb"
            className="animate-fade-in-up animation-delay-100 mb-8 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/40"
          >
            <Link
              href={`/${CC}/`}
              className="transition-colors duration-300 hover:text-white"
            >
              Home
            </Link>
            <ChevronRight className="h-3 w-3" />
            <Link
              href={`/${CC}/services/`}
              className="transition-colors duration-300 hover:text-white"
            >
              Services
            </Link>
            <ChevronRight className="h-3 w-3" />
            <span className="text-white/70">{category}</span>
          </nav>
          <p className="animate-fade-in-up animation-delay-200 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            Category
          </p>
          <h1 className="animate-fade-in-up animation-delay-300 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            {category}
          </h1>
          <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            {CATEGORY_TAGLINES[category]} {list.length} services in this category.
          </p>
        </div>
      </section>

      {/* SERVICES — horizontal list (every service in this category) */}
      <main id="main-content" className="bg-[#F2F2F4] py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          {list.length === 0 ? (
            <p className="py-12 text-center text-base text-gray-500">
              No services in this category yet.
            </p>
          ) : (
            <div className="border-t border-gray-300">
              {list.map((s, i) => (
                <ScrollReveal key={s.rawSlug} delay={(i % 8) * 40}>
                  <Link
                    href={`/${CC}/services/${s.slug}/`}
                    className="group flex items-center gap-6 border-b border-gray-300 py-8 md:gap-10"
                  >
                    <span className="w-12 shrink-0 font-display text-2xl text-[#F15C30] md:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h2 className="font-display text-xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6] md:text-2xl">
                        {shortServiceLabel(s.title)}
                      </h2>
                      {s.metaDescription && (
                        <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-gray-600 md:block">
                          {s.metaDescription}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#2575B6] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}

          <ScrollReveal>
            <div className="mt-12 text-center">
              <Link
                href={`/${CC}/services/`}
                className="group inline-flex items-center gap-2 text-sm font-semibold uppercase tracking-[0.15em] text-[#2575B6] hover:text-[#094D76]"
              >
                <ArrowRight className="h-4 w-4 rotate-180 transition-transform duration-300 group-hover:-translate-x-1" />
                Back to all services
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </main>

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
              Need help choosing?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Tell us about your project.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Get a Quote
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
