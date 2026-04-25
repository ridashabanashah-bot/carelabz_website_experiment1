import Image from "next/image";
import Link from "next/link";
import { Mail, Linkedin, Twitter, Facebook } from "lucide-react";

const SERVICES = [
  { label: "Arc Flash Study", href: "/us/services/study-analysis/arc-flash-study/" },
  { label: "Short Circuit Analysis", href: "/us/services/study-analysis/short-circuit-analysis/" },
  { label: "Load Flow Analysis", href: "/us/services/study-analysis/load-flow-analysis/" },
  { label: "Relay Coordination Study", href: "/us/services/study-analysis/relay-coordination-study/" },
  { label: "Power Quality Analysis", href: "/us/services/study-analysis/power-quality-analysis/" },
];

const COMPANY = [
  { label: "About Us", href: "/us/about/" },
  { label: "Case Studies", href: "/us/case-studies/" },
  { label: "Blog", href: "/us/blog/" },
  { label: "Contact", href: "/us/contact/" },
];

const FOOTER_DESCRIPTION =
  "Carelabs delivers IEEE 1584 arc flash studies, NFPA 70E compliance, and full power system engineering services across the United States.";

const EMAIL = "info@carelabz.com";

export default function USFooter() {
  return (
    <footer className="bg-navy border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Column 1 — Logo + blurb */}
          <div>
            <Link href="/us/" className="inline-block mb-4">
              <Image
                src="/images/logo/carelabs-logo.svg"
                alt="Carelabs"
                width={866}
                height={288}
                className="h-8 w-auto"
              />
            </Link>
            <p className="text-sm text-white/60 leading-relaxed">
              {FOOTER_DESCRIPTION}
            </p>
          </div>

          {/* Column 2 — Services */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
              Services
            </h4>
            <ul className="space-y-2">
              {SERVICES.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="text-sm text-white/70 transition-colors hover:text-orange-400"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — Company */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
              Company
            </h4>
            <ul className="space-y-2">
              {COMPANY.map((c) => (
                <li key={c.href}>
                  <Link
                    href={c.href}
                    className="text-sm text-white/70 transition-colors hover:text-orange-400"
                  >
                    {c.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4 — Contact */}
          <div>
            <h4 className="text-sm font-semibold uppercase tracking-widest text-white/40 mb-4">
              Contact
            </h4>
            <ul className="space-y-3">
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4 text-orange-400 shrink-0" />
                <a
                  href={`mailto:${EMAIL}`}
                  className="text-sm text-white/70 hover:text-orange-400 transition-colors"
                >
                  {EMAIL}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom row */}
        <div className="mt-12 border-t border-white/10 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-white/40">
            &copy; {new Date().getFullYear()} Carelabs. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy/"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms/"
              className="text-xs text-white/40 hover:text-white/70 transition-colors"
            >
              Terms of Service
            </Link>
            <div className="flex items-center gap-3">
              <a
                href="https://ae.linkedin.com/company/carelabs"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-white/40 hover:text-orange-400 transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com/carelabz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-white/40 hover:text-orange-400 transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://www.facebook.com/carelabz"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-white/40 hover:text-orange-400 transition-colors"
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
