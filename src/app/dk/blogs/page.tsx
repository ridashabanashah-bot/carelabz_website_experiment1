export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getBlogPosts, type BlogPost } from "@/lib/strapi-blog";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

const CC = "dk";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Electrical Safety Blog: Power System Studies & Analysis | Carelabs ${config.countryName}`,
  description: `Expert insights on electrical safety, power system studies, arc flash analysis, and ${config.primaryStandard} compliance for ${config.countryName} facilities.`,
  alternates: {
    canonical: `https://carelabz.com${config.blogIndexPath}`,
    languages: {
      [config.hreflang]: `https://carelabz.com${config.blogIndexPath}`,
      "x-default": `https://carelabz.com${config.blogIndexPath}`,
    },
  },
  openGraph: {
    title: `Electrical Safety Blog & Industry Insights | Carelabs ${config.countryName}`,
    description: `Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in ${config.countryName}.`,
    url: `https://carelabz.com${config.blogIndexPath}`,
    siteName: "Carelabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Electrical Safety Blog & Industry Insights | Carelabs ${config.countryName}`,
    description: `Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in ${config.countryName}.`,
  },
};

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(
      /\s*-\s*Carelabs\s*(UK|United Kingdom|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i,
      ""
    )
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .replace(/\s+in\s+(the\s+)?(United Kingdom|UK|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i, "")
    .trim();
}

function postDate(post: BlogPost): string {
  return post.publishedDate ?? post.publishedAt;
}

function formatDateShort(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-GB", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function getPostHref(slug: string): string {
  const suffix = `-${CC}`;
  const clean = slug.endsWith(suffix) ? slug.slice(0, -suffix.length) : slug;
  return config.blogDetailPattern.replace("{slug}", clean);
}

export default async function BlogIndexPage() {
  const allPosts = await getBlogPosts(CC);

  const sorted = [...allPosts].sort(
    (a, b) =>
      new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime()
  );

  const featured = sorted.slice(0, 5);
  const older = sorted.slice(5);

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: config.countryName,
      countryIso2: config.dialCodeCountryIso2,
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com${config.blogIndexPath}`,
      `Electrical Safety Blog & Industry Insights | Carelabs ${config.countryName}`,
      `Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in ${config.countryName}.`,
      config.hreflang
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "Blog", url: `https://carelabz.com${config.blogIndexPath}` },
    ]),
  ]);

  return (
    <>
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
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
            <div className="max-w-3xl">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-6 block">
                Knowledge Hub
              </span>
              <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-6xl uppercase text-white leading-[0.95]">
                From the<br />
                <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                  Blog.
                </span>
              </h1>
              <p className="font-ne-body text-lg text-white/50 mt-8 max-w-2xl leading-relaxed">
                Expert knowledge on {config.primaryStandard}, IEEE 1584, and
                power system engineering from the Carelabs {config.countryName} team.
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- FEATURED — editorial rows ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12">
            {sorted.length === 0 && (
              <p className="text-center font-ne-body text-gray-500 py-20">
                No articles yet. Check back soon.
              </p>
            )}

            {featured.length > 0 && (
              <>
                <div className="mb-12">
                  <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                    Latest
                  </span>
                  <h2 className="font-ne-display font-black text-3xl md:text-5xl uppercase text-[#1A3650] leading-[0.95]">
                    Latest Articles
                  </h2>
                </div>

                <div className="divide-y divide-[#1A3650]/10 border-t border-[#1A3650]/10">
                  {featured.map((post) => {
                    const date = postDate(post);
                    const href = getPostHref(post.slug);
                    return (
                      <Link
                        key={post.id}
                        href={href}
                        className="group flex flex-col md:flex-row md:items-center justify-between py-7 gap-4 hover:pl-2 transition-all"
                      >
                        <div className="min-w-0 flex-1">
                          {post.category && (
                            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 font-semibold mb-2 block">
                              {post.category}
                            </span>
                          )}
                          <h3 className="font-ne-display font-bold text-xl md:text-2xl uppercase text-[#1A3650] group-hover:text-orange-500 transition-colors">
                            {cleanTitle(post.title)}
                          </h3>
                        </div>
                        <div className="flex items-center gap-6 shrink-0 md:pl-8">
                          {date && (
                            <time
                              dateTime={date}
                              className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40"
                            >
                              {formatDateShort(date)}
                            </time>
                          )}
                          <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-orange-500 transition-colors" />
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ---------------- OLDER — navy editorial rows ---------------- */}
        {older.length > 0 && (
          <section className="bg-[#1A3650] py-20 px-6">
            <div className="max-w-[1400px] mx-auto lg:px-12">
              <div className="mb-10">
                <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                  Archive
                </span>
                <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-white leading-[0.95]">
                  More Articles
                </h2>
              </div>
              <div className="divide-y divide-[#4A7C9B]/20 border-t border-white/10">
                {older.map((post) => {
                  const href = getPostHref(post.slug);
                  return (
                    <Link
                      key={post.id}
                      href={href}
                      className="group flex flex-col md:flex-row md:items-center justify-between py-6 gap-4 hover:pl-2 transition-all"
                    >
                      <div className="min-w-0 flex-1">
                        {post.category && (
                          <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 font-semibold mb-1 block">
                            {post.category}
                          </span>
                        )}
                        <h3 className="font-ne-display font-bold text-base md:text-lg uppercase text-white/90 group-hover:text-orange-500 transition-colors line-clamp-1">
                          {cleanTitle(post.title)}
                        </h3>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/20 group-hover:text-orange-500 transition-colors shrink-0" />
                    </Link>
                  );
                })}
              </div>
            </div>
          </section>
        )}

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-24 px-6 border-t border-[#1A3650]/5">
          <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
            <h2 className="font-ne-display font-black text-3xl md:text-4xl uppercase text-[#1A3650] leading-tight">
              Ready to improve your electrical safety?
            </h2>
            <div className="mt-8">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#162a47] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <NEFooter config={config} />
    </>
  );
}
