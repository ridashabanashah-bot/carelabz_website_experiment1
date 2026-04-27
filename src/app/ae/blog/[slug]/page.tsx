export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getBlogPost, type BlogPost } from "@/lib/strapi-blog";
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

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(/\s*-\s*Carelabs\s*(UAE|United Arab Emirates|Dubai)\s*$/i, "")
    .trim();
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

async function fetchBlogWithFallback(slug: string): Promise<BlogPost | null> {
  const withSuffix = await getBlogPost(CC, `${slug}-${CC}`);
  if (withSuffix) return withSuffix;
  return getBlogPost(CC, slug);
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageUrl = `https://carelabz.com/${CC}/blog/${params.slug}/`;
  const post = await fetchBlogWithFallback(params.slug);
  if (!post) return { title: `Not Found | Carelabs ${COUNTRY_NAME}` };
  const title = cleanTitle(post.title);
  return {
    title: post.metaTitle ?? `${title} | Carelabs ${COUNTRY_NAME}`,
    description: post.metaDescription ?? post.excerpt ?? undefined,
    keywords: post.seoKeywords ?? undefined,
    alternates: {
      canonical: pageUrl,
      languages: { [HREFLANG]: pageUrl, "x-default": pageUrl },
    },
    openGraph: {
      title: post.metaTitle ?? `${title} | Carelabs ${COUNTRY_NAME}`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      url: pageUrl,
      siteName: "Carelabs",
      type: "article",
      locale: "en_AE",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? `${title} | Carelabs ${COUNTRY_NAME}`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
    },
  };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const post = await fetchBlogWithFallback(params.slug);
  if (!post) notFound();

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: cleanTitle(post.title),
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
    url: `https://carelabz.com/${CC}/blog/${params.slug}/`,
  };

  return (
    <>
      <AENavbar config={config} />
      <JsonLd data={articleJsonLd} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-20 pt-36 lg:pb-24 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-3xl">
          <nav
            aria-label="Breadcrumb"
            className="animate-fade-in-up animation-delay-100 mb-6 flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.15em] text-white/40"
          >
            <Link href={`/${CC}/`} className="transition-colors duration-300 hover:text-white">Home</Link>
            <ChevronRight className="h-3 w-3" />
            <Link href={config.blogIndexPath} className="transition-colors duration-300 hover:text-white">Insights</Link>
          </nav>
          {post.category && (
            <span className="animate-fade-in-up animation-delay-200 inline-block text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
              {post.category}
            </span>
          )}
          <h1 className="animate-fade-in-up animation-delay-300 mt-4 font-display text-display-hero uppercase tracking-tight text-white">
            {cleanTitle(post.title)}
          </h1>
          <div className="animate-fade-in-up animation-delay-400 mt-8 flex flex-wrap items-center gap-4 text-sm text-white/40">
            {post.author && (
              <span>
                By <span className="font-medium text-white/70">{post.author}</span>
              </span>
            )}
            {post.publishedDate && (
              <time dateTime={post.publishedDate}>
                {formatDate(post.publishedDate)}
              </time>
            )}
          </div>
          {post.heroImage && post.heroImage.startsWith("http") && (
            <div className="animate-fade-in-up animation-delay-500 relative mt-10 aspect-[16/9] overflow-hidden">
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

      {/* ARTICLE BODY */}
      <section className="bg-white px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <ScrollReveal>
            <div
              className="prose prose-lg max-w-none prose-headings:font-display prose-headings:uppercase prose-headings:tracking-tight prose-headings:text-gray-900 prose-headings:font-normal prose-p:text-gray-600 prose-li:text-gray-600 prose-strong:text-gray-900 prose-a:text-[#2575B6] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: marked(post.body || "") as string }}
            />
          </ScrollReveal>
          {post.tags && post.tags.length > 0 && (
            <ScrollReveal>
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="border border-gray-300 px-4 py-1.5 text-xs uppercase tracking-[0.15em] text-gray-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </ScrollReveal>
          )}
        </div>
      </section>

      {/* FAQ */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="bg-[#F2F2F4] py-24 lg:py-32">
          <div className="mx-auto max-w-3xl px-6">
            <SectionHeading eyebrow="FAQ" title="Common Questions" />
            <div className="mt-12 space-y-4">
              {post.faqs.map((faq, i) => (
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
              Need expert support?
            </h2>
          </ScrollReveal>
          <ScrollReveal delay={200}>
            <p className="mt-6 text-lg leading-relaxed text-white/70">
              Carelabs delivers arc flash studies, power system analysis, and {config.primaryStandard} compliance services across the UAE.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Get a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                href={config.blogIndexPath}
                className="inline-flex items-center gap-2 border border-white/20 px-10 py-4 text-sm font-medium uppercase tracking-[0.1em] text-white/80 transition-all duration-300 hover:border-white/60 hover:text-white"
              >
                More Articles
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
