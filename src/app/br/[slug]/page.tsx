import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import {
  Shield,
  FileText,
  CheckCircle2,
  ChevronRight,
  ArrowRight,
} from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { JsonLd } from "@/components/JsonLd";
import { getServicePageBySlug, ServicePage } from "@/lib/strapi";
import { getBlogPost, BlogPost } from "@/lib/strapi-blog";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";

export const dynamic = "force-dynamic";

const CC = "br";
const COUNTRY_NAME = "Brazil";
const HREFLANG = "en-BR";
const config = COUNTRY_CONFIGS[CC];

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageUrl = `https://carelabz.com/${CC}/${params.slug}/`;
  const service = await getServicePageBySlug(`${params.slug}-${CC}`);
  if (service) {
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
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
        description: service.metaDescription || undefined,
      },
    };
  }
  const post = await getBlogPost(CC, `${params.slug}-${CC}`);
  if (post) {
    return {
      title: post.metaTitle ?? `${post.title} | Carelabs ${COUNTRY_NAME}`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      keywords: post.seoKeywords ?? undefined,
      alternates: {
        canonical: pageUrl,
        languages: { [HREFLANG]: pageUrl, "x-default": pageUrl },
      },
      openGraph: {
        title: post.metaTitle ?? `${post.title} | Carelabs ${COUNTRY_NAME}`,
        description: post.metaDescription ?? post.excerpt ?? undefined,
        url: pageUrl,
        siteName: "Carelabs",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.metaTitle ?? `${post.title} | Carelabs ${COUNTRY_NAME}`,
        description: post.metaDescription ?? post.excerpt ?? undefined,
      },
    };
  }
  return { title: `Not Found | Carelabs ${COUNTRY_NAME}` };
}

function buildServiceData(service: ServicePage) {
  return {
    title: service.title,
    eyebrow: service.eyebrow || "Electrical Safety",
    definitionalLede: service.definitionalLede || service.metaDescription || "",
    trustBadges:
      service.trustBadges ||
      config.standards.slice(0, 4).map((s) => ({ label: s })),
    featuresHeading: service.featuresHeading || "Key Challenges We Solve",
    featuresSubtext: service.featuresSubtext || "",
    features: service.features || [],
    safetyEyebrow: service.safetyEyebrow || "Worker Safety",
    safetyHeading: service.safetyHeading || "Protecting Your Team",
    safetyBody:
      service.safetyBody ||
      `Electrical hazards are among the leading causes of workplace injuries in ${COUNTRY_NAME} facilities.`,
    safetyBullets: service.safetyBullets || [],
    reportsEyebrow: service.reportsEyebrow || "Deliverables",
    reportsHeading: service.reportsHeading || "Comprehensive Report Package",
    reportsBody:
      service.reportsBody ||
      `Every engagement concludes with a ${config.primaryStandard}-aligned report package.`,
    reportsBullets: service.reportsBullets || [],
    processHeading: service.processHeading || "Our Process",
    processSteps: service.processSteps || [],
    faqs: service.faqs || [],
    faqSectionHeading: service.faqSectionHeading || "Frequently Asked Questions",
    ctaBannerHeading:
      service.ctaBannerHeading || "Ready to Schedule Your Study?",
    ctaBannerBody:
      service.ctaBannerBody ||
      "Our certified engineers deliver fast turnaround, clear reports, and full compliance support.",
    ctaBannerPrimaryText: service.ctaBannerPrimaryText || "Get a Free Quote",
    ctaBannerPrimaryHref:
      service.ctaBannerPrimaryHref || config.contactPath,
  };
}

function GradientCTA({
  heading,
  body,
  buttonText,
  buttonHref,
}: {
  heading: string;
  body?: string;
  buttonText: string;
  buttonHref: string;
}) {
  return (
    <section className="bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 lg:py-24 text-center">
      <div className="max-w-4xl mx-auto px-6">
        <h2 className="font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase leading-tight">
          {heading}
        </h2>
        {body && (
          <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
            {body}
          </p>
        )}
        <Link
          href={buttonHref}
          className="mt-8 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide"
        >
          {buttonText}
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
}

function ServiceView({ service, slug }: { service: ServicePage; slug: string }) {
  const data = buildServiceData(service);
  const pageUrl = `https://carelabz.com/${CC}/${slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
        description: service.metaDescription || undefined,
        inLanguage: HREFLANG,
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
          telephone: config.phone,
          email: config.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: config.address,
            addressCountry: CC.toUpperCase(),
          },
        },
        areaServed: { "@type": "Country", name: COUNTRY_NAME },
      },
      ...(data.faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: data.faqs.map((faq) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: { "@type": "Answer", text: faq.answer },
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
            item: `https://carelabz.com/${CC}/`,
          },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `https://carelabz.com${config.servicesIndexPath}`,
          },
          {
            "@type": "ListItem",
            position: 3,
            name: service.title,
            item: pageUrl,
          },
        ],
      },
    ],
  };

  return (
    <div className="bg-white">
      <JsonLd data={jsonLd} />

      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* HERO */}
        <section className="relative bg-[#0B1A2F] py-16 lg:py-24 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 font-body text-sm text-white/60">
                <li>
                  <Link
                    href={`/${CC}/`}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Home
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li>
                  <Link
                    href={config.servicesIndexPath}
                    className="hover:text-orange-500 transition-colors"
                  >
                    Services
                  </Link>
                </li>
                <li>
                  <ChevronRight className="h-3 w-3" />
                </li>
                <li className="text-white">{service.title}</li>
              </ol>
            </nav>

            <div className="max-w-3xl">
              <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                {data.eyebrow}
              </p>
              <h1 className="font-condensed font-extrabold text-3xl md:text-4xl lg:text-5xl uppercase text-white leading-tight tracking-tight">
                {service.title}
              </h1>
              {data.definitionalLede && (
                <p className="font-body text-lg text-white/70 mt-6 max-w-3xl">
                  {data.definitionalLede}
                </p>
              )}
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href={data.ctaBannerPrimaryHref}
                  className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold uppercase tracking-wide px-8 py-3 rounded-full transition-colors"
                >
                  Free Consultation
                  <ArrowRight className="w-4 h-4" />
                </Link>
                <Link
                  href={config.servicesIndexPath}
                  className="inline-flex items-center gap-2 border-2 border-white text-white font-condensed font-bold uppercase tracking-wide px-8 py-3 rounded-full hover:bg-white hover:text-[#0B1A2F] transition-colors"
                >
                  All Services
                </Link>
              </div>
              {data.trustBadges.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-8">
                  {data.trustBadges.map((badge, i) => (
                    <span
                      key={i}
                      className="inline-flex items-center gap-2 rounded-full bg-white/10 border border-white/20 px-4 py-2 font-body text-sm text-white"
                    >
                      <Shield className="h-3.5 w-3.5 text-orange-500" />
                      {badge.label}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </section>

        {/* FEATURES */}
        {data.features.length > 0 && (
          <section className="bg-[#F8FAFC] py-16 lg:py-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="mb-12 max-w-3xl">
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  What We Deliver
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase">
                  {data.featuresHeading}
                </h2>
                {data.featuresSubtext && (
                  <p className="font-body text-lg text-gray-600 mt-6">
                    {data.featuresSubtext}
                  </p>
                )}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {data.features.map((feature, i) => (
                  <div
                    key={i}
                    className="rounded-2xl rounded-tr-none bg-white p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                  >
                    <CheckCircle2 className="text-orange-500 w-6 h-6" />
                    <h3 className="font-condensed font-bold text-base uppercase text-[#0B1A2F] mt-3">
                      {feature.title}
                    </h3>
                    <p className="font-body text-sm text-gray-600 mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* PROCESS */}
        {data.processSteps.length > 0 && (
          <section className="bg-white py-16 lg:py-24">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="mb-12">
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  How We Work
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase">
                  {data.processHeading}
                </h2>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                {data.processSteps.map((step, i) => {
                  const stepNum = step.number ?? i + 1;
                  return (
                    <div
                      key={stepNum}
                      className="border-t-2 border-orange-500 pt-6"
                    >
                      <div className="font-condensed font-extrabold text-6xl text-orange-500/20 leading-none">
                        {String(stepNum).padStart(2, "0")}
                      </div>
                      <h3 className="font-condensed font-bold text-lg text-[#0B1A2F] uppercase mt-2">
                        {step.title}
                      </h3>
                      <p className="font-body text-sm text-gray-600 leading-relaxed mt-3">
                        {step.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* SAFETY */}
        <section className="bg-[#1E293B] py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div>
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  {data.safetyEyebrow}
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-white uppercase">
                  {data.safetyHeading}
                </h2>
                <p className="font-body text-lg text-white/70 mt-6 leading-relaxed">
                  {data.safetyBody}
                </p>
                {data.safetyBullets.length > 0 && (
                  <ul className="mt-6 space-y-3">
                    {data.safetyBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                        <span className="font-body text-white/90">{bullet}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
              <div className="relative rounded-2xl rounded-tr-none aspect-[4/3] flex items-center justify-center overflow-hidden bg-white/5 border border-white/10">
                <Shield className="w-32 h-32 text-orange-500/30" />
              </div>
            </div>
          </div>
        </section>

        {/* REPORTS */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
              <div className="relative rounded-2xl rounded-tr-none aspect-[4/3] flex items-center justify-center bg-white order-2 lg:order-1 border border-gray-100">
                <FileText className="w-32 h-32 text-[#0B1A2F]/15" />
              </div>
              <div className="order-1 lg:order-2">
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  {data.reportsEyebrow}
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase">
                  {data.reportsHeading}
                </h2>
                <p className="font-body text-lg text-gray-600 mt-6 leading-relaxed">
                  {data.reportsBody}
                </p>
                {data.reportsBullets.length > 0 && (
                  <ol className="mt-6 space-y-3">
                    {data.reportsBullets.map((bullet, i) => (
                      <li key={i} className="flex items-start gap-4">
                        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-orange-500 text-white font-condensed font-bold text-sm shrink-0">
                          {i + 1}
                        </span>
                        <span className="font-body text-gray-700 pt-1">
                          {bullet}
                        </span>
                      </li>
                    ))}
                  </ol>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        {data.faqs.length > 0 && (
          <section className="bg-[#F8FAFC] py-16 lg:py-24">
            <div className="max-w-3xl mx-auto px-6 lg:px-12">
              <div className="mb-10 text-center">
                <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
                  FAQ
                </p>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl text-[#0B1A2F] uppercase">
                  {data.faqSectionHeading}
                </h2>
              </div>
              <div className="space-y-4">
                {data.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-2xl p-6 border border-gray-200 open:shadow-lg transition-shadow"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="font-condensed font-bold uppercase text-[#0B1A2F] pr-6">
                        {faq.question}
                      </span>
                      <span className="text-orange-500 text-2xl transition-transform group-open:rotate-45 shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 font-body text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <GradientCTA
          heading={data.ctaBannerHeading}
          body={data.ctaBannerBody}
          buttonText={data.ctaBannerPrimaryText}
          buttonHref={data.ctaBannerPrimaryHref}
        />
      </main>

      <SAFooter config={config} />
    </div>
  );
}

function formatDate(s: string | null): string {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return s;
  }
}

function BlogView({ post }: { post: BlogPost }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
    inLanguage: HREFLANG,
    author: {
      "@type": "Person",
      name: post.author ?? "Carelabs Engineering Team",
    },
    datePublished: post.publishedDate ?? post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      "@type": "Organization",
      name: "Carelabs",
      url: "https://carelabz.com",
    },
    ...(post.heroImage
      ? { image: `https://carelabz.com${post.heroImage}` }
      : {}),
    url: `https://carelabz.com/${CC}/${post.slug}/`,
  };

  return (
    <div className="bg-white">
      <JsonLd data={articleJsonLd} />

      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* HERO */}
        <section className="relative bg-[#0B1A2F] py-16 lg:py-24 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-3xl mx-auto px-6 lg:px-12">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-body text-sm text-white/60 mb-6"
            >
              <Link
                href={`/${CC}/`}
                className="hover:text-orange-500 transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href={config.blogIndexPath}
                className="hover:text-orange-500 transition-colors"
              >
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white line-clamp-1">{post.title}</span>
            </nav>
            {post.category && (
              <span className="font-condensed text-xs uppercase tracking-[0.15em] bg-orange-500 text-white px-3 py-1 rounded-full inline-block mb-4">
                {post.category}
              </span>
            )}
            <h1 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-white leading-tight tracking-tight">
              {post.title}
            </h1>
            <div className="font-body text-sm text-white/60 mt-4 flex flex-wrap items-center gap-4">
              {post.author && (
                <span>
                  By <span className="text-white">{post.author}</span>
                </span>
              )}
              {post.publishedDate && (
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
              )}
            </div>
            {post.heroImage && post.heroImage.startsWith("http") && (
              <div className="mt-10 relative aspect-[16/9] rounded-2xl rounded-tr-none overflow-hidden shadow-2xl">
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt ?? post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
          </div>
        </section>

        {/* BODY */}
        <section className="bg-white py-12 lg:py-16">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <article
              className="prose prose-lg max-w-none font-body text-gray-700 leading-relaxed prose-headings:font-condensed prose-headings:font-bold prose-headings:uppercase prose-headings:text-[#0B1A2F] prose-strong:text-[#0B1A2F] prose-a:text-orange-500 hover:prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: marked(post.body || "") as string,
              }}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F8FAFC] px-4 py-1.5 font-body text-xs font-medium text-[#0B1A2F] border border-gray-200"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQ */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="bg-[#F8FAFC] py-16">
            <div className="max-w-3xl mx-auto px-6 lg:px-12">
              <h2 className="font-condensed font-extrabold text-3xl text-[#0B1A2F] uppercase mb-8 text-center">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {post.faqs.map((faq, i) => (
                  <details
                    key={i}
                    className="group bg-white rounded-2xl p-6 border border-gray-200 open:shadow-lg transition-shadow"
                  >
                    <summary className="flex items-center justify-between cursor-pointer list-none">
                      <span className="font-condensed font-bold uppercase text-[#0B1A2F] pr-6">
                        {faq.question}
                      </span>
                      <span className="text-orange-500 text-2xl transition-transform group-open:rotate-45 shrink-0">
                        +
                      </span>
                    </summary>
                    <p className="mt-4 font-body text-gray-600 leading-relaxed">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          </section>
        )}

        <GradientCTA
          heading="Need Expert Electrical Safety Support?"
          body={`Carelabs provides arc flash studies, power system analysis, and ${config.primaryStandard} compliance services across ${COUNTRY_NAME}.`}
          buttonText="Get a Free Quote"
          buttonHref={config.contactPath}
        />
      </main>

      <SAFooter config={config} />
    </div>
  );
}

export default async function Page({ params }: PageProps) {
  const service = await getServicePageBySlug(`${params.slug}-${CC}`);
  if (service) return <ServiceView service={service} slug={params.slug} />;
  const post = await getBlogPost(CC, `${params.slug}-${CC}`);
  if (post) return <BlogView post={post} />;
  notFound();
}
