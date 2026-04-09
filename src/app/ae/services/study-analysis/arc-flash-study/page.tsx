import { Metadata } from "next";
import { getServicePageBySlug } from "@/lib/strapi";
import { notFound } from "next/navigation";
import { JsonLd } from "@/components/JsonLd";

// Force dynamic rendering — Strapi is not available at build time on Vercel
export const dynamic = "force-dynamic";

const PAGE_URL = "https://carelabz.com/ae/services/study-analysis/arc-flash-study";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getServicePageBySlug("arc-flash-study");

  if (!page) {
    return { title: "Arc Flash Study & Analysis" };
  }

  return {
    title: page.metaTitle,
    description: page.metaDescription,
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title: page.metaTitle,
      description: page.metaDescription,
      url: PAGE_URL,
      siteName: "CareLAbz",
      type: "website",
    },
  };
}

function FaqAccordion({ faqs }: { faqs: { question: string; answer: string }[] }) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="mt-12">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">
        Frequently Asked Questions
      </h2>
      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <details
            key={index}
            className="group border border-gray-200 rounded-lg"
          >
            <summary className="flex cursor-pointer items-center justify-between p-4 font-medium text-gray-900 hover:bg-gray-50">
              {faq.question}
              <span className="ml-2 shrink-0 transition-transform group-open:rotate-180">
                ▼
              </span>
            </summary>
            <div className="px-4 pb-4 text-gray-700">
              {faq.answer}
            </div>
          </details>
        ))}
      </div>
    </section>
  );
}

export default async function ArcFlashStudyPage() {
  const page = await getServicePageBySlug("arc-flash-study");

  if (!page) {
    notFound();
  }

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: page.title,
    description: page.metaDescription,
    url: PAGE_URL,
    provider: {
      "@type": "Organization",
      name: "CareLAbz",
      url: "https://carelabz.com",
    },
    areaServed: {
      "@type": "Place",
      name: "Dubai, UAE",
    },
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: page.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-3xl px-4 py-12">
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />

      <h1 className="text-4xl font-bold text-gray-900 mb-8">
        {page.title}
      </h1>

      <div
        className="prose prose-lg max-w-none text-gray-700"
        dangerouslySetInnerHTML={{ __html: page.body }}
      />

      <FaqAccordion faqs={page.faqs} />
    </main>
  );
}
