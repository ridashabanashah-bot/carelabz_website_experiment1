import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight } from "lucide-react";
import { CAStickyNavbar } from "@/components/ca-navbar";
import CAFooter from "@/components/ca-footer";
import { getBlogPosts, type BlogPost } from "@/lib/strapi-blog";
import { buildJsonLd, getOrganizationSchemaCA, getWebPageSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electrical Safety Blog: Power System Studies & Analysis | CareLabs Canada",
  description:
    "Expert insights on electrical safety, power system studies, arc flash analysis, and CSA Z462 compliance for Canadian facilities. Stay informed with CareLabs.",
  alternates: {
    canonical: "https://carelabz.com/ca/blogs/",
    languages: {
      "en-CA": "https://carelabz.com/ca/blogs/",
      "x-default": "https://carelabz.com/ca/blogs/",
    },
  },
  openGraph: {
    title: "Electrical Safety Blog & Industry Insights | CareLabs Canada",
    description:
      "Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in Canada.",
    url: "https://carelabz.com/ca/blogs/",
    siteName: "CareLabs",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Electrical Safety Blog & Industry Insights | CareLabs Canada",
    description:
      "Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in Canada.",
  },
};

function postDate(post: BlogPost): string {
  return post.publishedDate ?? post.publishedAt;
}

function formatDateShort(dateString: string | null): string {
  if (!dateString) return "";
  try {
    return new Date(dateString).toLocaleDateString("en-CA", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  } catch {
    return "";
  }
}

export default async function CABlogIndexPage() {
  const allPosts = await getBlogPosts("ca");

  const sorted = [...allPosts].sort(
    (a, b) =>
      new Date(postDate(b)).getTime() - new Date(postDate(a)).getTime()
  );

  const featured = sorted.slice(0, 3);
  const older = sorted.slice(3);

  const jsonLd = buildJsonLd([
    getOrganizationSchemaCA(),
    getWebPageSchema(
      "https://carelabz.com/ca/blogs/",
      "Electrical Safety Blog & Industry Insights | CareLabs Canada",
      "Expert insights on arc flash analysis, power system engineering, and electrical safety compliance in Canada.",
      "en-CA"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/ca/" },
      { name: "Blog", url: "https://carelabz.com/ca/blogs/" },
    ]),
  ]);

  return (
    <>
      <CAStickyNavbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main id="main-content">
        <section className="bg-[#EEF4FF] pt-32 pb-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-4">
              Power Systems Knowledge Hub
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A2538] mb-6">
              Power up your Knowledge with our Blogs
            </h1>
            <p className="text-lg text-[#374151] max-w-2xl mx-auto">
              Stay ahead of CSA Z462, Canadian Electrical Code, and IEEE 1584 requirements.
              Expert knowledge from the CareLabs engineering team to help Canadian
              facilities stay safe and compliant.
            </p>
          </div>
        </section>

        <section className="bg-offWhite py-20 px-4">
          <div className="mx-auto max-w-7xl">
            {sorted.length === 0 && (
              <p className="text-center text-slate-500 py-20">
                No articles yet. Check back soon.
              </p>
            )}

            {featured.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-[#1A2538] mb-8">
                  Latest Articles
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featured.map((post) => {
                    const date = postDate(post);
                    return (
                      <article
                        key={post.id}
                        className="rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 bg-white flex flex-col"
                      >
                        <Link
                          href={`/ca/${post.slug}/`}
                          aria-hidden="true"
                          tabIndex={-1}
                          className="block relative aspect-[16/9] overflow-hidden"
                        >
                          {post.heroImage &&
                          post.heroImage.startsWith("http") ? (
                            <Image
                              src={post.heroImage}
                              alt={post.heroImageAlt ?? post.title}
                              fill
                              className="object-cover transition-transform duration-500 hover:scale-105"
                              sizes="(max-width: 768px) 100vw, 33vw"
                            />
                          ) : (
                            <div className="absolute inset-0 bg-gradient-to-br from-[#EEF4FF] to-[#0050B3]/20 flex items-center justify-center">
                              <BookOpen className="w-12 h-12 text-[#0050B3]/40" />
                            </div>
                          )}
                        </Link>

                        <div className="p-6 flex flex-col flex-1">
                          {post.category && (
                            <span className="text-xs font-bold text-[#FF6633] uppercase tracking-wider mb-2">
                              {post.category}
                            </span>
                          )}
                          <h3 className="text-lg font-bold text-[#1A2538] mb-2 line-clamp-2">
                            <Link
                              href={`/ca/${post.slug}/`}
                              className="hover:text-[#0050B3] transition-colors"
                            >
                              {post.title}
                            </Link>
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-[#374151] line-clamp-3 mb-4">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center justify-between mt-auto pt-2">
                            {date && (
                              <time
                                dateTime={date}
                                className="text-xs text-[#64748B]"
                              >
                                {formatDateShort(date)}
                              </time>
                            )}
                            <Link
                              href={`/ca/${post.slug}/`}
                              className="text-sm font-semibold text-[#FF6633] hover:text-[#0050B3] transition-colors ml-auto"
                              aria-label={`Read more about ${post.title}`}
                            >
                              Read More →
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
                <h2 className="text-2xl font-bold text-[#1A2538] mb-6 mt-16">
                  More Articles
                </h2>
                <div className="border-t border-slate-200 mb-8" />
                <ul>
                  {older.map((post) => (
                    <li key={post.id}>
                      <Link
                        href={`/ca/${post.slug}/`}
                        className="border-b border-slate-100 py-4 flex items-center justify-between gap-4 hover:bg-[#EEF4FF]/50 transition-colors px-2 rounded-lg group"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          {post.category && (
                            <span className="text-xs font-semibold text-[#FF6633] uppercase">
                              {post.category}
                            </span>
                          )}
                          <span className="text-base font-semibold text-[#1A2538] group-hover:text-[#0050B3] transition-colors line-clamp-1">
                            {post.title}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 flex-shrink-0">
                          <span className="text-sm font-medium text-[#0050B3] group-hover:text-[#FF6633] transition-colors inline-flex items-center gap-1">
                            Read
                            <ChevronRight className="w-4 h-4" />
                          </span>
                        </div>
                      </Link>
                    </li>
                  ))}
                </ul>
              </>
            )}
          </div>
        </section>

        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Improve Your Electrical Safety?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Our expert engineers are ready to help your Canadian facility meet
              CSA Z462 and Canadian Electrical Code requirements. Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/ca/contact/"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/ca/services/arc-flash-study/"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <CAFooter />
    </>
  );
}
