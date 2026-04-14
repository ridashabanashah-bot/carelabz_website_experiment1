"use client";
import { useState } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";

interface MobileNavProps {
  links: { label: string; href: string }[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="text-[#1A2538] p-2"
        aria-label="Toggle menu"
      >
        {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>
      {isOpen && (
        <div className="absolute top-[74px] left-0 right-0 bg-white shadow-lg border-t border-slate-100 z-50">
          <nav className="flex flex-col p-4 space-y-2">
            {links.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setIsOpen(false)}
                className="text-sm font-medium text-[#1A2538] hover:text-[#FF6633] transition-colors py-2 border-b border-slate-100"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href="/us/contact/"
              onClick={() => setIsOpen(false)}
              className="inline-flex items-center justify-center rounded-[50px] bg-[#FF6633] px-5 py-2.5 text-sm font-semibold text-white hover:scale-105 transition-all mt-2"
            >
              Get a Quote
            </Link>
          </nav>
        </div>
      )}
    </div>
  );
}
