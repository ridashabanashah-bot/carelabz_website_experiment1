import { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StickyNavbar } from "@/components/sticky-navbar";
import { getServicesByRegion, ServicePage } from "@/lib/strapi";

export const dynamic = "force-dynamic";

interface CategoryPageProps {
  params: { category: string };
}

const VALID_CATEGORIES = ["study-analysis", "inspection"] as const;
type ValidCategory = (typeof VALID_CATEGORIES)[number];

function getCategoryLabel(category: ValidCategory): string {
  if (category === "study-analysis") return "Study & Analysis";
  if (category === "inspection") return "Inspection";
  return category;
}

// Slugs that belong to "inspection" category
const INSPECTION_SLUGS = ["electrical-safety-inspection"];

function getUrlSlug(strapiSlug: string): string {
  return strapiSlug.endsWith("-us") ? strapiSlug.slice(0, -3) : strapiSlug;
}

function getServiceCategory(service: ServicePage): ValidCategory {
  const urlSlug = getUrlSlug(service.slug);
  return INSPECTION_SLUGS.includes(urlSlug) ? "inspection" : "study-analysis";
}

export async function generateMetadata({
  params,
}: CategoryPageProps): Promise<Metadata> {
  if (!VALID_CATEGORIES.includes(params.category as ValidCategory)) {
    return { title: "Services | CareLabs USA" };
  }
  const label = getCategoryLabel(params.category as ValidCategory);
  return {
    title: `${label} Services | CareLabs USA`,
    description: `Browse CareLabs USA ${label.toLowerCase()} electrical safety services for US facilities.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  if (!VALID_CATEGORIES.includes(params.category as ValidCategory)) {
    notFound();
  }

  const category = params.category as ValidCategory;
  const allServices = await getServicesByRegion("us");
  const services = allServices.filter(
    (s) => getServiceCategory(s) === category
  );

  const categoryLabel = getCategoryLabel(category);

  return (
    <>
      <StickyNavbar />

      {/* Hero */}
      <section className="bg-navy pt-24 pb-16">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-6">
            <ol className="flex items-center gap-2 text-sm text-slate-400">
              <li>
                <Link href="/us/services/" className="hover:text-orange-400 transition-colors">
                  Services
                </Link>
              </li>
              <li aria-hidden="true" className="text-slate-600">/</li>
              <li className="text-white font-medium">{categoryLabel}</li>
            </ol>
          </nav>
          <div className="mx-auto max-w-3xl">
            <h1 className="text-4xl font-bold tracking-tight text-white sm:text-5xl mb-6">
              {categoryLabel} Services
            </h1>
            <p className="text-lg text-slate-300 leading-relaxed">
              {category === "study-analysis"
                ? "Engineering analysis services to assess risk, ensure NEC/NFPA 70E/IEEE 1584 compliance, and optimise your power system."
                : "On-site electrical safety inspection services ensuring your facilities meet OSHA and NFPA 70E requirements."}
            </p>
          </div>
        </div>
      </section>

      {/* Cards */}
      <main id="main-content" className="bg-offWhite py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {services.length === 0 ? (
            <p className="text-center text-slate-500 py-12">
              No services found in this category.
            </p>
          ) : (
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {services.map((service) => {
                const urlSlug = getUrlSlug(service.slug);
                return (
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
                      href={`/us/services/${category}/${urlSlug}/`}
                      className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors"
                    >
                      Learn More →
                    </Link>
                  </article>
                );
              })}
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
