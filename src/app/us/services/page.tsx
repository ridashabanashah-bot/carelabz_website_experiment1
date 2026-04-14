import { Metadata } from "next";
import Link from "next/link";
import { StickyNavbar } from "@/components/sticky-navbar";
import { getServicesByRegion } from "@/lib/strapi";
import { ServicePage } from "@/lib/strapi";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Electrical Safety Services | CareLabs USA",
  description:
    "Comprehensive electrical safety services in the USA including arc flash studies, power system analysis, relay coordination, harmonic studies, and electrical safety inspections.",
};

// Map Strapi slug to URL path
function getServiceHref(service: ServicePage): string {
  const slug = service.slug;
  // Strip "-us" suffix
  const urlSlug = slug.endsWith("-us") ? slug.slice(0, -3) : slug;
  // Determine category
  if (urlSlug === "electrical-safety-inspection") {
    return `/us/services/inspection/${urlSlug}/`;
  }
  return `/us/services/study-analysis/${urlSlug}/`;
}

export default async function ServicesIndexPage() {
  const services = await getServicesByRegion("us");

  return (
    <>
      <StickyNavbar />

      {/* Hero Section */}
      <section className="bg-[#EEF4FF] pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-widest text-orange-400 mb-3">
              USA Electrical Engineering
            </p>
            <h1 className="text-4xl font-bold tracking-tight text-[#1A2538] sm:text-5xl lg:text-6xl mb-6">
              Our Services
            </h1>
            <p className="text-lg text-[#374151] leading-relaxed">
              Comprehensive electrical safety services designed to keep your
              facilities compliant, your workers protected, and your operations
              running smoothly — delivered by certified engineers across the
              United States.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <main id="main-content" className="bg-offWhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <p className="text-center text-slate-500 py-12">
              Services are currently being loaded. Please check back shortly.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => (
                <article
                  key={service.id}
                  className="rounded-xl border border-slate-200 bg-white p-8 shadow-sm hover:shadow-md transition-shadow"
                >
                  <h2 className="text-xl font-bold text-navy mb-3">
                    {service.title}
                  </h2>
                  {service.metaDescription && (
                    <p className="text-slate-600 text-sm leading-relaxed mb-6 line-clamp-3">
                      {service.metaDescription.length > 160
                        ? service.metaDescription.slice(0, 157) + "…"
                        : service.metaDescription}
                    </p>
                  )}
                  <Link
                    href={getServiceHref(service)}
                    className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                  >
                    Learn More →
                  </Link>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-navy text-white py-12">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-8 md:grid-cols-3">
            <div>
              <h3 className="text-lg font-bold mb-4">CareLabs USA</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                Professional electrical safety services for US facilities.
                NEC, NFPA 70E, OSHA, and IEEE 1584 compliant.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Services</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/us/services/study-analysis/" className="hover:text-orange-400 transition-colors">
                    Study &amp; Analysis
                  </Link>
                </li>
                <li>
                  <Link href="/us/services/inspection/" className="hover:text-orange-400 transition-colors">
                    Inspection
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2 text-sm text-slate-400">
                <li>
                  <Link href="/us/contact/" className="hover:text-orange-400 transition-colors">
                    Get a Quote
                  </Link>
                </li>
                <li>
                  <Link href="/us/about/" className="hover:text-orange-400 transition-colors">
                    About CareLabs
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="mt-12 border-t border-slate-700 pt-8 text-center text-sm text-slate-500">
            &copy; {new Date().getFullYear()} CareLabs. All rights reserved.
          </div>
        </div>
      </footer>
    </>
  );
}
