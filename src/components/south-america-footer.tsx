import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Mail, Linkedin, Twitter, Facebook } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface SouthAmericaFooterProps {
  config: CountryConfig;
}

export function SouthAmericaFooter({ config }: SouthAmericaFooterProps) {
  const companyLinks = [
    { label: "About Us", href: config.aboutPath },
    ...(config.caseStudyPath
      ? [{ label: "Case Studies", href: config.caseStudyPath }]
      : []),
    { label: "Blog", href: config.blogIndexPath },
    { label: "Contact", href: config.contactPath },
  ];

  return (
    <footer
      className="sa-root relative"
      style={{ backgroundColor: "#094d76" }}
    >
      <div
        className="absolute inset-x-0 top-0 h-[2px]"
        style={{ backgroundColor: "#F15C30" }}
        aria-hidden="true"
      />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <Link
              href={`/${config.cc}/`}
              className="inline-block mb-4"
              aria-label={`Carelabs ${config.countryName} home`}
            >
              <Image
                src="/images/logo/carelabs-logo.svg"
                alt="Carelabs"
                width={866}
                height={288}
                className="h-9 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p
              className="text-sm leading-relaxed max-w-xs"
              style={{
                fontFamily: "var(--sa-font-body)",
                color: "rgba(255,255,255,0.72)",
              }}
            >
              {config.footerDescription}
            </p>
          </div>

          <div>
            <h4
              className="text-sm uppercase tracking-widest mb-5"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 700,
                color: "#F15C30",
              }}
            >
              Services
            </h4>
            <ul className="space-y-2.5">
              {config.services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                    style={{ fontFamily: "var(--sa-font-body)" }}
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-sm uppercase tracking-widest mb-5"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 700,
                color: "#F15C30",
              }}
            >
              Company
            </h4>
            <ul className="space-y-2.5">
              {companyLinks.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm text-white/75 hover:text-white transition-colors"
                    style={{ fontFamily: "var(--sa-font-body)" }}
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4
              className="text-sm uppercase tracking-widest mb-5"
              style={{
                fontFamily: "var(--sa-font-heading)",
                fontWeight: 700,
                color: "#F15C30",
              }}
            >
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <span
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#F15C30" }}
                >
                  <MapPin className="w-4 h-4 text-white" />
                </span>
                <span
                  className="text-sm text-white/85"
                  style={{ fontFamily: "var(--sa-font-body)" }}
                >
                  {config.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#F15C30" }}
                >
                  <Phone className="w-4 h-4 text-white" />
                </span>
                <a
                  href={`tel:${config.phone.replace(/\s/g, "")}`}
                  className="text-sm text-white/85 hover:text-white transition-colors"
                  style={{ fontFamily: "var(--sa-font-body)" }}
                >
                  {config.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <span
                  className="shrink-0 inline-flex h-8 w-8 items-center justify-center rounded-full"
                  style={{ backgroundColor: "#F15C30" }}
                >
                  <Mail className="w-4 h-4 text-white" />
                </span>
                <a
                  href={`mailto:${config.email}`}
                  className="text-sm text-white/85 hover:text-white transition-colors"
                  style={{ fontFamily: "var(--sa-font-body)" }}
                >
                  {config.email}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <div style={{ backgroundColor: "#2575B6" }}>
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p
            className="text-xs text-white/85"
            style={{ fontFamily: "var(--sa-font-body)" }}
          >
            &copy; {new Date().getFullYear()} Carelabs {config.countryName}. All
            rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy/"
              className="text-xs text-white/85 hover:text-white transition-colors"
              style={{ fontFamily: "var(--sa-font-body)" }}
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms/"
              className="text-xs text-white/85 hover:text-white transition-colors"
              style={{ fontFamily: "var(--sa-font-body)" }}
            >
              Terms of Service
            </Link>
            <div className="flex items-center gap-3">
              <a
                href="https://ae.linkedin.com/company/carelabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/85 hover:text-white transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/carelabz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-white/85 hover:text-white transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/carelabz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/85 hover:text-white transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
