import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import {
  Shield,
  FileText,
  CheckCircle,
  ChevronRight,
  Activity,
  BarChart2,
  Settings,
  Cpu,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { SouthAmericaFooter } from "@/components/south-america-footer";
import { JsonLd } from "@/components/JsonLd";
import { FloatingSidebar } from "@/components/service-page/floating-sidebar";
import { FeatureTabs } from "@/components/service-page/feature-tabs";
import { ServiceFaqAccordion } from "@/components/service-page/faq-accordion-new";
import { FaqAccordion } from "@/components/faq-accordion";
import { getServicePageBySlug, ServicePage } from "@/lib/strapi";
import { getBlogPost, BlogPost } from "@/lib/strapi-blog";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";

export const dynamic = "force-dynamic";

const CC = "cl";
const COUNTRY_NAME = "Chile";
const HREFLANG = "en-CL";
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

const STEP_ICONS = [ClipboardList, Cpu, BarChart2, Settings, Activity, Shield];

function buildServiceData(service: ServicePage) {
  return {
    title: service.title,
    eyebrow: service.eyebrow || "ELECTRICAL SAFETY",
    definitionalLede: service.definitionalLede || service.metaDescription || "",
    trustBadges:
      service.trustBadges ||
      config.standards.slice(0, 4).map((s) => ({ label: s })),
    featuresHeading: service.featuresHeading || "Key Challenges We Solve",
    featuresSubtext:
      service.featuresSubtext ||
      "Our engineers identify and resolve electrical safety risks before they become costly incidents.",
    features: service.features || [],
    safetyEyebrow: service.safetyEyebrow || "WORKER SAFETY",
    safetyHeading: service.safetyHeading || "Protecting Your Team",
    safetyBody:
      service.safetyBody ||
      `Electrical hazards are among the leading causes of workplace injuries in ${COUNTRY_NAME} facilities.`,
    safetyBullets: service.safetyBullets || [],
    reportsEyebrow: service.reportsEyebrow || "DELIVERABLES",
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
    ctaBannerSecondaryText:
      service.ctaBannerSecondaryText || "View All Services",
    ctaBannerSecondaryHref:
      service.ctaBannerSecondaryHref || config.servicesIndexPath,
  };
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
          { "@type": "ListItem", position: 1, name: "Home", item: `https://carelabz.com/${CC}/` },
          {
            "@type": "ListItem",
            position: 2,
            name: "Services",
            item: `https://carelabz.com${config.servicesIndexPath}`,
          },
          { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <div className="sa-root">
      <JsonLd data={jsonLd} />
      <RegionNavbar config={config} />
      <FloatingSidebar />

      {/* HERO */}
      <section
        className="sa-hero-bg relative overflow-hidden"
        style={{ paddingTop: "8rem", paddingBottom: "6rem" }}
      >
        <div className="sa-hero-shape" aria-hidden="true" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol
              className="flex flex-wrap items-center gap-2 text-sm"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.7)",
              }}
            >
              <li>
                <Link
                  href={config.servicesIndexPath}
                  className="hover:text-[#F15C30] transition-colors"
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
            <span
              className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(241,92,48,0.18)",
                color: "#F15C30",
                fontFamily: "var(--sa-font-body)",
                fontWeight: 600,
              }}
            >
              {data.eyebrow}
            </span>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2.25rem, 4.5vw, 3.5rem)",
                lineHeight: 1.1,
              }}
            >
              {service.title}
            </h1>
            {data.definitionalLede && (
              <p
                className="mb-10"
                style={{
                  fontFamily: "var(--sa-font-body)",
                  color: "rgba(255,255,255,0.85)",
                  fontSize: "1.125rem",
                  lineHeight: 1.65,
                  maxWidth: "44rem",
                }}
              >
                {data.definitionalLede}
              </p>
            )}
            <Link href={data.ctaBannerPrimaryHref} className="sa-btn-primary">
              Free Consultation <ArrowRight className="w-4 h-4" />
            </Link>
            {data.trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-10">
                {data.trustBadges.map((badge, i) => (
                  <span
                    key={i}
                    className="inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-sm"
                    style={{
                      backgroundColor: "rgba(255,255,255,0.12)",
                      border: "1px solid rgba(255,255,255,0.22)",
                      backdropFilter: "blur(8px)",
                      color: "#ffffff",
                      fontFamily: "var(--sa-font-body)",
                      fontWeight: 500,
                    }}
                  >
                    <Shield className="h-3.5 w-3.5" style={{ color: "#F15C30" }} />
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* FEATURES INTRO */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          <div className="max-w-3xl">
            <span className="sa-accent-rule" style={{ margin: "0 0 1.25rem" }} />
            <h2
              className="mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 3rem)",
                color: "#094d76",
                lineHeight: 1.15,
              }}
            >
              {data.featuresHeading}
            </h2>
            {data.featuresSubtext && (
              <p
                style={{
                  fontFamily: "var(--sa-font-body)",
                  color: "#5a5d66",
                  fontSize: "1.125rem",
                  lineHeight: 1.65,
                }}
              >
                {data.featuresSubtext}
              </p>
            )}
          </div>
        </div>
      </section>

      {/* FEATURE TABS */}
      {data.features.length > 0 && (
        <section style={{ backgroundColor: "#f2f2f4" }} className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
            <h2
              className="mb-12"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                color: "#094d76",
              }}
            >
              What We Deliver
            </h2>
            <FeatureTabs features={data.features} />
          </div>
        </section>
      )}

      {/* SAFETY SECTION */}
      <section style={{ backgroundColor: "#ffffff" }} className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <span
                className="inline-block mb-4 text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--sa-font-body)",
                  fontWeight: 700,
                  color: "#F15C30",
                }}
              >
                {data.safetyEyebrow}
              </span>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  color: "#094d76",
                }}
              >
                {data.safetyHeading}
              </h2>
              <p
                className="mb-8"
                style={{
                  fontFamily: "var(--sa-font-body)",
                  color: "#5a5d66",
                  lineHeight: 1.7,
                }}
              >
                {data.safetyBody}
              </p>
              {data.safetyBullets.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {data.safetyBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle
                        className="mt-0.5 h-5 w-5 shrink-0"
                        style={{ color: "#F15C30" }}
                      />
                      <span
                        style={{
                          fontFamily: "var(--sa-font-body)",
                          color: "#5a5d66",
                        }}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={config.contactPath} className="sa-btn-primary">
                Contact Us <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center"
              style={{
                background:
                  "linear-gradient(135deg, #e8f4fd 0%, rgba(61,143,212,0.3) 100%)",
              }}
            >
              <Shield
                className="h-32 w-32"
                style={{ color: "rgba(9,77,118,0.25)" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* REPORTS SECTION */}
      <section style={{ backgroundColor: "#f2f2f4" }} className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div
              className="relative rounded-3xl overflow-hidden aspect-[4/3] flex items-center justify-center order-2 lg:order-1"
              style={{ backgroundColor: "#ffffff" }}
            >
              <FileText
                className="h-32 w-32"
                style={{ color: "rgba(9,77,118,0.15)" }}
              />
            </div>
            <div className="order-1 lg:order-2">
              <span
                className="inline-block mb-4 text-xs uppercase tracking-widest"
                style={{
                  fontFamily: "var(--sa-font-body)",
                  fontWeight: 700,
                  color: "#F15C30",
                }}
              >
                {data.reportsEyebrow}
              </span>
              <h2
                className="mb-6"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                  color: "#094d76",
                }}
              >
                {data.reportsHeading}
              </h2>
              <p
                className="mb-8"
                style={{
                  fontFamily: "var(--sa-font-body)",
                  color: "#5a5d66",
                  lineHeight: 1.7,
                }}
              >
                {data.reportsBody}
              </p>
              {data.reportsBullets.length > 0 && (
                <ol className="space-y-4 mb-8">
                  {data.reportsBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span
                        className="flex-shrink-0 inline-flex items-center justify-center rounded-full text-sm"
                        style={{
                          width: "2rem",
                          height: "2rem",
                          backgroundColor: "#F15C30",
                          color: "#ffffff",
                          fontFamily: "var(--sa-font-heading)",
                          fontWeight: 700,
                        }}
                      >
                        {i + 1}
                      </span>
                      <span
                        className="pt-1"
                        style={{
                          fontFamily: "var(--sa-font-body)",
                          color: "#5a5d66",
                        }}
                      >
                        {bullet}
                      </span>
                    </li>
                  ))}
                </ol>
              )}
              <Link href={config.contactPath} className="sa-btn-primary">
                Reach Out <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* PROCESS */}
      {data.processSteps.length > 0 && (
        <section style={{ backgroundColor: "#ffffff" }} className="py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-8 lg:px-16">
            <div className="text-center mb-14">
              <span className="sa-accent-rule" aria-hidden="true" />
              <h2
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                  color: "#094d76",
                }}
              >
                {data.processHeading}
              </h2>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {data.processSteps.map((step, index) => {
                const Icon = STEP_ICONS[index % STEP_ICONS.length];
                const stepNum = step.number ?? index + 1;
                return (
                  <div
                    key={stepNum}
                    className="sa-card sa-card-accent p-8 relative"
                  >
                    <span
                      className="absolute top-4 right-6"
                      style={{
                        fontFamily: "var(--sa-font-heading)",
                        fontWeight: 800,
                        fontSize: "3.75rem",
                        color: "rgba(37,117,182,0.10)",
                        lineHeight: 1,
                      }}
                    >
                      {String(stepNum).padStart(2, "0")}
                    </span>
                    <div
                      className="mb-5 inline-flex items-center justify-center rounded-xl"
                      style={{
                        width: "3rem",
                        height: "3rem",
                        backgroundColor: "#e8f4fd",
                        color: "#2575B6",
                      }}
                    >
                      <Icon className="h-6 w-6" />
                    </div>
                    <h3
                      className="mb-2"
                      style={{
                        fontFamily: "var(--sa-font-heading)",
                        fontWeight: 700,
                        fontSize: "1.125rem",
                        color: "#094d76",
                      }}
                    >
                      {step.title}
                    </h3>
                    <p
                      className="text-sm"
                      style={{
                        fontFamily: "var(--sa-font-body)",
                        color: "#5a5d66",
                        lineHeight: 1.6,
                      }}
                    >
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* FAQ */}
      {data.faqs.length > 0 && (
        <section style={{ backgroundColor: "#f2f2f4" }} className="py-24">
          <div className="mx-auto max-w-4xl px-4 sm:px-8">
            <div className="text-center mb-12">
              <span className="sa-accent-rule" aria-hidden="true" />
              <h2
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(2rem, 3.5vw, 2.75rem)",
                  color: "#094d76",
                }}
              >
                {data.faqSectionHeading}
              </h2>
            </div>
            <ServiceFaqAccordion faqs={data.faqs} />
          </div>
        </section>
      )}

      {/* CTA */}
      <section
        className="relative py-24 overflow-hidden"
        style={{
          background: "linear-gradient(90deg, #F15C30 0%, #c44a1f 100%)",
        }}
      >
        <div className="relative mx-auto max-w-4xl px-4 sm:px-8 text-center">
          <h2
            className="text-white mb-4"
            style={{
              fontFamily: "var(--sa-font-heading)",
              fontWeight: 800,
              fontSize: "clamp(2rem, 4vw, 2.75rem)",
            }}
          >
            {data.ctaBannerHeading}
          </h2>
          {data.ctaBannerBody && (
            <p
              className="mb-10 mx-auto max-w-2xl"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.075rem",
                lineHeight: 1.65,
              }}
            >
              {data.ctaBannerBody}
            </p>
          )}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href={data.ctaBannerSecondaryHref}
              className="inline-flex items-center justify-center rounded-full border-2 border-white text-white px-8 py-3.5 hover:bg-white/10 transition-colors"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 600,
              }}
            >
              {data.ctaBannerSecondaryText}
            </Link>
            <Link
              href={data.ctaBannerPrimaryHref}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#ffffff",
                color: "#c44a1f",
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 600,
              }}
            >
              {data.ctaBannerPrimaryText}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <SouthAmericaFooter config={config} />
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
    <div className="sa-root">
      <RegionNavbar config={config} />
      <JsonLd data={articleJsonLd} />

      <main id="main-content">
        {/* HERO */}
        <section
          className="sa-hero-bg relative overflow-hidden"
          style={{ paddingTop: "8rem", paddingBottom: "4rem" }}
        >
          <div className="sa-hero-shape" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-8">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm mb-6 flex-wrap"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.75)",
              }}
            >
              <Link
                href={`/${CC}/`}
                className="hover:text-[#F15C30] transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href={config.blogIndexPath}
                className="hover:text-[#F15C30] transition-colors"
              >
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white line-clamp-1">{post.title}</span>
            </nav>
            {post.category && (
              <span
                className="inline-block mb-4 px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                style={{
                  backgroundColor: "rgba(241,92,48,0.22)",
                  color: "#F15C30",
                  fontFamily: "var(--sa-font-body)",
                  fontWeight: 600,
                }}
              >
                {post.category}
              </span>
            )}
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4.5vw, 3.25rem)",
                lineHeight: 1.1,
              }}
            >
              {post.title}
            </h1>
            <div
              className="flex flex-wrap items-center gap-4 text-sm mb-10"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.8)",
              }}
            >
              {post.author && (
                <span>
                  By <span className="text-white font-medium">{post.author}</span>
                </span>
              )}
              {post.publishedDate && (
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
              )}
            </div>
            {post.heroImage && post.heroImage.startsWith("http") ? (
              <div className="relative aspect-[16/9] rounded-3xl overflow-hidden shadow-2xl">
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt ?? post.title}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 896px) 100vw, 896px"
                />
              </div>
            ) : (
              <div
                className="relative aspect-[16/9] rounded-3xl overflow-hidden flex items-center justify-center"
                style={{
                  background:
                    "linear-gradient(135deg, #2575B6 0%, #094d76 100%)",
                }}
              >
                <span
                  className="text-white/20 text-8xl"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                  }}
                >
                  CL
                </span>
              </div>
            )}
          </div>
        </section>

        {/* BODY */}
        <section
          style={{ backgroundColor: "#ffffff" }}
          className="py-16 px-4"
        >
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#094d76] prose-headings:font-bold prose-p:text-[#5a5d66] prose-li:text-[#5a5d66] prose-strong:text-[#094d76] prose-a:text-[#F15C30] prose-a:no-underline hover:prose-a:underline"
              style={{ fontFamily: "var(--sa-font-body)" }}
              dangerouslySetInnerHTML={{
                __html: marked(post.body || "") as string,
              }}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full px-4 py-1.5 text-xs"
                    style={{
                      backgroundColor: "#f2f2f4",
                      color: "#5a5d66",
                      fontFamily: "var(--sa-font-body)",
                      fontWeight: 500,
                    }}
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
          <section style={{ backgroundColor: "#f2f2f4" }} className="py-16 px-4">
            <div className="mx-auto max-w-3xl">
              <h2
                className="mb-8"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 800,
                  fontSize: "clamp(1.5rem, 3vw, 2rem)",
                  color: "#094d76",
                }}
              >
                Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={post.faqs} />
            </div>
          </section>
        )}

        {/* CTA */}
        <section
          className="relative py-20 px-4 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #F15C30 0%, #c44a1f 100%)",
          }}
        >
          <div className="relative mx-auto max-w-4xl text-center">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
              }}
            >
              Need Expert Electrical Safety Support?
            </h2>
            <p
              className="mb-10 mx-auto max-w-2xl"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.075rem",
                lineHeight: 1.65,
              }}
            >
              Carelabs provides arc flash studies, power system analysis, and{" "}
              {config.primaryStandard} compliance services across {COUNTRY_NAME}
              .
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#c44a1f",
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 600,
                }}
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={config.blogIndexPath}
                className="inline-flex items-center justify-center rounded-full border-2 border-white text-white px-8 py-3.5 hover:bg-white/10 transition-colors"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 600,
                }}
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <SouthAmericaFooter config={config} />
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
