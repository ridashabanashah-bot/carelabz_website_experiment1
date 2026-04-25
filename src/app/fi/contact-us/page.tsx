export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { NENavbar } from "@/components/ne-navbar";
import { NEFooter } from "@/components/ne-footer";
import { NEAnnouncementTicker } from "@/components/ne-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/strapi-pages";
import { getServicesByRegion } from "@/lib/strapi";
import { getCountryFromHeaders } from "@/lib/detect-country";
import {
  buildJsonLd,
  getRegionOrganizationSchema,
  getWebPageSchema,
  getBreadcrumbSchema,
} from "@/lib/jsonld";

const CC = "fi";
const config = COUNTRY_CONFIGS[CC];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage(CC);
  return {
    title:
      page?.metaTitle ??
      `Contact Carelabs ${config.countryName} | Get in Touch`,
    description:
      page?.metaDescription ??
      `Contact the Carelabs team for electrical safety testing, arc flash studies, and ${config.primaryStandard} compliance services across ${config.countryName}.`,
    alternates: {
      canonical: `https://carelabz.com/${CC}/contact-us/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/contact-us/`,
        "x-default": `https://carelabz.com/${CC}/contact-us/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `Contact Carelabs — Get a Free Consultation ${config.countryName}`,
      description:
        page?.metaDescription ??
        `Get in touch for a free consultation on electrical safety services in ${config.countryName}.`,
      url: `https://carelabz.com/${CC}/contact-us/`,
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `Contact Carelabs — Get a Free Consultation ${config.countryName}`,
      description:
        page?.metaDescription ??
        `Get in touch for a free consultation on electrical safety services in ${config.countryName}.`,
    },
  };
}

export default async function ContactPage() {
  const headersList = headers();
  const iso2 = getCountryFromHeaders(headersList, config.dialCodeCountryIso2);

  const [page, services] = await Promise.all([
    getContactPage(CC),
    getServicesByRegion(CC),
  ]);

  const serviceOptions = services.map((s) => ({
    title: s.title,
    slug: s.slug,
  }));

  const subtext =
    page?.heroSubtext ??
    `Have a question or ready to start a project? Our ${config.countryName} team is here to help.`;

  const resolvedPhone = page?.phone ?? config.phone;
  const resolvedEmail = page?.email ?? config.email;
  const resolvedAddress = page?.address ?? config.address;

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: config.countryName,
      countryIso2: config.dialCodeCountryIso2,
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com/${CC}/contact-us/`,
      page?.metaTitle ??
        `Contact Carelabs — Get a Free Consultation ${config.countryName}`,
      page?.metaDescription ??
        `Get in touch for a free consultation on electrical safety services in ${config.countryName}.`,
      config.hreflang
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "Contact", url: `https://carelabz.com/${CC}/contact-us/` },
    ]),
  ]);

  return (
    <>
      <NEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <NENavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* ---------------- HERO — left-aligned, shorter ---------------- */}
        <section className="relative bg-[#1A3650] pt-32 pb-16 lg:pt-40 lg:pb-20 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "60px 60px",
            }}
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12">
            <div className="max-w-3xl">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-6 block">
                Contact
              </span>
              <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-6xl uppercase text-white leading-[0.95]">
                Get in<br />
                <span className="font-ne-accent italic font-normal normal-case text-orange-500">
                  Touch.
                </span>
              </h1>
              <p className="font-ne-body text-lg text-white/50 mt-8 max-w-2xl leading-relaxed">
                {subtext}
              </p>
            </div>
          </div>
        </section>

        {/* ---------------- FORM + DETAILS ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12 grid lg:grid-cols-2 gap-16">
            {/* Form (clean, no card wrapper) */}
            <div>
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                Send a message
              </span>
              <h2 className="font-ne-display font-bold text-2xl md:text-3xl uppercase text-[#1A3650] leading-tight">
                {page?.formHeading ?? "Tell us about your project"}
              </h2>
              <p className="font-ne-body text-sm text-gray-600 mt-3 mb-8 leading-relaxed">
                {page?.formSubtext ??
                  "Fill out the form and our team will get back to you within one business day."}
              </p>
              <ContactForm
                services={serviceOptions}
                defaultIso2={iso2}
                countryName={config.countryName}
              />
            </div>

            {/* Details list — flat, no card wrapper */}
            <div className="lg:pl-8">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-orange-500/60 mb-3 block">
                Reach Us Directly
              </span>
              <h2 className="font-ne-display font-bold text-2xl md:text-3xl uppercase text-[#1A3650] leading-tight">
                Our {config.countryName} Team
              </h2>
              <ul className="mt-8">
                <li className="flex gap-4 items-start py-5 border-b border-[#1A3650]/10">
                  <Phone className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40 mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
                      className="font-ne-body text-[#1A3650] hover:text-orange-500 transition-colors"
                    >
                      {resolvedPhone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-start py-5 border-b border-[#1A3650]/10">
                  <Mail className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40 mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${resolvedEmail}`}
                      className="font-ne-body text-[#1A3650] hover:text-orange-500 transition-colors"
                    >
                      {resolvedEmail}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-start py-5 border-b border-[#1A3650]/10">
                  <MapPin className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                  <div>
                    <p className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40 mb-1">
                      Address
                    </p>
                    <p className="font-ne-body text-[#1A3650] whitespace-pre-line">
                      {resolvedAddress}
                    </p>
                  </div>
                </li>
                {page?.officeHours && (
                  <li className="flex gap-4 items-start py-5 border-b border-[#1A3650]/10">
                    <Clock className="w-5 h-5 text-orange-500 mt-1 shrink-0" />
                    <div>
                      <p className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#1A3650]/40 mb-1">
                        Office Hours
                      </p>
                      <p className="font-ne-body text-[#1A3650] whitespace-pre-line">
                        {page.officeHours}
                      </p>
                    </div>
                  </li>
                )}
              </ul>

              {page?.mapEmbedUrl && (
                <div className="overflow-hidden border border-[#1A3650]/10 mt-8">
                  <iframe
                    src={page.mapEmbedUrl}
                    width="100%"
                    height="240"
                    style={{ border: 0 }}
                    allowFullScreen
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    title={`Carelabs ${config.countryName} office location`}
                  />
                </div>
              )}
            </div>
          </div>
        </section>

        {/* ---------------- FINAL CTA — single-line ---------------- */}
        <section className="bg-[#1A3650] py-16 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12 text-center">
            <h2 className="font-ne-display font-black text-2xl md:text-3xl uppercase text-white leading-tight">
              Need urgent assistance?
            </h2>
            <Link
              href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 mt-4 font-ne-nav text-sm uppercase tracking-[0.18em] text-orange-500 hover:text-orange-400 transition-colors"
            >
              <Phone className="w-4 h-4" />
              Call our {config.countryName} team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <NEFooter config={config} />
    </>
  );
}
