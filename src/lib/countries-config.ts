// Country configuration registry. One entry per live country subdirectory.
// Used by <RegionNavbar>, <RegionFooter>, <RegionMobileNav>, and page metadata.
// Adding a new country:
//   1. Add an entry here
//   2. Create pages in src/app/[cc]/
//   3. Add sitemap + redirect entries in sitemap.ts / next.config.mjs
//
// Do NOT include "us" or "ca" here — those keep their legacy dedicated components
// (us-footer.tsx, sticky-navbar.tsx, ca-footer.tsx, ca-navbar.tsx) for zero regression risk.

export interface CountryNavService {
  label: string;
  href: string;
}

export interface CountryConfig {
  cc: string;                       // "mx", "br", ...
  countryName: string;              // "Mexico"
  countryNameLocative: string;      // "Mexico" for "in Mexico"
  hreflang: string;                 // "en-MX"
  dialCodeCountryIso2: string;      // "MX" (used as contact form default)

  // URL layout (differs per country)
  servicesIndexPath: string;        // "/mx/service/"
  serviceDetailPattern: string;     // "/mx/{slug}/" or "/mx/services/{slug}/"
  blogIndexPath: string;            // "/mx/blogs/" or "/mx/blog/" or "/mx/our-blogs/"
  blogDetailPattern: string;        // "/mx/{slug}/" or "/mx/blog/{slug}/"
  aboutPath: string;                // "/mx/about-us/"
  contactPath: string;              // "/mx/contact-us/"
  caseStudyPath: string | null;     // "/mx/case-study/" or null

  // Footer / contact
  address: string;                  // "Mexico City, Mexico"
  phone: string;                    // "+52 (800) 000-0000"
  email: string;                    // "info@carelabz.com"
  footerDescription: string;        // full sentence

  // Services shown in nav dropdown + footer (label + relative href)
  services: CountryNavService[];

  // Local electrical standards (used in Strapi seoKeywords, trust badges, etc.)
  standards: string[];              // ["NOM-029-STPS-2011", "IEEE 1584", ...]
  primaryStandard: string;          // "NOM-029-STPS-2011"
  localCodeName: string;            // "Mexican Electrical Code (NOM-001-SEDE)"
  localAuthority: string;           // "STPS"
}

// Helper to build standard service list from slugs
function defaultServices(cc: string, pattern: (slug: string) => string): CountryNavService[] {
  return [
    { label: "Arc Flash Study", href: pattern("arc-flash-study") },
    { label: "Short Circuit Analysis", href: pattern("short-circuit-analysis") },
    { label: "Load Flow Analysis", href: pattern("load-flow-analysis") },
    { label: "Relay Coordination Study", href: pattern("relay-coordination-study") },
  ];
}

export const COUNTRY_CONFIGS: Record<string, CountryConfig> = {
  mx: {
    cc: "mx",
    countryName: "Mexico",
    countryNameLocative: "Mexico",
    hreflang: "en-MX",
    dialCodeCountryIso2: "MX",
    servicesIndexPath: "/mx/service/",
    serviceDetailPattern: "/mx/{slug}/",
    blogIndexPath: "/mx/blogs/",
    blogDetailPattern: "/mx/{slug}/",
    aboutPath: "/mx/about-us/",
    contactPath: "/mx/contact-us/",
    caseStudyPath: null,
    address: "Mexico City, Mexico",
    phone: "+52 (55) 0000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers NOM-029 arc flash studies, NOM-001-SEDE compliance, and full power system engineering services across Mexico.",
    services: defaultServices("mx", (s) => `/mx/${s}/`),
    standards: [
      "NOM-029-STPS-2011",
      "NOM-001-SEDE",
      "IEEE 1584",
      "IEC 60909",
      "ETAP",
      "NFPA 70E",
    ],
    primaryStandard: "NOM-029-STPS-2011",
    localCodeName: "Mexican Electrical Code (NOM-001-SEDE)",
    localAuthority: "STPS (Secretaría del Trabajo)",
  },
  br: {
    cc: "br",
    countryName: "Brazil",
    countryNameLocative: "Brazil",
    hreflang: "en-BR",
    dialCodeCountryIso2: "BR",
    servicesIndexPath: "/br/services/",
    serviceDetailPattern: "/br/{slug}/",
    blogIndexPath: "/br/blogs/",
    blogDetailPattern: "/br/{slug}/",
    aboutPath: "/br/about-us/",
    contactPath: "/br/contact-us/",
    caseStudyPath: null,
    address: "São Paulo, Brazil",
    phone: "+55 (11) 0000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers NR-10 arc flash studies, ABNT NBR 5410 compliance, and full power system engineering services across Brazil.",
    services: [
      { label: "Arc Flash Study", href: "/br/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/br/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/br/motor-start-analysis/" },
      { label: "Power System Study", href: "/br/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/br/power-quality-analysis/" },
    ],
    standards: [
      "NR-10",
      "ABNT NBR 5410",
      "IEEE 1584",
      "IEC 60909",
      "ETAP",
    ],
    primaryStandard: "NR-10",
    localCodeName: "ABNT NBR 5410 (Brazilian Electrical Installations)",
    localAuthority: "Ministério do Trabalho",
  },
};
