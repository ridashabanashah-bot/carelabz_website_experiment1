export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
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

const CC = "no";
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

function cleanTitle(title: string): string {
  return title.replace(/\s+in\s+(the\s+)?(United Kingdom|UK|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i, "").trim();
}

export default async function BlogIndexPage() {
  const allPosts = await getBlogPosts(CC);

  const sorted = [...allPosts].sort(
    (a, b) =>
      new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime()
  );

  const featured = sorted.slice(0, 3);
  const older = sorted.slice(3);

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
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
              Knowledge Hub
            </span>
            <h1 className="font-condensed font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase text-white leading-[0.95] tracking-tight">
              From the
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Blog.
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              Expert knowledge on {config.primaryStandard}, IEEE 1584, and
              power system engineering from the Carelabs {config.countryName} team.
            </p>
          </div>
        </section>

        {/* ---------------- FEATURED ---------------- */}
        <section className="bg-[#F8FAFC] py-20 px-6">
          <div className="max-w-[1400px] mx-auto">
            {sorted.length === 0 && (
              <p className="text-center font-body text-gray-500 py-20">
                No articles yet. Check back soon.
              </p>
            )}

            {featured.length > 0 && (
              <>
                <div className="mb-12">
                  <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block">
                    Latest
                  </span>
                  <h2 className="font-condensed font-extrabold text-3xl md:text-5xl uppercase text-[#0B1A2F] leading-[0.95]">
                    Latest Articles
                  </h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featured.map((post) => {
                    const date = postDate(post);
                    const href = getPostHref(post.slug);
                    return (
                      <Link
                        key={post.id}
                        href={href}
                        className="group rounded-2xl overflow-hidden bg-white hover:shadow-lg transition-all duration-300 flex flex-col"
                      >
                        <div className="relative aspect-[16/9] overflow-hidden bg-[#1E293B]">
                          {post.heroImage && post.heroImage.startsWith("http") ? (
                            <Image
                              src={post.heroImage}
                              alt={post.heroImageAlt ?? post.title}
                              fill
                              className="object-cover transition-transform duration-500 group-hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div
                              className="absolute inset-0 opacity-10"
                              style={{
                                backgroundImage:
                                  "radial-gradient(circle, #F97316 1.5px, transparent 1.5px)",
                                backgroundSize: "20px 20px",
                              }}
                              aria-hidden="true"
                            >
                              <BookOpen className="absolute inset-0 m-auto w-10 h-10 text-white/30" />
                            </div>
                          )}
                        </div>
                        <div className="p-6 flex flex-col flex-1">
                          {post.category && (
                            <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
                              {post.category}
                            </span>
                          )}
                          <h3 className="font-condensed font-bold text-lg uppercase text-[#0B1A2F] mt-2 group-hover:text-orange-500 transition-colors line-clamp-2 tracking-tight">
                            {cleanTitle(post.title)}
                          </h3>
                          {post.excerpt && (
                            <p className="font-body text-sm text-gray-600 mt-3 line-clamp-3 leading-relaxed">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-4">
                            {date && (
                              <time
                                dateTime={date}
                                className="font-condensed text-xs uppercase tracking-[0.15em] text-[#0B1A2F]/40"
                              >
                                {formatDateShort(date)}
                              </time>
                            )}
                            <span className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 inline-flex items-center gap-1">
                              Read <ArrowRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </>
            )}
          </div>
        </section>

        {/* ---------------- OLDER ---------------- */}
        {older.length > 0 && (
          <section className="bg-white py-20 px-6">
            <div className="max-w-[1400px] mx-auto">
              <div className="mb-10">
                <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block">
                  Archive
                </span>
                <h2 className="font-condensed font-extrabold text-3xl md:text-4xl uppercase text-[#0B1A2F] leading-[0.95]">
                  More Articles
                </h2>
              </div>
              <ul className="border-t border-[#0B1A2F]/10">
                {older.map((post) => {
                  const href = getPostHref(post.slug);
                  return (
                    <li key={post.id}>
                      <Link
                        href={href}
                        className="border-b border-[#0B1A2F]/10 py-5 flex items-center justify-between gap-4 hover:bg-[#F8FAFC] transition-colors px-2 -mx-2 rounded-lg group"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          {post.category && (
                            <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold">
                              {post.category}
                            </span>
                          )}
                          <span className="font-condensed text-base md:text-lg uppercase font-bold text-[#0B1A2F] group-hover:text-orange-500 transition-colors line-clamp-1 tracking-tight">
                            {cleanTitle(post.title)}
                          </span>
                        </div>
                        <span className="font-condensed text-sm uppercase tracking-[0.15em] text-orange-500 inline-flex items-center gap-1 shrink-0">
                          Read <ArrowRight className="w-3.5 h-3.5" />
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          </section>
        )}

        {/* ---------------- CTA ---------------- */}
        <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
              Ready to Improve Your
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Electrical Safety?
              </span>
            </h2>
            <p className="font-body text-lg text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              Our expert engineers are ready to help your {config.countryName}{" "}
              facility meet {config.primaryStandard} requirements.
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
                href={config.servicesIndexPath}
                className="inline-flex items-center justify-center gap-2 border-2 border-white/20 text-white hover:bg-white hover:text-[#0B1A2F] font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <NEFooter config={config} />
    </>
  );
}
