export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowRight, ChevronRight, Plus, CheckCircle } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getServicePageBySlug, type ServicePage } from "@/lib/strapi";
import { JsonLd } from "@/components/JsonLd";
import { ScrollReveal } from "@/components/scroll-reveal";
import { SectionHeading } from "@/components/section-heading";

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
      <AENavbar config={config} />
      <JsonLd data={jsonLd} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1100px]">
          <nav aria-label="Breadcrumb" className="animate-fade-in-up animation-delay-100 mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/40">
              <li><Link href={`/${CC}/`} className="transition-colors duration-300 hover:text-white">Home</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li><Link href={config.servicesIndexPath} className="transition-colors duration-300 hover:text-white">Services</Link></li>
              <li aria-hidden="true"><ChevronRight className="h-3 w-3" /></li>
              <li className="line-clamp-1 text-white/70">{service.title}</li>
            </ol>
          </nav>
          <p className="animate-fade-in-up animation-delay-200 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            {service.eyebrow ?? `IEEE 1584 · ${config.primaryStandard}`}
          </p>
          <h1 className="animate-fade-in-up animation-delay-300 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            {service.title}
          </h1>
          {service.definitionalLede && (
            <p className="animate-fade-in-up animation-delay-400 mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
              {service.definitionalLede}
            </p>
          )}
          <div className="animate-fade-in-up animation-delay-500 mt-10">
            <Link
              href={service.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F15C30] px-8 py-3.5 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
            >
              Free Consultation
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* BODY PROSE */}
      {service.body && (
        <section className="bg-white px-6 py-20">
          <div className="mx-auto max-w-3xl">
            <ScrollReveal>
              <div
                className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-gray-900 prose-headings:font-normal prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-[#2575B6] prose-a:no-underline hover:prose-a:underline"
                dangerouslySetInnerHTML={{ __html: marked(service.body) as string }}
              />
            </ScrollReveal>
          </div>
        </section>
      )}

      {/* FEATURES — border-l accent cards */}
      {features.length > 0 && (
        <section className="bg-[#F2F2F4] px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-[1280px]">
            <SectionHeading
              eyebrow="What We Deliver"
              title={service.featuresHeading ?? "Key Outcomes"}
            />
            <div className="mt-16 grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
              {features.map((feature, i) => (
                <ScrollReveal key={i} delay={i * 100}>
                  <div className="group h-full border-l-2 border-[#2575B6] bg-white p-8 transition-colors duration-300 hover:border-[#F15C30]">
                    <span className="font-display text-3xl text-[#F15C30]/30">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-3 font-display text-lg uppercase tracking-tight text-gray-900">
                      {feature.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {feature.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* PROCESS — gap-px grid */}
      {processSteps.length > 0 && (
        <section className="bg-white py-24 lg:py-32">
          <div className="mx-auto max-w-[1280px] px-6">
            <SectionHeading
              eyebrow="Our Process"
              title={service.processHeading ?? "How We Work"}
            />
            <div className="mt-16 grid grid-cols-1 gap-px bg-gray-200 md:grid-cols-2 lg:grid-cols-4">
              {processSteps.map((step, i) => (
                <ScrollReveal key={step.number ?? i} delay={i * 100}>
                  <div className="h-full bg-white p-8">
                    <span className="block font-display text-6xl text-[#F15C30]/20">
                      {String(step.number ?? i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="mt-6 font-display text-lg uppercase tracking-tight text-gray-900">
                      {step.title}
                    </h3>
                    <p className="mt-3 text-sm leading-relaxed text-gray-600">
                      {step.description}
                    </p>
                  </div>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* SAFETY */}
      {(service.safetyHeading || service.safetyBody) && (
        <section className="bg-[#094D76] px-6 py-24 lg:py-32">
          <div className="mx-auto max-w-[1000px]">
            <ScrollReveal>
              <p className="text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
                {service.safetyEyebrow ?? "Safety"}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-3 font-display text-display-lg uppercase tracking-tight text-white">
                {service.safetyHeading ?? "Protecting Your Team"}
              </h2>
            </ScrollReveal>
            {service.safetyBody && (
              <ScrollReveal delay={200}>
                <p className="mt-6 text-lg leading-relaxed text-white/70">
                  {service.safetyBody}
                </p>
              </ScrollReveal>
            )}
            {safetyBullets.length > 0 && (
              <ScrollReveal delay={300}>
                <ul className="mt-8 space-y-3">
                  {safetyBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#F15C30]" />
                      <span className="text-white/80">{bullet}</span>
                    </li>
                  ))}
                </ul>
              </ScrollReveal>
            )}
          </div>
        </section>
      )}

      {/* FAQ */}
      {faqs.length > 0 && (
        <section className="bg-[#F2F2F4] py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading
              eyebrow="FAQ"
              title={service.faqSectionHeading ?? "Common Questions"}
            />
            <div className="mt-12 space-y-4">
              {faqs.map((faq, i) => (
                <ScrollReveal key={i} delay={i * 50}>
                  <details className="group bg-white px-8 py-6 [&[open]_h3]:text-[#2575B6]">
                    <summary className="flex cursor-pointer list-none items-start justify-between gap-4">
                      <h3 className="font-display text-base uppercase tracking-tight text-gray-900 transition-colors duration-300 md:text-lg">
                        {faq.question}
                      </h3>
                      <Plus className="h-5 w-5 shrink-0 text-[#F15C30] transition-transform duration-300 group-open:rotate-45" />
                    </summary>
                    <p className="mt-4 text-base leading-relaxed text-gray-600">
                      {faq.answer}
                    </p>
                  </details>
                </ScrollReveal>
              ))}
            </div>
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
              {service.ctaBannerHeading ?? "Ready to schedule a study?"}
            </h2>
          </ScrollReveal>
          {service.ctaBannerBody && (
            <ScrollReveal delay={200}>
              <p className="mt-6 text-lg leading-relaxed text-white/70">
                {service.ctaBannerBody}
              </p>
            </ScrollReveal>
          )}
          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={service.ctaBannerPrimaryHref ?? config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                {service.ctaBannerPrimaryText ?? "Get a Quote"}
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
