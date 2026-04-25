import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Mail, MapPin, ArrowRight } from "lucide-react";
import { SAAnnouncementTicker } from "@/components/sa-announcement-ticker";
import { SANavbar } from "@/components/sa-navbar";
import { SAFooter } from "@/components/sa-footer";
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

export const dynamic = "force-dynamic";

const CC = "pe";
const COUNTRY_NAME = "Peru";
const HREFLANG = "en-PE";
const config = COUNTRY_CONFIGS[CC];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage(CC);
  return {
    title: page?.metaTitle ?? `Contact Carelabs ${COUNTRY_NAME} | Get in Touch`,
    description:
      page?.metaDescription ??
      `Contact the Carelabs team for electrical safety testing, arc flash studies, and ${config.primaryStandard} compliance services across ${COUNTRY_NAME}.`,
    alternates: {
      canonical: `https://carelabz.com/${CC}/contact-us/`,
      languages: {
        [HREFLANG]: `https://carelabz.com/${CC}/contact-us/`,
        "x-default": `https://carelabz.com/${CC}/contact-us/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `Contact Carelabs — Get a Free Consultation ${COUNTRY_NAME}`,
      description:
        page?.metaDescription ??
        `Get in touch for a free consultation on electrical safety services in ${COUNTRY_NAME}.`,
      url: `https://carelabz.com/${CC}/contact-us/`,
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `Contact Carelabs — Get a Free Consultation ${COUNTRY_NAME}`,
      description:
        page?.metaDescription ??
        `Get in touch for a free consultation on electrical safety services in ${COUNTRY_NAME}.`,
    },
  };
}

export default async function PEContactPage() {
  const headersList = headers();
  const iso2 = getCountryFromHeaders(headersList, CC.toUpperCase());

  const [page, services] = await Promise.all([
    getContactPage(CC),
    getServicesByRegion(CC),
  ]);

  // If Strapi returned duplicate titles (same title on multiple services),
  // fall back to the static config labels to keep the dropdown usable.
  const uniqueTitles = new Set(services.map((s) => s.title));
  const serviceOptions =
    services.length > 0 && uniqueTitles.size === services.length
      ? services.map((s) => ({ title: s.title, slug: s.slug }))
      : config.services.map((s) => ({ title: s.label, slug: s.href }));

  const headline = page?.heroHeadline ?? "Get in Touch";
  const subtext =
    page?.heroSubtext ??
    `Have a question or ready to start a project? Our ${COUNTRY_NAME} team is here to help.`;

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: CC,
      countryName: COUNTRY_NAME,
      countryIso2: CC.toUpperCase(),
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      `https://carelabz.com/${CC}/contact-us/`,
      page?.metaTitle ??
        `Contact Carelabs — Get a Free Consultation ${COUNTRY_NAME}`,
      page?.metaDescription ??
        `Get in touch for a free consultation on electrical safety services in ${COUNTRY_NAME}.`,
      HREFLANG
    ),
    getBreadcrumbSchema([
      { name: "Home", url: `https://carelabz.com/${CC}/` },
      { name: "Contact", url: `https://carelabz.com/${CC}/contact-us/` },
    ]),
  ]);
  const resolvedEmail = page?.email ?? config.email;

  const ContactItem = ({
    icon: Icon,
    label,
    value,
  }: {
    icon: React.ElementType;
    label: string;
    value: React.ReactNode;
  }) => (
    <div className="flex gap-4">
      <Icon className="text-orange-500 w-5 h-5 mt-1 shrink-0" />
      <div>
        <p className="font-condensed text-xs uppercase tracking-wider text-white/50">
          {label}
        </p>
        <div className="font-body text-base text-white mt-1">{value}</div>
      </div>
    </div>
  );

  return (
    <div className="bg-white">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Fixed header */}
      <div className="fixed top-0 left-0 right-0 z-50">
        <SAAnnouncementTicker
          countryName={COUNTRY_NAME}
          standards={config.standards}
        />
        <SANavbar config={config} />
      </div>

      <main className="pt-[112px]">
        {/* HERO */}
        <section className="relative bg-[#0B1A2F] py-16 lg:py-24 overflow-hidden">
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              backgroundImage:
                "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
              backgroundSize: "48px 48px",
            }}
            aria-hidden="true"
          />
          <div className="relative max-w-[1400px] mx-auto px-6 lg:px-12 text-center">
            <h1 className="font-condensed font-extrabold text-4xl md:text-5xl uppercase text-white tracking-tight leading-tight">
              {headline}
            </h1>
            <p className="font-body text-lg text-white/70 mt-4 max-w-2xl mx-auto">
              {subtext}
            </p>
            <span className="inline-flex items-center gap-2 mt-6 px-4 py-2 rounded-full bg-white/10 border border-white/20 text-white/90 font-body text-sm">
              <MapPin className="w-4 h-4" />
              Showing services available in {COUNTRY_NAME}
            </span>
          </div>
        </section>

        {/* FORM + CONTACT INFO */}
        <section className="bg-[#F8FAFC] py-16 lg:py-24">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-[1400px] mx-auto px-6 lg:px-12">
            {/* Form */}
            <div className="bg-white rounded-2xl rounded-tr-none p-8 shadow-lg border border-gray-100">
              <h2 className="font-condensed font-bold text-2xl text-[#0B1A2F] uppercase mb-2">
                {page?.formHeading ?? "Send Us a Message"}
              </h2>
              <p className="font-body text-sm text-gray-600 mb-6">
                {page?.formSubtext ??
                  "Fill in the form below and we will get back to you within one business day."}
              </p>
              <ContactForm
                services={serviceOptions}
                defaultIso2={iso2}
                countryName={COUNTRY_NAME}
              />
            </div>

            {/* Contact details */}
            <div className="bg-[#0B1A2F] rounded-2xl rounded-tr-none p-8 text-white space-y-8">
              <h2 className="font-condensed font-bold text-2xl uppercase">
                Contact Details
              </h2>
              {/* Email first — it's the authoritative contact method while
                  per-country phone numbers remain placeholder values. */}
              <ContactItem
                icon={Mail}
                label="Email (primary)"
                value={
                  <a
                    href={`mailto:${resolvedEmail}`}
                    className="hover:text-orange-500 transition-colors font-semibold"
                  >
                    {resolvedEmail}
                  </a>
                }
              />
            </div>
          </div>

          {/* Map */}
          {page?.mapEmbedUrl && (
            <div className="max-w-[1400px] mx-auto px-6 lg:px-12 mt-12">
              <div className="rounded-2xl overflow-hidden border border-gray-200">
                <iframe
                  src={page.mapEmbedUrl}
                  width="100%"
                  height="360"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Carelabs ${COUNTRY_NAME} Office Location`}
                />
              </div>
            </div>
          )}
        </section>

        {/* CTA */}
        <section className="bg-gradient-to-r from-orange-500 to-[#0B1A2F] py-20 lg:py-24 text-center">
          <div className="max-w-4xl mx-auto px-6">
            <h2 className="font-condensed font-extrabold text-3xl md:text-5xl text-white uppercase leading-tight">
              Need urgent assistance?
            </h2>
            <p className="font-body text-lg text-white/80 mt-6 max-w-2xl mx-auto">
              Our {COUNTRY_NAME} team responds to emergency compliance and
              safety testing requests within one business day.
            </p>
            <Link
              href={`mailto:${resolvedEmail}`}
              className="mt-8 inline-flex items-center gap-3 bg-white text-[#0B1A2F] font-condensed font-bold uppercase px-10 py-4 rounded-full shadow-2xl hover:scale-105 transition-transform text-base tracking-wide"
            >
              <Mail className="w-4 h-4" />
              Email Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>

      <SAFooter config={config} />
    </div>
  );
}
