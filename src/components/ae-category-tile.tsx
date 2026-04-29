"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown } from "lucide-react";

interface ServiceLink {
  slug: string;
  title: string;
}

interface CategoryTileProps {
  categoryName: string;
  categoryHref: string;
  services: ServiceLink[];
  serviceHrefBase: string; // e.g. "/ae/services"
  previewLimit?: number;
}

export function AECategoryTile({
  categoryName,
  categoryHref,
  services,
  serviceHrefBase,
  previewLimit = 12,
}: CategoryTileProps) {
  const [open, setOpen] = useState(false);
  const visible = services.slice(0, previewLimit);
  const hidden = Math.max(0, services.length - visible.length);

  return (
    <div
      className="group relative h-full bg-white transition-colors duration-300 hover:bg-[#F2F2F4] md:hover:bg-[#F2F2F4]"
      onMouseLeave={() => setOpen(false)}
    >
      {/* Header row — clickable on desktop (link) and mobile (toggle) */}
      <div className="flex items-stretch border-l-2 border-[#2575B6] transition-colors duration-300 group-hover:border-[#F15C30]">
        <Link
          href={categoryHref}
          className="flex-1 px-6 py-8 md:px-8 md:py-10"
          onMouseEnter={() => setOpen(true)}
          onFocus={() => setOpen(true)}
        >
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[#F15C30]">
            Category
          </p>
          <h3 className="mt-3 font-display text-2xl uppercase tracking-tight text-gray-900 transition-colors duration-300 group-hover:text-[#2575B6] md:text-3xl">
            {categoryName}
          </h3>
          <p className="mt-2 text-sm text-gray-500">
            {services.length} {services.length === 1 ? "service" : "services"}
          </p>
        </Link>
        {/* Mobile-only chevron toggle */}
        <button
          type="button"
          aria-expanded={open}
          aria-label={open ? `Collapse ${categoryName}` : `Expand ${categoryName}`}
          className="flex shrink-0 items-center justify-center px-5 text-[#2575B6] md:hidden"
          onClick={() => setOpen((o) => !o)}
        >
          <ChevronDown
            className={`h-5 w-5 transition-transform duration-300 ${
              open ? "rotate-180" : ""
            }`}
          />
        </button>
      </div>

      {/* Services dropdown — hover on md+, accordion on mobile */}
      <div
        className={`overflow-hidden border-t border-gray-200 bg-[#F2F2F4] transition-all duration-300 ${
          open ? "max-h-[600px] opacity-100" : "max-h-0 opacity-0"
        } md:max-h-0 md:opacity-0 md:group-hover:max-h-[600px] md:group-hover:opacity-100`}
      >
        <ul className="px-6 py-4 md:px-8 md:py-5">
          {visible.map((s) => (
            <li key={s.slug}>
              <Link
                href={`${serviceHrefBase}/${s.slug}/`}
                className="group/item flex items-center justify-between gap-3 py-2 text-sm text-gray-700 transition-colors duration-200 hover:text-[#2575B6]"
              >
                <span>{s.title}</span>
                <ArrowRight className="h-3.5 w-3.5 text-[#2575B6] opacity-0 transition-all duration-200 group-hover/item:translate-x-1 group-hover/item:opacity-100" />
              </Link>
            </li>
          ))}
          <li className="mt-3 border-t border-gray-300 pt-3">
            <Link
              href={categoryHref}
              className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#F15C30] hover:text-[#d44a22]"
            >
              {hidden > 0 ? `View all ${services.length} →` : "Open category page →"}
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
}
