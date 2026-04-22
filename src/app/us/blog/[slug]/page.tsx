import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import USFooter from "@/components/us-footer";
import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/JsonLd";
import { marked } from "marked";
import { getBlogPost } from "@/lib/strapi-blog";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  let post = await getBlogPost("us", params.slug);
  if (!post) post = await getBlogPost("us", `${params.slug}-us`);

  if (!post) {
    return {
      title: "Article Not Found | Carelabs USA",
    };
  }

  return {
    title: post.metaTitle ?? `${post.title} | Carelabs USA`,
    description:
      post.metaDescription ??
      post.excerpt ??
      "Expert electrical safety insights from the Carelabs engineering team.",
    keywords: post.seoKeywords ?? undefined,
    alternates: {
      canonical: `https://carelabz.com/us/blog/${params.slug}/`,
      languages: {
        "en-US": `https://carelabz.com/us/blog/${params.slug}/`,
        "x-default": `https://carelabz.com/us/blog/${params.slug}/`,
      },
    },
    openGraph: {
      title: post.metaTitle ?? `${post.title} | Carelabs USA`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      url: `https://carelabz.com/us/blog/${params.slug}/`,
      siteName: "Carelabs",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? `${post.title} | Carelabs USA`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
    },
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default async function BlogPostPage({ params }: PageProps) {
  // Some US blogs use raw slugs (original migration), some use `${slug}-us`
  // (namespaced after unique-slug fix for cross-region collisions). Try both.
  let post = await getBlogPost("us", params.slug);
  if (!post) post = await getBlogPost("us", `${params.slug}-us`);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
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
    url: `https://carelabz.com/us/blog/${post.slug}/`,
  };

  return (
    <>
      <StickyNavbar />
      <JsonLd data={articleJsonLd} />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#EEF4FF] pt-28 pb-16 px-4">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-[#374151] mb-6 flex-wrap"
            >
              <Link
                href="/"
                className="hover:text-[#1A2538] transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/us/blog/"
                className="hover:text-[#1A2538] transition-colors"
              >
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#1A2538] line-clamp-1">{post.title}</span>
            </nav>

            {/* Category tag */}
            {post.category && (
              <span className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2538] mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author + Date */}
            <div className="flex flex-wrap items-center gap-4 text-[#374151] text-sm mb-10">
              {post.author && (
                <span>
                  By{" "}
                  <span className="text-[#1A2538] font-medium">{post.author}</span>
                </span>
              )}
              {post.publishedDate && (
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
              )}
            </div>

            {/* Hero Image */}
            {post.heroImage && post.heroImage.startsWith("http") ? (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
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
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-[#0050B3] to-[#1A2538] flex items-center justify-center">
                <span className="text-white/20 text-8xl font-bold">CL</span>
              </div>
            )}
          </div>
        </section>

        {/* Body */}
        <section className="bg-offWhite py-16 px-4">
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#1A2538] prose-headings:font-bold prose-p:text-[#374151] prose-li:text-[#374151] prose-strong:text-[#1A2538] prose-a:text-[#FF6633] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: marked(post.body || "") as string }}
            />

            {/* Tags */}
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* FAQs */}
        {post.faqs && post.faqs.length > 0 && (
          <section className="bg-white py-16 px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-8">
                Frequently Asked Questions
              </h2>
              <FaqAccordion faqs={post.faqs} />
            </div>
          </section>
        )}

        {/* Related Posts */}
        {post.relatedPosts && post.relatedPosts.length > 0 && (
          <section className="bg-offWhite py-16 px-4">
            <div className="mx-auto max-w-7xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-8">
                Related Articles
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {post.relatedPosts.map((related) => (
                  <article
                    key={related.slug}
                    className="rounded-xl bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 p-6 flex flex-col"
                  >
                    <h3 className="text-base font-bold text-navy mb-3 leading-snug">
                      <Link
                        href={`/us/blog/${related.slug}/`}
                        className="hover:text-orange-500 transition-colors"
                      >
                        {related.title}
                      </Link>
                    </h3>
                    {related.excerpt && (
                      <p className="text-slate-600 text-sm leading-relaxed flex-1 mb-4">
                        {related.excerpt}
                      </p>
                    )}
                    <Link
                      href={`/us/blog/${related.slug}/`}
                      className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors mt-auto"
                    >
                      Read more
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </article>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* CTA Banner */}
        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need Expert Electrical Safety Support?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Carelabs provides arc flash studies, power system analysis, and
              full electrical safety compliance services across the United
              States.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/us/blog/"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>

      <USFooter />
    </>
  );
}
