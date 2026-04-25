export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicesByRegion, type ServicePage } from "@/lib/strapi";
import { JsonLd } from "@/components/JsonLd";

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
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
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
      <section className="bg-[#0A1628] pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-6">
            United Arab Emirates · Engineering
          </p>
          <h1 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight">
            Our Services
          </h1>
          <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            DEWA-compliant studies, power system analysis, and electrical safety engineering — all delivered to {config.primaryStandard} and IEC standards.
          </p>
        </div>
      </section>

      {/* SERVICES GRID */}
      <main id="main-content" className="bg-[#EBF2F8] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          {services.length === 0 ? (
            <p className="text-center font-ae-body text-base text-[#0F2847]/50 py-12">
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {services.map((service) => (
                <Link
                  key={service.id}
                  href={getServiceHref(service)}
                  className="group block bg-white border border-[#D4E3F0] p-8 hover:border-[#2D7AB8] transition-colors"
                >
                  <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.15em] text-[#2D7AB8]">
                    IEEE 1584 · {config.primaryStandard}
                  </span>
                  <h2 className="font-ae-display text-2xl text-[#0F2847] mt-3 leading-tight group-hover:text-[#1E5A8A] transition-colors">
                    {service.title}
                  </h2>
                  {service.metaDescription && (
                    <p className="font-ae-body text-sm text-[#0F2847]/60 mt-4 leading-relaxed line-clamp-3">
                      {service.metaDescription}
                    </p>
                  )}
                  <span className="font-ae-nav font-medium text-sm uppercase tracking-[0.12em] text-[#2D7AB8] mt-6 inline-flex items-center gap-2">
                    Learn More <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-[#0F2847] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            Ready to schedule a study?
          </h2>
          <p className="font-ae-body text-lg text-[#5A8FB4] mt-6">
            Tell us about your facility and compliance requirements.
          </p>
          <div className="mt-10">
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              Request a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
