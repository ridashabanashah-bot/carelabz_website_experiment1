import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Linkedin, Mail } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface SAFooterProps {
  config: CountryConfig;
  email?: string | null;
}

export function SAFooter({ config, email }: SAFooterProps) {
  const resolvedEmail = email ?? config.email;

  // Case Studies intentionally omitted until real content exists — the
  // placeholder pages still ship under /{cc}/case-studies/ but we don't
  // advertise them in the footer to avoid pointing users at empty shells.
  const navLinks = [
    { label: "Services", href: config.servicesIndexPath },
    { label: "About", href: config.aboutPath },
    { label: "Blog", href: config.blogIndexPath },
    { label: "Contact", href: config.contactPath },
  ];

  const certLine = config.standards.slice(0, 3).join(" · ");

  return (
    <footer aria-label="Site footer">
      {/* Top — orange */}
      <div className="bg-orange-500 py-16 lg:py-20 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* Column 1 — brand */}
          <div>
            <Link
              href={`/${config.cc}/`}
              className="inline-block mb-6"
              aria-label={`Carelabs ${config.countryName} home`}
            >
              <Image
                src="/images/logo/carelabs-logo.svg"
                alt="Carelabs"
                width={866}
                height={288}
                className="h-10 w-auto"
                style={{ filter: "brightness(0) invert(1)" }}
              />
            </Link>
            <p className="font-condensed uppercase tracking-widest text-xs text-white/90 mb-4">
              Test | Calibrate | Inspect | Certify
            </p>
            <a
              href={`mailto:${resolvedEmail}`}
              className="font-body text-sm text-white/85 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4" />
              {resolvedEmail}
            </a>
          </div>

          {/* Column 2 — nav */}
          <div>
            <h4 className="font-condensed font-bold uppercase tracking-widest text-sm text-white mb-6">
              Navigate
            </h4>
            <ul className="space-y-3">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="font-body text-base text-white hover:text-white/80 transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3 — CTA */}
          <div>
            <h4 className="font-condensed font-bold text-2xl text-white mb-4">
              Ready to protect your team?
            </h4>
            <p className="font-body text-sm text-white/85 mb-6">
              Talk to our {config.countryName} engineers about your next power
              system study or compliance audit.
            </p>
            <Link
              href={config.contactPath}
              className="inline-flex items-center gap-2 bg-[#0B1A2F] hover:bg-[#162a45] text-white font-condensed font-bold uppercase tracking-wide px-8 py-3 rounded-full transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom — navy */}
      <div className="bg-[#0B1A2F] py-5 px-6 lg:px-12">
        <div className="max-w-[1400px] mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-white/60 text-sm font-body order-3 md:order-1">
            © {new Date().getFullYear()} Carelabs. All rights reserved.
          </p>
          {certLine && (
            <p className="text-white/40 text-xs font-condensed uppercase tracking-wider order-1 md:order-2">
              {certLine}
            </p>
          )}
          <div className="flex items-center gap-4 order-2 md:order-3">
            <a
              href="https://ae.linkedin.com/company/carelabs"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="LinkedIn"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Linkedin className="w-4 h-4" />
            </a>
            <a
              href={`mailto:${resolvedEmail}`}
              aria-label="Email"
              className="text-white/60 hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
