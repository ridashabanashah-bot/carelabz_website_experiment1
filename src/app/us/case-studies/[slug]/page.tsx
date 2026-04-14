import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StickyNavbar } from "@/components/sticky-navbar";
import { getCaseStudy } from "@/lib/strapi-pages";

export const dynamic = "force-dynamic";

interface Props {
  params: { slug: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const study = await getCaseStudy("us", params.slug);
  if (!study) return { title: "Case Study Not Found | CareLabs US" };
  return {
    title: study.metaTitle ?? `${study.title} | CareLabs US`,
    description:
      study.metaDescription ??
      study.excerpt ??
      "Read this CareLabs case study.",
  };
}

export default async function CaseStudyPage({ params }: Props) {
  const study = await getCaseStudy("us", params.slug);

  if (!study) notFound();

  return (
    <>
      <StickyNavbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-navy pt-32 pb-20 px-4">
          <div className="mx-auto max-w-5xl">
            {/* Breadcrumb */}
            <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-sm text-white/50">
              <Link href="/us" className="hover:text-white transition-colors">
                Home
              </Link>
              <span>/</span>
              <Link href="/us/case-studies" className="hover:text-white transition-colors">
                Case Studies
              </Link>
              <span>/</span>
              <span className="text-white/80">{study.title}</span>
            </nav>

            {/* Industry Tag */}
            {study.industry && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-full px-3 py-1 mb-4">
                {study.industry}
              </span>
            )}

            {/* Title */}
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              {study.title}
            </h1>

            {/* Client */}
            {study.client && (
              <p className="text-white/60 text-lg">
                Client:{" "}
                <span className="text-white font-medium">{study.client}</span>
              </p>
            )}
          </div>
        </section>

        {/* Results Grid */}
        {study.results && study.results.length > 0 && (
          <section className="bg-white py-16 px-4">
            <div className="mx-auto max-w-5xl">
              <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {study.results.slice(0, 4).map((result, idx) => (
                  <div
                    key={idx}
                    className="bg-offWhite rounded-xl p-8 text-center"
                  >
                    <p className="text-4xl font-extrabold text-orange-500 mb-2">
                      {result.value}
                    </p>
                    <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-2">
                      {result.metric}
                    </p>
                    {result.description && (
                      <p className="text-xs text-gray-500 leading-relaxed">
                        {result.description}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}

        {/* Challenge Section */}
        {study.challenge && (
          <section className="bg-white py-16 px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                The Challenge
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">{study.challenge}</p>
            </div>
          </section>
        )}

        {/* Solution Section */}
        {study.solution && (
          <section className="bg-offWhite py-16 px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl md:text-3xl font-bold text-navy mb-6">
                Our Solution
              </h2>
              <p className="text-gray-600 text-lg leading-relaxed">{study.solution}</p>
            </div>
          </section>
        )}

        {/* Body Richtext */}
        {study.body && (
          <section className="bg-white py-16 px-4">
            <div className="mx-auto max-w-3xl">
              <article
                className="prose prose-lg prose-headings:text-navy prose-a:text-orange-500 hover:prose-a:text-orange-600 max-w-none"
                dangerouslySetInnerHTML={{ __html: study.body }}
              />
            </div>
          </section>
        )}

        {/* CTA Section */}
        <section className="bg-navy py-20 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="text-3xl font-bold text-white mb-4">
              {study.ctaText ?? "Ready to achieve similar results?"}
            </h2>
            <p className="text-white/70 mb-8">
              Contact our team to discuss how CareLabs can help your
              organization.
            </p>
            <Link
              href={study.ctaHref ?? "/us/contact"}
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
                <p className="text-white font-bold text-lg mb-2">CareLabs</p>
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
              © {new Date().getFullYear()} CareLabs. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
