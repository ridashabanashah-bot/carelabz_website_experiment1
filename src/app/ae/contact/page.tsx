export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { headers } from "next/headers";
import { Mail } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/strapi-pages";
import { getServicesByRegion } from "@/lib/strapi";
import { getCountryFromHeaders } from "@/lib/detect-country";

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
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />

      {/* HERO */}
      <section className="bg-[#0A1628] pt-36 pb-20 lg:pt-44 lg:pb-24 px-6 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="max-w-[1100px] mx-auto text-center relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-6">
            Contact
          </p>
          <h1 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.95]">
            {page?.heroHeadline ?? "Get in Touch"}
          </h1>
          <p className="font-ae-body text-base md:text-lg text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            {subtext}
          </p>
        </div>
      </section>

      {/* FORM + EMAIL */}
      <main id="main-content" className="bg-[#F8F5F0] py-20 lg:py-28 px-6">
        <div className="max-w-[1100px] mx-auto grid lg:grid-cols-5 gap-12">
          {/* Email-only contact info — left col */}
          <div className="lg:col-span-2">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
              Reach Us
            </span>
            <h2 className="font-ae-display text-3xl lg:text-4xl text-[#0F2847] leading-tight mb-8">
              Email is the fastest way to start.
            </h2>
            <a
              href="mailto:info@carelabz.com"
              className="inline-flex items-center gap-3 font-ae-body text-base text-[#0F2847] hover:text-[#1E5A8A] transition-colors group"
            >
              <span className="w-10 h-10 bg-[#EBF2F8] flex items-center justify-center group-hover:bg-[#D4E3F0] transition-colors">
                <Mail className="w-4 h-4 text-[#1E5A8A]" />
              </span>
              <span className="font-ae-body font-medium">info@carelabz.com</span>
            </a>
            <p className="font-ae-body text-sm text-[#0F2847]/60 mt-8 leading-relaxed">
              Our UAE team responds within one business day. For urgent compliance questions, mention &quot;urgent&quot; in your subject line.
            </p>
          </div>

          {/* Form — right col */}
          <div className="lg:col-span-3">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
              Or send a message
            </span>
            <h2 className="font-ae-display text-3xl lg:text-4xl text-[#0F2847] leading-tight mb-3">
              {page?.formHeading ?? "Tell us about your project"}
            </h2>
            <p className="font-ae-body text-sm text-[#0F2847]/60 mb-8 leading-relaxed">
              {page?.formSubtext ??
                "Fill out the form and we'll get back to you within one business day."}
            </p>
            <ContactForm
              services={serviceOptions}
              defaultIso2={iso2}
              countryName={config.countryName}
            />
          </div>
        </div>
      </main>

      <AEFooter config={config} />
    </>
  );
}
