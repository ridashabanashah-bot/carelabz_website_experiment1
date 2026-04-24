import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen } from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { getBlogPosts, type BlogPost } from "@/lib/strapi-blog";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

export const dynamic = "force-dynamic";

const CC = "br";
const COUNTRY_NAME = "Brazil";
const HREFLANG = "en-BR";
const config = COUNTRY_CONFIGS[CC];

export const metadata: Metadata = {
  title: `Electrical Safety Blog: Power System Studies & Analysis | Carelabs ${COUNTRY_NAME}`,
  description: `Expert insights on electrical safety, power system studies, arc flash analysis, and ${config.primaryStandard} compliance for ${COUNTRY_NAME} facilities. Stay informed with Carelabs.`,
  alternates: {
    canonical: `https://carelabz.com/${CC}/blogs/`,
    languages: {
      [HREFLANG]: `https://carelabz.com/${CC}/blogs/`,
      "x-default": `https://carelabz.com/${CC}/blogs/`,
    },
  },
  openGraph: {
    title: `Electrical Safety Blog & Industry Insights | Carelabs ${COUNTRY_NAME}`,
    description: `Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in ${COUNTRY_NAME}.`,
    url: `https://carelabz.com/${CC}/blogs/`,
    siteName: "Carelabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: `Electrical Safety Blog & Industry Insights | Carelabs ${COUNTRY_NAME}`,
    description: `Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in ${COUNTRY_NAME}.`,
  },
};

function postDate(post: BlogPost): string {
  return post.publishedDate ?? post.publishedAt;
}

function formatDate(v: string | null): string {
  if (!v) return "";
  try {
    return new Date(v).toLocaleDateString("en-US", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

function slugPath(post: BlogPost): string {
  const slug = post.slug.endsWith(`-${CC}`) ? post.slug.slice(0, -3) : post.slug;
  return `/${CC}/${slug}/`;
}

export default async function BRBlogIndexPage() {
  const allPosts = await getBlogPosts(CC);
  const sorted = [...allPosts].sort(
    (a, b) => new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime()
  );
  const featuredPost = sorted[0];
  const sideFeatured = sorted.slice(1, 3);
  const older = sorted.slice(3);

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: COUNTRY_NAME,
      countryIso2: CC.toUpperCase(),
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com/${CC}/blogs/`,
      `Electrical Safety Blog & Industry Insights | Carelabs ${COUNTRY_NAME}`,
      `Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in ${COUNTRY_NAME}.`,
      HREFLANG
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "Blog", url: `https://carelabz.com/${CC}/blogs/` },
    ]),
  ]);

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* HERO */}
        <section className="relative bg-[#0B1A2F] py-20 lg:py-28 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <p className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 mb-4">
              Power Systems Knowledge Hub
            </p>
            <h1 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-tight tracking-tight">
              From the{" "}
              <span className="font-accent italic font-normal normal-case text-orange-500">
                Blog
              </span>
            </h1>
            <p className="font-body text-lg text-white/70 mt-6 max-w-2xl mx-auto">
              Stay ahead of {config.primaryStandard}, IEEE 1584, and
              international compliance requirements. Expert knowledge from the
              Carelabs engineering team.
            </p>
          </div>
        </section>

        {/* FEATURED + SIDE */}
        {featuredPost && (
          <section className="bg-[#F8FAFC] py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                {/* Featured */}
                <Link
                  href={slugPath(featuredPost)}
                  className="lg:col-span-3 group rounded-2xl rounded-tr-none overflow-hidden bg-[#0B1A2F] p-8 text-white flex flex-col min-h-[400px] relative"
                >
                  {featuredPost.heroImage &&
                  featuredPost.heroImage.startsWith("http") ? (
                    <Image
                      src={featuredPost.heroImage}
                      alt={featuredPost.heroImageAlt ?? featuredPost.title}
                      fill
                      className="object-cover opacity-30 group-hover:opacity-40 transition-opacity"
                      sizes="(max-width: 1024px) 100vw, 60vw"
                    />
                  ) : (
                    <div
                      className="absolute inset-0 opacity-10"
                      style={{
                        backgroundImage:
                          "radial-gradient(circle at 2px 2px, white 1px, transparent 0)",
                        backgroundSize: "32px 32px",
                      }}
                      aria-hidden="true"
                    />
                  )}
                  <div className="relative mt-auto">
                    {featuredPost.category && (
                      <span className="font-condensed text-xs uppercase tracking-[0.15em] bg-orange-500 text-white px-3 py-1 rounded-full inline-block mb-4">
                        {featuredPost.category}
                      </span>
                    )}
                    <h2 className="font-condensed font-bold text-2xl md:text-3xl text-white uppercase group-hover:text-orange-500 transition-colors">
                      {featuredPost.title}
                    </h2>
                    {featuredPost.excerpt && (
                      <p className="font-body text-sm text-white/75 mt-4 leading-relaxed">
                        {featuredPost.excerpt.length > 180
                          ? featuredPost.excerpt.slice(0, 177) + "…"
                          : featuredPost.excerpt}
                      </p>
                    )}
                    <div className="mt-6 flex items-center justify-between">
                      <span className="font-body text-xs text-white/60">
                        {formatDate(postDate(featuredPost))}
                      </span>
                      <span className="font-condensed font-semibold uppercase tracking-wider text-orange-500 inline-flex items-center gap-2">
                        Read More <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                </Link>

                {/* Side */}
                <div className="lg:col-span-2 space-y-4">
                  {sideFeatured.map((post) => (
                    <Link
                      key={post.id}
                      href={slugPath(post)}
                      className="group block rounded-2xl rounded-tr-none bg-white p-6 border border-gray-100 hover:shadow-lg transition-shadow"
                    >
                      {post.category && (
                        <span className="font-condensed text-xs uppercase tracking-[0.15em] text-orange-500 font-semibold">
                          {post.category}
                        </span>
                      )}
                      <h3 className="font-condensed font-bold text-lg text-[#0B1A2F] uppercase mt-2 group-hover:text-orange-500 transition-colors">
                        {post.title}
                      </h3>
                      {post.excerpt && (
                        <p className="font-body text-sm text-gray-600 mt-2 line-clamp-2">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="mt-4 flex items-center justify-between">
                        <span className="font-body text-xs text-gray-500">
                          {formatDate(postDate(post))}
                        </span>
                        <ArrowRight className="w-4 h-4 text-orange-500 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}

        {/* MORE ARTICLES */}
        {older.length > 0 && (
          <section className="bg-white py-16">
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
              <h2 className="font-condensed font-extrabold text-2xl md:text-3xl text-[#0B1A2F] uppercase mb-8">
                More Articles
              </h2>
              <ul>
                {older.map((post) => (
                  <li key={post.id}>
                    <Link
                      href={slugPath(post)}
                      className="group flex items-start gap-6 py-6 border-b border-gray-100 hover:bg-[#F8FAFC] transition-colors px-4 rounded-lg"
                    >
                      <span className="font-condensed text-sm text-orange-500 shrink-0 w-24 uppercase tracking-wider">
                        {formatDate(postDate(post))}
                      </span>
                      <div className="flex-1 min-w-0">
                        {post.category && (
                          <span className="font-condensed text-xs uppercase tracking-widest text-gray-500">
                            {post.category}
                          </span>
                        )}
                        <h3 className="font-condensed font-bold text-lg text-[#0B1A2F] group-hover:text-orange-500 transition-colors mt-1">
                          {post.title}
                        </h3>
                        {post.excerpt && (
                          <p className="font-body text-sm text-gray-600 mt-1 line-clamp-2">
                            {post.excerpt}
                          </p>
                        )}
                      </div>
                      <ArrowRight className="w-5 h-5 text-orange-500 mt-1 shrink-0 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {sorted.length === 0 && (
          <section className="bg-[#F8FAFC] py-32 text-center">
            <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-6" />
            <p className="font-body text-lg text-gray-500">
              No articles yet. Check back soon.
            </p>
          </section>
        )}

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase leading-tight">
              Ready to Improve Your Electrical Safety?
            </h2>
            <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
              Our expert engineers are ready to help your {COUNTRY_NAME}{" "}
              facility meet {config.primaryStandard} requirements.
            </p>
            <Link
              href={config.contactPath}
              className="mt-8 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide"
            >
              Get a Free Quote
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </section>
      </main>

      <SAFooter config={config} />
    </div>
  );
}
