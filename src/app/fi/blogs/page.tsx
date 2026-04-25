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

const CC = "fi";
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
    .replace(
      /\s+in\s+(the\s+)?(United Kingdom|UK|Ireland|Sweden|Norway|Denmark|Finland)\s*$/i,
      ""
    )
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
        {/* ---------------- STATEMENT HERO ---------------- */}
        <section className="relative bg-[#1A3650] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 pb-20 lg:pt-40 lg:pb-28">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
              Knowledge Hub
            </span>
            <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
              From the<br />
              <span className="font-ne-accent italic font-normal text-[#F97316]">
                Blog.
              </span>
            </h1>
            <p className="font-ne-body text-base text-white/40 mt-10 max-w-2xl leading-relaxed">
              Expert knowledge on {config.primaryStandard}, IEEE 1584, and
              power system engineering from the Carelabs {config.countryName} team.
            </p>
          </div>
        </section>

        {/* ---------------- ARTICLES — pure-text editorial line list ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12">
            {sorted.length === 0 && (
              <p className="text-center font-ne-body text-base text-[#1A3650]/50 py-20">
                No articles yet. Check back soon.
              </p>
            )}

            {sorted.length > 0 && (
              <div className="border-t border-[#1A3650]/10">
                {sorted.map((post) => {
                  const date = postDate(post);
                  const href = getPostHref(post.slug);
                  return (
                    <Link
                      key={post.id}
                      href={href}
                      className="group flex flex-col md:flex-row md:items-center justify-between py-7 gap-4 border-b border-[#1A3650]/10"
                    >
                      <div className="min-w-0 flex-1">
                        {post.category && (
                          <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-2 block">
                            {post.category}
                          </span>
                        )}
                        <h2 className="font-ne-display font-black text-xl md:text-2xl lg:text-3xl text-[#1A3650] uppercase leading-tight group-hover:text-[#F97316] transition-colors">
                          {cleanTitle(post.title)}
                        </h2>
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
                        <ArrowRight className="w-5 h-5 text-[#1A3650]/20 group-hover:text-[#F97316] transition-colors" />
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#1A3650] py-24 lg:py-32 px-6">
          <div className="max-w-[1000px] mx-auto">
            <h2 className="font-ne-display font-black text-4xl md:text-5xl lg:text-6xl text-white uppercase leading-[0.95]">
              Ready to improve
            </h2>
            <p className="font-ne-accent italic text-3xl md:text-4xl text-[#F97316] mt-3">
              your electrical safety?
            </p>
            <div className="mt-12">
              <Link
                href={config.contactPath}
                className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
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
