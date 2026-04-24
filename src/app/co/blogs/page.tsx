import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, ArrowRight } from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { SouthAmericaFooter } from "@/components/south-america-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["co"];
import { getBlogPosts, type BlogPost } from "@/lib/strapi-blog";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title:
    "Electrical Safety Blog: Power System Studies & Analysis | Carelabs Colombia",
  description:
    "Expert insights on electrical safety, power system studies, arc flash analysis, and RETIE compliance for Colombia facilities. Stay informed with Carelabs.",
  alternates: {
    canonical: "https://carelabz.com/co/blogs/",
    languages: {
      "en-CO": "https://carelabz.com/co/blogs/",
      "x-default": "https://carelabz.com/co/blogs/",
    },
  },
  openGraph: {
    title: "Electrical Safety Blog & Industry Insights | Carelabs Colombia",
    description:
      "Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in Colombia.",
    url: "https://carelabz.com/co/blogs/",
    siteName: "Carelabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electrical Safety Blog & Industry Insights | Carelabs Colombia",
    description:
      "Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in Colombia.",
  },
};

function postDate(post: BlogPost): string {
  return post.publishedDate ?? post.publishedAt;
}

function formatDateShort(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-CO", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function COBlogIndexPage() {
  const allPosts = await getBlogPosts("co");

  const sorted = [...allPosts].sort(
    (a, b) => new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime()
  );

  const featured = sorted.slice(0, 3);
  const older = sorted.slice(3);

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: "co",
      countryName: "Colombia",
      countryIso2: "CO",
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      "https://carelabz.com/co/blogs/",
      "Electrical Safety Blog & Industry Insights | Carelabs Colombia",
      "Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in Colombia.",
      "en-CO"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/co/" },
      { name: "Blog", url: "https://carelabz.com/co/blogs/" },
    ]),
  ]);

  return (
    <div className="sa-root">
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
        {/* HERO */}
        <section
          className="sa-hero-bg relative overflow-hidden"
          style={{ paddingTop: "8rem", paddingBottom: "5rem" }}
        >
          <div className="sa-hero-shape" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-8 text-center">
            <span
              className="inline-block mb-5 px-4 py-1.5 rounded-full text-xs uppercase tracking-widest"
              style={{
                backgroundColor: "rgba(241,92,48,0.18)",
                color: "#F15C30",
                fontFamily: "var(--sa-font-body)",
                fontWeight: 600,
              }}
            >
              Power Systems Knowledge Hub
            </span>
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                lineHeight: 1.1,
              }}
            >
              Power up your Knowledge with our Blogs
            </h1>
            <p
              className="mx-auto"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.82)",
                fontSize: "1.125rem",
                lineHeight: 1.65,
                maxWidth: "44rem",
              }}
            >
              Stay ahead of RETIE, NTC 2050, and IEEE 1584 requirements.
              Expert knowledge from the Carelabs engineering team to help
              Colombia facilities stay safe and compliant.
            </p>
          </div>
        </section>

        {/* POSTS */}
        <section style={{ backgroundColor: "#f7f5f3" }} className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            {sorted.length === 0 && (
              <p
                className="text-center py-20"
                style={{
                  fontFamily: "var(--sa-font-body)",
                  color: "#9c9b9a",
                }}
              >
                No articles yet. Check back soon.
              </p>
            )}

            {featured.length > 0 && (
              <>
                <h2
                  className="mb-10"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "clamp(1.75rem, 3vw, 2.25rem)",
                    color: "#094d76",
                  }}
                >
                  Latest Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                  {featured.map((post) => {
                    const date = postDate(post);
                    return (
                      <article
                        key={post.id}
                        className="sa-card overflow-hidden flex flex-col"
                      >
                        <Link
                          href={`/co/${post.slug}/`}
                          aria-hidden="true"
                          tabIndex={-1}
                          className="block relative aspect-[16/9] overflow-hidden"
                        >
                          {post.heroImage && post.heroImage.startsWith("http") ? (
                            <Image
                              src={post.heroImage}
                              alt={post.heroImageAlt ?? post.title}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div
                              className="absolute inset-0 flex items-center justify-center"
                              style={{
                                background:
                                  "linear-gradient(135deg, #e8f4fd 0%, rgba(37,117,182,0.3) 100%)",
                              }}
                            >
                              <BookOpen
                                className="w-12 h-12"
                                style={{ color: "rgba(37,117,182,0.5)" }}
                              />
                            </div>
                          )}
                        </Link>

                        <div className="p-6 flex flex-col flex-1">
                          {post.category && (
                            <span
                              className="inline-block mb-3 self-start px-3 py-1 rounded-full text-xs uppercase tracking-wider"
                              style={{
                                backgroundColor: "#fde8e2",
                                color: "#F15C30",
                                fontFamily: "var(--sa-font-body)",
                                fontWeight: 600,
                              }}
                            >
                              {post.category}
                            </span>
                          )}
                          <h3
                            className="mb-3 line-clamp-2"
                            style={{
                              fontFamily: "var(--sa-font-heading)",
                              fontWeight: 700,
                              fontSize: "1.125rem",
                              color: "#094d76",
                              lineHeight: 1.35,
                            }}
                          >
                            <Link
                              href={`/co/${post.slug}/`}
                              className="transition-colors hover:text-[#2575B6]"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          {post.excerpt && (
                            <p
                              className="line-clamp-3 mb-4 text-sm"
                              style={{
                                fontFamily: "var(--sa-font-body)",
                                color: "#9c9b9a",
                                lineHeight: 1.6,
                              }}
                            >
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-3">
                            {date && (
                              <time
                                dateTime={date}
                                className="text-xs"
                                style={{
                                  fontFamily: "var(--sa-font-body)",
                                  color: "#9c9b9a",
                                }}
                              >
                                {formatDateShort(date)}
                              </time>
                            )}
                            <Link
                              href={`/co/${post.slug}/`}
                              className="inline-flex items-center gap-1 text-sm ml-auto"
                              style={{
                                fontFamily: "var(--sa-font-body)",
                                fontWeight: 600,
                                color: "#F15C30",
                              }}
                              aria-label={`Read more about ${post.title}`}
                            >
                              Read more
                              <ArrowRight className="w-4 h-4" />
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {older.length > 0 && (
              <>
                <h2
                  className="mt-16 mb-6"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "#094d76",
                  }}
                >
                  More Articles
                </h2>
                <div
                  className="rounded-2xl overflow-hidden"
                  style={{
                    backgroundColor: "#ffffff",
                    boxShadow: "0 1px 3px rgba(15,23,42,0.04)",
                  }}
                >
                  <ul>
                    {older.map((post, idx) => (
                      <li
                        key={post.id}
                        style={{
                          borderTop:
                            idx === 0 ? "none" : "1px solid #f2f2f4",
                        }}
                      >
                        <Link
                          href={`/co/${post.slug}/`}
                          className="py-4 px-6 flex items-center justify-between gap-4 transition-colors hover:bg-[#e8f4fd]/40 group"
                        >
                          <div className="flex flex-col gap-1 min-w-0">
                            {post.category && (
                              <span
                                className="text-xs uppercase"
                                style={{
                                  fontFamily: "var(--sa-font-body)",
                                  fontWeight: 600,
                                  color: "#F15C30",
                                }}
                              >
                                {post.category}
                              </span>
                            )}
                            <span
                              className="line-clamp-1 transition-colors group-hover:text-[#2575B6]"
                              style={{
                                fontFamily: "var(--sa-font-heading)",
                                fontWeight: 600,
                                color: "#094d76",
                              }}
                            >
                              {post.title}
                            </span>
                          </div>
                          <span
                            className="flex-shrink-0 inline-flex items-center gap-1 text-sm transition-colors"
                            style={{
                              fontFamily: "var(--sa-font-body)",
                              fontWeight: 600,
                              color: "#2575B6",
                            }}
                          >
                            Read
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              </>
            )}
          </div>
        </section>

        {/* CTA BANNER */}
        <section
          className="relative py-24 px-4 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #F15C30 0%, #c44a1f 100%)",
          }}
        >
          <div className="relative mx-auto max-w-4xl text-center">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
              }}
            >
              Ready to Improve Your Electrical Safety?
            </h2>
            <p
              className="mb-10 mx-auto max-w-2xl"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.075rem",
                lineHeight: 1.65,
              }}
            >
              Our expert engineers are ready to help your Colombia facility meet
              RETIE and NTC 2050 requirements. Get a free consultation
              today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/co/contact-us/"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 transition-all hover:scale-[1.02]"
                style={{
                  backgroundColor: "#ffffff",
                  color: "#c44a1f",
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 600,
                }}
              >
                Get a Free Quote
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/co/services/"
                className="inline-flex items-center justify-center gap-2 rounded-full px-8 py-3.5 border-2 border-white text-white hover:bg-white/10 transition-colors"
                style={{
                  fontFamily: "var(--sa-font-heading)",
                  fontWeight: 600,
                }}
              >
                Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <SouthAmericaFooter config={config} />
    </div>
  );
}
