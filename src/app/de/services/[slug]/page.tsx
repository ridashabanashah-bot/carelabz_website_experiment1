import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import {
  Shield,
  FileText,
  CheckCircle,
  ChevronRight,
  Zap,
  Activity,
  BarChart2,
  Settings,
  Cpu,
  ClipboardList,
  Factory,
  Building2,
  Server,
  Flame,
  GraduationCap,
  Landmark,
  ArrowRight,
  Heart,
  Monitor,
  Truck,
  DollarSign,
  ShoppingBag,
  HardHat,
  Warehouse,
} from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["de"];
import { JsonLd } from "@/components/JsonLd";
import { FloatingSidebar } from "@/components/service-page/floating-sidebar";
import { FeatureTabs } from "@/components/service-page/feature-tabs";
import { ServiceFaqAccordion } from "@/components/service-page/faq-accordion-new";
import { getServicePageBySlug, ServicePage } from "@/lib/strapi";

export const dynamic = "force-dynamic";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface DEServicePageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: DEServicePageProps): Promise<Metadata> {
  const strapiSlug = `${params.slug}-de`;
  const service = await getServicePageBySlug(strapiSlug);

  if (!service) {
    return { title: "Service Not Found | Carelabs Germany" };
  }

  const pageUrl = `https://carelabz.com/de/services/${params.slug}/`;

  return {
    title: service.metaTitle || `${service.title} | Carelabs Germany`,
    description: service.metaDescription || undefined,
    keywords: service.seoKeywords?.join(", "),
    alternates: {
      canonical: pageUrl,
      languages: {
        "en-DE": pageUrl,
        "x-default": pageUrl,
      },
    },
    openGraph: {
      title: service.metaTitle || `${service.title} | Carelabs Germany`,
      description: service.metaDescription || undefined,
      url: pageUrl,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: service.metaTitle || `${service.title} | Carelabs Germany`,
      description: service.metaDescription || undefined,
    },
  };
}

const STEP_ICONS = [ClipboardList, Cpu, BarChart2, Settings, Activity, Shield];

const INDUSTRY_ICONS: Record<string, typeof Building2> = {
  "Oil & Gas": Flame,
  "Oil and Gas": Flame,
  Healthcare: Heart,
  "Health Care": Heart,
  "Data Centers": Server,
  "Data Center": Server,
  "Data Center and IT": Server,
  Manufacturing: Factory,
  Utilities: Zap,
  "Commercial Real Estate": Building2,
  Commercial: Building2,
  Education: GraduationCap,
  "Education and Research": GraduationCap,
  Government: Landmark,
  "Information Technology": Monitor,
  Transportation: Truck,
  "Financial Services": DollarSign,
  Retail: ShoppingBag,
  Construction: HardHat,
  Warehousing: Warehouse,
};

function buildPageData(service: ServicePage) {
  return {
    title: service.title,
    eyebrow: service.eyebrow || "ELECTRICAL SAFETY",
    definitionalLede:
      service.definitionalLede || service.metaDescription || "",
    trustBadges: service.trustBadges || [
      { label: "DIN VDE 0100" },
      { label: "DIN VDE 0100" },
      { label: "IEEE 1584" },
      { label: "P.Eng Certified" },
    ],
    featuresHeading: service.featuresHeading || "Key Challenges We Solve",
    featuresSubtext:
      service.featuresSubtext ||
      "Our engineers identify and resolve electrical safety risks before they become costly incidents.",
    features: service.features || [],
    safetyEyebrow: service.safetyEyebrow || "WORKER SAFETY",
    safetyHeading: service.safetyHeading || "Protecting Your Team",
    safetyBody:
      service.safetyBody ||
      "Electrical hazards are among the leading causes of workplace injuries in Germany facilities.",
    safetyBullets: service.safetyBullets || [],
    safetyImage: service.safetyImage || null,
    safetyImageAlt: service.safetyImageAlt || "Electrical safety",
    reportsEyebrow: service.reportsEyebrow || "DELIVERABLES",
    reportsHeading:
      service.reportsHeading || "Comprehensive Report Package",
    reportsBody:
      service.reportsBody ||
      "Every engagement concludes with a detailed DIN VDE 0100-aligned report package.",
    reportsBullets: service.reportsBullets || [],
    reportsImage: service.reportsImage || null,
    reportsImageAlt: service.reportsImageAlt || "Engineering report",
    processHeading: service.processHeading || "Our Process",
    processSteps: service.processSteps || [],
    industriesHeading: service.industriesHeading || "Industries We Serve",
    industries: service.industries || [],
    insightsHeading: service.insightsHeading || "Latest Insights",
    insights: service.insights || [],
    ctaBannerHeading:
      service.ctaBannerHeading || "Ready to Schedule Your Study?",
    ctaBannerBody:
      service.ctaBannerBody ||
      "Our certified engineers deliver fast turnaround, clear reports, and full compliance support.",
    ctaBannerPrimaryText:
      service.ctaBannerPrimaryText || "Get a Free Quote",
    ctaBannerPrimaryHref:
      service.ctaBannerPrimaryHref || "/de/contact-us/",
    ctaBannerSecondaryText:
      service.ctaBannerSecondaryText || "View All Services",
    ctaBannerSecondaryHref:
      service.ctaBannerSecondaryHref || "/de/services/",
    faqs: service.faqs || [],
    faqSectionHeading:
      service.faqSectionHeading || "Frequently Asked Questions",
    footerDescription:
      service.footerDescription ||
      "Professional electrical safety services for Germany facilities.",
    footerPhone: service.footerPhone || "+1 (800) 456-7890",
    footerEmail: service.footerEmail || "info@carelabz.com",
    footerAddress:
      service.footerAddress || "Toronto, ON, Germany",
  };
}

export default async function DEServiceDetailPage({
  params,
}: DEServicePageProps) {
  const strapiSlug = `${params.slug}-de`;
  const service = await getServicePageBySlug(strapiSlug);

  if (!service) {
    notFound();
  }

  const data = buildPageData(service);

  const pageUrl = `https://carelabz.com/de/services/${params.slug}/`;

  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: service.metaTitle || `${service.title} | Carelabs Germany`,
        description: service.metaDescription || undefined,
        inLanguage: "en-DE",
        isPartOf: { "@id": "https://carelabz.com/#website" },
      },
      {
        "@type": "Service",
        name: service.title,
        serviceType: "Electrical Safety Engineering",
        description: data.definitionalLede || service.metaDescription || undefined,
        url: pageUrl,
        provider: {
          "@type": "LocalBusiness",
          name: "Carelabs",
          url: "https://carelabz.com",
          telephone: data.footerPhone,
          email: data.footerEmail,
          address: {
            "@type": "PostalAddress",
            addressLocality: "Toronto",
            addressRegion: "ON",
            addressCountry: "Germany",
          },
        },
        areaServed: {
          "@type": "Country",
          name: "Germany",
        },
        speakable: {
          "@type": "SpeakableSpecification",
          cssSelector: ["h1", ".hero-subtext", ".faq-answer"],
        },
      },
      ...(data.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: data.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            },
          ]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          {
            "@type": "ListItem",
            position: 1,
            name: "Home",
            item: "https://carelabz.com/de/",
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: "https://carelabz.com/de/services/",
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: pageUrl,
          },
        ],
      },
      ...(data.processSteps.length > 0
        ? [
            {
              "@type": "HowTo",
              name: `How Carelabs Performs ${service.title}`,
              description: data.processHeading,
              totalTime: "P2W",
              step: data.processSteps.map((s, i) => ({
                "@type": "HowToStep",
                position: i + 1,
                name: s.title,
                text: s.description,
              })),
            },
          ]
        : []),
    ],
  };

  return (
    <main className={`${montserrat.className} bg-[#EEF4FF]`}>
      <JsonLd data={jsonLd} />
      <RegionNavbar config={config} />
      <FloatingSidebar />

      <section className="bg-[#EEF4FF] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-white/50 -top-48 -right-48" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[#374151]">
              <li>
                <Link
                  href="/de/services/"
                  className="hover:text-[#FF6633] transition-colors"
                >
                  Services
                </Link>
              </li>
              <li>
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="text-[#1A2538] font-medium">{service.title}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#1A2538] uppercase tracking-widest mb-4">
              {data.eyebrow}
            </p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#1A2538] leading-tight mb-6">
              {service.title}
            </h1>
            {data.definitionalLede && (
              <p className="text-xl text-[#374151] leading-relaxed mb-8">
                {data.definitionalLede}
              </p>
            )}
            <Link
              href={data.ctaBannerPrimaryHref}
              className="inline-flex items-center bg-[#FF6633] text-white rounded-[50px] h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-sm"
            >
              Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
            </Link>

            {data.trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-10">
                {data.trustBadges.map((badge, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0050B3] border border-blue-100 shadow-sm"
                  >
                    <Shield className="h-3.5 w-3.5" />
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#EEF4FF] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1A2538] mb-6">
              {data.featuresHeading}
            </h2>
            {data.featuresSubtext && (
              <p className="text-lg text-[#374151] leading-relaxed">
                {data.featuresSubtext}
              </p>
            )}
          </div>
        </div>
      </section>

      {data.features.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] mb-12">
              What We Deliver
            </h2>
            <FeatureTabs features={data.features} />
          </div>
        </section>
      )}

      <section className="bg-[#EEF4FF] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#FF6633] uppercase tracking-widest mb-4">
                {data.safetyEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2538] mb-6">
                {data.safetyHeading}
              </h2>
              <p className="text-[#374151] leading-relaxed mb-8">
                {data.safetyBody}
              </p>
              {data.safetyBullets.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {data.safetyBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0050B3]" />
                      <span className="text-[#374151]">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link
                href="/de/contact-us/"
                className="inline-flex items-center bg-[#0050B3] text-white rounded-[50px] h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-sm"
              >
                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-blue-100 aspect-[4/3] flex items-center justify-center">
              {data.safetyImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.safetyImage}
                  alt={data.safetyImageAlt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <Shield className="h-24 w-24 text-[#0050B3]/20" />
              )}
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] flex items-center justify-center order-2 lg:order-1">
              {data.reportsImage ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={data.reportsImage}
                  alt={data.reportsImageAlt}
                  className="h-full w-full object-cover"
                />
              ) : (
                <FileText className="h-24 w-24 text-slate-300" />
              )}
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold text-[#FF6633] uppercase tracking-widest mb-4">
                {data.reportsEyebrow}
              </p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2538] mb-6">
                {data.reportsHeading}
              </h2>
              <p className="text-[#374151] leading-relaxed mb-8">
                {data.reportsBody}
              </p>
              {data.reportsBullets.length > 0 && (
                <ol className="space-y-4 mb-8">
                  {data.reportsBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex-shrink-0 flex items-center justify-center bg-[#0050B3] text-white rounded-full w-8 h-8 text-sm font-bold">
                        {i + 1}
                      </span>
                      <span className="text-[#374151] pt-1">{bullet}</span>
                    </li>
                  ))}
                </ol>
              )}
              <Link
                href="/de/contact-us/"
                className="inline-flex items-center bg-[#0050B3] text-white rounded-[50px] h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-sm"
              >
                Reach Out <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {data.processSteps.length > 0 && (
        <section className="bg-[#EEF4FF] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] text-center mb-16">
              {data.processHeading}
            </h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.processSteps.map((step, index) => {
                const Icon = STEP_ICONS[index % STEP_ICONS.length];
                const stepNum = step.number ?? index + 1;
                return (
                  <div
                    key={stepNum}
                    className="relative bg-white rounded-[30px] shadow-sm p-8"
                  >
                    <span className="absolute top-4 right-6 text-6xl font-bold text-[#0050B3]/10">
                      {String(stepNum).padStart(2, "0")}
                    </span>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                      <Icon className="h-6 w-6 text-[#0050B3]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A2538] mb-2">
                      {step.title}
                    </h3>
                    <p className="text-[#374151] text-sm leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      <section className="bg-[#EEF4FF] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] text-center mb-16">
            Industries We Empower
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { name: "Oil & Gas", desc: "Upstream, midstream, and downstream facilities across Germany" },
              { name: "Healthcare", desc: "Hospitals, clinics, and medical campuses" },
              { name: "Data Centers", desc: "Tier I through Tier IV facilities" },
              { name: "Manufacturing", desc: "Production lines and industrial plants" },
              { name: "Utilities", desc: "Generation, transmission, and distribution" },
              { name: "Commercial Real Estate", desc: "Office buildings and retail complexes" },
              { name: "Education", desc: "Universities, schools, and research labs" },
              { name: "Government", desc: "Federal, provincial, and municipal facilities" },
            ].map((ind) => {
              const Icon = INDUSTRY_ICONS[ind.name] || Building2;
              return (
                <div
                  key={ind.name}
                  className="bg-white border-l-4 border-[#0050B3] rounded-r-2xl p-6 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all"
                >
                  <div className="flex items-center gap-3 mb-2">
                    <Icon className="h-5 w-5 text-[#0050B3]" />
                    <h3 className="font-bold text-[#1A2538]">{ind.name}</h3>
                  </div>
                  <p className="text-sm text-[#374151]">{ind.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {data.faqs.length > 0 && (
        <section className="bg-[#EEF4FF] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] text-center mb-12">
              {data.faqSectionHeading}
            </h2>
            <ServiceFaqAccordion faqs={data.faqs} />
          </div>
        </section>
      )}

      <section className="bg-[#0050B3] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            {data.ctaBannerHeading}
          </h2>
          {data.ctaBannerBody && (
            <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">
              {data.ctaBannerBody}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={data.ctaBannerSecondaryHref}
              className="inline-flex items-center justify-center rounded-[50px] border-2 border-white text-white h-[50px] px-8 font-semibold hover:bg-white hover:text-[#0050B3] transition-all"
            >
              {data.ctaBannerSecondaryText}
            </Link>
            <Link
              href={data.ctaBannerPrimaryHref}
              className="inline-flex items-center justify-center rounded-[50px] bg-[#FF6633] text-white h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-lg"
            >
              {data.ctaBannerPrimaryText}
            </Link>
          </div>
        </div>
      </section>

      <RegionFooter config={config} />
    </main>
  );
}
