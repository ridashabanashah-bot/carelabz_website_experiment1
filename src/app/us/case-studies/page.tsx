import type { Metadata } from "next";
import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import USFooter from "@/components/us-footer";
import { getCaseStudies, type CaseStudy } from "@/lib/strapi-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Case Studies | CareLabs US",
    description:
      "Explore how CareLabs has helped clients across the US achieve safety compliance and operational excellence.",
  };
}

function studyDate(cs: CaseStudy): string {
  return cs.publishedDate ?? cs.publishedAt ?? cs.createdAt;
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

export default async function CaseStudiesPage() {
  const allCaseStudies = await getCaseStudies("us");

  const sorted = [...allCaseStudies].sort(
    (a, b) =>
      new Date(studyDate(b)).getTime() - new Date(studyDate(a)).getTime()
  );

  const featured = sorted.slice(0, 3);
  const older = sorted.slice(3);

  return (
    <>
      <StickyNavbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-[#EEF4FF] pt-32 pb-20 px-4">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A2538] mb-6">
              Case Studies
            </h1>
            <p className="text-lg md:text-xl text-[#374151] max-w-2xl mx-auto">
              Real-world results from our partnerships. See how CareLabs has
              helped organizations across the US achieve safety compliance,
              reduce risk, and drive operational excellence.
            </p>
          </div>
        </section>

        {/* Case Studies */}
        <section className="bg-offWhite py-20 px-4">
          <div className="mx-auto max-w-7xl">
            {sorted.length === 0 && (
              <p className="text-center text-slate-500 py-20">
                No case studies yet. Check back soon.
              </p>
            )}

            {/* Featured 3 cards (with date) */}
            {featured.length > 0 && (
              <>
                <h2 className="text-3xl font-bold text-[#1A2538] mb-8">
                  Featured Case Studies
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {featured.map((study) => {
                    const date = studyDate(study);
                    return (
                      <article
                        key={study.id}
                        className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all border border-slate-100 flex flex-col"
                      >
                        {/* Top color band */}
                        <div className="h-2 bg-gradient-to-r from-[#0050B3] to-[#FF6633]" />

                        <div className="p-6 flex flex-col flex-1">
                          {/* Industry badge */}
                          {study.industry && (
                            <span className="inline-flex items-center gap-1.5 bg-[#EEF4FF] text-[#0050B3] text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-full mb-4 self-start">
                              {study.industry}
                            </span>
                          )}

                          {/* Title */}
                          <h3 className="text-lg font-bold text-[#1A2538] mb-3 line-clamp-2">
                            <Link
                              href={`/us/case-studies/${study.slug}/`}
                              className="hover:text-[#0050B3] transition-colors"
                            >
                              {study.title}
                            </Link>
                          </h3>

                          {/* Excerpt or challenge */}
                          {(study.excerpt || study.challenge) && (
                            <p className="text-sm text-[#374151] line-clamp-3 mb-4">
                              {study.excerpt || study.challenge}
                            </p>
                          )}

                          {/* Results metrics row — first 2 */}
                          {study.results && study.results.length > 0 && (
                            <div className="flex gap-3 mb-4">
                              {study.results.slice(0, 2).map((r, idx) => (
                                <div
                                  key={idx}
                                  className="bg-[#EEF4FF] rounded-lg px-3 py-2 text-center flex-1"
                                >
                                  <p className="text-lg font-bold text-[#0050B3]">
                                    {r.value}
                                  </p>
                                  <p className="text-xs text-[#374151]">
                                    {r.metric}
                                  </p>
                                </div>
                              ))}
                            </div>
                          )}

                          {/* Bottom row */}
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
                              href={`/us/case-studies/${study.slug}/`}
                              className="text-sm font-semibold text-[#FF6633] hover:text-[#0050B3] transition-colors ml-auto"
                              aria-label={`Read case study: ${study.title}`}
                            >
                              Read Case Study →
                            </Link>
                          </div>
                        </div>
                      </article>
                    );
                  })}
                </div>
              </>
            )}

            {/* More case studies list (no date) — only when >3 */}
            {older.length > 0 && (
              <>
                <h2 className="text-2xl font-bold text-[#1A2538] mb-6 mt-16">
                  More Case Studies
                </h2>
                <div className="border-t border-slate-200 mb-8" />
                <ul>
                  {older.map((study) => (
                    <li key={study.id}>
                      <Link
                        href={`/us/case-studies/${study.slug}/`}
                        className="border-b border-slate-100 py-4 flex items-center justify-between gap-4 hover:bg-[#EEF4FF]/50 transition-colors px-2 rounded-lg group"
                      >
                        <div className="flex flex-col gap-1 min-w-0">
                          {study.industry && (
                            <span className="text-xs font-semibold text-[#0050B3] uppercase mb-1">
                              {study.industry}
                            </span>
                          )}
                          <span className="text-base font-semibold text-[#1A2538] group-hover:text-[#0050B3] transition-colors line-clamp-1">
                            {study.title}
                          </span>
                          {study.client && (
                            <span className="text-sm text-[#64748B]">
                              {study.client}
                            </span>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
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

        {/* CTA Banner */}
        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to write your success story?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Contact our team to learn how CareLabs can help your organization
              achieve its safety and compliance goals.
            </p>
            <Link
              href="/us/contact/"
              className="inline-flex items-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Get in Touch
            </Link>
          </div>
        </section>
      </main>
      <USFooter />
    </>
  );
}
