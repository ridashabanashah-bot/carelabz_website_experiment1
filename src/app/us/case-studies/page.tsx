import type { Metadata } from "next";
import Link from "next/link";
import { StickyNavbar } from "@/components/sticky-navbar";
import { getCaseStudies } from "@/lib/strapi-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Case Studies | Carelabs US",
    description:
      "Explore how Carelabs has helped clients across the US achieve safety compliance and operational excellence.",
  };
}

export default async function CaseStudiesPage() {
  const caseStudies = await getCaseStudies("us");

  return (
    <>
      <StickyNavbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-navy pt-32 pb-20 px-4">
          <div className="mx-auto max-w-7xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              Case Studies
            </h1>
            <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
              Real-world results from our partnerships. See how Carelabs has
              helped organizations across the US achieve safety compliance,
              reduce risk, and drive operational excellence.
            </p>
          </div>
        </section>

        {/* Case Studies Grid */}
        <section className="bg-offWhite py-20 px-4">
          <div className="mx-auto max-w-7xl">
            {caseStudies.length === 0 ? (
              <p className="text-center text-gray-500 text-lg py-12">
                No case studies available at this time. Check back soon.
              </p>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {caseStudies.map((study) => (
                  <article
                    key={study.id}
                    className="rounded-xl bg-white shadow-sm p-8 flex flex-col"
                  >
                    {/* Industry Tag */}
                    {study.industry && (
                      <span className="inline-block text-xs font-semibold uppercase tracking-wider text-orange-500 bg-orange-50 rounded-full px-3 py-1 mb-4 self-start">
                        {study.industry}
                      </span>
                    )}

                    {/* Title / Client */}
                    <h3 className="text-xl font-bold text-navy mb-2">
                      {study.title}
                    </h3>
                    {study.client && (
                      <p className="text-sm text-gray-500 mb-4">{study.client}</p>
                    )}

                    {/* Excerpt */}
                    {study.excerpt && (
                      <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                        {study.excerpt}
                      </p>
                    )}

                    {/* Results Preview — first 2 metrics */}
                    {study.results && study.results.length > 0 && (
                      <div className="flex gap-6 mb-6 border-t border-gray-100 pt-4">
                        {study.results.slice(0, 2).map((result, idx) => (
                          <div key={idx}>
                            <p className="text-2xl font-bold text-navy">
                              {result.value}
                            </p>
                            <p className="text-xs text-gray-500 uppercase tracking-wide">
                              {result.metric}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Read More Link */}
                    <Link
                      href={`/us/case-studies/${study.slug}`}
                      className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors mt-auto"
                    >
                      Read Case Study →
                    </Link>
                  </article>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-navy py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Ready to write your success story?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Contact our team to learn how Carelabs can help your organization
              achieve its safety and compliance goals.
            </p>
            <Link
              href="/us/contact"
              className="inline-flex items-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600"
            >
              Get in Touch
            </Link>
          </div>
        </section>

        {/* Footer */}
        <footer className="bg-slateCard py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
              <div className="md:col-span-2">
                <p className="text-white font-bold text-lg mb-2">Carelabs</p>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  Professional electrical safety testing, calibration, inspection,
                  and certification services across the United States.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Services</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/us/services" className="text-white/60 text-sm hover:text-white transition-colors">
                      All Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Company</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/us/about" className="text-white/60 text-sm hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/us/case-studies" className="text-white/60 text-sm hover:text-white transition-colors">
                      Case Studies
                    </Link>
                  </li>
                  <li>
                    <Link href="/us/contact" className="text-white/60 text-sm hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-white/40 text-sm text-center pt-8">
              © {new Date().getFullYear()} Carelabs. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
