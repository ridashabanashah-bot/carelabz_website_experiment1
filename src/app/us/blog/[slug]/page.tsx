import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import { FaqAccordion } from "@/components/faq-accordion";
import { JsonLd } from "@/components/JsonLd";
import { getBlogPost } from "@/lib/strapi-blog";

export const dynamic = "force-dynamic";

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const post = await getBlogPost("us", params.slug);

  if (!post) {
    return {
      title: "Article Not Found | CareLabs USA",
    };
  }

  return {
    title: post.metaTitle ?? `${post.title} | CareLabs USA`,
    description:
      post.metaDescription ??
      post.excerpt ??
      "Expert electrical safety insights from the CareLabs engineering team.",
    keywords: post.seoKeywords ?? undefined,
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
  const post = await getBlogPost("us", params.slug);

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
      name: post.author ?? "CareLabs Engineering Team",
    },
    datePublished: post.publishedDate ?? post.publishedAt,
    dateModified: post.updatedAt,
    publisher: {
      "@type": "Organization",
      name: "CareLabs",
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
        <section className="bg-navy pt-28 pb-16 px-4">
          <div className="mx-auto max-w-4xl">
            {/* Breadcrumb */}
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-white/50 mb-6 flex-wrap"
            >
              <Link
                href="/"
                className="hover:text-white transition-colors"
              >
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/us/blog/"
                className="hover:text-white transition-colors"
              >
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-white/80 line-clamp-1">{post.title}</span>
            </nav>

            {/* Category tag */}
            {post.category && (
              <span className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">
                {post.category}
              </span>
            )}

            {/* Title */}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white mb-6 leading-tight">
              {post.title}
            </h1>

            {/* Author + Date */}
            <div className="flex flex-wrap items-center gap-4 text-white/60 text-sm mb-10">
              {post.author && (
                <span>
                  By{" "}
                  <span className="text-white/80 font-medium">{post.author}</span>
                </span>
              )}
              {post.publishedDate && (
                <time dateTime={post.publishedDate}>
                  {formatDate(post.publishedDate)}
                </time>
              )}
            </div>

            {/* Hero Image */}
            {post.heroImage && (
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
            )}
          </div>
        </section>

        {/* Body */}
        <section className="bg-offWhite py-16 px-4">
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-lg prose-headings:text-navy prose-a:text-orange-500 prose-a:no-underline hover:prose-a:underline prose-strong:text-navy max-w-none"
              dangerouslySetInnerHTML={{ __html: post.body }}
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
        <section className="bg-navy py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need Expert Electrical Safety Support?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              CareLabs provides arc flash studies, power system analysis, and
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

      {/* Footer */}
      <footer className="bg-slateCard text-white/60 py-12 px-4">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-4">
            <div className="md:col-span-2">
              <p className="text-white font-bold text-lg mb-2">CareLabs</p>
              <p className="text-sm leading-relaxed max-w-xs">
                Professional electrical safety services for US facilities.
                Arc flash studies, power system analysis, and compliance
                solutions.
              </p>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Services</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/us/services/study-analysis/arc-flash-study/"
                    className="hover:text-white transition-colors"
                  >
                    Arc Flash Study
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/services/study-analysis/short-circuit-analysis/"
                    className="hover:text-white transition-colors"
                  >
                    Short Circuit Analysis
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/services/study-analysis/load-flow-analysis/"
                    className="hover:text-white transition-colors"
                  >
                    Load Flow Analysis
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <p className="text-white font-semibold mb-3">Company</p>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link
                    href="/us/about/"
                    className="hover:text-white transition-colors"
                  >
                    About Us
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/blog/"
                    className="hover:text-white transition-colors"
                  >
                    Blog
                  </Link>
                </li>
                <li>
                  <Link
                    href="/us/contact/"
                    className="hover:text-white transition-colors"
                  >
                    Contact
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="border-t border-white/10 mt-10 pt-8 text-sm text-center">
            &copy; {new Date().getFullYear()} CareLabs. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
