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

const CC = "ie";
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
        {/* ---------------- HERO ---------------- */}
        <section className="relative bg-[#0B1A2F] pt-36 pb-24 px-6 overflow-hidden">
          <div
            className="absolute inset-0 opacity-[0.04]"
            aria-hidden="true"
            style={{
              backgroundImage:
                "radial-gradient(circle, #ffffff 1px, transparent 1px)",
              backgroundSize: "24px 24px",
            }}
          />
          <div className="relative max-w-4xl mx-auto text-center">
            <span className="font-condensed text-xs uppercase tracking-[0.3em] text-orange-500 font-semibold mb-6 block">
              Contact
            </span>
            <h1 className="font-condensed font-extrabold text-5xl md:text-6xl lg:text-7xl uppercase text-white leading-[0.95] tracking-tight">
              Get in
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Touch.
              </span>
            </h1>
            <p className="font-body text-lg md:text-xl text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              {subtext}
            </p>
          </div>
        </section>

        {/* ---------------- FORM + DETAILS ---------------- */}
        <section className="bg-[#F8FAFC] py-20 lg:py-28 px-6">
          <div className="max-w-[1400px] mx-auto grid lg:grid-cols-2 gap-10">
            {/* Form card */}
            <div className="rounded-2xl bg-white p-8 lg:p-10 border border-gray-100">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block">
                Send a message
              </span>
              <h2 className="font-condensed font-bold text-2xl md:text-3xl uppercase text-[#0B1A2F] leading-tight tracking-tight">
                {page?.formHeading ?? "Tell us about your project"}
              </h2>
              <p className="font-body text-sm text-gray-600 mt-3 mb-6 leading-relaxed">
                {page?.formSubtext ??
                  "Fill out the form and our team will get back to you within one business day."}
              </p>
              <ContactForm
                services={serviceOptions}
                defaultIso2={iso2}
                countryName={config.countryName}
              />
            </div>

            {/* Details card — navy */}
            <div className="rounded-2xl bg-[#0B1A2F] p-8 lg:p-10 text-white">
              <span className="font-condensed text-xs uppercase tracking-[0.2em] text-orange-500 font-semibold mb-3 block">
                Reach Us Directly
              </span>
              <h2 className="font-condensed font-bold text-2xl md:text-3xl uppercase text-white leading-tight tracking-tight">
                Our {config.countryName} Team
              </h2>
              <ul className="mt-8 space-y-6">
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Phone className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
                      Phone
                    </p>
                    <a
                      href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
                      className="font-body text-white hover:text-orange-500 transition-colors"
                    >
                      {resolvedPhone}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <Mail className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
                      Email
                    </p>
                    <a
                      href={`mailto:${resolvedEmail}`}
                      className="font-body text-white hover:text-orange-500 transition-colors"
                    >
                      {resolvedEmail}
                    </a>
                  </div>
                </li>
                <li className="flex gap-4 items-start">
                  <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                    <MapPin className="w-4 h-4 text-orange-500" />
                  </div>
                  <div>
                    <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
                      Address
                    </p>
                    <p className="font-body text-white whitespace-pre-line">
                      {resolvedAddress}
                    </p>
                  </div>
                </li>
                {page?.officeHours && (
                  <li className="flex gap-4 items-start">
                    <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center shrink-0">
                      <Clock className="w-4 h-4 text-orange-500" />
                    </div>
                    <div>
                      <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/40 mb-1">
                        Office Hours
                      </p>
                      <p className="font-body text-white whitespace-pre-line">
                        {page.officeHours}
                      </p>
                    </div>
                  </li>
                )}
              </ul>

              {page?.mapEmbedUrl && (
                <div className="rounded-xl overflow-hidden border border-white/10 mt-8">
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

        {/* ---------------- FINAL CTA ---------------- */}
        <section className="bg-[#0B1A2F] py-24 lg:py-32 px-6">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="font-condensed font-extrabold text-4xl md:text-5xl lg:text-6xl uppercase text-white leading-[0.95]">
              Need Urgent
              <span className="block font-accent italic font-normal normal-case text-orange-500 mt-3">
                Assistance?
              </span>
            </h2>
            <p className="font-body text-lg text-white/60 mt-8 max-w-2xl mx-auto leading-relaxed">
              Our {config.countryName} team is available to respond to emergency
              compliance and safety testing requests.
            </p>
            <div className="mt-10 flex justify-center">
              <Link
                href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
                className="inline-flex items-center gap-2 bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-[0.15em] px-8 py-3.5 rounded-full transition-colors"
              >
                <Phone className="w-4 h-4" />
                Call Now
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </main>
      <NEFooter config={config} />
    </>
  );
}
