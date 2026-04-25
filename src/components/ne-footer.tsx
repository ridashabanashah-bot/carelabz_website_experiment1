import Image from "next/image";
import Link from "next/link";
import { Linkedin, Mail, Phone, MapPin } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface NEFooterProps {
  config: CountryConfig;
  phone?: string | null;
  email?: string | null;
  address?: string | null;
  description?: string | null;
}

export function NEFooter({
  config,
  phone,
  email,
  address,
}: NEFooterProps) {
  const resolvedPhone = phone ?? config.phone;
  const resolvedEmail = email ?? config.email;
  const resolvedAddress = address ?? config.address;

  const navigateLinks = [
    { label: "Home", href: `/${config.cc}/` },
    { label: "Services", href: config.servicesIndexPath },
    { label: "About", href: config.aboutPath },
    { label: "Blog", href: config.blogIndexPath },
    { label: "Contact", href: config.contactPath },
    ...(config.caseStudyPath
      ? [{ label: "Case Studies", href: config.caseStudyPath }]
      : []),
  ];

  const certLine = config.standards.slice(0, 3).join(" · ");

  return (
    <footer aria-label="Site footer" className="relative overflow-hidden bg-[#0B1A2F]">
      <div className="relative py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 — Navigate */}
          <div>
            <h4 className="font-condensed text-sm uppercase tracking-[0.2em] text-white font-semibold mb-6 border-b border-white/10 pb-3">
              Navigate
            </h4>
            <ul className="space-y-3">
              {navigateLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-sm text-white/50 hover:text-white hover:underline transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 2 — Services */}
          <div>
            <h4 className="font-condensed text-sm uppercase tracking-[0.2em] text-white font-semibold mb-6 border-b border-white/10 pb-3">
              Services
            </h4>
            <ul className="space-y-3">
              {config.services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="font-body text-sm text-white/50 hover:text-white hover:underline transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Contact */}
          <div>
            <h4 className="font-condensed text-sm uppercase tracking-[0.2em] text-white font-semibold mb-6 border-b border-white/10 pb-3">
              Contact
            </h4>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Phone className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <a
                  href={`tel:${resolvedPhone.replace(/[^\d+]/g, "")}`}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors"
                >
                  {resolvedPhone}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <Mail className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <a
                  href={`mailto:${resolvedEmail}`}
                  className="font-body text-sm text-white/60 hover:text-white transition-colors"
                >
                  {resolvedEmail}
                </a>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 text-orange-500 mt-0.5 shrink-0" />
                <span className="font-body text-sm text-white/60">
                  {resolvedAddress}
                </span>
              </li>
            </ul>
          </div>

          {/* Column 4 — Stay connected */}
          <div>
            <h4 className="font-condensed text-sm uppercase tracking-[0.2em] text-white font-semibold mb-6 border-b border-white/10 pb-3">
              Stay Connected
            </h4>
            <p className="font-body text-sm text-white/50 mb-4 leading-relaxed">
              Insights from our {config.countryName} power system engineering team — delivered quarterly.
            </p>
            <form className="flex gap-2">
              <input
                type="email"
                aria-label="Email address"
                placeholder="Email address"
                className="bg-transparent border border-white/20 rounded-full px-4 py-2 text-white text-sm font-body placeholder:text-white/30 focus:border-orange-500 outline-none flex-1 min-w-0"
              />
              <button
                type="submit"
                className="bg-orange-500 text-white font-condensed font-bold text-xs uppercase tracking-[0.15em] px-5 py-2 rounded-full hover:bg-orange-600 transition-colors shrink-0"
              >
                Join
              </button>
            </form>
            <div className="mt-8 flex items-center gap-3">
              <a
                href="https://www.linkedin.com/company/carelabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/30 hover:text-white transition-colors"
              >
                <Linkedin className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/10 mt-14 pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between max-w-[1400px] mx-auto gap-4">
            <p className="font-body text-xs text-white/30 order-3 md:order-1">
              © {new Date().getFullYear()} Carelabs. All rights reserved.
            </p>
            {certLine && (
              <p className="font-condensed text-xs uppercase tracking-[0.2em] text-white/20 order-1 md:order-2">
                {certLine}
              </p>
            )}
            <Link
              href={`/${config.cc}/`}
              className="order-2 md:order-3 flex items-center"
              aria-label={`Carelabs ${config.countryName} home`}
            >
              <Image
                src="/images/logo/carelabs-logo.svg"
                alt="Carelabs"
                width={866}
                height={288}
                className="h-7 w-auto"
                style={{ filter: "brightness(0) invert(1) opacity(0.4)" }}
              />
            </Link>
          </div>
        </div>
      </div>

      {/* Watermark — huge CARELABS at 3% opacity across bottom */}
      <div
        className="pointer-events-none absolute bottom-[-20px] left-0 right-0 text-center font-condensed font-extrabold uppercase text-white/[0.03] select-none"
        style={{ fontSize: "clamp(80px, 18vw, 260px)", lineHeight: "1" }}
        aria-hidden="true"
      >
        CARELABS
      </div>
    </footer>
  );
}
