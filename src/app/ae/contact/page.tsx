export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Mail, Phone, MapPin } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/strapi-pages";
import { getServicesByRegion } from "@/lib/strapi";
import { getCountryFromHeaders } from "@/lib/detect-country";
import { ScrollReveal } from "@/components/scroll-reveal";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage(CC);
  return {
    title: page?.metaTitle ?? `Contact Carelabs UAE — Electrical Safety Consultation`,
    description:
      page?.metaDescription ??
      `Contact Carelabs for DEWA-compliant arc flash studies, power system engineering, and electrical safety services across the UAE.`,
    alternates: {
      canonical: `https://carelabz.com/${CC}/contact/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/contact/`,
        "x-default": `https://carelabz.com/${CC}/contact/`,
      },
    },
    openGraph: {
      title: page?.metaTitle ?? `Contact Carelabs UAE`,
      description: page?.metaDescription ?? `Get in touch for electrical safety services in the UAE.`,
      url: `https://carelabz.com/${CC}/contact/`,
      siteName: "Carelabs",
      type: "website",
      locale: "en_AE",
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

  const serviceOptions = services.map((s) => ({ title: s.title, slug: s.slug }));

  const subtext =
    page?.heroSubtext ??
    `Tell us about your facility and compliance requirements. Our UAE engineering team responds within one business day.`;

  return (
    <>
      <AENavbar config={config} />

      {/* HERO */}
      <section className="relative overflow-hidden bg-[#094D76] px-6 pb-20 pt-36 lg:pb-24 lg:pt-44">
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 opacity-[0.03] [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:40px_40px]"
        />
        <div className="relative z-10 mx-auto max-w-[1100px] text-center">
          <p className="animate-fade-in-up animation-delay-100 text-xs font-semibold uppercase tracking-[0.25em] text-[#F15C30]">
            Contact
          </p>
          <h1 className="animate-fade-in-up animation-delay-200 mt-6 font-display text-display-hero uppercase tracking-tight text-white">
            {page?.heroHeadline ?? "Get in Touch"}
          </h1>
          <p className="animate-fade-in-up animation-delay-300 mx-auto mt-8 max-w-2xl text-lg leading-relaxed text-white/70">
            {subtext}
          </p>
        </div>
      </section>

      {/* CONTACT INFO + FORM */}
      <main id="main-content" className="bg-[#F2F2F4] px-6 py-24 lg:py-32">
        <div className="mx-auto grid max-w-[1280px] gap-12 lg:grid-cols-5">
          {/* Contact info — left col */}
          <div className="lg:col-span-2">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                Reach Us
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-3 font-display text-display-md uppercase tracking-tight text-gray-900">
                Email is the fastest way to start.
              </h2>
            </ScrollReveal>

            <ScrollReveal delay={200}>
              <a
                href="mailto:info@carelabz.com"
                className="group mt-8 block border-l-2 border-[#2575B6] bg-white p-6 transition-colors duration-300 hover:border-[#F15C30]"
              >
                <div className="flex items-center gap-4">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F2F2F4] transition-colors duration-300 group-hover:bg-[#F15C30]/10">
                    <Mail className="h-4 w-4 text-[#2575B6]" />
                  </span>
                  <div>
                    <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                      Email
                    </p>
                    <p className="mt-1 text-base font-medium text-gray-900">
                      info@carelabz.com
                    </p>
                  </div>
                </div>
              </a>
            </ScrollReveal>

            {config.phone && (
              <ScrollReveal delay={300}>
                <div className="mt-4 border-l-2 border-[#2575B6] bg-white p-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F2F2F4]">
                      <Phone className="h-4 w-4 text-[#2575B6]" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Phone
                      </p>
                      <p className="mt-1 text-base font-medium text-gray-900">
                        {config.phone}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            {config.address && (
              <ScrollReveal delay={400}>
                <div className="mt-4 border-l-2 border-[#2575B6] bg-white p-6">
                  <div className="flex items-center gap-4">
                    <span className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#F2F2F4]">
                      <MapPin className="h-4 w-4 text-[#2575B6]" />
                    </span>
                    <div>
                      <p className="text-xs uppercase tracking-[0.2em] text-gray-500">
                        Office
                      </p>
                      <p className="mt-1 text-base font-medium text-gray-900">
                        {config.address}
                      </p>
                    </div>
                  </div>
                </div>
              </ScrollReveal>
            )}

            <ScrollReveal delay={500}>
              <p className="mt-8 text-sm leading-relaxed text-gray-600">
                Our UAE team responds within one business day. For urgent compliance questions, mention &quot;urgent&quot; in your subject line.
              </p>
            </ScrollReveal>
          </div>

          {/* Form — right col */}
          <div className="lg:col-span-3">
            <ScrollReveal>
              <p className="text-sm font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
                Or send a message
              </p>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <h2 className="mt-3 font-display text-display-md uppercase tracking-tight text-gray-900">
                {page?.formHeading ?? "Tell us about your project"}
              </h2>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <p className="mt-3 text-sm leading-relaxed text-gray-600">
                {page?.formSubtext ??
                  "Fill out the form and we'll get back to you within one business day."}
              </p>
            </ScrollReveal>
            <ScrollReveal delay={300}>
              <div className="mt-8 bg-white p-8">
                <ContactForm
                  services={serviceOptions}
                  defaultIso2={iso2}
                  countryName={config.countryName}
                />
              </div>
            </ScrollReveal>
          </div>
        </div>
      </main>

      <AEFooter config={config} />
    </>
  );
}
