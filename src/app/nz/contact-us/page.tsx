import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Phone, Mail, MapPin } from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["nz"];
import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/strapi-pages";
import { getServicesByRegion } from "@/lib/strapi";
import { getCountryFromHeaders } from "@/lib/detect-country";
import { buildJsonLd, getRegionOrganizationSchema, getWebPageSchema, getBreadcrumbSchema } from "@/lib/jsonld";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage("nz");
  return {
    title: page?.metaTitle ?? "Contact Carelabs New Zealand | Get in Touch",
    description:
      page?.metaDescription ??
      "Contact the Carelabs team for electrical safety testing, arc flash studies, and AS/NZS 3000 compliance services across New Zealand.",
    alternates: {
      canonical: "https://carelabz.com/nz/contact-us/",
      languages: {
        "en-NZ": "https://carelabz.com/nz/contact-us/",
        "x-default": "https://carelabz.com/nz/contact-us/",
      },
    },
    openGraph: {
      title: page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation New Zealand",
      description:
        page?.metaDescription ?? "Get in touch for a free consultation on electrical safety services in New Zealand.",
      url: "https://carelabz.com/nz/contact-us/",
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation New Zealand",
      description:
        page?.metaDescription ?? "Get in touch for a free consultation on electrical safety services in New Zealand.",
    },
  };
}

export default async function NZContactPage() {
  const headersList = headers();
  const iso2 = getCountryFromHeaders(headersList, "NZ");
  // On the New Zealand contact page the banner must always say New Zealand
  // regardless of the visitor's IP — the services ARE in New Zealand.
  const countryName = "New Zealand";

  const [page, services] = await Promise.all([
    getContactPage("nz"),
    getServicesByRegion("nz"),
  ]);

  const serviceOptions = services.map((s) => ({
    title: s.title,
    slug: s.slug,
  }));

  const headline = page?.heroHeadline ?? "Get in Touch";
  const subtext =
    page?.heroSubtext ??
    "Have a question or ready to start a project? Our New Zealand team is here to help.";

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({ cc: "nz", countryName: "New Zealand", countryIso2: "NZ", phone: config.phone, email: config.email, addressLocality: config.address }),
    getWebPageSchema(
      "https://carelabz.com/nz/contact-us/",
      page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation New Zealand",
      page?.metaDescription ?? "Get in touch for a free consultation on electrical safety services in New Zealand.",
      "en-NZ"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/nz/" },
      { name: "Contact", url: "https://carelabz.com/nz/contact-us/" },
    ]),
  ]);

  return (
    <>
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
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

        <section className="bg-[#EEF4FF] py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
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
                      title="Carelabs New Zealand Office Location"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
              Need urgent assistance?
            </h2>
            <p className="text-white/70 text-lg mb-8">
              Our New Zealand team is available to respond to emergency compliance and
              safety testing requests.
            </p>
            <Link
              href="tel:+18004567890"
              className="inline-flex items-center gap-2 rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white transition-colors hover:bg-orange-600"
            >
              <Phone className="w-4 h-4" />
              Call Now
            </Link>
          </div>
        </section>
      </main>
      <RegionFooter config={config} />
    </>
  );
}
