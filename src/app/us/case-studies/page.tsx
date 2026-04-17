import type { Metadata } from "next";
import Link from "next/link";
import { FolderOpen } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import USFooter from "@/components/us-footer";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "Case Studies | CareLabs US",
    description:
      "Explore how CareLabs helps clients across the US achieve electrical safety compliance and operational excellence.",
    alternates: {
      canonical: "https://carelabz.com/us/case-studies/",
    },
  };
}

export default function CaseStudiesPage() {
  return (
    <>
      <StickyNavbar />
      <main id="main-content">
        {/* Hero */}
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

        {/* Empty state */}
        <section className="bg-[#EEF4FF] py-24 px-4">
          <div className="mx-auto max-w-3xl text-center">
            <FolderOpen className="w-16 h-16 text-[#0050B3]/30 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-[#1A2538] mb-4">
              Case Studies Coming Soon
            </h2>
            <p className="text-[#374151] max-w-xl mx-auto mb-8">
              We are currently documenting our project successes. Check back
              soon to read about how CareLabs has helped facilities across the
              USA achieve electrical safety compliance.
            </p>
            <Link
              href="/us/contact/"
              className="bg-[#FF6633] text-white rounded-[50px] h-[50px] px-8 font-medium hover:scale-105 transition-all inline-flex items-center justify-center"
            >
              Get in Touch
            </Link>
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
