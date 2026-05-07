# Claude Code Prompt — UAE (AE) Design System + Full Site Build

Copy everything below the line into Claude Code.

---

## Task: Build the complete UAE site with a distinct blue-dominant design system

**Branch:** `feature/ae-design-system`

Read `CLAUDE.md` before starting.

**Design vision:** Corporate, trustworthy, technical, authoritative. Multiple shades of blue flowing through the entire design — deep navy hero, mid-blue accents, lighter blue panels, with warm cream/stone sections for breathing room. Inspired by Nobl.io (editorial serif statements, line-list capabilities, methodology panels) and The Set Studio (warm tones alongside blue, generous whitespace, marquee movement).

**CRITICAL:** This is a THIRD design system — completely different from SA (navy + orange cards) and NE (Nordic blue + sand, Fraunces/Syne fonts). UAE must have its own fonts, its own component set, and its own layout patterns.

---

## Part 1: UAE Color Palette

All blues share the same hue family but vary in lightness and saturation. Orange stays as the singular accent.

| Token | Hex | Use |
|-------|-----|-----|
| `ae-deep` | `#0A1628` | Hero backgrounds, deepest layer |
| `ae-navy` | `#0F2847` | Primary blue, nav bar, footer |
| `ae-ink` | `#163560` | Section backgrounds (methodology, dark panels) |
| `ae-mid` | `#1E5A8A` | Interactive elements, hover states, borders |
| `ae-sky` | `#2D7AB8` | Links, active states, accent borders |
| `ae-steel` | `#5A8FB4` | Secondary text on dark, muted accents |
| `ae-pale` | `#D4E3F0` | Light blue section backgrounds |
| `ae-ice` | `#EBF2F8` | Lightest blue tint for alternating rows |
| `ae-stone` | `#F2EDE6` | Warm cream sections (Nobl's cream equivalent) |
| `ae-warm` | `#F8F5F0` | Warmest white background |
| `ae-white` | `#FAFBFC` | Clean white background |
| `ae-orange` | `#F97316` | Accent — trust badges, active indicators, CTA buttons |

### Add to `tailwind.config.ts`

```ts
// Inside theme.extend.colors — ADD (do not remove existing colors):
aeDeep: "#0A1628",
aeNavy: "#0F2847",
aeInk: "#163560",
aeMid: "#1E5A8A",
aeSky: "#2D7AB8",
aeSteel: "#5A8FB4",
aePale: "#D4E3F0",
aeIce: "#EBF2F8",
aeStone: "#F2EDE6",
aeWarm: "#F8F5F0",
aeWhite: "#FAFBFC",
aeOrange: "#F97316",
```

---

## Part 2: UAE Typography

Use **DM Serif Display** (editorial, authoritative serif — similar to Nobl's Flecha) + **Inter** (clean, technical, trustworthy sans — the corporate standard).

### Add to `src/app/layout.tsx`

Import alongside existing fonts (do NOT remove Barlow, Poppins, Playfair, Fraunces, Syne):

```tsx
import { DM_Serif_Display } from "next/font/google";
import { Inter } from "next/font/google";

const dmSerif = DM_Serif_Display({
  subsets: ["latin"],
  weight: "400",
  variable: "--font-dm-serif",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});
```

Add `${dmSerif.variable} ${inter.variable}` to the `<body>` className (append to existing variables).

### Add to `tailwind.config.ts`

```ts
// Inside theme.extend.fontFamily — ADD:
"ae-display": ["var(--font-dm-serif)", "Georgia", "serif"],
"ae-body": ["var(--font-inter)", "system-ui", "sans-serif"],
"ae-nav": ["var(--font-inter)", "system-ui", "sans-serif"],
```

### Font usage rules

| Element | Font class | Weight | Size pattern |
|---------|-----------|--------|-------------|
| Hero H1 | `font-ae-display` | `font-normal` (400 is DM Serif's only weight) | `text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem]` |
| Section H2 | `font-ae-display` | `font-normal` | `text-3xl md:text-4xl lg:text-5xl` |
| H3 subheads | `font-ae-body` | `font-semibold` | `text-xl md:text-2xl` |
| Body text | `font-ae-body` | `font-normal` | `text-base` |
| Nav links | `font-ae-nav` | `font-medium` | `text-[13px] tracking-[0.08em]` |
| Eyebrow labels | `font-ae-nav` | `font-medium` | `text-xs uppercase tracking-[0.15em]` |
| CTA buttons | `font-ae-nav` | `font-semibold` | `text-sm uppercase tracking-[0.1em]` |

---

## Part 3: UAE Components

Create three new component files. Do NOT modify any existing SA or NE components.

### `src/components/ae-navbar.tsx`

```tsx
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
      {/* Thin blue accent line at very top */}
      <div className="fixed top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-[#1E5A8A] via-[#2D7AB8] to-[#1E5A8A] z-[60]" />

      <header
        className={`fixed top-[3px] left-0 right-0 z-50 transition-all duration-300 ${
          scrolled
            ? "bg-[#0F2847]/95 backdrop-blur-md shadow-lg"
            : "bg-[#0F2847]"
        }`}
      >
        <nav className="max-w-[1280px] mx-auto flex items-center justify-between h-16 px-6 lg:px-10">
          {/* Logo */}
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

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            <Link
              href={`/${config.cc}/`}
              className="font-ae-nav font-medium text-[13px] tracking-[0.08em] text-white/70 hover:text-white transition-colors uppercase"
            >
              Home
            </Link>

            {/* Services Dropdown */}
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

            {/* CTA */}
            <Link
              href={config.contactPath}
              className="font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] text-white bg-[#F97316] hover:bg-orange-600 px-6 py-2.5 transition-colors"
            >
              Contact
            </Link>
          </div>

          {/* Mobile hamburger */}
          <button
            className="lg:hidden text-white"
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
          >
            {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile menu */}
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
```

**Key differences from SA/NE navbars:**
- Gradient blue accent line at top (not solid orange like NE, not teal like SA)
- Sharp-cornered CTA (no rounded, no pill)
- `bg-[#0F2847]` navy — different shade from SA's `#0B1A2F` and NE's `#1A3650`
- Services dropdown has blue border accent, not orange
- Font: `font-ae-nav` (Inter) — clean, corporate

### `src/components/ae-footer.tsx`

```tsx
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Mail } from "lucide-react";
import type { CountryConfig } from "@/lib/countries-config";

interface AEFooterProps {
  config: CountryConfig;
}

export function AEFooter({ config }: AEFooterProps) {
  return (
    <footer className="bg-[#0A1628]">
      {/* Blue gradient separator */}
      <div className="h-[3px] bg-gradient-to-r from-[#1E5A8A] via-[#2D7AB8] to-[#1E5A8A]" />

      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/images/logo/carelabs-logo.png"
              alt="Carelabs"
              width={130}
              height={43}
              className="h-8 w-auto mb-6"
            />
            <p className="font-ae-body text-sm text-white/30 leading-relaxed">
              {config.footerDescription}
            </p>
          </div>

          {/* Services column */}
          <div>
            <h4 className="font-ae-nav font-semibold text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mb-5">
              Services
            </h4>
            <ul className="space-y-3">
              {config.services.map((s) => (
                <li key={s.href}>
                  <Link
                    href={s.href}
                    className="font-ae-body text-sm text-white/40 hover:text-white transition-colors"
                  >
                    {s.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Company column */}
          <div>
            <h4 className="font-ae-nav font-semibold text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mb-5">
              Company
            </h4>
            <ul className="space-y-3">
              <li><Link href={config.aboutPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">About</Link></li>
              <li><Link href={config.blogIndexPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">Insights</Link></li>
              {config.caseStudyPath && (
                <li><Link href={config.caseStudyPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">Case Studies</Link></li>
              )}
              <li><Link href={config.contactPath} className="font-ae-body text-sm text-white/40 hover:text-white transition-colors">Contact</Link></li>
            </ul>
          </div>

          {/* Contact column */}
          <div>
            <h4 className="font-ae-nav font-semibold text-xs uppercase tracking-[0.15em] text-[#2D7AB8] mb-5">
              Contact
            </h4>
            <a
              href="mailto:info@carelabz.com"
              className="font-ae-body text-sm text-white/40 hover:text-white transition-colors inline-flex items-center gap-2"
            >
              <Mail className="w-4 h-4 text-[#2D7AB8]" />
              info@carelabz.com
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-[#1E5A8A]/15 mt-14 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="font-ae-body text-xs text-white/20">
            &copy; {new Date().getFullYear()} Carelabs. All rights reserved.
          </p>
          <p className="font-ae-display text-4xl lg:text-5xl text-white/[0.03] uppercase tracking-widest select-none">
            CARELABS
          </p>
        </div>
      </div>
    </footer>
  );
}
```

### `src/components/ae-announcement-ticker.tsx`

```tsx
"use client";

import { useState } from "react";
import { X } from "lucide-react";

interface AEAnnouncementTickerProps {
  countryName: string;
  standards: string[];
}

export function AEAnnouncementTicker({ countryName, standards }: AEAnnouncementTickerProps) {
  const [visible, setVisible] = useState(true);
  if (!visible) return null;

  return (
    <div className="bg-[#163560] text-white relative z-[70]">
      <div className="max-w-[1280px] mx-auto flex items-center justify-between px-6 py-2">
        <p className="font-ae-body text-xs text-white/60">
          Trusted for <span className="text-[#F97316] font-medium">{standards[0]}</span> compliance across the {countryName}
        </p>
        <button
          onClick={() => setVisible(false)}
          className="text-white/30 hover:text-white transition-colors ml-4 shrink-0"
          aria-label="Dismiss"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
```

---

## Part 4: Add UAE to countries-config.ts

Add this entry to `COUNTRY_CONFIGS` in `src/lib/countries-config.ts`:

```ts
ae: {
  cc: "ae",
  countryName: "United Arab Emirates",
  countryNameLocative: "the UAE",
  hreflang: "en-AE",
  dialCodeCountryIso2: "AE",
  servicesIndexPath: "/ae/services/",
  serviceDetailPattern: "/ae/services/{slug}/",
  blogIndexPath: "/ae/blog/",
  blogDetailPattern: "/ae/blog/{slug}/",
  aboutPath: "/ae/about/",
  contactPath: "/ae/contact/",
  caseStudyPath: "/ae/case-studies/",
  address: "Dubai, United Arab Emirates",
  phone: "+971 4 000 0000",
  email: "info@carelabz.com",
  footerDescription:
    "Carelabs delivers DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the United Arab Emirates.",
  services: [
    { label: "Arc Flash Study", href: "/ae/services/arc-flash-study/" },
    { label: "Short Circuit Analysis", href: "/ae/services/short-circuit-analysis/" },
    { label: "Load Flow Analysis", href: "/ae/services/load-flow-analysis/" },
    { label: "Relay Coordination Study", href: "/ae/services/relay-coordination-study/" },
    { label: "Power System Protection", href: "/ae/services/power-system-protection-coordination-study/" },
    { label: "Cable Testing", href: "/ae/services/cable-testing-services/" },
  ],
  standards: ["DEWA", "IEEE 1584", "NFPA 70E", "IEC 61482", "IEC 60364"],
  primaryStandard: "DEWA",
  localCodeName: "DEWA Regulations & IEC Standards",
  localAuthority: "DEWA",
},
```

---

## Part 5: UAE Homepage — `src/app/ae/page.tsx`

Create the file. The layout blends Nobl's editorial authority with The Set Studio's warm blue palette — all through different shades of blue.

```tsx
export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Plus, Shield, Award, FileCheck, Zap } from "lucide-react";
import { AENavbar } from "@/components/ae-navbar";
import { AEFooter } from "@/components/ae-footer";
import { AEAnnouncementTicker } from "@/components/ae-announcement-ticker";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";
import { JsonLd } from "@/components/JsonLd";
import { getHomePage } from "@/lib/strapi-home";

const CC = "ae";
const config = COUNTRY_CONFIGS[CC];

function cleanTitle(raw: string): string {
  return raw
    .replace(/\s*\|\s*Care[Ll]ab[sz]\s*$/i, "")
    .replace(
      /\s*-\s*Carelabs\s*(UAE|United Arab Emirates|Dubai)\s*$/i,
      ""
    )
    .replace(/^Uncategorized Archives\s*-\s*/i, "")
    .replace(/^admin,\s*Author at\s*/i, "")
    .trim();
}

export async function generateMetadata(): Promise<Metadata> {
  const page = await getHomePage(CC);
  return {
    title:
      page?.metaTitle ??
      `Carelabs UAE — Electrical Safety & Power System Studies`,
    description:
      page?.metaDescription ??
      `Carelabs delivers DEWA-compliant arc flash studies, IEEE 1584 analysis, and full power system engineering across the United Arab Emirates.`,
    keywords: page?.seoKeywords ?? undefined,
    alternates: {
      canonical: `https://carelabz.com/${CC}/`,
      languages: {
        [config.hreflang]: `https://carelabz.com/${CC}/`,
        "x-default": `https://carelabz.com/${CC}/`,
      },
    },
    openGraph: {
      title:
        page?.metaTitle ??
        `Carelabs UAE — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.`,
      url: `https://carelabz.com/${CC}/`,
      siteName: "Carelabs",
      type: "website",
      locale: "en_AE",
    },
    twitter: {
      card: "summary_large_image",
      title:
        page?.metaTitle ??
        `Carelabs UAE — Electrical Safety & Power System Studies`,
      description:
        page?.metaDescription ??
        `DEWA-compliant arc flash studies, power system engineering, and electrical safety solutions across the UAE.`,
    },
  };
}

export default async function HomePage() {
  const page = await getHomePage(CC);

  if (!page) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-[#0A1628] text-white">
        <p className="font-ae-nav uppercase tracking-[0.18em] text-sm">
          Content unavailable — please try again shortly
        </p>
      </main>
    );
  }

  const jsonLdData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Carelabs",
    description: page.metaDescription,
    url: `https://carelabz.com/${CC}/`,
    telephone: page.footerPhone ?? config.phone,
    email: page.footerEmail ?? config.email,
    address: {
      "@type": "PostalAddress",
      addressLocality: page.footerAddress ?? config.address,
    },
  };

  return (
    <>
      <JsonLd data={jsonLdData} />
      <AEAnnouncementTicker
        countryName={config.countryName}
        standards={config.standards}
      />
      <AENavbar config={config} />

      {/* ═══════ 1 · HERO — Deep blue, centered editorial statement ═══════ */}
      <section className="min-h-screen flex items-center justify-center bg-[#0A1628] px-6 relative overflow-hidden">
        {/* Subtle radial glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_#163560_0%,_transparent_70%)] opacity-30" />
        <div className="text-center max-w-5xl py-24 relative z-10">
          <p className="font-ae-nav font-medium text-xs uppercase tracking-[0.2em] text-[#2D7AB8] mb-8">
            Power System Engineering
          </p>
          <h1 className="font-ae-display text-5xl sm:text-6xl md:text-7xl lg:text-[5.5rem] text-white leading-[0.95] tracking-tight">
            {page.heroHeadline ?? "Electrical Safety Demands Precision."}
          </h1>
          <p className="font-ae-body text-lg md:text-xl text-[#5A8FB4] mt-8 max-w-2xl mx-auto leading-relaxed">
            {page.heroSubtext ?? "DEWA-compliant arc flash studies, power system analysis, and electrical safety engineering across the UAE."}
          </p>
          <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href={page.heroPrimaryCtaHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
            >
              {page.heroPrimaryCtaText ?? "Get a Quote"}
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href={page.heroSecondaryCtaHref ?? config.servicesIndexPath}
              className="inline-flex items-center gap-2 border border-[#1E5A8A] hover:border-[#2D7AB8] text-white/70 hover:text-white font-ae-nav font-medium text-sm uppercase tracking-[0.1em] px-8 py-3.5 transition-colors"
            >
              {page.heroSecondaryCtaText ?? "Our Services"}
            </Link>
          </div>
        </div>
      </section>

      {/* ═══════ 2 · TRUST BAR — Blue mid-tone band ═══════ */}
      <section className="bg-[#163560] py-8 px-6">
        <div className="max-w-[1200px] mx-auto flex flex-wrap items-center justify-center gap-8 lg:gap-16">
          {(page.trustBadges ?? [
            { text: "DEWA Approved" },
            { text: "IEEE 1584 Certified" },
            { text: "NFPA 70E Compliant" },
            { text: "IEC 61482 Aligned" },
          ]).map((badge: { text: string }, i: number) => (
            <div key={i} className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-[#F97316]" />
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.12em] text-white/50">
                {badge.text}
              </span>
            </div>
          ))}
        </div>
      </section>

      {/* ═══════ 3 · BRAND STATEMENT — Stone warm block (Nobl's red → our stone) ═══════ */}
      <section className="bg-[#F2EDE6] py-16 lg:py-24 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <p className="font-ae-display text-2xl md:text-3xl lg:text-4xl text-[#0F2847] leading-snug">
            We protect people, facilities, and operations through rigorous power system engineering and DEWA-compliant safety studies.
          </p>
        </div>
      </section>

      {/* ═══════ 4 · SERVICES — Editorial line-list on ice blue (Nobl pattern) ═══════ */}
      {page.services && page.services.length > 0 && (
        <section className="bg-[#EBF2F8] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                Capabilities
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-[#0F2847] leading-[0.95]">
                What We Do
              </h2>
            </div>
            <div className="divide-y divide-[#0F2847]/10">
              {page.services.slice(0, 8).map((service, i) => (
                <Link
                  key={service.href}
                  href={service.href}
                  className="group flex items-center justify-between py-6 gap-6"
                >
                  <div className="flex items-center gap-6">
                    <span className="font-ae-display text-3xl text-[#0F2847]/10 w-12 shrink-0">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <h3 className="font-ae-body font-semibold text-lg md:text-xl text-[#0F2847] group-hover:text-[#1E5A8A] transition-colors">
                      {service.title}
                    </h3>
                  </div>
                  <ArrowRight className="w-5 h-5 text-[#0F2847]/15 group-hover:text-[#2D7AB8] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={config.servicesIndexPath}
                className="font-ae-nav font-medium text-sm uppercase tracking-[0.15em] text-[#2D7AB8] hover:text-[#1E5A8A] inline-flex items-center gap-2 transition-colors"
              >
                View All Services <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 5 · MANIFESTO — Full viewport, deep blue (Nobl statement) ═══════ */}
      <section className="bg-[#0F2847] flex items-center justify-center px-6 py-28 lg:py-40">
        <div className="text-center max-w-4xl">
          <h2 className="font-ae-display text-4xl md:text-5xl lg:text-6xl text-white leading-[0.95]">
            We don&apos;t deliver reports.
          </h2>
          <p className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-[#2D7AB8] mt-5 leading-[0.95]">
            We deliver certainty.
          </p>
        </div>
      </section>

      {/* ═══════ 6 · METHODOLOGY — Dark ink panels with blue numbers ═══════ */}
      <section className="bg-[#163560] py-20 lg:py-28">
        <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
          <div className="text-center mb-16">
            <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8]/60 mb-4 block">
              Methodology
            </span>
            <h2 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-white leading-[0.95]">
              How We Work
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-px bg-[#1E5A8A]/20">
            {(page.processSteps ?? [
              { title: "Discovery", description: "Deep-dive into your electrical infrastructure and compliance posture." },
              { title: "Analysis", description: "Arc flash, short circuit, load flow — the full IEEE 1584 study suite." },
              { title: "Reporting", description: "Actionable documentation with risk scores, labels, and remediation steps." },
              { title: "Compliance", description: "Full alignment with DEWA regulations and international standards." },
            ]).map((step: { title: string; description: string }, i: number) => (
              <div key={i} className="bg-[#163560] p-8">
                <span className="font-ae-display text-5xl text-[#2D7AB8]/15 block">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="font-ae-body font-semibold text-lg text-white uppercase mt-6 tracking-wide">
                  {step.title}
                </h3>
                <p className="font-ae-body text-sm text-white/35 mt-4 leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ 7 · INDUSTRIES MARQUEE ═══════ */}
      {page.industries && page.industries.length > 0 && (
        <section className="bg-[#F8F5F0] py-12 overflow-hidden">
          <div className="relative">
            <div className="animate-marquee whitespace-nowrap">
              {[...Array(2)].map((_, dupe) => (
                <span key={dupe} className="inline-block">
                  {page.industries!.map((industry, i) => (
                    <span
                      key={`${dupe}-${i}`}
                      className="inline-block mx-8 font-ae-display text-6xl md:text-8xl uppercase text-[#0F2847]/[0.05]"
                    >
                      {industry.name}
                      <span className="text-[#2D7AB8]/15 mx-8">·</span>
                    </span>
                  ))}
                </span>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 8 · INSIGHTS — Editorial list on pale blue ═══════ */}
      {page.insights && page.insights.length > 0 && (
        <section className="bg-[#D4E3F0] py-20 lg:py-28">
          <div className="max-w-[1200px] mx-auto px-6 lg:px-12">
            <div className="text-center mb-16">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#1E5A8A] mb-4 block">
                Insights
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl lg:text-5xl text-[#0F2847] leading-[0.95]">
                From the Blog
              </h2>
            </div>
            <div className="divide-y divide-[#0F2847]/10">
              {page.insights.slice(0, 5).map((insight, i) => (
                <Link
                  key={i}
                  href={insight.href}
                  className="group flex items-center justify-between py-6 gap-6"
                >
                  <h3 className="font-ae-body font-semibold text-lg md:text-xl text-[#0F2847] group-hover:text-[#1E5A8A] transition-colors">
                    {cleanTitle(insight.title)}
                  </h3>
                  <ArrowRight className="w-5 h-5 text-[#0F2847]/15 group-hover:text-[#2D7AB8] transition-colors shrink-0" />
                </Link>
              ))}
            </div>
            <div className="text-center mt-12">
              <Link
                href={config.blogIndexPath}
                className="font-ae-nav font-medium text-sm uppercase tracking-[0.15em] text-[#1E5A8A] hover:text-[#0F2847] inline-flex items-center gap-2 transition-colors"
              >
                Read All Articles <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* ═══════ 9 · FAQ ═══════ */}
      {page.faqs && page.faqs.length > 0 && (
        <section className="bg-[#F8F5F0] py-16 lg:py-24">
          <div className="max-w-3xl mx-auto px-6 lg:px-12">
            <div className="text-center mb-12">
              <span className="font-ae-nav font-medium text-xs uppercase tracking-[0.18em] text-[#2D7AB8] mb-4 block">
                FAQ
              </span>
              <h2 className="font-ae-display text-3xl md:text-4xl text-[#0F2847]">
                Common Questions
              </h2>
            </div>
            {page.faqs.map((faq, i) => (
              <details key={i} className="group border-b border-[#0F2847]/10 py-5">
                <summary className="flex items-start justify-between gap-4 cursor-pointer list-none font-ae-body font-semibold text-base md:text-lg text-[#0F2847]">
                  <span>{faq.question}</span>
                  <Plus className="w-5 h-5 text-[#2D7AB8] shrink-0 mt-0.5 transition-transform group-open:rotate-45" />
                </summary>
                <p className="font-ae-body text-base text-[#0F2847]/50 mt-3 leading-relaxed">
                  {faq.answer}
                </p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* ═══════ 10 · CTA — Nobl's "Let's Talk." but corporate ═══════ */}
      <section className="bg-[#0F2847] py-28 lg:py-40 px-6">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-ae-display text-5xl md:text-6xl lg:text-7xl text-white leading-[0.92]">
            Let&apos;s Talk.
          </h2>
          <p className="font-ae-body text-lg text-[#5A8FB4] mt-6 max-w-xl mx-auto">
            Tell us about your facility and compliance requirements.
          </p>
          <div className="mt-10">
            <Link
              href={page.ctaBannerPrimaryHref ?? config.contactPath}
              className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-orange-600 text-white font-ae-nav font-semibold text-sm uppercase tracking-[0.1em] px-10 py-4 transition-colors"
            >
              Contact Us
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      <AEFooter config={config} />
    </>
  );
}
```

---

## Part 6: Build remaining AE pages

Using the AE components and design system, create these route files:

### `src/app/ae/services/page.tsx`
- Services index page
- Use `getServicesByRegion("ae")` from `src/lib/strapi.ts`
- Grid layout on `bg-[#EBF2F8]` (ice blue)
- Cards with `bg-white border border-[#D4E3F0]` — clean, no shadows
- `AENavbar` + `AEFooter`

### `src/app/ae/services/[category]/page.tsx`
- Category index — filter services by category
- Same grid layout pattern

### `src/app/ae/services/[category]/[slug]/page.tsx`
- Individual service page
- Hero: `bg-[#0A1628]` with service title in `font-ae-display`
- Sections alternate between `bg-[#F8F5F0]`, `bg-[#EBF2F8]`, `bg-white`
- FAQ accordion with `Plus` icon in `text-[#2D7AB8]`

### `src/app/ae/blog/page.tsx`
- Blog index
- Use `getBlogPosts("ae")`
- Cards on `bg-[#F2EDE6]` (stone)

### `src/app/ae/blog/[slug]/page.tsx`
- Individual blog post
- Content on `bg-white`, sidebar on `bg-[#EBF2F8]`

### `src/app/ae/about/page.tsx`
- Use `getAboutPage("ae")`
- Hero on `bg-[#0A1628]`, content sections alternating blue/stone

### `src/app/ae/contact/page.tsx`
- Use `getContactPage("ae")`
- Form on `bg-[#F8F5F0]`
- Email only: `info@carelabz.com`

### `src/app/ae/case-studies/page.tsx`
- Use `getCaseStudies("ae")`
- Grid on `bg-[#EBF2F8]`

### `src/app/ae/case-studies/[slug]/page.tsx`
- Individual case study

**For ALL AE pages:**
- `export const dynamic = "force-dynamic";` at top
- Use `AENavbar`, `AEFooter`, `AEAnnouncementTicker`
- Use `font-ae-display`, `font-ae-body`, `font-ae-nav` classes
- Use AE color palette — never SA colors (`#0B1A2F`, `bg-navy`) or NE colors (`#1A3650`, `bg-[#F0EBE1]`)
- Include `generateMetadata()` with SEO fields
- Include `JsonLd` schema
- `cleanTitle()` helper where blog/insight titles are displayed
- All Strapi fields use `??` null coalescing

---

## Part 7: Design System Comparison (verify no overlap)

| Element | SA (US/BR/MX) | NE (UK/IE/SE/NO/DK/FI) | UAE (AE) |
|---------|-------------|----------------------|---------|
| Primary BG | `#0B1A2F` | `#1A3650` | `#0A1628` |
| Mid accent | teal/orange gradient | `#4A7C9B` | `#1E5A8A` + `#2D7AB8` |
| Light BG | `#F8FAFC` | `#F0EBE1` sand | `#EBF2F8` ice blue |
| Warm BG | white | `#F9F7F3` | `#F2EDE6` stone |
| Display font | Barlow Condensed | Fraunces | DM Serif Display |
| Body font | Poppins | Syne | Inter |
| Accent font | Playfair Display | Fraunces italic | — (DM Serif only) |
| Nav top accent | none | 2px orange solid | 3px blue gradient |
| CTA shape | rounded | sharp / pill (CTA only) | sharp (all) |
| Hero layout | split image+text | centered statement | centered + radial glow |
| Manifesto text | none | orange italic accent | blue `#2D7AB8` accent |
| Hover color | orange | orange | blue `#1E5A8A` |
| FAQ icon color | orange | orange | blue `#2D7AB8` |

---

## Verification

1. `npx tsc --noEmit` — zero errors
2. `npx next lint` — zero warnings
3. `npm run build` — all AE routes compile
4. **Grep check**: `grep -rn "bg-navy\|#0B1A2F\|#1A3650\|font-ne-\|font-condensed\|font-accent" src/app/ae/` must return ZERO results (no SA/NE design leakage)
5. **Grep check**: `grep -rn "bg-\[#0A1628\]\|bg-\[#0F2847\]\|bg-\[#163560\]\|font-ae-" src/app/ae/` must return MULTIPLE results (AE design system in use)
6. Commit: `feat: add UAE (AE) design system with blue-dominant palette and full site build`
7. Push: `git push origin main && git push company main`
