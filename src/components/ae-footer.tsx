import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";
import { getServicesByRegion, type ServicePage } from "@/lib/strapi";
import {
  categorizeAEService,
  AE_CATEGORIES_ORDER,
  type AEServiceCategory,
} from "@/lib/ae-service-categories";

interface AEFooterProps {
  config: CountryConfig;
}

function cleanSlug(slug: string): string {
  return slug.endsWith("-ae") ? slug.slice(0, -3) : slug;
}

function shortLabel(title: string): string {
  // Trim "in Dubai, UAE" / "Services" / etc. for compact footer rendering
  return title
    .replace(/\s*(?:in|at|for)\s+(?:Dubai|UAE|United Arab Emirates)[^,]*$/i, "")
    .replace(/\s*Services?$/i, "")
    .replace(/\s*-\s*Carelabs.*$/i, "")
    .trim();
}

export async function AEFooter({ config }: AEFooterProps) {
  const services = await getServicesByRegion(config.cc).catch(() => [] as ServicePage[]);

  const grouped: Record<AEServiceCategory, ServicePage[]> = {
    "Testing": [],
    "Calibration": [],
    "Inspection": [],
    "Study & Analysis": [],
  };
  for (const svc of services) {
    grouped[categorizeAEService(svc.slug)].push(svc);
  }
  for (const cat of AE_CATEGORIES_ORDER) {
    grouped[cat].sort((a: ServicePage, b: ServicePage) =>
      a.title.localeCompare(b.title)
    );
  }

  const colHeading =
    "text-xs font-semibold uppercase tracking-[0.2em] text-white/40";
  const linkClass =
    "text-sm text-white/60 transition-colors duration-300 hover:text-white";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
        {/* Top row: brand + company + contact */}
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          <div>
            <Image
              src="/images/logo/carelabs-logo.svg"
              alt="Carelabs"
              width={950}
              height={177}
              className="mb-6 h-10 w-auto"
            />
            <p className="text-sm leading-relaxed text-white/60">
              {config.footerDescription}
            </p>
            <a
              href="https://ae.linkedin.com/company/carelabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Carelabs on LinkedIn"
              className="mt-6 inline-flex h-10 w-10 items-center justify-center border border-white/20 text-white/60 transition-colors duration-300 hover:border-[#F15C30] hover:text-[#F15C30]"
            >
              <Linkedin className="h-4 w-4" />
            </a>
          </div>

          <div>
            <h4 className={`${colHeading} mb-5`}>Company</h4>
            <ul className="space-y-3">
              <li>
                <Link href={config.aboutPath} className={linkClass}>
                  About
                </Link>
              </li>
              <li>
                <Link href={config.blogIndexPath} className={linkClass}>
                  Insights
                </Link>
              </li>
              {config.caseStudyPath && (
                <li>
                  <Link href={config.caseStudyPath} className={linkClass}>
                    Case Studies
                  </Link>
                </li>
              )}
              <li>
                <Link href={config.contactPath} className={linkClass}>
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className={`${colHeading} mb-5`}>Contact</h4>
            <ul className="space-y-3">
              <li>
                <a
                  href="mailto:info@carelabz.com"
                  className={`inline-flex items-start gap-2 ${linkClass}`}
                >
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[#2575B6]" />
                  info@carelabz.com
                </a>
              </li>
              {config.phone && (
                <li>
                  <a
                    href={`tel:${config.phone.replace(/\s+/g, "")}`}
                    className={`inline-flex items-start gap-2 ${linkClass}`}
                  >
                    <Phone className="mt-0.5 h-4 w-4 shrink-0 text-[#2575B6]" />
                    {config.phone}
                  </a>
                </li>
              )}
              {config.address && (
                <li className={`inline-flex items-start gap-2 ${linkClass}`}>
                  <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#2575B6]" />
                  <span>{config.address}</span>
                </li>
              )}
            </ul>
          </div>
        </div>

        {/* Services row: 4 categories with all services listed */}
        {services.length > 0 && (
          <div className="mt-14 grid grid-cols-1 gap-10 border-t border-white/10 pt-12 sm:grid-cols-2 lg:grid-cols-4">
            {AE_CATEGORIES_ORDER.map((cat) => {
              const list = grouped[cat] ?? [];
              if (list.length === 0) return null;
              return (
                <div key={cat}>
                  <h4 className={`${colHeading} mb-5`}>{cat}</h4>
                  <ul className="space-y-2.5">
                    {list.map((svc) => (
                      <li key={svc.id}>
                        <Link
                          href={`/${config.cc}/services/${cleanSlug(svc.slug)}/`}
                          className={linkClass}
                        >
                          {shortLabel(svc.title)}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}

        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Carelabs. All rights reserved.
          </p>
          <p className="text-xs uppercase tracking-[0.2em] text-white/40">
            Engineered for the UAE.
          </p>
        </div>
      </div>
    </footer>
  );
}
