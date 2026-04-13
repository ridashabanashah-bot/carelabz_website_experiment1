import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Zap,
  Shield,
  FileText,
  CheckCircle,
  ChevronRight,
  Phone,
  Mail,
  MapPin,
  AlertTriangle,
  BarChart2,
  Settings,
  Activity,
  Cpu,
  ClipboardList,
} from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import { FaqAccordion } from "@/components/faq-accordion";
import { getServicePageBySlug, ServicePage } from "@/lib/strapi";

export const dynamic = "force-dynamic";

interface ServicePageProps {
  params: { category: string; slug: string };
}

export async function generateMetadata({
  params,
}: ServicePageProps): Promise<Metadata> {
  const strapiSlug = `${params.slug}-us`;
  const service = await getServicePageBySlug(strapiSlug);

  if (!service) {
    return { title: "Service Not Found | Carelabs USA" };
  }

  return {
    title: service.metaTitle || `${service.title} | Carelabs USA`,
    description: service.metaDescription || undefined,
    keywords: service.seoKeywords?.join(", "),
  };
}

// Fallback icon list for process steps
const STEP_ICONS = [
  ClipboardList,
  Cpu,
  BarChart2,
  Settings,
  Activity,
  Shield,
];

// Fallback icon for features
const FEATURE_ICONS = [AlertTriangle, Zap, CheckCircle];

function buildPageData(service: ServicePage) {
  return {
    title: service.title,
    eyebrow: service.eyebrow || "Electrical Safety",
    definitionalLede: service.definitionalLede || service.metaDescription || "",
    trustBadges: service.trustBadges || [
      { label: "NEC Compliant" },
      { label: "NFPA 70E" },
      { label: "OSHA Aligned" },
      { label: "IEEE 1584" },
    ],
    featuresHeading: service.featuresHeading || "Key Challenges We Solve",
    featuresSubtext:
      service.featuresSubtext ||
      "Our engineers identify and resolve electrical safety risks before they become costly incidents.",
    features: service.features || [],
    safetyEyebrow: service.safetyEyebrow || "Worker Safety",
    safetyHeading: service.safetyHeading || "Protecting Your Team",
    safetyBody:
      service.safetyBody ||
      "Electrical hazards are among the leading causes of workplace injuries. Our studies provide the data you need to implement proper PPE, establish safe work boundaries, and train your team.",
    safetyBullets: service.safetyBullets || [],
    safetyImage: service.safetyImage || null,
    safetyImageAlt: service.safetyImageAlt || "Electrical safety",
    reportsEyebrow: service.reportsEyebrow || "Deliverables",
    reportsHeading: service.reportsHeading || "Comprehensive Report Package",
    reportsBody:
      service.reportsBody ||
      "Every engagement concludes with a detailed report package designed to support your compliance programme and internal engineering team.",
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
    ctaBannerPrimaryText: service.ctaBannerPrimaryText || "Get a Free Quote",
    ctaBannerPrimaryHref: service.ctaBannerPrimaryHref || "/us/contact/",
    ctaBannerSecondaryText: service.ctaBannerSecondaryText || "View All Services",
    ctaBannerSecondaryHref:
      service.ctaBannerSecondaryHref || "/us/services/",
    faqs: service.faqs || [],
    faqSectionHeading: service.faqSectionHeading || "Frequently Asked Questions",
    footerDescription:
      service.footerDescription ||
      "Professional electrical safety services for US facilities. NEC, NFPA 70E, OSHA, and IEEE 1584 compliant.",
    footerPhone: service.footerPhone || null,
    footerEmail: service.footerEmail || null,
    footerAddress: service.footerAddress || null,
  };
}

export default async function ServiceDetailPage({ params }: ServicePageProps) {
  const strapiSlug = `${params.slug}-us`;
  const service = await getServicePageBySlug(strapiSlug);

  if (!service) {
    notFound();
  }

  const data = buildPageData(service);

  return (
    <>
      <StickyNavbar />

      {/* ================================================================
          HERO SECTION
      ================================================================ */}
      <section className="relative overflow-hidden bg-navy pt-24 pb-20">
        {/* Circuit SVG background */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-10"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 0 1200 600"
            preserveAspectRatio="xMidYMid slice"
          >
            <g stroke="#60a5fa" strokeWidth="1" fill="none">
              <line x1="0" y1="100" x2="200" y2="100" />
              <line x1="200" y1="100" x2="200" y2="200" />
              <line x1="200" y1="200" x2="400" y2="200" />
              <line x1="400" y1="200" x2="400" y2="50" />
              <line x1="400" y1="50" x2="700" y2="50" />
              <line x1="700" y1="50" x2="700" y2="300" />
              <line x1="700" y1="300" x2="1000" y2="300" />
              <line x1="1000" y1="300" x2="1000" y2="150" />
              <line x1="1000" y1="150" x2="1200" y2="150" />
              <line x1="0" y1="400" x2="300" y2="400" />
              <line x1="300" y1="400" x2="300" y2="500" />
              <line x1="300" y1="500" x2="600" y2="500" />
              <line x1="600" y1="500" x2="600" y2="350" />
              <line x1="600" y1="350" x2="900" y2="350" />
              <line x1="900" y1="350" x2="900" y2="450" />
              <line x1="900" y1="450" x2="1200" y2="450" />
              <circle cx="200" cy="200" r="4" fill="#60a5fa" />
              <circle cx="400" cy="50" r="4" fill="#60a5fa" />
              <circle cx="700" cy="300" r="4" fill="#60a5fa" />
              <circle cx="1000" cy="150" r="4" fill="#60a5fa" />
              <circle cx="300" cy="500" r="4" fill="#60a5fa" />
              <circle cx="600" cy="350" r="4" fill="#60a5fa" />
            </g>
          </svg>
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Breadcrumb */}
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-slate-400">
              <li>
                <Link href="/us/services/" className="hover:text-orange-400 transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li>
                <Link
                  href={`/us/services/${params.category}/`}
                  className="hover:text-orange-400 transition-colors capitalize"
                >
                  {params.category === "study-analysis"
                    ? "Study & Analysis"
                    : "Inspection"}
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">
                <ChevronRight className="h-3 w-3" />
              </li>
              <li className="text-white font-medium">{service.title}</li>
            </ol>
          </nav>

          <div className="mx-auto max-w-4xl">
            {/* Eyebrow */}
            <p className="mb-4 text-sm font-semibold uppercase tracking-widest text-orange-400">
              {data.eyebrow}
            </p>

            {/* H1 */}
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl mb-6">
              {service.title}
            </h1>

            {/* Definitional lede */}
            {data.definitionalLede && (
              <p className="text-xl font-semibold text-slate-200 leading-relaxed mb-8">
                {data.definitionalLede}
              </p>
            )}

            {/* Trust badges */}
            {data.trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-8">
                {data.trustBadges.map((badge, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full border border-orange-500/30 bg-orange-500/10 px-4 py-1.5 text-xs font-semibold text-orange-300"
                  >
                    <Shield className="h-3 w-3" />
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <main id="main-content">
        {/* ================================================================
            FEATURES / CHALLENGES SECTION
        ================================================================ */}
        {data.features.length > 0 && (
          <section className="bg-offWhite py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-4">
                  {data.featuresHeading}
                </h2>
                {data.featuresSubtext && (
                  <p className="text-slate-600 leading-relaxed">
                    {data.featuresSubtext}
                  </p>
                )}
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.features.slice(0, 6).map((feature, i) => {
                  const Icon = FEATURE_ICONS[i % FEATURE_ICONS.length];
                  return (
                    <div
                      key={i}
                      className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
                    >
                      <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-orange-500/10">
                        <Icon className="h-6 w-6 text-orange-500" />
                      </div>
                      <h3 className="text-lg font-bold text-navy mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {feature.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            SAFETY SECTION — image left, content right
        ================================================================ */}
        <section className="bg-white py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
                {data.safetyImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.safetyImage}
                    alt={data.safetyImageAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy/5">
                    <Shield className="h-24 w-24 text-navy/20" />
                  </div>
                )}
              </div>

              {/* Content */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
                  {data.safetyEyebrow}
                </p>
                <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-4">
                  {data.safetyHeading}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {data.safetyBody}
                </p>
                {data.safetyBullets.length > 0 && (
                  <ul className="space-y-3">
                    {data.safetyBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                        <span className="text-slate-700 text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            REPORTS SECTION — content left, image right
        ================================================================ */}
        <section className="bg-offWhite py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Content */}
              <div>
                <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-orange-500">
                  {data.reportsEyebrow}
                </p>
                <h2 className="text-3xl font-bold text-navy sm:text-4xl mb-4">
                  {data.reportsHeading}
                </h2>
                <p className="text-slate-600 leading-relaxed mb-6">
                  {data.reportsBody}
                </p>
                {data.reportsBullets.length > 0 && (
                  <ul className="space-y-3">
                    {data.reportsBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <FileText className="mt-0.5 h-5 w-5 shrink-0 text-orange-500" />
                        <span className="text-slate-700 text-sm">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Image */}
              <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3]">
                {data.reportsImage ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={data.reportsImage}
                    alt={data.reportsImageAlt}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-navy/5">
                    <FileText className="h-24 w-24 text-navy/20" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* ================================================================
            PROCESS STEPS — 6-step grid
        ================================================================ */}
        {data.processSteps.length > 0 && (
          <section className="bg-white py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                  {data.processHeading}
                </h2>
              </div>
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {data.processSteps.map((step, i) => {
                  const Icon = STEP_ICONS[i % STEP_ICONS.length];
                  return (
                    <div
                      key={step.number}
                      className="relative rounded-xl border border-slate-200 bg-offWhite p-6"
                    >
                      <div className="mb-4 flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-navy text-white text-sm font-bold">
                          {step.number}
                        </div>
                        <Icon className="h-5 w-5 text-orange-500" />
                      </div>
                      <h3 className="text-base font-bold text-navy mb-2">
                        {step.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            INDUSTRIES — 8 cards on navy background
        ================================================================ */}
        {data.industries.length > 0 && (
          <section className="bg-navy py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mx-auto max-w-2xl text-center mb-12">
                <h2 className="text-3xl font-bold text-white sm:text-4xl">
                  {data.industriesHeading}
                </h2>
              </div>
              <div className="grid gap-4 grid-cols-2 sm:grid-cols-3 lg:grid-cols-4">
                {data.industries.map((industry, i) => (
                  <div
                    key={i}
                    className="relative overflow-hidden rounded-xl bg-slateCard border border-slate-700 p-6 text-center"
                  >
                    {industry.image && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={industry.image}
                        alt={industry.alt}
                        className="mx-auto mb-3 h-12 w-12 object-contain opacity-80"
                      />
                    )}
                    <p className="text-sm font-semibold text-white">
                      {industry.name}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            INSIGHTS — 3 cards
        ================================================================ */}
        {data.insights.length > 0 && (
          <section className="bg-offWhite py-20">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10">
                <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                  {data.insightsHeading}
                </h2>
              </div>
              <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
                {data.insights.slice(0, 3).map((insight, i) => (
                  <article
                    key={i}
                    className="rounded-xl overflow-hidden border border-slate-200 bg-white shadow-sm hover:shadow-md transition-shadow"
                  >
                    {insight.image && (
                      <div className="aspect-[16/9] overflow-hidden bg-slate-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={insight.image}
                          alt={insight.alt}
                          className="h-full w-full object-cover"
                        />
                      </div>
                    )}
                    <div className="p-6">
                      <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-orange-500">
                        {insight.category}
                      </p>
                      <h3 className="text-base font-bold text-navy mb-2">
                        {insight.title}
                      </h3>
                      <p className="text-slate-600 text-sm leading-relaxed mb-4 line-clamp-2">
                        {insight.description}
                      </p>
                      <Link
                        href={insight.href}
                        className="text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                      >
                        Read more →
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* ================================================================
            FAQ SECTION
        ================================================================ */}
        {data.faqs.length > 0 && (
          <section className="bg-white py-20">
            <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
              <div className="mb-10 text-center">
                <h2 className="text-3xl font-bold text-navy sm:text-4xl">
                  {data.faqSectionHeading}
                </h2>
              </div>
              <FaqAccordion faqs={data.faqs} />
            </div>
          </section>
        )}

        {/* ================================================================
            CTA BANNER
        ================================================================ */}
        <section className="bg-navy py-20">
          <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl font-bold text-white sm:text-4xl mb-4">
              {data.ctaBannerHeading}
            </h2>
            {data.ctaBannerBody && (
              <p className="text-lg text-slate-300 leading-relaxed mb-8">
                {data.ctaBannerBody}
              </p>
            )}
            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href={data.ctaBannerPrimaryHref || "/us/contact/"}
                className="inline-flex items-center rounded-lg bg-orange-500 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {data.ctaBannerPrimaryText}
              </Link>
              {data.ctaBannerSecondaryText && (
                <Link
                  href={data.ctaBannerSecondaryHref || "/us/services/"}
                  className="inline-flex items-center rounded-lg border border-white/30 px-8 py-3.5 text-sm font-semibold text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
                >
                  {data.ctaBannerSecondaryText}
                </Link>
              )}
            </div>
          </div>
        </section>
      </main>

      {/* ================================================================
          FOOTER
      ================================================================ */}
      <footer className="bg-slateCard text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold mb-4">Carelabs USA</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                {data.footerDescription}
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link
                    href="/us/services/study-analysis/"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Study &amp; Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/services/inspection/"
                    className="hover:text-orange-400 transition-colors"
                  >
                    Inspection
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                {data.footerPhone && (
                  <li className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-orange-400 shrink-0" />
                    <a
                      href={`tel:${data.footerPhone}`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      {data.footerPhone}
                    </a>
                  </li>
                )}
                {data.footerEmail && (
                  <li className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-orange-400 shrink-0" />
                    <a
                      href={`mailto:${data.footerEmail}`}
                      className="hover:text-orange-400 transition-colors"
                    >
                      {data.footerEmail}
                    </a>
                  </li>
                )}
                {data.footerAddress && (
                  <li className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 text-orange-400 shrink-0" />
                    <span>{data.footerAddress}</span>
                  </li>
                )}
                {!data.footerPhone && !data.footerEmail && !data.footerAddress && (
                  <li>
                    <Link
                      href="/us/contact/"
                      className="hover:text-orange-400 transition-colors"
                    >
                      Get a Quote
                    </Link>
                  </li>
                )}
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} Carelabs. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
