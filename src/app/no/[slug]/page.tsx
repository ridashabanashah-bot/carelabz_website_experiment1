export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import {
  CheckCircle,
  ChevronRight,
  ArrowRight,
  Plus,
} from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { JsonLd } from "@/components/JsonLd";
import { FaqAccordion } from "@/components/faq-accordion";
import { getServicePageBySlug, type ServicePage } from "@/lib/strapi";
import { getBlogPost, type BlogPost } from "@/lib/strapi-blog";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";

const CC = "no";
const COUNTRY_NAME = "Norway";
const HREFLANG = "en-NO";
const config = COUNTRY_CONFIGS[CC];

interface PageProps {
  params: { slug: string };
}

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(
      /\s*-\s*Carelabs\s*(UK|United Kingdom|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i,
      ""
    )
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .trim();
}

function cleanExcerpt(raw: string): string {
  return raw
    .replace(/\s*\[…?\]\s*$/, "")
    .replace(/\s*\[\.{3}\]\s*$/, "")
    .trim();
}

async function fetchServiceWithFallback(slug: string): Promise<ServicePage | null> {
  const withSuffix = await getServicePageBySlug(`${slug}-${CC}`);
  if (withSuffix) return withSuffix;
  return getServicePageBySlug(slug);
}

async function fetchBlogWithFallback(slug: string): Promise<BlogPost | null> {
  const withSuffix = await getBlogPost(CC, `${slug}-${CC}`);
  if (withSuffix) return withSuffix;
  return getBlogPost(CC, slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageUrl = `https://carelabz.com/${CC}/${params.slug}/`;
  const service = await fetchServiceWithFallback(params.slug);
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
  const post = await fetchBlogWithFallback(params.slug);
  if (post) {
    return {
      title: post.metaTitle ?? `${cleanTitle(post.title)} | Carelabs ${COUNTRY_NAME}`,
      description:
        post.metaDescription ??
        (post.excerpt ? cleanExcerpt(post.excerpt) : undefined),
      keywords: post.seoKeywords ?? undefined,
      alternates: {
        canonical: pageUrl,
        languages: { [HREFLANG]: pageUrl, "x-default": pageUrl },
      },
      openGraph: {
        title: post.metaTitle ?? `${cleanTitle(post.title)} | Carelabs ${COUNTRY_NAME}`,
        description:
          post.metaDescription ??
          (post.excerpt ? cleanExcerpt(post.excerpt) : undefined),
        url: pageUrl,
        siteName: "Carelabs",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.metaTitle ?? `${cleanTitle(post.title)} | Carelabs ${COUNTRY_NAME}`,
        description:
          post.metaDescription ??
          (post.excerpt ? cleanExcerpt(post.excerpt) : undefined),
      },
    };
  }
  return { title: `Not Found | Carelabs ${COUNTRY_NAME}` };
}

function ServiceView({ service, slug }: { service: ServicePage; slug: string }) {
  const pageUrl = `https://carelabz.com/${CC}/${slug}/`;
  const eyebrow = service.eyebrow || `IEEE 1584 · ${config.primaryStandard}`;
  const lede = service.definitionalLede || service.metaDescription || "";
  const features = service.features || [];
  const processSteps = service.processSteps || [];
  const faqs = service.faqs || [];
  const safetyBullets = service.safetyBullets || [];
  const ctaHeading = service.ctaBannerHeading || "Ready to schedule your study?";
  const ctaPrimary = service.ctaBannerPrimaryText || "Get a Free Quote";
  const ctaPrimaryHref = service.ctaBannerPrimaryHref || config.contactPath;

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
      },
      {
        "@type": "Service",
        name: service.title,
        serviceType: "Electrical Safety Engineering",
        description: lede || service.metaDescription || undefined,
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
      ...(faqs.length > 0
        ? [
            {
              "@type": "FAQPage",
              mainEntity: faqs.map((faq) => ({
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
          { "@type": "ListItem", position: 2, name: "Services", item: `https://carelabz.com${config.servicesIndexPath}` },
          { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <>
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />
      <JsonLd data={jsonLd} />

      {/* ---------------- HERO — left-aligned ---------------- */}
      <section className="relative bg-[#1A3650] pt-32 pb-20 lg:pt-40 lg:pb-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.03]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
            backgroundSize: "60px 60px",
          }}
        />
        <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-ne-nav text-xs uppercase tracking-[0.18em] text-white/40">
              <li>
                <Link
                  href={`/${CC}/`}
                  className="hover:text-orange-500 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li>
                <Link
                  href={config.servicesIndexPath}
                  className="hover:text-orange-500 transition-colors"
                >
                  Services
                </Link>
              </li>
              <li aria-hidden="true"><ChevronRight className="w-3 h-3" /></li>
              <li className="text-white/70 line-clamp-1">{service.title}</li>
            </ol>
          </nav>

          <div className="max-w-3xl">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-6 block">
              {eyebrow}
            </span>
            <h1 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
              {service.title}
            </h1>
            {lede && (
              <p className="font-ne-body text-lg text-white/50 mt-8 leading-relaxed">
                {lede}
              </p>
            )}
            <div className="mt-10">
              <Link
                href={ctaPrimaryHref}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
              >
                Free Consultation
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ---------------- TRUST BAR ---------------- */}
      <div className="bg-[#F9F7F3] py-6 px-6 border-b border-[#1A3650]/5">
        <p className="text-center font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40">
          {config.standards.slice(0, 5).join("  ·  ")}
        </p>
      </div>

      {/* ---------------- FEATURES — numbered editorial list ---------------- */}
      {features.length > 0 && (
        <section className="bg-[#F9F7F3] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="mb-14 max-w-3xl">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                What We Deliver
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-5xl uppercase text-[#1A3650] leading-[0.95]">
                {service.featuresHeading || "Key Challenges We Solve"}
              </h2>
              {service.featuresSubtext && (
                <p className="font-ne-body text-lg text-gray-600 mt-6 leading-relaxed">
                  {service.featuresSubtext}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="flex items-start gap-6 py-8 px-4 border-b border-[#1A3650]/10"
                >
                  <span className="font-ne-display font-black text-3xl text-[#1A3650]/10 leading-none shrink-0 w-12">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-ne-display font-bold text-lg uppercase text-[#1A3650]">
                      {feature.title}
                    </h3>
                    <p className="font-ne-body text-sm text-gray-500 mt-2 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- PROCESS — navy editorial ---------------- */}
      {processSteps.length > 0 && (
        <section className="bg-[#1A3650] py-20 lg:py-28">
          <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="mb-14 max-w-3xl">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                Our Process
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-5xl uppercase text-white leading-[0.95]">
                {service.processHeading || "How We Work"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
              {processSteps.map((step, index) => {
                const stepNum = step.number ?? index + 1;
                return (
                  <div
                    key={stepNum}
                    className="flex items-start gap-6 py-8 px-4 border-b border-white/10"
                  >
                    <span className="font-ne-display font-black text-3xl text-white/10 leading-none shrink-0 w-12">
                      {String(stepNum).padStart(2, "0")}
                    </span>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-ne-display font-bold text-lg uppercase text-white">
                        {step.title}
                      </h3>
                      <p className="font-ne-body text-sm text-white/50 mt-2 leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- SAFETY ---------------- */}
      {(service.safetyHeading || service.safetyBody) && (
        <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12">
            <div className="max-w-3xl">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-4 block">
                {service.safetyEyebrow || "Worker Safety"}
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-4xl lg:text-5xl uppercase text-[#1A3650] leading-[0.95]">
                {service.safetyHeading || "Protecting Your Team"}
              </h2>
              {service.safetyBody && (
                <p className="font-ne-body text-lg text-gray-600 mt-6 leading-relaxed">
                  {service.safetyBody}
                </p>
              )}
              {safetyBullets.length > 0 && (
                <ul className="mt-8 space-y-3">
                  {safetyBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                      <span className="font-ne-body text-[#1A3650]/80">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FAQ — navy ---------------- */}
      {faqs.length > 0 && (
        <section className="bg-[#1A3650] py-16 lg:py-24 border-t border-white/5">
          <div className="max-w-3xl mx-auto px-6">
            <div className="mb-10">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                FAQ
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-white leading-[0.95]">
                {service.faqSectionHeading || "Common Questions"}
              </h2>
            </div>
            <div>
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-white/10 py-5"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ne-display font-bold text-base md:text-lg uppercase text-white/90">
                    <span>{faq.question}</span>
                    <Plus className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="font-ne-body text-base text-white/60 mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FINAL CTA — single-line ---------------- */}
      <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6">
        <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
          <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
            {ctaHeading}
          </h2>
          <div className="mt-8">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              {ctaPrimary}
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <NEFooter config={config} />
    </>
  );
}

function formatDate(s: string | null): string {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-GB", {
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
    headline: cleanTitle(post.title),
    description:
      post.metaDescription ?? (post.excerpt ? cleanExcerpt(post.excerpt) : ""),
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
    ...(post.heroImage ? { image: `https://carelabz.com${post.heroImage}` } : {}),
    url: `https://carelabz.com/${CC}/${post.slug}/`,
  };

  return (
    <>
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />
      <JsonLd data={articleJsonLd} />

      <main id="main-content">
        {/* ---------------- HERO — left-aligned ---------------- */}
        <section className="relative bg-[#1A3650] pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-3xl mx-auto px-6 lg:px-12">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-ne-nav text-xs uppercase tracking-[0.18em] text-white/40 mb-6 flex-wrap"
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
            </nav>
            {post.category && (
              <span className="inline-block font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/70 font-semibold mb-4">
                {post.category}
              </span>
            )}
            <h1 className="font-ne-display font-black text-3xl md:text-4xl lg:text-5xl uppercase text-white leading-[0.95]">
              {cleanTitle(post.title)}
            </h1>
            <div className="flex flex-wrap items-center gap-4 font-ne-body text-sm text-white/40 mt-8">
              {post.author && (
                <span>
                  By{" "}
                  <span className="text-white/70 font-medium">
                    {post.author}
                  </span>
                </span>
              )}
              {post.publishedDate && (
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
              )}
            </div>
            {post.heroImage && post.heroImage.startsWith("http") && (
              <div className="relative aspect-[16/9] overflow-hidden mt-10">
                <Image
                  src={post.heroImage}
                  alt={post.heroImageAlt ?? cleanTitle(post.title)}
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 768px"
                />
              </div>
            )}
          </div>
        </section>

        {/* ---------------- ARTICLE BODY ---------------- */}
        <section className="bg-[#F9F7F3] py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:font-ne-display prose-headings:uppercase prose-headings:prose-headings:text-[#1A3650] prose-headings:font-bold prose-p:text-gray-700 prose-p:font-ne-body prose-li:text-gray-700 prose-li:font-ne-body prose-strong:text-[#1A3650] prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: marked(post.body || "") as string,
              }}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-4 py-1.5 font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/60 border border-[#1A3650]/10"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------------- FAQ — navy ---------------- */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="bg-[#1A3650] py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                FAQ
              </span>
              <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-white leading-[0.95] mb-8">
                Common Questions
              </h2>
              <FaqAccordion faqs={post.faqs} />
            </div>
          </section>
        )}

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
            <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
              Need expert support?
            </h2>
            <p className="font-ne-body text-base text-gray-600 mt-4 max-w-2xl mx-auto leading-relaxed">
              Carelabs provides arc flash studies, power system analysis, and{" "}
              {config.primaryStandard} compliance services across {COUNTRY_NAME}.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                href={config.contactPath}
                className="inline-flex items-center justify-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={config.blogIndexPath}
                className="inline-flex items-center justify-center gap-2 border-2 border-[#1A3650]/20 text-[#1A3650] hover:bg-[#1A3650] hover:text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <NEFooter config={config} />
    </>
  );
}

export default async function Page({ params }: PageProps) {
  const service = await fetchServiceWithFallback(params.slug);
  if (service) return <ServiceView service={service} slug={params.slug} />;
  const post = await fetchBlogWithFallback(params.slug);
  if (post) return <BlogView post={post} />;
  notFound();
}
