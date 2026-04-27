export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getBlogPosts, type BlogPost } from "@/lib/strapi-blog";
import { ScrollReveal } from "@/components/scroll-reveal";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Insights & Articles | Carelabs UAE`,
  description: `Expert articles on electrical safety, power system studies, arc flash analysis, and DEWA compliance for UAE facilities.`,
  alternates: {
    canonical: `https://carelabz.com${config.blogIndexPath}`,
    languages: {
      [config.hreflang]: `https://carelabz.com${config.blogIndexPath}`,
      "x-default": `https://carelabz.com${config.blogIndexPath}`,
    },
  },
  openGraph: {
    title: `Insights & Articles | Carelabs UAE`,
    description: `Expert insights on electrical safety, power system engineering, and DEWA compliance across the UAE.`,
    url: `https://carelabz.com${config.blogIndexPath}`,
    siteName: "Carelabs",
    type: "website",
    locale: "en_AE",
  },
};

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(/\s*-\s*Carelabs\s*(UAE|United Arab Emirates|Dubai)\s*$/i, "")
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .trim();
}

function formatDate(s: string | null): string {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function postDate(post: BlogPost): string {
  return post.publishedDate ?? post.publishedAt;
}

function getPostHref(slug: string): string {
  const suffix = `-${CC}`;
  const clean = slug.endsWith(suffix) ? slug.slice(0, -suffix.length) : slug;
  return config.blogDetailPattern.replace("{slug}", clean);
}

export default async function BlogIndexPage() {
  const posts = (await getBlogPosts(CC)).sort(
    (a, b) => new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime()
  );

  return (
    <>
      <AENavbar config={config} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-24 pt-36 lg:pb-32 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1280px] text-center">
          <p className="animate-fade-in-up animation-delay-100 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            Knowledge Hub
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            Insights & Field Notes
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            Expert knowledge on {config.primaryStandard}, IEEE 1584, and power system engineering from the Carelabs UAE team.
          </p>
        </div>
      </section>

      {/* ARTICLES — gap-px grid */}
      <main id="main-content" className="bg-[#F2F2F4] py-24 lg:py-32">
        <div className="mx-auto max-w-[1280px] px-6">
          {posts.length === 0 ? (
            <p className="py-12 text-center text-base text-gray-500">
              No articles yet. Check back soon.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-px bg-gray-300 md:grid-cols-2 lg:grid-cols-3">
              {posts.map((post, i) => {
                const date = postDate(post);
                return (
                  <ScrollReveal key={post.id} delay={(i % 6) * 80}>
                    <Link
                      href={getPostHref(post.slug)}
                      className="group flex h-full flex-col bg-white p-8 transition-colors duration-300 hover:bg-[#F2F2F4]"
                    >
                      {post.category && (
                        <span className="text-xs font-semibold uppercase tracking-[0.2em] text-[#2575B6]">
                          {post.category}
                        </span>
                      )}
                      <h2 className="mt-4 flex-1 font-display text-xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6]">
                        {cleanTitle(post.title)}
                      </h2>
                      <div className="mt-6 flex items-center justify-between">
                        {date && (
                          <time
                            dateTime={date}
                            className="text-xs uppercase tracking-[0.15em] text-gray-500"
                          >
                            {formatDate(date)}
                          </time>
                        )}
                        <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#F15C30]">
                          Read More
                          <ArrowRight className="h-3 w-3 transition-transform duration-300 group-hover:translate-x-1" />
                        </span>
                      </div>
                    </Link>
                  </ScrollReveal>
                );
              })}
            </div>
          )}
        </div>
      </main>

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
              Our UAE team is ready to help with arc flash studies, system protection, and DEWA compliance.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={300}>
            <div className="mt-10">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F15C30] px-10 py-4 text-sm font-semibold uppercase tracking-[0.1em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
              >
                Get a Quote
                <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </ScrollReveal>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
