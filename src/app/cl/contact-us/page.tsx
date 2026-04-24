import type { Metadata } from "next";
import Link from "next/link";
import { headers } from "next/headers";
import { Phone, Mail, MapPin, Clock, ArrowRight } from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { SouthAmericaFooter } from "@/components/south-america-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
const config = COUNTRY_CONFIGS["cl"];
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

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage("cl");
  return {
    title: page?.metaTitle ?? "Contact Carelabs Chile | Get in Touch",
    description:
      page?.metaDescription ??
      "Contact the Carelabs team for electrical safety testing, arc flash studies, and NCh Elec. 4/2003 compliance services across Chile.",
    alternates: {
      canonical: "https://carelabz.com/cl/contact-us/",
      languages: {
        "en-CL": "https://carelabz.com/cl/contact-us/",
        "x-default": "https://carelabz.com/cl/contact-us/",
      },
    },
    openGraph: {
      title:
        page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation Chile",
      description:
        page?.metaDescription ??
        "Get in touch for a free consultation on electrical safety services in Chile.",
      url: "https://carelabz.com/cl/contact-us/",
      siteName: "Carelabs",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation Chile",
      description:
        page?.metaDescription ??
        "Get in touch for a free consultation on electrical safety services in Chile.",
    },
  };
}

export default async function CLContactPage() {
  const headersList = headers();
  const iso2 = getCountryFromHeaders(headersList, "CL");
  const countryName = "Chile";

  const [page, services] = await Promise.all([
    getContactPage("cl"),
    getServicesByRegion("cl"),
  ]);

  const serviceOptions = services.map((s) => ({
    title: s.title,
    slug: s.slug,
  }));

  const headline = page?.heroHeadline ?? "Get in Touch";
  const subtext =
    page?.heroSubtext ??
    "Have a question or ready to start a project? Our Chile team is here to help.";

  const jsonLd = buildJsonLd([
    getRegionOrganizationSchema({
      cc: "cl",
      countryName: "Chile",
      countryIso2: "CL",
      phone: config.phone,
      email: config.email,
      addressLocality: config.address,
    }),
    getWebPageSchema(
      "https://carelabz.com/cl/contact-us/",
      page?.metaTitle ?? "Contact Carelabs — Get a Free Consultation Chile",
      page?.metaDescription ??
        "Get in touch for a free consultation on electrical safety services in Chile.",
      "en-CL"
    ),
    getBreadcrumbSchema([
      { name: "Home", url: "https://carelabz.com/cl/" },
      { name: "Contact", url: "https://carelabz.com/cl/contact-us/" },
    ]),
  ]);

  const contactRow = (
    Icon: React.ElementType,
    label: string,
    value: React.ReactNode
  ) => (
    <div className="flex gap-4 items-start">
      <div
        className="shrink-0 inline-flex items-center justify-center rounded-full"
        style={{
          width: "3rem",
          height: "3rem",
          backgroundColor: "#F15C30",
        }}
      >
        <Icon className="w-5 h-5 text-white" />
      </div>
      <div>
        <p
          className="uppercase tracking-wide mb-1"
          style={{
            fontFamily: "var(--sa-font-heading)",
            fontWeight: 700,
            fontSize: "0.75rem",
            color: "#094d76",
          }}
        >
          {label}
        </p>
        <div
          style={{
            fontFamily: "var(--sa-font-body)",
            color: "#5a5d66",
          }}
        >
          {value}
        </div>
      </div>
    </div>
  );

  return (
    <div className="sa-root">
      <RegionNavbar config={config} />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main id="main-content">
        {/* HERO */}
        <section
          className="sa-hero-bg relative overflow-hidden"
          style={{ paddingTop: "8rem", paddingBottom: "5rem" }}
        >
          <div className="sa-hero-shape" aria-hidden="true" />
          <div className="relative mx-auto max-w-4xl px-4 sm:px-8 text-center">
            <h1
              className="text-white mb-6"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2.5rem, 5vw, 3.75rem)",
                lineHeight: 1.1,
              }}
            >
              {headline}
            </h1>
            <p
              className="mx-auto mb-6"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.85)",
                fontSize: "1.125rem",
                lineHeight: 1.65,
                maxWidth: "42rem",
              }}
            >
              {subtext}
            </p>
            <span
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm"
              style={{
                backgroundColor: "rgba(255,255,255,0.12)",
                border: "1px solid rgba(255,255,255,0.22)",
                backdropFilter: "blur(8px)",
                color: "#ffffff",
                fontFamily: "var(--sa-font-body)",
              }}
            >
              <MapPin className="w-4 h-4" />
              Showing services available in {countryName}
            </span>
          </div>
        </section>

        {/* FORM + CONTACT */}
        <section style={{ backgroundColor: "#f2f2f4" }} className="py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-10 items-start">
              <div
                className="rounded-3xl p-8 lg:p-10"
                style={{
                  backgroundColor: "#ffffff",
                  boxShadow: "0 4px 24px rgba(37,117,182,0.10)",
                }}
              >
                <h2
                  className="mb-2"
                  style={{
                    fontFamily: "var(--sa-font-heading)",
                    fontWeight: 800,
                    fontSize: "1.5rem",
                    color: "#094d76",
                  }}
                >
                  {page?.formHeading ?? "Send Us a Message"}
                </h2>
                <p
                  className="mb-6"
                  style={{
                    fontFamily: "var(--sa-font-body)",
                    color: "#5a5d66",
                  }}
                >
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
                {page?.phone &&
                  contactRow(
                    Phone,
                    "Phone",
                    <a
                      href={`tel:${page.phone.replace(/\s/g, "")}`}
                      className="hover:text-[#F15C30] transition-colors"
                    >
                      {page.phone}
                    </a>
                  )}

                {page?.email &&
                  contactRow(
                    Mail,
                    "Email",
                    <a
                      href={`mailto:${page.email}`}
                      className="hover:text-[#F15C30] transition-colors"
                    >
                      {page.email}
                    </a>
                  )}

                {page?.address &&
                  contactRow(
                    MapPin,
                    "Address",
                    <p className="whitespace-pre-line">{page.address}</p>
                  )}

                {page?.officeHours &&
                  contactRow(
                    Clock,
                    "Office Hours",
                    <p className="whitespace-pre-line">{page.officeHours}</p>
                  )}

                {!page?.phone && !page?.email && !page?.address && !page?.officeHours && (
                  <>
                    {contactRow(Phone, "Phone", <p>{config.phone}</p>)}
                    {contactRow(Mail, "Email", <p>{config.email}</p>)}
                    {contactRow(MapPin, "Address", <p>{config.address}</p>)}
                    {contactRow(
                      Clock,
                      "Office Hours",
                      <p>Monday – Friday, 9 AM – 5 PM</p>
                    )}
                  </>
                )}

                {page?.mapEmbedUrl && (
                  <div
                    className="rounded-2xl overflow-hidden mt-4"
                    style={{
                      border: "1px solid #f2f2f4",
                    }}
                  >
                    <iframe
                      src={page.mapEmbedUrl}
                      width="100%"
                      height="280"
                      style={{ border: 0 }}
                      allowFullScreen
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                      title="Carelabs Chile Office Location"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* URGENT CTA */}
        <section
          className="relative py-24 px-4 overflow-hidden"
          style={{
            background: "linear-gradient(90deg, #F15C30 0%, #c44a1f 100%)",
          }}
        >
          <div className="relative mx-auto max-w-4xl text-center">
            <h2
              className="text-white mb-4"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 800,
                fontSize: "clamp(2rem, 4vw, 2.75rem)",
              }}
            >
              Need urgent assistance?
            </h2>
            <p
              className="mb-10 mx-auto max-w-2xl"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.92)",
                fontSize: "1.075rem",
                lineHeight: 1.65,
              }}
            >
              Our Chile team is available to respond to emergency compliance
              and safety testing requests.
            </p>
            <Link
              href={`tel:${config.phone.replace(/\s/g, "")}`}
              className="inline-flex items-center gap-2 rounded-full px-8 py-3.5 transition-all hover:scale-[1.02]"
              style={{
                backgroundColor: "#ffffff",
                color: "#c44a1f",
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 600,
              }}
            >
              <Phone className="w-4 h-4" />
              Call Now
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </section>
      </main>
      <SouthAmericaFooter config={config} />
    </div>
  );
}
