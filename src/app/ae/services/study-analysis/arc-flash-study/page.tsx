import { Metadata } from "next";
import { JsonLd } from "@/components/JsonLd";

const PAGE_URL =
  "https://carelabz.com/ae/services/study-analysis/arc-flash-study";

const TITLE = "Arc Flash Study and Analysis Service in Dubai UAE";
const META_TITLE = "Arc Flash Study Dubai UAE | Carelabz";
const META_DESCRIPTION =
  "Expert arc flash study and analysis services in Dubai UAE. ETAP-based assessments, hazard analysis and compliance for industrial facilities.";

const BODY_HTML = `
<h2>Comprehensive Arc Flash Study Services in Dubai, UAE</h2>
<p>
  CareLAbz provides professional arc flash study and analysis services for
  industrial and commercial facilities across Dubai and the wider UAE. Our
  engineering team uses industry-leading <strong>ETAP software</strong> to
  model your electrical power system, calculate incident energy levels at
  every working point, and deliver actionable recommendations that protect
  your workforce and assets.
</p>

<h2>Why Your Facility Needs an Arc Flash Hazard Analysis</h2>
<p>
  An arc flash event can release temperatures exceeding 19,000 °C and
  generate blast pressures capable of causing severe burns, hearing damage,
  and fatalities. Regulatory bodies and local authorities — including
  <strong>DEWA (Dubai Electricity and Water Authority)</strong> — increasingly
  require facility owners to demonstrate that electrical hazards have been
  assessed and mitigated. A properly conducted arc flash study identifies
  these hazards before an incident occurs.
</p>

<h2>Our Arc Flash Study Methodology</h2>
<p>
  Every study we perform follows the rigorous framework established by
  <strong>IEEE 1584 (Guide for Performing Arc-Flash Hazard Calculations)</strong>
  and <strong>NFPA 70E (Standard for Electrical Safety in the Workplace)</strong>.
  Our process includes:
</p>
<ul>
  <li>On-site data collection of switchgear, panel boards, transformers, and protective devices</li>
  <li>Single-line diagram verification and power system modelling in ETAP</li>
  <li>Short-circuit analysis and protective device coordination study</li>
  <li>Incident energy calculations at each equipment location</li>
  <li>Arc flash hazard labels for every assessed panel and switchgear</li>
  <li>Detailed engineering report with PPE category recommendations</li>
  <li>Remediation guidance to reduce incident energy where possible</li>
</ul>

<h2>DEWA Compliance and International Standards</h2>
<p>
  Our studies are fully aligned with <strong>DEWA regulations</strong> and
  international standards including IEEE 1584, NFPA 70E, and
  <strong>IEC 61482</strong>. We ensure every deliverable meets the
  documentation requirements of local authorities and insurers, giving you
  complete confidence during audits and inspections.
</p>

<h2>Industries We Serve in the UAE</h2>
<p>
  Arc flash hazards exist in any facility with medium- or low-voltage
  electrical distribution. Our clients span a wide range of sectors:
</p>
<ul>
  <li>Oil and gas refineries and petrochemical plants</li>
  <li>Manufacturing and industrial facilities</li>
  <li>Data centres and telecommunications infrastructure</li>
  <li>Hospitals, clinics, and healthcare campuses</li>
  <li>Hotels, resorts, and commercial buildings</li>
  <li>District cooling plants and utility substations</li>
</ul>

<h2>Get Started with a Free Consultation</h2>
<p>
  Whether you need a first-time arc flash study or an update to reflect
  recent modifications to your electrical system, CareLAbz is ready to help.
  Contact our Dubai office today for a <strong>free consultation</strong> and
  a tailored proposal for your facility.
</p>
`;

const FAQS = [
  {
    question: "What is an arc flash study and why is it required in the UAE?",
    answer:
      "An arc flash study is an engineering analysis that calculates the incident energy available at each point in an electrical system where workers may be exposed. It determines arc flash boundaries, hazard risk categories, and required PPE levels. In the UAE, DEWA regulations and international standards such as NFPA 70E and IEEE 1584 require facility owners to assess and mitigate arc flash hazards to protect personnel and ensure regulatory compliance.",
  },
  {
    question: "How long does an arc flash study take in Dubai?",
    answer:
      "A typical arc flash study takes between 2 and 6 weeks depending on the size and complexity of the electrical system. The timeline includes on-site data collection, power system modelling in ETAP software, short-circuit and coordination analysis, incident energy calculations, and final report preparation. Larger facilities with multiple substations may require additional time.",
  },
  {
    question: "What does an arc flash study include?",
    answer:
      "A complete arc flash study includes on-site data collection of all electrical equipment, single-line diagram verification, short-circuit analysis, protective device coordination study, incident energy calculations at every working point, arc flash hazard labels for panels and switchgear, a detailed engineering report with PPE recommendations, and remediation guidance to reduce incident energy levels where possible.",
  },
  {
    question: "How much does an arc flash study cost in the UAE?",
    answer:
      "The cost of an arc flash study depends on the number of panels, switchgear, and substations in your facility, as well as the complexity of the electrical distribution system. CareLAbz provides custom quotes tailored to each project. Contact us for a free consultation and we will assess your requirements and provide a detailed proposal at no obligation.",
  },
  {
    question: "Which industries need arc flash studies in Dubai?",
    answer:
      "Arc flash studies are essential for any facility with medium- or low-voltage electrical distribution. Key industries include oil and gas, manufacturing, data centres, hospitals and healthcare facilities, hotels and hospitality, commercial buildings, district cooling plants, and utility substations. Any workplace where personnel interact with energised electrical equipment should have an up-to-date arc flash study.",
  },
  {
    question:
      "What standards does Carelabz follow for arc flash studies in UAE?",
    answer:
      "CareLAbz follows internationally recognised standards including IEEE 1584 (Guide for Performing Arc-Flash Hazard Calculations), NFPA 70E (Standard for Electrical Safety in the Workplace), and IEC 61482 for protective clothing against thermal hazards of an electric arc. All studies also comply with DEWA requirements and local authority regulations applicable in Dubai and the wider UAE.",
  },
];

export function generateMetadata(): Metadata {
  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords: [
      "arc flash study Dubai",
      "arc flash analysis UAE",
      "ETAP arc flash",
      "IEEE 1584 UAE",
      "arc flash hazard analysis",
      "NFPA 70E Dubai",
    ],
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      url: PAGE_URL,
      siteName: "CareLAbz",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Sub-components                                                     */
/* ------------------------------------------------------------------ */

function Navbar() {
  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[#0a1628]">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex items-center justify-between h-16">
        <a href="/" className="text-white text-xl font-bold tracking-wide">
          CareLAbz
        </a>
        <a
          href="#contact"
          className="hidden sm:inline-block rounded-md bg-white px-4 py-2 text-sm font-semibold text-[#0a1628] transition hover:bg-gray-200"
        >
          Contact Us
        </a>
      </div>
    </nav>
  );
}

function HeroSection() {
  return (
    <section className="bg-[#0a1628] pt-28 pb-16 sm:pt-32 sm:pb-20">
      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6">
          {TITLE}
        </h1>
        <p className="text-base sm:text-lg text-gray-300 max-w-2xl mx-auto mb-8">
          {META_DESCRIPTION}
        </p>
        <a
          href="#contact"
          className="inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#0a1628] shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
        >
          Get Free Quote
        </a>
      </div>
    </section>
  );
}

const TRUST_BADGES = [
  { icon: "\u2705", label: "DEWA Compliant" },
  { icon: "\ud83d\udcd0", label: "IEEE 1584" },
  { icon: "\u26a1", label: "NFPA 70E" },
  { icon: "\ud83d\udda5\ufe0f", label: "ETAP Software" },
];

function TrustBadges() {
  return (
    <section className="bg-gray-50 py-8">
      <div className="mx-auto max-w-5xl px-4 grid grid-cols-2 sm:grid-cols-4 gap-4">
        {TRUST_BADGES.map((badge) => (
          <div
            key={badge.label}
            className="flex flex-col items-center justify-center rounded-xl bg-white p-4 shadow-sm border border-gray-100 text-center"
          >
            <span className="text-3xl mb-2" aria-hidden="true">
              {badge.icon}
            </span>
            <span className="text-sm font-semibold text-[#0a1628]">
              {badge.label}
            </span>
          </div>
        ))}
      </div>
    </section>
  );
}

function BodyContent() {
  return (
    <section className="bg-white py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <div
          className="prose prose-lg max-w-none prose-headings:text-[#0a1628] prose-headings:font-bold prose-p:text-gray-700 prose-strong:text-[#0a1628] prose-li:text-gray-700 prose-ul:my-4 prose-li:my-1"
          dangerouslySetInnerHTML={{ __html: BODY_HTML }}
        />
      </div>
    </section>
  );
}

function FaqAccordion({
  faqs,
}: {
  faqs: { question: string; answer: string }[];
}) {
  if (!faqs || faqs.length === 0) return null;

  return (
    <section className="bg-gray-50 py-12 sm:py-16">
      <div className="mx-auto max-w-4xl px-4">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#0a1628] mb-8 text-center">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <details
              key={index}
              className="group rounded-lg border border-gray-200 bg-white shadow-sm transition-shadow hover:shadow-md"
            >
              <summary className="flex cursor-pointer items-center justify-between p-5 font-medium text-[#0a1628] hover:bg-gray-50 rounded-lg select-none">
                <span className="pr-4">{faq.question}</span>
                <span className="ml-2 shrink-0 text-gray-400 transition-transform group-open:rotate-180">
                  &#9660;
                </span>
              </summary>
              <div className="px-5 pb-5 text-gray-600 leading-relaxed">
                {faq.answer}
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContactCta() {
  return (
    <section id="contact" className="bg-[#0a1628] py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-2xl sm:text-3xl font-bold text-white mb-4">
          Ready to Get Started?
        </h2>
        <p className="text-gray-300 mb-8 max-w-xl mx-auto">
          Contact our Dubai office today for a free consultation and a tailored
          arc flash study proposal for your facility.
        </p>
        <a
          href="mailto:info@carelabz.com"
          className="inline-block rounded-lg bg-white px-8 py-3 text-base font-semibold text-[#0a1628] shadow-lg transition hover:bg-gray-100 hover:shadow-xl"
        >
          Get Free Quote
        </a>
      </div>
    </section>
  );
}

function Footer() {
  return (
    <footer className="bg-[#0a1628] border-t border-white/10 py-6">
      <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-400">
        <p>&copy; {new Date().getFullYear()} CareLAbz — Electrical Safety Services. All rights reserved.</p>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page                                                               */
/* ------------------------------------------------------------------ */

export default function ArcFlashStudyPage() {
  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: TITLE,
    description: META_DESCRIPTION,
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
    mainEntity: FAQS.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CareLAbz",
    url: "https://carelabz.com",
    telephone: "+971-XXX-XXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://carelabz.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://carelabz.com/ae/services",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Study & Analysis",
        item: "https://carelabz.com/ae/services/study-analysis",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Arc Flash Study",
        item: PAGE_URL,
      },
    ],
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <Navbar />

      <main>
        <HeroSection />
        <TrustBadges />
        <BodyContent />
        <FaqAccordion faqs={FAQS} />
        <ContactCta />
      </main>

      <Footer />
    </>
  );
}
