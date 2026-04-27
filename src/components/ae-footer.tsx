import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Linkedin } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface AEFooterProps {
  config: CountryConfig;
}

export function AEFooter({ config }: AEFooterProps) {
  const colHeading =
    "text-xs font-semibold uppercase tracking-[0.2em] text-white/40";
  const linkClass =
    "text-sm text-white/60 transition-colors duration-300 hover:text-white";

  return (
    <footer className="bg-gray-900 text-white">
      <div className="mx-auto max-w-[1280px] px-6 py-16 lg:px-10 lg:py-20">
        <div className="grid grid-cols-1 gap-12 md:grid-cols-2 lg:grid-cols-4 lg:gap-8">
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
            <h4 className={`${colHeading} mb-5`}>Services</h4>
            <ul className="space-y-3">
              {config.services.map((s) => (
                <li key={s.href}>
                  <Link href={s.href} className={linkClass}>
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
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
