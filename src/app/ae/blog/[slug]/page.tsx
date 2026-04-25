export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { marked } from "marked";
import { ArrowRight, ChevronRight, Plus } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getBlogPost, type BlogPost } from "@/lib/strapi-blog";
import { JsonLd } from "@/components/JsonLd";

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
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />
      <JsonLd data={articleJsonLd} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-32 pb-16 lg:pt-40 lg:pb-20 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-3xl mx-auto relative z-10">
          <nav aria-label="Breadcrumb" className="flex items-center gap-2 font-ae-nav text-xs uppercase tracking-[0.15em] text-white/40 mb-6 flex-wrap">
            <Link href={`/${CC}/`} className="hover:text-[#2D7AB8] transition-colors">Home</Link>
            <ChevronRight className="w-3 h-3" />
            <Link href={config.blogIndexPath} className="hover:text-[#2D7AB8] transition-colors">Insights</Link>
          </nav>
          {post.category && (
            <span className="inline-block font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-4">
              {post.category}
            </span>
          )}
          <h1 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-white leading-[0.95]">
            {cleanTitle(post.title)}
          </h1>
          <div className="flex flex-wrap items-center gap-4 font-ae-body text-sm text-white/40 mt-8">
            {post.author && (
              <span>
                By <span className="text-white/70 font-medium">{post.author}</span>
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

      {/* ARTICLE BODY */}
      <section className="bg-[#FAFBFC] py-20 px-6">
        <div className="max-w-3xl mx-auto">
          <div
            className="prose prose-lg max-w-none prose-headings:font-ae-display prose-headings:text-[#0F2847] prose-headings:font-normal prose-p:text-[#0F2847]/70 prose-p:font-ae-body prose-li:text-[#0F2847]/70 prose-li:font-ae-body prose-strong:text-[#0F2847] prose-a:text-[#2D7AB8] prose-a:no-underline hover:prose-a:underline"
            dangerouslySetInnerHTML={{ __html: marked(post.body || "") as string }}
          />
          {post.tags && post.tags.length > 0 && (
            <div className="mt-10 flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span key={tag} className="px-4 py-1.5 font-ae-nav text-xs uppercase tracking-[0.15em] text-[#0F2847]/60 border border-[#D4E3F0]">
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ */}
      {post.faqs && post.faqs.length > 0 && (
        <section className="bg-[#EBF2F8] py-16 px-6">
          <div className="max-w-3xl mx-auto">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
              FAQ
            </span>
            <h2 className="font-ae-display text-3xl md:text-4xl text-[#0F2847] mb-8">
              Common Questions
            </h2>
            {post.faqs.map((faq, i) => (
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
            Need expert support?
          </h2>
          <p className="font-ae-body text-lg text-[#5A8FB4] mt-6 max-w-2xl mx-auto">
            Carelabs delivers arc flash studies, power system analysis, and {config.primaryStandard} compliance services across the UAE.
          </p>
          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Link
              href={config.contactPath}
              className="inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={config.blogIndexPath}
              className="inline-flex items-center justify-center gap-2 border border-[#1E5A8A] hover:border-[#2D7AB8] text-white/70 hover:text-white font-ae-nav font-medium text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              More Articles
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
