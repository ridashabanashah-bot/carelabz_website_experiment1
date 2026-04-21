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
  uk: {
    cc: "uk",
    countryName: "United Kingdom",
    countryNameLocative: "the UK",
    hreflang: "en-GB",
    dialCodeCountryIso2: "GB",
    servicesIndexPath: "/uk/our-services/",
    serviceDetailPattern: "/uk/{slug}/",
    blogIndexPath: "/uk/blogs/",
    blogDetailPattern: "/uk/{slug}/",
    aboutPath: "/uk/about-us/",
    contactPath: "/uk/contact-us/",
    caseStudyPath: null,
    address: "London, United Kingdom",
    phone: "+44 (20) 0000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers BS 7671 arc flash studies, IET Wiring Regulations compliance, and full power system engineering services across the UK.",
    services: [
      { label: "Arc Flash Study", href: "/uk/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/uk/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/uk/motor-start-analysis/" },
      { label: "Power System Study", href: "/uk/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/uk/power-quality-analysis/" },
    ],
    standards: ["BS 7671", "IET Wiring Regulations", "HSR25", "IEEE 1584", "IEC 60909", "ETAP"],
    primaryStandard: "BS 7671",
    localCodeName: "BS 7671 / IET Wiring Regulations",
    localAuthority: "HSE (Health and Safety Executive)",
  },
  pe: {
    cc: "pe",
    countryName: "Peru",
    countryNameLocative: "Peru",
    hreflang: "en-PE",
    dialCodeCountryIso2: "PE",
    servicesIndexPath: "/pe/services/",
    serviceDetailPattern: "/pe/{slug}/",
    blogIndexPath: "/pe/blogs/",
    blogDetailPattern: "/pe/{slug}/",
    aboutPath: "/pe/about-us/",
    contactPath: "/pe/contact-us/",
    caseStudyPath: null,
    address: "Lima, Peru",
    phone: "+51 (1) 000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers RM 111-2013-MEM arc flash studies, CNE-aligned compliance, and full power system engineering services across Peru.",
    services: [
      { label: "Arc Flash Study", href: "/pe/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/pe/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/pe/motor-start-analysis/" },
      { label: "Power System Study", href: "/pe/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/pe/power-quality-analysis/" },
    ],
    standards: ["RM 111-2013-MEM", "CNE", "IEEE 1584", "IEC 60909", "ETAP"],
    primaryStandard: "RM 111-2013-MEM",
    localCodeName: "CNE (Código Nacional de Electricidad)",
    localAuthority: "OSINERGMIN",
  },
  ar: {
    cc: "ar",
    countryName: "Argentina",
    countryNameLocative: "Argentina",
    hreflang: "en-AR",
    dialCodeCountryIso2: "AR",
    servicesIndexPath: "/ar/services/",
    serviceDetailPattern: "/ar/{slug}/",
    blogIndexPath: "/ar/blogs/",
    blogDetailPattern: "/ar/{slug}/",
    aboutPath: "/ar/about-us/",
    contactPath: "/ar/contact-us/",
    caseStudyPath: null,
    address: "Buenos Aires, Argentina",
    phone: "+54 (11) 0000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers AEA 90364 arc flash studies, IRAM 2281 compliance, and full power system engineering services across Argentina.",
    services: [
      { label: "Arc Flash Study", href: "/ar/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/ar/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/ar/motor-start-analysis/" },
      { label: "Power System Study", href: "/ar/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/ar/power-quality-analysis/" },
    ],
    standards: ["AEA 90364", "IRAM 2281", "IEEE 1584", "IEC 60909", "ETAP"],
    primaryStandard: "AEA 90364",
    localCodeName: "Reglamentación AEA 90364",
    localAuthority: "ENRE",
  },
  cl: {
    cc: "cl",
    countryName: "Chile",
    countryNameLocative: "Chile",
    hreflang: "en-CL",
    dialCodeCountryIso2: "CL",
    servicesIndexPath: "/cl/services/",
    serviceDetailPattern: "/cl/{slug}/",
    blogIndexPath: "/cl/blogs/",
    blogDetailPattern: "/cl/{slug}/",
    aboutPath: "/cl/about-us/",
    contactPath: "/cl/contact-us/",
    caseStudyPath: null,
    address: "Santiago, Chile",
    phone: "+56 (2) 000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers NCh Elec. 4/2003 arc flash studies, SEC-aligned compliance, and full power system engineering services across Chile.",
    services: [
      { label: "Arc Flash Study", href: "/cl/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/cl/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/cl/motor-start-analysis/" },
      { label: "Power System Study", href: "/cl/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/cl/power-quality-analysis/" },
    ],
    standards: ["NCh Elec. 4/2003", "NSEG 5 En. 71", "IEEE 1584", "IEC 60909", "ETAP"],
    primaryStandard: "NCh Elec. 4/2003",
    localCodeName: "NCh Elec. 4/2003 (Chilean Electrical Code)",
    localAuthority: "SEC (Superintendencia de Electricidad y Combustibles)",
  },
  co: {
    cc: "co",
    countryName: "Colombia",
    countryNameLocative: "Colombia",
    hreflang: "en-CO",
    dialCodeCountryIso2: "CO",
    servicesIndexPath: "/co/services/",
    serviceDetailPattern: "/co/{slug}/",
    blogIndexPath: "/co/blogs/",
    blogDetailPattern: "/co/{slug}/",
    aboutPath: "/co/about-us/",
    contactPath: "/co/contact-us/",
    caseStudyPath: null,
    address: "Bogotá, Colombia",
    phone: "+57 (1) 000-0000",
    email: "info@carelabz.com",
    footerDescription:
      "Carelabs delivers RETIE arc flash studies, NTC 2050 compliance, and full power system engineering services across Colombia.",
    services: [
      { label: "Arc Flash Study", href: "/co/arc-flash-study/" },
      { label: "Harmonic Study & Analysis", href: "/co/harmonic-study-and-analysis/" },
      { label: "Motor Start Analysis", href: "/co/motor-start-analysis/" },
      { label: "Power System Study", href: "/co/power-system-study-and-analysis/" },
      { label: "Power Quality Analysis", href: "/co/power-quality-analysis/" },
    ],
    standards: ["RETIE", "NTC 2050", "IEEE 1584", "IEC 60909", "ETAP"],
    primaryStandard: "RETIE",
    localCodeName: "NTC 2050 (Colombian Electrical Code)",
    localAuthority: "Ministerio de Minas y Energía",
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
