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

const CC = "uk";
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
        {/* ---------------- COMPACT STATEMENT HERO ---------------- */}
        <section className="relative bg-[#1A3650] overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.03]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)",
              backgroundSize: "80px 80px",
            }}
          />
          <div className="relative max-w-[1200px] mx-auto px-6 lg:px-12 pt-32 pb-16 lg:pt-40 lg:pb-24">
            <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 font-semibold mb-8 block">
              Contact
            </span>
            <h1 className="font-ne-display font-black text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
              Get in<br />
              <span className="font-ne-accent italic font-normal text-[#F97316]">
                Touch.
              </span>
            </h1>
            <p className="font-ne-body text-base text-white/40 mt-10 max-w-2xl leading-relaxed">
              {subtext}
            </p>
          </div>
        </section>

        {/* ---------------- TWO-COLUMN: contact info + form ---------------- */}
        <section className="bg-[#F9F7F3] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12 grid lg:grid-cols-5 gap-16">
            {/* Left — contact info, simple text blocks */}
            <div className="lg:col-span-2">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-4 block">
                Reach Us Directly
              </span>
              <h2 className="font-ne-display font-black text-3xl lg:text-4xl text-[#1A3650] uppercase leading-[0.95] mb-12">
                Our {config.countryName} Team
              </h2>

              <div className="space-y-10">
                <div>
                  <span className="inline-flex items-center gap-2 font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-2">
                    <Phone className="w-3.5 h-3.5" /> Phone
                  </span>
                  <a
                    href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
                    className="block font-ne-display font-bold text-xl text-[#1A3650] uppercase hover:text-[#F97316] transition-colors"
                  >
                    {resolvedPhone}
                  </a>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-2">
                    <Mail className="w-3.5 h-3.5" /> Email
                  </span>
                  <a
                    href={`mailto:${resolvedEmail}`}
                    className="block font-ne-display font-bold text-xl text-[#1A3650] uppercase hover:text-[#F97316] transition-colors break-all"
                  >
                    {resolvedEmail}
                  </a>
                </div>
                <div>
                  <span className="inline-flex items-center gap-2 font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-2">
                    <MapPin className="w-3.5 h-3.5" /> Address
                  </span>
                  <p className="font-ne-display font-bold text-xl text-[#1A3650] uppercase whitespace-pre-line">
                    {resolvedAddress}
                  </p>
                </div>
                {page?.officeHours && (
                  <div>
                    <span className="inline-flex items-center gap-2 font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-2">
                      <Clock className="w-3.5 h-3.5" /> Office Hours
                    </span>
                    <p className="font-ne-display font-bold text-xl text-[#1A3650] uppercase whitespace-pre-line">
                      {page.officeHours}
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Right — form */}
            <div className="lg:col-span-3 lg:pl-8">
              <span className="font-ne-nav text-xs uppercase tracking-[0.18em] text-[#F97316]/70 mb-4 block">
                Send a message
              </span>
              <h2 className="font-ne-display font-black text-3xl lg:text-4xl text-[#1A3650] uppercase leading-[0.95] mb-4">
                {page?.formHeading ?? "Tell us about your project"}
              </h2>
              <p className="font-ne-body text-sm text-[#1A3650]/60 mb-8 leading-relaxed max-w-lg">
                {page?.formSubtext ??
                  "Fill out the form and our team will get back to you within one business day."}
              </p>
              <ContactForm
                services={serviceOptions}
                defaultIso2={iso2}
                countryName={config.countryName}
              />
            </div>
          </div>
        </section>

        {page?.mapEmbedUrl && (
          <section className="bg-[#F0EBE1] px-6 lg:px-12 py-12">
            <div className="max-w-[1400px] mx-auto">
              <iframe
                src={page.mapEmbedUrl}
                width="100%"
                height="320"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title={`Carelabs ${config.countryName} office location`}
              />
            </div>
          </section>
        )}

        {/* ---------------- URGENT-CALL BAND (orange) ---------------- */}
        <section className="bg-[#F97316] py-12 px-6">
          <div className="max-w-[1400px] mx-auto lg:px-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
            <p className="font-ne-display font-black text-2xl md:text-3xl text-white uppercase leading-tight tracking-tight">
              Need urgent assistance?
            </p>
            <Link
              href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
              className="inline-flex items-center gap-2 bg-[#1A3650] hover:bg-[#243E54] text-white font-ne-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors shrink-0"
            >
              <Phone className="w-4 h-4" />
              Call our team
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <NEFooter config={config} />
    </>
  );
}
