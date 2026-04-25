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
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <>
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1E5A8A] via-[#2D7AB8] to-[#1E5A8A] z-[60]" />

      <header
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0F2847]/95 backdrop-blur-md shadow-lg"
            : "bg-[#0F2847]"
        }`}
      >
        <nav className="max-w-[1280px] mx-auto flex items-center justify-between h-16 px-6 lg:px-10">
          <Link href={`/${config.cc}/`} className="shrink-0">
            <Image
              src="/images/logo/carelabs-logo.png"
              alt="Carelabs"
              width={130}
              height={43}
              className="h-8 w-auto"
              priority
            />
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            <Link
              href={`/${config.cc}/`}
              className="font-ae-nav font-medium text-[13px] tracking-[0.08em] text-white/70 hover:text-white transition-colors uppercase"
            >
              Home
            </Link>

            <div
              className="relative"
              onMouseEnter={() => setServicesOpen(true)}
              onMouseLeave={() => setServicesOpen(false)}
            >
              <button className="font-ae-nav font-medium text-[13px] tracking-[0.08em] text-white/70 hover:text-white transition-colors uppercase flex items-center gap-1">
                Services
                <ChevronDown className={`w-3.5 h-3.5 transition-transform ${servicesOpen ? "rotate-180" : ""}`} />
              </button>
              {servicesOpen && (
                <div className="absolute top-full left-0 mt-2 w-72 bg-[#0F2847] border border-[#1E5A8A]/30 shadow-2xl py-2">
                  {config.services.map((s) => (
                    <Link
                      key={s.href}
                      href={s.href}
                      className="block px-5 py-2.5 font-ae-body text-sm text-white/60 hover:text-white hover:bg-[#163560]/50 transition-colors"
                    >
                      {s.label}
                    </Link>
                  ))}
                  <div className="border-t border-[#1E5A8A]/20 mt-2 pt-2 px-5 pb-2">
                    <Link
                      href={config.servicesIndexPath}
                      className="font-ae-nav text-xs uppercase tracking-[0.12em] text-[#F97316] hover:text-orange-400 inline-flex items-center gap-1.5 transition-colors"
                    >
                      All Services <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              )}
            </div>

            <Link
              href={config.blogIndexPath}
              className="font-ae-nav font-medium text-[13px] tracking-[0.08em] text-white/70 hover:text-white transition-colors uppercase"
            >
              Insights
            </Link>
            {config.caseStudyPath && (
              <Link
                href={config.caseStudyPath}
                className="font-ae-nav font-medium text-[13px] tracking-[0.08em] text-white/70 hover:text-white transition-colors uppercase"
              >
                Case Studies
              </Link>
            )}
            <Link
              href={config.aboutPath}
              className="font-ae-nav font-medium text-[13px] tracking-[0.08em] text-white/70 hover:text-white transition-colors uppercase"
            >
              About
            </Link>

            <Link
              href={config.contactPath}
              className="font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] text-white bg-[#F97316] hover:bg-orange-600 px-6 py-2.5 transition-colors"
            >
              Contact
            </Link>
          </div>

          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {menuOpen && (
          <div className="lg:hidden bg-[#0F2847] border-t border-[#1E5A8A]/20 px-6 py-6 space-y-4">
            <Link href={`/${config.cc}/`} className="block font-ae-nav text-sm uppercase tracking-[0.1em] text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link href={config.servicesIndexPath} className="block font-ae-nav text-sm uppercase tracking-[0.1em] text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Services</Link>
            <Link href={config.blogIndexPath} className="block font-ae-nav text-sm uppercase tracking-[0.1em] text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Insights</Link>
            {config.caseStudyPath && (
              <Link href={config.caseStudyPath} className="block font-ae-nav text-sm uppercase tracking-[0.1em] text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>Case Studies</Link>
            )}
            <Link href={config.aboutPath} className="block font-ae-nav text-sm uppercase tracking-[0.1em] text-white/70 hover:text-white" onClick={() => setMenuOpen(false)}>About</Link>
            <Link href={config.contactPath} className="block font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] text-white bg-[#F97316] hover:bg-orange-600 px-6 py-3 text-center mt-4" onClick={() => setMenuOpen(false)}>Contact</Link>
          </div>
        )}
      </header>
    </>
  );
}
