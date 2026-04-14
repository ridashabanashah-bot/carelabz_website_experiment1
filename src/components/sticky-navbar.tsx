"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { MobileNav } from "./mobile-nav";

const NAV_LINKS = [
  { label: "Services", href: "/us/services/" },
  { label: "About", href: "/us/about/" },
  { label: "Blog", href: "/us/blog/" },
  { label: "Contact", href: "/us/contact/" },
];

export function StickyNavbar() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled
          ? "bg-white/90 backdrop-blur-md shadow-lg"
          : "bg-white shadow-sm"
      }`}
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-[74px] items-center justify-between">
          <Link href="/us/" className="flex items-center">
            <Image
              src="/images/logo/carelabs-logo.png"
              alt="Carelabs"
              width={866}
              height={288}
              priority
              className="h-10 w-auto"
            />
          </Link>
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-sm font-medium text-[#1A2538] hover:text-[#FF6633] transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>
          <Link
            href="/us/contact/"
            className="hidden md:inline-flex items-center rounded-[50px] bg-[#FF6633] px-6 py-2.5 text-sm font-semibold text-white hover:scale-105 transition-all shadow-sm"
          >
            Get a Quote
          </Link>
          <MobileNav links={NAV_LINKS} />
        </div>
      </div>
    </header>
  );
}
