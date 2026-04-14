import type { Metadata } from "next";
import Link from "next/link";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import { ContactForm } from "@/components/contact-form";
import { getContactPage } from "@/lib/strapi-pages";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const page = await getContactPage("us");
  return {
    title: page?.metaTitle ?? "Contact CareLabs | Get in Touch",
    description:
      page?.metaDescription ??
      "Contact the CareLabs team for electrical safety testing, calibration, and compliance services across the United States.",
  };
}

export default async function ContactPage() {
  const page = await getContactPage("us");

  const headline = page?.heroHeadline ?? "Get in Touch";
  const subtext =
    page?.heroSubtext ??
    "Have a question or ready to start a project? Our team is here to help.";

  return (
    <>
      <StickyNavbar />
      <main id="main-content">
        {/* Hero Section */}
        <section className="bg-[#EEF4FF] pt-32 pb-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#1A2538] mb-6">
              {headline}
            </h1>
            <p className="text-lg md:text-xl text-[#374151] max-w-2xl mx-auto">
              {subtext}
            </p>
          </div>
        </section>

        {/* Two-column Contact Layout */}
        <section className="bg-offWhite py-20 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid lg:grid-cols-2 gap-12 items-start">
              {/* Left: Contact Form */}
              <div className="bg-white rounded-xl shadow-sm p-8 lg:p-10">
                <ContactForm
                  heading={page?.formHeading ?? "Send Us a Message"}
                  subtext={
                    page?.formSubtext ??
                    "Fill in the form below and we will get back to you within one business day."
                  }
                />
              </div>

              {/* Right: Contact Details */}
              <div className="space-y-8">
                {page?.phone && (
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Phone className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">
                        Phone
                      </p>
                      <a
                        href={`tel:${page.phone.replace(/\s/g, "")}`}
                        className="text-gray-700 hover:text-orange-500 transition-colors"
                      >
                        {page.phone}
                      </a>
                    </div>
                  </div>
                )}

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

                {page?.address && (
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">
                        Address
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">{page.address}</p>
                    </div>
                  </div>
                )}

                {page?.officeHours && (
                  <div className="flex gap-4 items-start">
                    <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                      <Clock className="w-5 h-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">
                        Office Hours
                      </p>
                      <p className="text-gray-700 whitespace-pre-line">
                        {page.officeHours}
                      </p>
                    </div>
                  </div>
                )}

                {/* Fallback contact details when no Strapi data */}
                {!page?.phone && !page?.email && !page?.address && !page?.officeHours && (
                  <div className="space-y-6">
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Phone className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">Phone</p>
                        <p className="text-gray-700">+1 (800) 000-0000</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Mail className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">Email</p>
                        <p className="text-gray-700">info@carelabz.com</p>
                      </div>
                    </div>
                    <div className="flex gap-4 items-start">
                      <div className="w-12 h-12 rounded-lg bg-orange-50 flex items-center justify-center flex-shrink-0">
                        <Clock className="w-5 h-5 text-orange-500" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-navy uppercase tracking-wide mb-1">Office Hours</p>
                        <p className="text-gray-700">Monday – Friday, 8 AM – 6 PM EST</p>
                      </div>
                    </div>
                  </div>
                )}

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
                      title="CareLabs Office Location"
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* CTA Banner */}
        <section className="bg-navy py-20 px-4">
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

        {/* Footer */}
        <footer className="bg-slateCard py-12 px-4">
          <div className="mx-auto max-w-7xl">
            <div className="grid md:grid-cols-4 gap-8 pb-8 border-b border-white/10">
              <div className="md:col-span-2">
                <p className="text-white font-bold text-lg mb-2">CareLabs</p>
                <p className="text-white/60 text-sm leading-relaxed max-w-xs">
                  Professional electrical safety testing, calibration, inspection,
                  and certification services across the United States.
                </p>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Services</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/us/services" className="text-white/60 text-sm hover:text-white transition-colors">
                      All Services
                    </Link>
                  </li>
                </ul>
              </div>
              <div>
                <p className="text-white font-semibold mb-3">Company</p>
                <ul className="space-y-2">
                  <li>
                    <Link href="/us/about" className="text-white/60 text-sm hover:text-white transition-colors">
                      About
                    </Link>
                  </li>
                  <li>
                    <Link href="/us/case-studies" className="text-white/60 text-sm hover:text-white transition-colors">
                      Case Studies
                    </Link>
                  </li>
                  <li>
                    <Link href="/us/contact" className="text-white/60 text-sm hover:text-white transition-colors">
                      Contact
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
            <p className="text-white/40 text-sm text-center pt-8">
              © {new Date().getFullYear()} CareLabs. All rights reserved.
            </p>
          </div>
        </footer>
      </main>
    </>
  );
}
