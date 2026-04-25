export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowRight, ChevronRight, Plus, CheckCircle } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicePageBySlug, type ServicePage } from "@/lib/strapi";
import { JsonLd } from "@/components/JsonLd";

const CC = "ae";
const COUNTRY_NAME = "United Arab Emirates";
const HREFLANG = "en-AE";
const config = COUNTRY_CONFIGS[CC];

interface PageProps {
  params: { slug: string };
}

async function fetchServiceWithFallback(slug: string): Promise<ServicePage | null> {
  const withSuffix = await getServicePageBySlug(`${slug}-${CC}`);
  if (withSuffix) return withSuffix;
  return getServicePageBySlug(slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageUrl = `https://carelabz.com/${CC}/services/${params.slug}/`;
  const service = await fetchServiceWithFallback(params.slug);
  if (!service) {
    return { title: `Not Found | Carelabs ${COUNTRY_NAME}` };
  }
  return {
    title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
    description: service.metaDescription || undefined,
    keywords: service.seoKeywords?.join(", "),
    alternates: {
      canonical: pageUrl,
      languages: { [HREFLANG]: pageUrl, "x-default": pageUrl },
    },
    openGraph: {
      title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
      description: service.metaDescription || undefined,
      url: pageUrl,
      siteName: "Carelabs",
      type: "website",
      locale: "en_AE",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
      description: service.metaDescription || undefined,
    },
  };
}

export default async function ServiceDetailPage({ params }: PageProps) {
  const service = await fetchServiceWithFallback(params.slug);
  if (!service) notFound();

  const pageUrl = `https://carelabz.com/${CC}/services/${params.slug}/`;
  const features = service.features ?? [];
  const processSteps = service.processSteps ?? [];
  const safetyBullets = service.safetyBullets ?? [];
  const faqs = service.faqs ?? [];

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Service",
        name: service.title,
        serviceType: "Electrical Safety Engineering",
        description: service.metaDescription ?? undefined,
        url: pageUrl,
        provider: {
          "@type": "LocalBusiness",
          name: "Carelabs",
          url: "https://carelabz.com",
          email: config.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: config.address,
            addressCountry: "AE",
          },
        },
        areaServed: { "@type": "Country", name: COUNTRY_NAME },
      },
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((f) => ({
                "@type": "Question",
                name: f.question,
                acceptedAnswer: { "@type": "Answer", text: f.answer },
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <>
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-[1100px] mx-auto relative z-10">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-ae-nav text-xs uppercase tracking-[0.15em] text-white/40">
              <li><Link href={`/${CC}/`} className="hover:text-[#2D7AB8] transition-colors">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li><Link href={config.servicesIndexPath} className="hover:text-[#2D7AB8] transition-colors">Services</Link></li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li className="text-white/70 line-clamp-1">{service.title}</li>
            </ol>
          </nav>

          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-6">
            {service.eyebrow ?? `IEEE 1584 · ${config.primaryStandard}`}
          </p>
          <h1 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            {service.title}
          </h1>
          {service.definitionalLede && (
            <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-8 max-w-2xl leading-relaxed">
              {service.definitionalLede}
            </p>
          )}
          <div className="mt-10">
            <Link
              href={service.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
            >
              Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BODY PROSE */}
      {service.body && (
        <section className="bg-[#FAFBFC] py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:font-ae-display prose-headings:text-[#0F2847] prose-headings:font-normal prose-p:text-[#0F2847]/70 prose-p:font-ae-body prose-li:text-[#0F2847]/70 prose-li:font-ae-body prose-strong:text-[#0F2847] prose-a:text-[#2D7AB8] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: marked(service.body) as string }}
            />
          </div>
        </section>
      )}

      {/* FEATURES */}
      {features.length > 0 && (
        <section className="bg-[#EBF2F8] py-20 lg:py-28 px-6">
          <div className="max-w-[1200px] mx-auto">
            <div className="text-center mb-14">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                What We Deliver
              </span>
              <h2 className="font-ae-display text-3xl md:text-5xl text-[#0F2847]">
                {service.featuresHeading ?? "Key Outcomes"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div key={i} className="bg-white border border-[#D4E3F0] p-6">
                  <span className="font-ae-display text-3xl text-[#2D7AB8]/20">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-ae-body font-semibold text-lg text-[#0F2847] mt-3">
                    {feature.title}
                  </h3>
                  <p className="font-ae-body text-sm text-[#0F2847]/60 mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS */}
      {processSteps.length > 0 && (
        <section className="bg-[#163560] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-14">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8]/60 mb-4 block">
                Our Process
              </span>
              <h2 className="font-ae-display text-3xl md:text-5xl text-white">
                {service.processHeading ?? "How We Work"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1E5A8A]/20">
              {processSteps.map((step, i) => (
                <div key={step.number ?? i} className="bg-[#163560] p-8">
                  <span className="font-ae-display text-5xl text-[#2D7AB8]/15 block">
                    {String(step.number ?? i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-ae-body font-semibold text-lg text-white uppercase mt-6 tracking-wide">
                    {step.title}
                  </h3>
                  <p className="font-ae-body text-sm text-white/35 mt-4 leading-relaxed">
                    {step.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SAFETY */}
      {(service.safetyHeading || service.safetyBody) && (
        <section className="bg-[#0F2847] py-20 lg:py-28 px-6">
          <div className="max-w-[1000px] mx-auto">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8]/70 mb-4 block">
              {service.safetyEyebrow ?? "Safety"}
            </span>
            <h2 className="font-ae-display text-3xl md:text-5xl text-white leading-[0.95]">
              {service.safetyHeading ?? "Protecting Your Team"}
            </h2>
            {service.safetyBody && (
              <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-6 leading-relaxed">
                {service.safetyBody}
              </p>
            )}
            {safetyBullets.length > 0 && (
              <ul className="mt-8 space-y-3">
                {safetyBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-[#2D7AB8] mt-0.5 shrink-0" />
                    <span className="font-ae-body text-white/80">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-[#F8F5F0] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                FAQ
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl text-[#0F2847]">
                {service.faqSectionHeading ?? "Common Questions"}
              </h2>
            </div>
            {faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[#0F2847]/10 py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ae-body font-semibold text-base md:text-lg text-[#0F2847]">
                  <span>{faq.question}</span>
                  <Plus className="w-5 h-5 text-[#2D7AB8] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                </summary>
                <p className="font-ae-body text-base text-[#0F2847]/60 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* CTA */}
      <section className="bg-[#0F2847] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            {service.ctaBannerHeading ?? "Ready to schedule a study?"}
          </h2>
          {service.ctaBannerBody && (
            <p className="font-ae-body text-lg text-[#5A8FB4] mt-6 max-w-xl mx-auto">
              {service.ctaBannerBody}
            </p>
          )}
          <div className="mt-10">
            <Link
              href={service.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              {service.ctaBannerPrimaryText ?? "Get a Quote"}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
