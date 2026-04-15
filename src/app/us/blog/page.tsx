import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import USFooter from "@/components/us-footer";
import { getBlogPosts } from "@/lib/strapi-blog";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electrical Safety Blog | CareLabs USA",
  description:
    "Expert insights on electrical safety, arc flash studies, power system analysis, and compliance for US facilities. Stay informed with CareLabs.",
};

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

export default async function BlogIndexPage() {
  const posts = await getBlogPosts("us");

  return (
    <>
      <StickyNavbar />

      <main id="main-content">
        {/* Hero */}
        <section className="bg-[#EEF4FF] pt-32 pb-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <p className="text-orange-500 text-sm font-bold uppercase tracking-widest mb-4">
              Insights &amp; Resources
            </p>
            <h1 className="text-4xl sm:text-5xl font-bold text-[#1A2538] mb-6">
              Insights &amp; Resources
            </h1>
            <p className="text-lg text-[#374151] max-w-2xl mx-auto">
              Stay ahead of electrical safety regulations, compliance standards,
              and best practices. Expert knowledge from the CareLabs engineering
              team to help US facilities stay safe and compliant.
            </p>
          </div>
        </section>

        {/* Blog Grid */}
        <section className="bg-offWhite py-20 px-4">
          <div className="mx-auto max-w-7xl">
            {posts.length === 0 ? (
              <p className="text-center text-slate-500 py-20">
                No articles found. Check back soon.
              </p>
            ) : (
              <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="rounded-xl bg-white shadow-sm overflow-hidden hover:shadow-lg transition-shadow duration-300 flex flex-col"
                  >
                    {/* Image */}
                    <Link
                      href={`/us/blog/${post.slug}/`}
                      className="block relative aspect-[16/9] overflow-hidden bg-slate-100"
                      tabIndex={-1}
                      aria-hidden="true"
                    >
                      {post.heroImage && post.heroImage.startsWith("http") ? (
                        <Image
                          src={post.heroImage}
                          alt={post.heroImageAlt ?? post.title}
                          fill
                          className="object-cover transition-transform duration-500 hover:scale-105"
                          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                      ) : (
                        <div className="absolute inset-0 bg-gradient-to-br from-[#0050B3] to-[#1A2538] flex items-center justify-center">
                          <span className="text-white/20 text-6xl font-bold">
                            CL
                          </span>
                        </div>
                      )}
                    </Link>

                    {/* Content */}
                    <div className="p-6 flex flex-col flex-1">
                      {post.category && (
                        <span className="text-xs font-bold text-orange-500 uppercase tracking-wider mb-2">
                          {post.category}
                        </span>
                      )}
                      <h3 className="text-lg font-bold text-navy mb-3 leading-snug">
                        <Link
                          href={`/us/blog/${post.slug}/`}
                          className="hover:text-orange-500 transition-colors"
                        >
                          {post.title}
                        </Link>
                      </h3>
                      {post.excerpt && (
                        <p className="text-slate-600 text-sm leading-relaxed mb-4 flex-1">
                          {post.excerpt}
                        </p>
                      )}
                      <div className="flex items-center justify-between mt-auto pt-4 border-t border-slate-100">
                        {post.publishedDate && (
                          <time
                            dateTime={post.publishedDate}
                            className="text-xs text-slate-400"
                          >
                            {formatDate(post.publishedDate)}
                          </time>
                        )}
                        <Link
                          href={`/us/blog/${post.slug}/`}
                          className="inline-flex items-center gap-1 text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors ml-auto"
                          aria-label={`Read more about ${post.title}`}
                        >
                          Read more
                          <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to Improve Your Electrical Safety?
            </h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Our expert engineers are ready to help your US facility meet
              NFPA 70E and OSHA requirements. Get a free consultation today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white hover:bg-orange-600 transition-colors"
              >
                Get a Free Quote
              </Link>
              <Link
                href="/us/services/study-analysis/arc-flash-study/"
                className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors"
              >
                Our Services
              </Link>
            </div>
          </div>
        </section>
      </main>

      <USFooter />
    </>
  );
}
