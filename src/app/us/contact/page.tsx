import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Phone, Mail, MapPin } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import USFooter from "@/components/us-footer";
import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/strapi-pages";
import { getServicesByRegion } from "@/lib/strapi";
import {
  getCountryFromHeaders,
  getCountryName,
} from "@/lib/detect-country";
import { buildJsonLd, getOrganizationSchema, getWebPageSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage("us");
  return {
    title: page?.metaTitle ?? "Contact Carelabs | Get in Touch",
    description:
      page?.metaDescription ??
      "Contact the Carelabs team for electrical safety testing, calibration, and compliance services across the United States.",
    alternates: {
      canonical: "https://carelabz.com/us/contact/",
      languages: {
        "en-US": "https://carelabz.com/us/contact/",
        "x-default": "https://carelabz.com/us/contact/",
      },
    },
    openGraph: {
      title: page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation USA",
      description:
        page?.metaDescription ?? "Get in touch for a free consultation on electrical safety services.",
      url: "https://carelabz.com/us/contact/",
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation USA",
      description:
        page?.metaDescription ?? "Get in touch for a free consultation on electrical safety services.",
    },
  };
}

export default async function ContactPage() {
  const headersList = headers();
  const iso2 = getCountryFromHeaders(headersList);
  const countryName = getCountryName(iso2);

  const [page, services] = await Promise.all([
    getContactPage("us"),
    getServicesByRegion("us"),
  ]);

  const serviceOptions = services.map((s) => ({
    title: s.title,
    slug: s.slug,
  }));

  const headline = page?.heroHeadline ?? "Get in Touch";
  const subtext =
    page?.heroSubtext ??
    "Have a question or ready to start a project? Our team is here to help.";

  const jsonLd = buildJsonLd([
    getOrganizationSchema(),
    getWebPageSchema(
      "https://carelabz.com/us/contact/",
      page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation USA",
      page?.metaDescription ?? "Get in touch for a free consultation on electrical safety services."
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/us/" },
      { name: "Contact", url: "https://carelabz.com/us/contact/" },
    ]),
  ]);

  return (
    <>
      <StickyNavbar />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-[#0050B3] pt-32 pb-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-6">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-white/80 max-w-2xl mx-auto">
              {subtext}
            </p>
            <span className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 text-sm text-white mt-6 border border-white/30">
              <MapPin className="w-4 h-4" />
              Showing services available in {countryName}
            </span>
          </div>
        </section>

        {/* Two-column Contact Layout */}
        <section className="bg-[#EEF4FF] py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Contact Form */}
              <div className="bg-white rounded-2xl shadow-sm p-8 lg:p-10">
                <h2 className="text-2xl font-bold text-[#1A2538] mb-2">
                  {page?.formHeading ?? "Send Us a Message"}
                </h2>
                <p className="text-[#374151] mb-6">
                  {page?.formSubtext ??
                    "Fill in the form below and we will get back to you within one business day."}
                </p>
                <ContactForm
                  services={serviceOptions}
                  defaultIso2={iso2}
                  countryName={countryName}
                />
              </div>

              {/* Right: Contact Details */}
              <div className="space-y-8">

                {page?.email && (
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Mail className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">
                        Email
                      </p>
                      <a
                        href={`mailto:${page.email}`}
                        className="text-gray-700 hover:text-orange-500 transition-colors"
                      >
                        {page.email}
                      </a>
                    </div>
                  </div>
                )}



                {/* Fallback contact details when no Strapi data */}

                {/* Map Embed */}
                {page?.mapEmbedUrl && (
                  <div className="rounded-xl overflow-hidden border border-gray-200 mt-4">
                    <iframe
                      src={page.mapEmbedUrl}
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Carelabs Office Location"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need urgent assistance?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Our team is available to respond to emergency compliance and safety
              testing requests.
            </p>
            <Link
              href="tel:+18000000000"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Link>
          </div>
        </section>

      </main>
      <USFooter />
    </>
  );
}
