export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getBlogPosts, type BlogPost } from "@/lib/strapi-blog";

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
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-24 lg:pt-44 lg:pb-32 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-[1200px] mx-auto text-center relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-6">
            Knowledge Hub
          </p>
          <h1 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95] tracking-tight">
            Insights & Field Notes
          </h1>
          <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            Expert knowledge on {config.primaryStandard}, IEEE 1584, and power system engineering from the Carelabs UAE team.
          </p>
        </div>
      </section>

      {/* ARTICLES */}
      <main id="main-content" className="bg-[#F2EDE6] py-20 lg:py-28">
        <div className="max-w-[1100px] mx-auto px-6 lg:px-12">
          {posts.length === 0 ? (
            <p className="text-center font-ae-body text-base text-[#0F2847]/50 py-12">
              No articles yet. Check back soon.
            </p>
          ) : (
            <div className="border-t border-[#0F2847]/10">
              {posts.map((post) => {
                const date = postDate(post);
                return (
                  <Link
                    key={post.id}
                    href={getPostHref(post.slug)}
                    className="group flex flex-col md:flex-row md:items-center justify-between py-7 gap-4 border-b border-[#0F2847]/10"
                  >
                    <div className="min-w-0 flex-1">
                      {post.category && (
                        <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-2 block">
                          {post.category}
                        </span>
                      )}
                      <h2 className="font-ae-display text-xl md:text-2xl text-[#0F2847] leading-tight group-hover:text-[#1E5A8A] transition-colors">
                        {cleanTitle(post.title)}
                      </h2>
                    </div>
                    <div className="flex items-center gap-6 shrink-0 md:pl-8">
                      {date && (
                        <time dateTime={date} className="font-ae-nav text-xs uppercase tracking-[0.15em] text-[#0F2847]/40">
                          {formatDate(date)}
                        </time>
                      )}
                      <ArrowRight className="w-5 h-5 text-[#0F2847]/15 group-hover:text-[#2D7AB8] transition-colors" />
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>

      {/* CTA */}
      <section className="bg-[#0F2847] py-24 lg:py-32 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            Need expert support?
          </h2>
          <p className="font-ae-body text-lg text-[#5A8FB4] mt-6">
            Our UAE team is ready to help with arc flash studies, system protection, and DEWA compliance.
          </p>
          <div className="mt-10">
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              Get a Quote
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
