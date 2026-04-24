"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { Menu, X, ChevronDown } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface SANavbarProps {
  config: CountryConfig;
}

export function SANavbar({ config }: SANavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setIsScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const navLinks = [
    { name: "About Us", href: config.aboutPath },
    { name: "Contact Us", href: config.contactPath },
  ];

  const navBg = isScrolled || mobileMenuOpen
    ? "bg-[#0B1A2F] shadow-lg"
    : "bg-transparent";

  return (
    <nav
      className={`w-full transition-colors duration-300 ${navBg}`}
      aria-label="Primary"
    >
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12">
        <div className="flex items-center justify-between h-[72px]">
          <Link
            href={`/${config.cc}/`}
            aria-label={`Carelabs ${config.countryName} home`}
            className="flex items-center"
          >
            <Image
              src="/images/logo/carelabs-logo.svg"
              alt="Carelabs"
              width={866}
              height={288}
              priority
              className="h-9 w-auto"
              style={{ filter: "brightness(0) invert(1)" }}
            />
          </Link>

          <div className="hidden lg:flex items-center gap-10">
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className="font-condensed text-sm uppercase tracking-wider text-white/80 hover:text-orange-500 transition-colors inline-flex items-center gap-1"
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 transition-transform ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                  <div className="bg-[#0B1A2F] border border-white/10 rounded-2xl shadow-2xl p-4 min-w-[320px]">
                    <ul className="grid gap-1">
                      {config.services.map((s) => (
                        <li key={s.href}>
                          <Link
                            href={s.href}
                            className="block px-3 py-2.5 rounded-xl text-sm font-body font-medium text-white/80 hover:bg-white/5 hover:text-orange-500 transition-colors"
                          >
                            {s.label}
                          </Link>
                        </li>
                      ))}
                    </ul>
                    <div className="border-t border-white/10 mt-3 pt-3">
                      <Link
                        href={config.servicesIndexPath}
                        className="flex items-center justify-between px-3 py-2 text-sm font-condensed font-semibold uppercase tracking-wider text-orange-500 hover:text-orange-400 transition-colors"
                      >
                        View All Services →
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="font-condensed text-sm uppercase tracking-wider text-white/80 hover:text-orange-500 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          <div className="hidden lg:block">
            <Link
              href={config.contactPath}
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-wide px-6 py-2.5 rounded-full transition-colors"
            >
              Request a Quote
            </Link>
          </div>

          <button
            type="button"
            className="lg:hidden p-2 text-white"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? (
              <X className="w-6 h-6" />
            ) : (
              <Menu className="w-6 h-6" />
            )}
          </button>
        </div>
      </div>

      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#0B1A2F] border-t border-white/10 py-6">
          <div className="max-w-[1400px] mx-auto px-6 space-y-2">
            <div className="py-2">
              <p className="text-white/40 font-condensed text-xs uppercase tracking-widest mb-3">
                Services
              </p>
              <ul className="space-y-2">
                {config.services.map((s) => (
                  <li key={s.href}>
                    <Link
                      href={s.href}
                      className="block text-white/80 font-body font-medium py-1.5 hover:text-orange-500"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      {s.label}
                    </Link>
                  </li>
                ))}
                <li>
                  <Link
                    href={config.servicesIndexPath}
                    className="block text-orange-500 font-condensed font-semibold uppercase tracking-wider py-1.5"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    View All Services →
                  </Link>
                </li>
              </ul>
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="block font-condensed uppercase tracking-wider text-white/80 hover:text-orange-500 py-2"
                onClick={() => setMobileMenuOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <Link
              href={config.contactPath}
              className="inline-flex items-center bg-orange-500 hover:bg-orange-600 text-white font-condensed font-bold text-sm uppercase tracking-wide px-6 py-3 rounded-full w-full justify-center mt-4"
              onClick={() => setMobileMenuOpen(false)}
            >
              Request a Quote
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}
