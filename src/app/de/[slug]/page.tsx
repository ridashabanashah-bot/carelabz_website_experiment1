import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["de"];
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
  let post = await getBlogPost("de", params.slug);
  if (!post) post = await getBlogPost("de", `${params.slug}-de`);

  if (!post) {
    return {
      title: "Article Not Found | Carelabs Germany",
    };
  }

  return {
    title: post.metaTitle ?? `${post.title} | Carelabs Germany`,
    description:
      post.metaDescription ??
      post.excerpt ??
      "Expert electrical safety insights from the Carelabs engineering team.",
    keywords: post.seoKeywords ?? undefined,
    alternates: {
      canonical: `https://carelabz.com/de/${params.slug}/`,
      languages: {
        "en-DE": `https://carelabz.com/de/${params.slug}/`,
        "x-default": `https://carelabz.com/de/${params.slug}/`,
      },
    },
    openGraph: {
      title: post.metaTitle ?? `${post.title} | Carelabs Germany`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      url: `https://carelabz.com/de/${params.slug}/`,
      siteName: "Carelabs",
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title: post.metaTitle ?? `${post.title} | Carelabs Germany`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
    },
  };
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-DE", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  } catch {
    return dateString;
  }
}

export default async function DEBlogPostPage({ params }: PageProps) {
  let post = await getBlogPost("de", params.slug);
  if (!post) post = await getBlogPost("de", `${params.slug}-de`);

  if (!post) {
    notFound();
  }

  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
    inLanguage: "en-DE",
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
    url: `https://carelabz.com/de/${post.slug}/`,
  };

  return (
    <>
      <RegionNavbar config={config} />
      <JsonLd data={articleJsonLd} />

      <main id="main-content">
        <section className="bg-[#EEF4FF] pt-28 pb-16 px-4">
          <div className="mx-auto max-w-4xl">
            <nav
              aria-label="Breadcrumb"
              className="flex items-center gap-2 text-sm text-[#374151] mb-6 flex-wrap"
            >
              <Link href="/de/" className="hover:text-[#1A2538] transition-colors">
                Home
              </Link>
              <span aria-hidden="true">/</span>
              <Link
                href="/de/blogs/"
                className="hover:text-[#1A2538] transition-colors"
              >
                Blog
              </Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#1A2538] line-clamp-1">{post.title}</span>
            </nav>

            {post.category && (
              <span className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">
                {post.category}
              </span>
            )}

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2538] mb-6 leading-tight">
              {post.title}
            </h1>

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

        <section className="bg-offWhite py-16 px-4">
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#1A2538] prose-headings:font-bold prose-p:text-[#374151] prose-li:text-[#374151] prose-strong:text-[#1A2538] prose-a:text-[#FF6633] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: marked(post.body || "") as string }}
            />

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

        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Need Expert Electrical Safety Support?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Carelabs provides arc flash studies, power system analysis, and
              DIN VDE 0100 compliance services across Germany.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/de/contact-us/"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Get a Free Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link
                href="/de/blogs/"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>

      <RegionFooter config={config} />
    </>
  );
}
