"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X, ChevronDown, Zap } from "lucide-react";

interface ServiceLink {
  label: string;
  href: string;
}

interface CAMobileNavProps {
  services: ServiceLink[];
}

export function CAMobileNav({ services }: CAMobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [servicesExpanded, setServicesExpanded] = useState(false);

  const close = () => {
    setIsOpen(false);
    setServicesExpanded(false);
  };

  const linkClass =
    "font-['Montserrat'] text-[15px] font-semibold tracking-wide text-[#2575B6] py-3 border-b border-slate-100";

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="border-2 border-[#2575B6] rounded-lg p-1.5 text-[#2575B6]"
        aria-label="Toggle menu"
        aria-expanded={isOpen}
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {isOpen && (
        <div className="absolute top-[74px] left-0 right-0 bg-white shadow-lg border-t border-slate-100 z-50 max-h-[calc(100vh-74px)] overflow-y-auto">
          <nav className="flex flex-col p-4">
            <Link href="/ca/about-us/" onClick={close} className={linkClass}>
              About Us
            </Link>

            <button
              type="button"
              onClick={() => setServicesExpanded(!servicesExpanded)}
              className={`${linkClass} flex items-center justify-between w-full text-left`}
              aria-expanded={servicesExpanded}
            >
              Services
              <ChevronDown
                className={`w-4 h-4 transition-transform ${
                  servicesExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {servicesExpanded && (
              <div className="bg-[#EEF4FF] rounded-xl my-2 p-2">
                {services.map((s) => (
                  <Link
                    key={s.href}
                    href={s.href}
                    onClick={close}
                    className="flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-[#1A2538] hover:bg-white transition-colors"
                  >
                    <Zap className="w-4 h-4 text-[#F15C30] flex-shrink-0" />
                    {s.label}
                  </Link>
                ))}
                <Link
                  href="/ca/service/"
                  onClick={close}
                  className="block px-3 py-2.5 text-sm font-semibold text-[#F15C30] hover:text-[#2575B6]"
                >
                  View All Services →
                </Link>
              </div>
            )}

            <Link href="/ca/blogs/" onClick={close} className={linkClass}>
              Blog
            </Link>

            <Link href="/ca/contact/" onClick={close} className={linkClass}>
              Contact Us
            </Link>

            <Link
              href="/ca/contact/"
              onClick={close}
              className="mt-4 inline-flex items-center justify-center rounded-[50px] bg-[#F15C30] px-5 py-3 text-sm font-semibold text-white hover:scale-105 transition-all"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
