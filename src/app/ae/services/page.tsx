export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicesByRegion, type ServicePage } from "@/lib/strapi";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/scroll-reveal";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Electrical Safety Services UAE | Carelabs`,
  description: `Carelabs provides DEWA-compliant arc flash studies, power system analysis, and electrical safety services across the United Arab Emirates.`,
  alternates: {
    canonical: `https://carelabz.com${config.servicesIndexPath}`,
    languages: {
      [config.hreflang]: `https://carelabz.com${config.servicesIndexPath}`,
      "x-default": `https://carelabz.com${config.servicesIndexPath}`,
    },
  },
  openGraph: {
    title: `Power System Engineering Services in UAE | Carelabs`,
    description: `DEWA-compliant power system studies, arc flash analysis, and electrical safety solutions across the UAE.`,
    url: `https://carelabz.com${config.servicesIndexPath}`,
    siteName: "Carelabs",
    type: "website",
    locale: "en_AE",
  },
};

function getServiceHref(svc: ServicePage): string {
  const suffix = `-${CC}`;
  const slug = svc.slug.endsWith(suffix) ? svc.slug.slice(0, -suffix.length) : svc.slug;
  return config.serviceDetailPattern.replace("{slug}", slug);
}

export default async function ServicesIndexPage() {
  const services = await getServicesByRegion(CC);

  return (
    <>
      <AENavbar config={config} />
      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: "Carelabs UAE — Services",
          url: `https://carelabz.com${config.servicesIndexPath}`,
        }}
      />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1280px] text-center">
          <p className="animate-fade-in-up animation-delay-100 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            United Arab Emirates · Engineering
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            Our Services
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            DEWA-compliant studies, power system analysis, and electrical safety engineering — all delivered to {config.primaryStandard} and IEC standards.
          </p>
        </div>
      </section>

      {/* SERVICES — horizontal list */}
      <main id="main-content" className="bg-[#F2F2F4] py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          {services.length === 0 ? (
            <p className="py-12 text-center text-base text-gray-500">
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="border-t border-gray-300">
              {services.map((service, i) => (
                <ScrollReveal key={service.id} delay={i * 50}>
                  <Link
                    href={getServiceHref(service)}
                    className="group flex items-center gap-6 border-b border-gray-300 py-8 md:gap-10"
                  >
                    <span className="w-12 shrink-0 font-display text-2xl text-[#F15C30] md:text-3xl">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <div className="flex-1">
                      <h2 className="font-display text-xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6] md:text-2xl">
                        {service.title}
                      </h2>
                      {service.metaDescription && (
                        <p className="mt-2 hidden max-w-2xl text-sm leading-relaxed text-gray-600 md:block">
                          {service.metaDescription}
                        </p>
                      )}
                    </div>
                    <ArrowRight className="h-5 w-5 shrink-0 text-[#2575B6] opacity-0 transition-all duration-300 group-hover:translate-x-2 group-hover:opacity-100" />
                  </Link>
                </ScrollReveal>
              ))}
            </div>
          )}
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
              Ready to schedule a study?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Tell us about your facility and compliance requirements.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Request a Quote
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
