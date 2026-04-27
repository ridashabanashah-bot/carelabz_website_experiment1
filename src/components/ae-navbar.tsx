"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { Menu, X, ChevronDown, ArrowRight } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface AENavbarProps {
  config: CountryConfig;
}

export function AENavbar({ config }: AENavbarProps) {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 40);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkColor = scrolled
    ? "text-gray-700 hover:text-gray-900"
    : "text-white/80 hover:text-white";

  const iconColor = scrolled ? "text-gray-700" : "text-white";

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-300 ${
        scrolled
          ? "bg-white/95 shadow-sm backdrop-blur"
          : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex h-20 max-w-[1280px] items-center justify-between px-6 lg:px-10">
        <Link href={`/${config.cc}/`} className="shrink-0">
          <Image
            src="/images/logo/carelabs-logo.svg"
            alt="Carelabs"
            width={950}
            height={177}
            className="h-12 w-auto"
            priority
          />
        </Link>

        <div className="hidden items-center gap-8 lg:flex">
          <Link
            href={config.aboutPath}
            className={`text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${linkColor}`}
          >
            About
          </Link>

          <div
            className="relative"
            onMouseEnter={() => setServicesOpen(true)}
            onMouseLeave={() => setServicesOpen(false)}
          >
            <button
              className={`flex items-center gap-1 text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${linkColor}`}
            >
              Services
              <ChevronDown
                className={`h-3.5 w-3.5 transition-transform duration-300 ${
                  servicesOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {servicesOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 border border-gray-200 bg-white py-2 shadow-2xl">
                {config.services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    className="block px-5 py-2.5 text-sm text-gray-700 transition-colors duration-200 hover:bg-[#F2F2F4] hover:text-[#2575B6]"
                  >
                    {s.label}
                  </Link>
                ))}
                <div className="mt-2 border-t border-gray-200 px-5 pb-2 pt-2">
                  <Link
                    href={config.servicesIndexPath}
                    className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-[0.15em] text-[#F15C30] transition-colors duration-300 hover:text-[#d44a22]"
                  >
                    All Services <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>
              </div>
            )}
          </div>

          <Link
            href={config.blogIndexPath}
            className={`text-[13px] font-medium uppercase tracking-[0.1em] transition-colors duration-300 ${linkColor}`}
          >
            Insights
          </Link>

          <Link
            href={config.contactPath}
            className="inline-flex items-center gap-2 bg-[#F15C30] px-6 py-2.5 text-xs font-semibold uppercase tracking-[0.15em] text-white transition-all duration-300 hover:scale-[1.02] hover:bg-[#d44a22]"
          >
            Contact Us
          </Link>
        </div>

        <button
          className={`lg:hidden ${iconColor}`}
          onClick={() => setMenuOpen(!menuOpen)}
          aria-label={menuOpen ? "Close menu" : "Open menu"}
        >
          {menuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </nav>

      {menuOpen && (
        <div className="space-y-4 border-t border-gray-200 bg-white px-6 py-6 lg:hidden">
          <Link
            href={config.aboutPath}
            className="block text-sm font-medium uppercase tracking-[0.1em] text-gray-700 hover:text-[#2575B6]"
            onClick={() => setMenuOpen(false)}
          >
            About
          </Link>
          <Link
            href={config.servicesIndexPath}
            className="block text-sm font-medium uppercase tracking-[0.1em] text-gray-700 hover:text-[#2575B6]"
            onClick={() => setMenuOpen(false)}
          >
            Services
          </Link>
          <Link
            href={config.blogIndexPath}
            className="block text-sm font-medium uppercase tracking-[0.1em] text-gray-700 hover:text-[#2575B6]"
            onClick={() => setMenuOpen(false)}
          >
            Insights
          </Link>
          <Link
            href={config.contactPath}
            className="mt-4 block bg-[#F15C30] px-6 py-3 text-center text-sm font-semibold uppercase tracking-[0.1em] text-white transition-colors duration-300 hover:bg-[#d44a22]"
            onClick={() => setMenuOpen(false)}
          >
            Contact Us
          </Link>
        </div>
      )}
    </header>
  );
}
