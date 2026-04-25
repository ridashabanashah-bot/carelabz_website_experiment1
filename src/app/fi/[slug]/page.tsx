export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import {
  Shield,
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

const CC = "fi";
const COUNTRY_NAME = "Finland";
const HREFLANG = "en-FI";
const config = COUNTRY_CONFIGS[CC];

interface PageProps {
  params: { slug: string };
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

function ServiceView({ service, slug }: { service: ServicePage; slug: string }) {
  const pageUrl = `https://carelabz.com/${CC}/${slug}/`;
  const eyebrow = service.eyebrow || `IEEE 1584 · ${config.primaryStandard}`;
  const lede = service.definitionalLede || service.metaDescription || "";
  const trustBadges =
    service.trustBadges ||
    config.standards.slice(0, 4).map((s) => ({ label: s }));
  const features = service.features || [];
  const processSteps = service.processSteps || [];
  const faqs = service.faqs || [];
  const safetyBullets = service.safetyBullets || [];
  const ctaHeading = service.ctaBannerHeading || "Ready to Schedule Your Study?";
  const ctaBody =
    service.ctaBannerBody ||
    "Our certified engineers deliver fast turnaround, clear reports, and full compliance support.";
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

      {/* ---------------- HERO ---------------- */}
      <section className="relative bg-[#0B1A2F] pt-36 pb-24 px-6 overflow-hidden">
        <div
          className="absolute inset-0 opacity-[0.04]"
          aria-hidden="true"
          style={{
            backgroundImage:
              "radial-gradient(circle, #ffffff 1px, transparent 1px)",
            backgroundSize: "24px 24px",
          }}
        />
        <div className="relative max-w-4xl mx-auto">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 font-condensed text-xs uppercase tracking-[0.15em] text-white/40">
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
              <li className="text-white/70">{service.title}</li>
            </ol>
          </nav>

          <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
            {eyebrow}
          </span>
          <h1 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95] tracking-tight">
            {service.title}
          </h1>
          {lede && (
            <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-3xl leading-relaxed">
              {lede}
            </p>
          )}
          <div className="mt-10">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
            >
              Free Consultation
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          {trustBadges.length > 0 && (
            <div className="flex flex-wrap gap-3 mt-10">
              {trustBadges.map((badge, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 font-condensed text-xs uppercase tracking-[0.15em] text-white/60 border border-white/10 px-4 py-2 rounded-full"
                >
                  <Shield className="w-3 h-3 text-orange-500" />
                  {badge.label}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ---------------- FEATURES ---------------- */}
      {features.length > 0 && (
        <section className="bg-[#F8FAFC] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                What We Deliver
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                {service.featuresHeading || "Key Challenges We Solve"}
              </h2>
              {service.featuresSubtext && (
                <p className="font-body text-lg text-gray-600 mt-6 leading-relaxed">
                  {service.featuresSubtext}
                </p>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {features.map((feature, i) => (
                <div
                  key={i}
                  className="rounded-2xl bg-white p-6 hover:shadow-lg transition-shadow"
                >
                  <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] mt-2 tracking-tight">
                    {feature.title}
                  </h3>
                  <p className="font-body text-sm text-gray-600 mt-3 leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- PROCESS ---------------- */}
      {processSteps.length > 0 && (
        <section className="bg-white py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto">
            <div className="max-w-3xl mb-14">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-4 block">
                Our Process
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                {service.processHeading || "How We Work"}
              </h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {processSteps.map((step, index) => {
                const stepNum = step.number ?? index + 1;
                return (
                  <div
                    key={stepNum}
                    className="relative p-6 border-t-2 border-orange-500 bg-[#F8FAFC] rounded-b-2xl"
                  >
                    <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
                      Step {String(stepNum).padStart(2, "0")}
                    </span>
                    <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] mt-2 tracking-tight">
                      {step.title}
                    </h3>
                    <p className="font-body text-sm text-gray-600 mt-3 leading-relaxed">
                      {step.description}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- SAFETY — slate band ---------------- */}
      {(service.safetyHeading || service.safetyBody) && (
        <section className="bg-[#1E293B] py-20 lg:py-28 px-6">
          <div className="max-w-4xl mx-auto">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
              {service.safetyEyebrow || "Worker Safety"}
            </span>
            <h2 className="font-condensed font-extrabold text-3xl md:text-4xl lg:text-5xl uppercase text-white leading-[0.95] tracking-tight">
              {service.safetyHeading || "Protecting Your Team"}
            </h2>
            {service.safetyBody && (
              <p className="font-body text-lg text-white/60 mt-6 leading-relaxed">
                {service.safetyBody}
              </p>
            )}
            {safetyBullets.length > 0 && (
              <ul className="mt-8 space-y-3">
                {safetyBullets.map((bullet, i) => (
                  <li key={i} className="flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-orange-500 mt-0.5 shrink-0" />
                    <span className="font-body text-white/80">{bullet}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </section>
      )}

      {/* ---------------- FAQ ---------------- */}
      {faqs.length > 0 && (
        <section className="bg-[#F8FAFC] py-20 lg:py-28 px-6">
          <div className="max-w-3xl mx-auto">
            <div className="mb-10 text-center">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block">
                FAQ
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                {service.faqSectionHeading || "Frequently Asked"}
                <span className="block font-accent italic font-normal normal-case text-orange-500 mt-2">
                  Questions.
                </span>
              </h2>
            </div>
            <div>
              {faqs.map((faq, i) => (
                <details
                  key={i}
                  className="group border-b border-[#0B1A2F]/10 py-5"
                >
                  <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-condensed font-bold text-base md:text-lg uppercase text-[#0B1A2F] tracking-tight">
                    <span>{faq.question}</span>
                    <Plus className="w-5 h-5 text-orange-500 shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                  </summary>
                  <p className="font-body text-base text-gray-600 mt-3 leading-relaxed">
                    {faq.answer}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ---------------- FINAL CTA ---------------- */}
      <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
            {ctaHeading}
          </h2>
          {ctaBody && (
            <p className="font-body text-lg text-white/60 mt-6 max-w-2xl mx-auto leading-relaxed">
              {ctaBody}
            </p>
          )}
          <div className="mt-10 flex justify-center">
            <Link
              href={ctaPrimaryHref}
              className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
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
        {/* ---------------- HERO ---------------- */}
        <section className="relative bg-[#0B1A2F] pt-36 pb-20 px-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-3xl mx-auto">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 font-condensed text-xs uppercase tracking-[0.15em] text-white/40 mb-6 flex-wrap"
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
              <span className="inline-block font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-4">
                {post.category}
              </span>
            )}
            <h1 className="font-condensed font-extrabold text-3xl md:text-4xl lg:text-5xl uppercase text-white leading-[0.95] tracking-tight">
              {post.title}
            </h1>
            <div className="flex flex-wrap items-center gap-4 font-body text-sm text-white/40 mt-8">
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
              <div className="relative aspect-[16/9] rounded-2xl overflow-hidden mt-10">
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

        {/* ---------------- ARTICLE BODY ---------------- */}
        <section className="bg-white py-20 px-6">
          <div className="max-w-3xl mx-auto">
            <div
              className="prose prose-lg max-w-none prose-headings:font-condensed prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-[#0B1A2F] prose-headings:font-bold prose-p:text-gray-700 prose-p:font-body prose-li:text-gray-700 prose-li:font-body prose-strong:text-[#0B1A2F] prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{
                __html: marked(post.body || "") as string,
              }}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-[#F8FAFC] px-4 py-1.5 font-condensed text-xs uppercase tracking-[0.15em] text-[#0B1A2F]/60"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* ---------------- FAQ ---------------- */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="bg-[#F8FAFC] py-16 px-6">
            <div className="max-w-3xl mx-auto">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block text-center">
                FAQ
              </span>
              <h2 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-[#0B1A2F] leading-[0.95] text-center mb-10">
                Frequently Asked
                <span className="block font-accent italic font-normal normal-case text-orange-500 mt-2">
                  Questions.
                </span>
              </h2>
              <FaqAccordion faqs={post.faqs} />
            </div>
          </section>
        )}

        {/* ---------------- CTA ---------------- */}
        <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
              Need Expert
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Support?
              </span>
            </h2>
            <p className="font-body text-lg text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              Carelabs provides arc flash studies, power system analysis, and{" "}
              {config.primaryStandard} compliance services across {COUNTRY_NAME}.
            </p>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href={config.contactPath}
                className="inline-flex items-center justify-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href={config.blogIndexPath}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-[#0B1A2F] font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
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
