"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { ChevronDown, ChevronRight, Zap } from "lucide-react";
import { MobileNav } from "./mobile-nav";

const SERVICES = [
  { label: "Arc Flash Study", href: "/us/services/study-analysis/arc-flash-study/" },
  { label: "Short Circuit Analysis", href: "/us/services/study-analysis/short-circuit-analysis/" },
  { label: "Load Flow Analysis", href: "/us/services/study-analysis/load-flow-analysis/" },
  { label: "Relay Coordination Study", href: "/us/services/study-analysis/relay-coordination-study/" },
  { label: "Harmonic Study", href: "/us/services/study-analysis/harmonic-study/" },
  { label: "Power Quality Analysis", href: "/us/services/study-analysis/power-quality-analysis/" },
  { label: "Motor Start Analysis", href: "/us/services/study-analysis/motor-start-analysis/" },
  { label: "Power System Study", href: "/us/services/study-analysis/power-system-study/" },
  { label: "Electrical Safety Inspection", href: "/us/services/inspection/electrical-safety-inspection/" },
];

export function StickyNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const linkClass =
    "font-['Montserrat'] text-[15px] font-semibold tracking-wide text-[#2575B6] hover:text-[#F15C30] transition-colors";

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-md"
          : "bg-white border-b border-slate-100"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[74px] items-center justify-between">
          {/* Logo */}
          <Link href="/us/" className="flex items-center" aria-label="CareLabs home">
            <Image
              src="/images/logo/carelabs-logo.svg"
              alt="CareLabs"
              width={866}
              height={288}
              priority
              className="h-10 w-auto"
            />
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <Link href="/us/about/" className={linkClass}>
              About Us
            </Link>

            {/* Services dropdown */}
            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button
                type="button"
                className={`${linkClass} inline-flex items-center`}
                aria-expanded={servicesOpen}
                aria-haspopup="true"
              >
                Services
                <ChevronDown
                  className={`w-4 h-4 ml-1 transition-transform ${
                    servicesOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {servicesOpen && (
                <div className="absolute left-1/2 -translate-x-1/2 top-full pt-3 z-50">
                  <div
                    className="bg-white rounded-2xl shadow-xl border border-slate-100 p-4 min-w-[320px]"
                    role="menu"
                  >
                    <div className="grid grid-cols-1 gap-1">
                      {SERVICES.map((s) => (
                        <Link
                          key={s.href}
                          href={s.href}
                          className="group flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-[#EEF4FF] transition-colors"
                          role="menuitem"
                        >
                          <Zap className="w-4 h-4 text-[#F15C30] flex-shrink-0" />
                          <span className="text-sm font-medium text-[#1A2538] group-hover:text-[#2575B6]">
                            {s.label}
                          </span>
                        </Link>
                      ))}
                    </div>
                    <div className="border-t border-slate-100 mt-3 pt-3">
                      <Link
                        href="/us/services/"
                        className="flex items-center justify-between px-3 py-2 text-sm font-semibold text-[#F15C30] hover:text-[#2575B6] transition-colors"
                      >
                        View All Services
                        <ChevronRight className="w-4 h-4 ml-1" />
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <Link href="/us/contact/" className={linkClass}>
              Contact Us
            </Link>
          </nav>

          {/* CTA */}
          <Link
            href="/us/contact/"
            className="hidden md:inline-flex items-center rounded-[50px] bg-[#F15C30] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 hover:shadow-lg transition-all shadow-sm"
          >
            Get a Quote
          </Link>

          {/* Mobile */}
          <MobileNav services={SERVICES} />
        </div>
      </div>
    </header>
  );
}
