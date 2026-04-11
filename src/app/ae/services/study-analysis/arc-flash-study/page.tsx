import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Shield,
  Zap,
  FileText,
  Users,
  CheckCircle,
  ArrowRight,
  Phone,
  Mail,
  MapPin,
  Linkedin,
  Twitter,
  Facebook,
} from "lucide-react";
import { StickyNavbar } from "@/components/sticky-navbar";
import { FaqAccordion, type FAQItem } from "@/components/faq-accordion";
import { JsonLd } from "@/components/JsonLd";
import { getServicePageBySlug } from "@/lib/strapi";

/* ------------------------------------------------------------------ */
/*  TypeScript Interfaces                                              */
/* ------------------------------------------------------------------ */

interface TrustBadge {
  label: string;
  icon: string;
}

interface FeatureCard {
  icon: "shield" | "zap" | "file-text" | "users";
  title: string;
  description: string;
}

interface BulletPoint {
  text: string;
}

interface ContentSection {
  eyebrow?: string;
  heading: string;
  description: string;
  bullets?: BulletPoint[];
  image: string;
  imageAlt: string;
}

interface ProcessStep {
  step: string;
  title: string;
  description: string;
}

interface IndustryCard {
  name: string;
  image: string;
  imageAlt: string;
}

interface InsightCard {
  category: string;
  title: string;
  excerpt: string;
  href: string;
  image: string;
  imageAlt: string;
}

interface FooterLink {
  label: string;
  href: string;
}

interface ContactInfo {
  address: string;
  phone: string;
  email: string;
}

interface PageData {
  hero: {
    eyebrow: string;
    headline: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
    image: string;
    imageAlt: string;
  };
  trustBadges: TrustBadge[];
  challenges: {
    heading: string;
    subheading: string;
    features: FeatureCard[];
  };
  safetySection: ContentSection;
  reportsSection: ContentSection;
  riskAssessment: {
    heading: string;
    steps: ProcessStep[];
  };
  industries: {
    heading: string;
    cards: IndustryCard[];
  };
  insights: {
    heading: string;
    cards: InsightCard[];
  };
  faqs: FAQItem[];
  cta: {
    heading: string;
    subtext: string;
    primaryCta: string;
    secondaryCta: string;
  };
  footer: {
    companyBlurb: string;
    services: FooterLink[];
    industries: FooterLink[];
    contact: ContactInfo;
  };
}

/* ------------------------------------------------------------------ */
/*  Hardcoded Page Content (Phase 1 — Strapi only supplies             */
/*  title / metaTitle / metaDescription / faqs)                        */
/* ------------------------------------------------------------------ */

const FALLBACK_TITLE = "Arc Flash Study & Analysis in Dubai, UAE";
const FALLBACK_META_TITLE =
  "Arc Flash Study & Analysis in Dubai, UAE | CareLAbz";
const FALLBACK_META_DESCRIPTION =
  "CareLAbz: IEEE 1584 arc flash studies in Dubai and the UAE. ETAP modelling, DEWA-compliant reports, PPE labelling, incident energy mitigation — 2–6 weeks.";

const FALLBACK_FAQS: FAQItem[] = [
  {
    question: "What is an arc flash study and why is it required in the UAE?",
    answer:
      "An arc flash study is an engineering analysis that calculates the incident energy available at each point in an electrical system where workers may be exposed. It determines arc flash boundaries, hazard risk categories, and required PPE levels. In the UAE, DEWA regulations and international standards such as NFPA 70E and IEEE 1584 require facility owners to assess and mitigate arc flash hazards to protect personnel and ensure regulatory compliance.",
  },
  {
    question: "How long does an arc flash study take in Dubai?",
    answer:
      "A typical arc flash study takes between 2 and 6 weeks depending on the size and complexity of the electrical system. The timeline includes on-site data collection, power system modelling in ETAP software, short-circuit and coordination analysis, incident energy calculations, and final report preparation. Larger facilities with multiple substations may require additional time.",
  },
  {
    question: "What does an arc flash study include?",
    answer:
      "A complete arc flash study includes on-site data collection of all electrical equipment, single-line diagram verification, short-circuit analysis, protective device coordination study, incident energy calculations at every working point, arc flash hazard labels for panels and switchgear, a detailed engineering report with PPE recommendations, and remediation guidance to reduce incident energy levels where possible.",
  },
  {
    question: "How much does an arc flash study cost in the UAE?",
    answer:
      "Arc flash studies in the UAE typically range from AED 15,000 for a small single-substation facility to AED 80,000+ for large multi-building industrial sites. CareLAbz quotes are based on the number of panels surveyed, switchgear count, drawing availability, and whether protection setting optimization is required. Most mid-sized commercial projects fall in the AED 25,000–45,000 range. Contact us for a no-obligation proposal.",
  },
  {
    question: "Which industries need arc flash studies in Dubai?",
    answer:
      "Arc flash studies are essential for any facility with medium- or low-voltage electrical distribution. Key industries include oil and gas, manufacturing, data centres, hospitals and healthcare facilities, hotels and hospitality, commercial buildings, district cooling plants, and utility substations. Any workplace where personnel interact with energised electrical equipment should have an up-to-date arc flash study.",
  },
  {
    question:
      "What standards does CareLAbz follow for arc flash studies in UAE?",
    answer:
      "CareLAbz follows internationally recognised standards including IEEE 1584 (Guide for Performing Arc-Flash Hazard Calculations), NFPA 70E (Standard for Electrical Safety in the Workplace), and IEC 61482 for protective clothing against thermal hazards of an electric arc. All studies also comply with DEWA requirements and local authority regulations applicable in Dubai and the wider UAE.",
  },
  {
    question: "Is an arc flash study legally required in the UAE?",
    answer:
      "The UAE does not yet have a single federal arc flash law, but DEWA regulations, employer duty of care under UAE Labour Law, and insurance underwriting requirements effectively mandate arc flash studies for any facility operating significant medium- or low-voltage equipment. IEEE 1584 and NFPA 70E are the de facto global standards that authorities, insurers, and auditors use to assess whether a UAE facility has met its electrical safety obligations.",
  },
  {
    question:
      "What is the difference between arc flash and short circuit analysis?",
    answer:
      "Short circuit analysis calculates the fault current that flows during a bolted, zero-impedance fault and is used to size breakers, cables, and switchgear. Arc flash analysis builds on top of that short circuit result to calculate the incident energy released when a fault sustains an arc, which determines worker PPE and boundary distances. The two studies are complementary — you cannot perform an accurate arc flash study without first completing a short circuit analysis.",
  },
  {
    question: "How often should an arc flash study be updated?",
    answer:
      "NFPA 70E 2024 Article 130.5(G) requires arc flash studies to be reviewed at least every 5 years, or sooner after any significant modification to the electrical system such as new equipment, upstream utility changes, or revised protection settings. CareLAbz offers dedicated update services and can re-run existing ETAP models substantially faster than a full original study, keeping your labels and PPE categories continuously compliant.",
  },
  {
    question: "Who performs arc flash studies in Dubai?",
    answer:
      "Arc flash studies in Dubai are performed by qualified electrical engineers with power system analysis experience, typically working for specialist consulting firms such as CareLAbz. The engineer must understand IEEE 1584 calculation methods, be proficient in ETAP or equivalent software, and have practical field experience collecting data from live electrical installations. For Dubai projects, clients generally prefer DEWA-approved consultants with a proven track record in UAE industrial and commercial facilities.",
  },
];

function buildPageData(overrides: {
  headline: string;
  subtext: string;
  faqs: FAQItem[];
}): PageData {
  return {
    hero: {
      eyebrow: "POWER SYSTEM SAFETY",
      headline: overrides.headline,
      subtext: overrides.subtext,
      primaryCta: "Request a Quote",
      secondaryCta: "Download Brochure",
      image: "/images/hero-arc-flash.jpg",
      imageAlt:
        "CareLAbz engineer performing on-site arc flash data collection at a Dubai industrial facility",
    },
    trustBadges: [
      { label: "DEWA Compliant", icon: "dewa" },
      { label: "IEEE 1584", icon: "ieee" },
      { label: "NFPA 70E", icon: "nfpa" },
      { label: "ETAP Software", icon: "etap" },
    ],
    challenges: {
      heading: "Solving Your Critical Infrastructure Challenges",
      subheading:
        "Our engineering expertise helps you identify and mitigate electrical hazards before they become incidents.",
      features: [
        {
          icon: "shield",
          title: "Hazard Identification",
          description:
            "Comprehensive analysis of your electrical system to identify all potential arc flash hazards at every working point.",
        },
        {
          icon: "zap",
          title: "Incident Energy Calculations",
          description:
            "Precise calculations using ETAP software to determine incident energy levels and arc flash boundaries.",
        },
        {
          icon: "file-text",
          title: "Compliance Documentation",
          description:
            "Complete documentation package meeting DEWA, IEEE 1584, and NFPA 70E requirements for audits and inspections.",
        },
      ],
    },
    safetySection: {
      eyebrow: "COMPREHENSIVE PROTECTION",
      heading: "Inventive Support for Elevating Safety",
      description:
        "Our arc flash studies provide the foundation for a safer workplace. We combine advanced power system modeling with practical engineering recommendations to reduce risk across your facility.",
      bullets: [
        { text: "On-site data collection and system verification" },
        { text: "Single-line diagram development and validation" },
        { text: "Short-circuit and protective device coordination" },
        { text: "PPE category recommendations for each location" },
        { text: "Arc flash warning labels for all equipment" },
        { text: "Remediation strategies to reduce incident energy" },
      ],
      image: "/images/safety-assessment.jpg",
      imageAlt:
        "Qualified worker wearing NFPA 70E compliant arc flash PPE during live electrical work in the UAE",
    },
    reportsSection: {
      eyebrow: "DETAILED DELIVERABLES",
      heading: "Arc Flash Reports",
      description:
        "Every study culminates in a comprehensive engineering report that serves as your roadmap to electrical safety compliance. Our reports are designed to be actionable, providing clear guidance for facility managers, safety officers, and maintenance teams.",
      bullets: [
        { text: "Executive summary with key findings and priorities" },
        { text: "Incident energy values at each equipment location" },
        { text: "Arc flash boundary distances and working distances" },
        { text: "PPE requirements by hazard risk category" },
        { text: "Equipment labeling specifications per NFPA 70E" },
        { text: "Recommendations for hazard mitigation" },
      ],
      image: "/images/arc-flash-report.jpg",
      imageAlt:
        "IEEE 1584 compliant arc flash hazard report with incident energy calculations for a DEWA-regulated facility",
    },
    riskAssessment: {
      heading: "Arc Flash Risk Assessment",
      steps: [
        {
          step: "01",
          title: "Data Collection",
          description:
            "On-site survey of all electrical equipment including switchgear, panels, transformers, and protective devices.",
        },
        {
          step: "02",
          title: "System Modeling",
          description:
            "Build accurate power system model in ETAP software with verified equipment parameters and configurations.",
        },
        {
          step: "03",
          title: "Short-Circuit Analysis",
          description:
            "Calculate available fault currents at each bus and equipment location throughout the system.",
        },
        {
          step: "04",
          title: "Coordination Study",
          description:
            "Evaluate protective device settings to ensure proper coordination and minimize arc flash duration.",
        },
        {
          step: "05",
          title: "Energy Calculations",
          description:
            "Determine incident energy levels and arc flash boundaries using IEEE 1584 methodology.",
        },
        {
          step: "06",
          title: "Report & Labels",
          description:
            "Deliver comprehensive report with PPE recommendations and compliant arc flash warning labels.",
        },
      ],
    },
    industries: {
      heading: "Industries We Empower",
      cards: [
        {
          name: "Oil & Gas",
          image: "/images/industries/oil-and-gas.jpg",
          imageAlt:
            "Arc flash study for an oil and gas refinery in the UAE",
        },
        {
          name: "Healthcare",
          image: "/images/industries/healthcare.jpg",
          imageAlt:
            "Arc flash hazard analysis for a Dubai hospital and healthcare facility",
        },
        {
          name: "Data Centers",
          image: "/images/industries/data-centers.jpg",
          imageAlt:
            "Arc flash hazard analysis for a Dubai data centre",
        },
        {
          name: "Manufacturing",
          image: "/images/industries/manufacturing.jpg",
          imageAlt:
            "NFPA 70E compliance and arc flash study for a UAE manufacturing plant",
        },
        {
          name: "Utilities",
          image: "/images/industries/utilities.jpg",
          imageAlt:
            "IEEE 1584 arc flash study for a DEWA electrical utility substation in Dubai",
        },
        {
          name: "Commercial Real Estate",
          image: "/images/industries/commercial-real-estate.jpg",
          imageAlt:
            "Arc flash study for a Dubai commercial real estate and office tower",
        },
        {
          name: "Education",
          image: "/images/industries/education.jpg",
          imageAlt:
            "Arc flash hazard analysis for a UAE university and education campus",
        },
        {
          name: "Government",
          image: "/images/industries/government.jpg",
          imageAlt:
            "Arc flash study for a UAE government administrative building in Dubai",
        },
      ],
    },
    insights: {
      heading: "Latest Insights",
      cards: [
        {
          category: "Safety Standards",
          title: "Understanding IEEE 1584-2018 Updates",
          excerpt:
            "Key changes in the latest arc flash calculation standard and what they mean for your facility assessments.",
          href: "/insights/ieee-1584-2018-updates",
          image: "/images/insights/understanding-ieee-1584-2018.jpg",
          imageAlt:
            "IEEE 1584-2018 arc flash calculation standard documentation and updates",
        },
        {
          category: "Compliance",
          title: "DEWA Requirements for Arc Flash Studies",
          excerpt:
            "A comprehensive guide to meeting Dubai Electricity and Water Authority electrical safety regulations.",
          href: "/insights/dewa-arc-flash-requirements",
          image: "/images/insights/dewa-requirements-for-arc-f.jpg",
          imageAlt:
            "DEWA arc flash study compliance checklist for Dubai electrical installations",
        },
        {
          category: "Best Practices",
          title: "Reducing Incident Energy in Your Facility",
          excerpt:
            "Practical strategies for lowering arc flash hazard levels through system design and protective device settings.",
          href: "/insights/reducing-incident-energy",
          image: "/images/insights/reducing-incident-energy-in.jpg",
          imageAlt:
            "Electrical panel and protective device settings used to reduce arc flash incident energy in a UAE facility",
        },
      ],
    },
    faqs: overrides.faqs,
    cta: {
      heading: "Ready to Make Your Facility Safer?",
      subtext:
        "Get expert arc flash analysis and protect your workforce with comprehensive hazard assessments.",
      primaryCta: "Schedule a Consultation",
      secondaryCta: "Call Us",
    },
    footer: {
      companyBlurb:
        "CareLAbz provides professional electrical safety services including arc flash studies, power system analysis, and compliance solutions for industrial and commercial facilities across the UAE.",
      services: [
        { label: "Arc Flash Study", href: "/services/arc-flash-study" },
        { label: "Short Circuit Analysis", href: "/services/short-circuit" },
        { label: "Coordination Study", href: "/services/coordination" },
        { label: "Load Flow Analysis", href: "/services/load-flow" },
        { label: "Power Quality", href: "/services/power-quality" },
      ],
      industries: [
        { label: "Oil & Gas", href: "/industries/oil-gas" },
        { label: "Healthcare", href: "/industries/healthcare" },
        { label: "Data Centers", href: "/industries/data-centers" },
        { label: "Manufacturing", href: "/industries/manufacturing" },
        { label: "Utilities", href: "/industries/utilities" },
      ],
      contact: {
        address: "Dubai, United Arab Emirates",
        phone: "+971 4 XXX XXXX",
        email: "info@carelabz.com",
      },
    },
  };
}

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

const PAGE_URL =
  "https://carelabz.com/ae/services/study-analysis/arc-flash-study/";

async function fetchStrapiSafe() {
  try {
    return await getServicePageBySlug("arc-flash-study");
  } catch {
    return null;
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const strapi = await fetchStrapiSafe();
  const metaTitle = strapi?.metaTitle || FALLBACK_META_TITLE;
  const metaDescription =
    strapi?.metaDescription || FALLBACK_META_DESCRIPTION;

  return {
    title: metaTitle,
    description: metaDescription,
    keywords: [
      "arc flash study Dubai",
      "arc flash analysis UAE",
      "ETAP arc flash",
      "IEEE 1584 UAE",
      "arc flash hazard analysis",
      "NFPA 70E Dubai",
    ],
    authors: [{ name: "CareLAbz Engineering Team" }],
    creator: "CareLAbz",
    publisher: "CareLAbz",
    alternates: {
      canonical: PAGE_URL,
      languages: {
        "en-AE": PAGE_URL,
        "x-default": PAGE_URL,
      },
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
        "max-video-preview": -1,
      },
    },
    openGraph: {
      title: metaTitle,
      description: metaDescription,
      url: PAGE_URL,
      siteName: "CareLAbz",
      type: "website",
      images: [
        {
          url: "/og/arc-flash-study.jpg",
          width: 1200,
          height: 630,
          alt: "CareLAbz Arc Flash Study Services in Dubai UAE",
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: metaTitle,
      description: metaDescription,
      images: ["/og/arc-flash-study.jpg"],
    },
  };
}

/* ------------------------------------------------------------------ */
/*  Icon Helper                                                        */
/* ------------------------------------------------------------------ */

function FeatureIcon({ icon }: { icon: FeatureCard["icon"] }) {
  const iconClass = "w-8 h-8 text-orange-500";
  switch (icon) {
    case "shield":
      return <Shield className={iconClass} />;
    case "zap":
      return <Zap className={iconClass} />;
    case "file-text":
      return <FileText className={iconClass} />;
    case "users":
      return <Users className={iconClass} />;
    default:
      return <Shield className={iconClass} />;
  }
}

/* ------------------------------------------------------------------ */
/*  Section Components                                                 */
/* ------------------------------------------------------------------ */

function HeroSection({
  data,
}: {
  data: PageData["hero"] & { trustBadges: TrustBadge[] };
}) {
  return (
    <section className="relative bg-navy pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg
          className="absolute inset-0 h-full w-full"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            <pattern
              id="circuit"
              x="0"
              y="0"
              width="100"
              height="100"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M0 50h40M60 50h40M50 0v40M50 60v40"
                stroke="currentColor"
                strokeWidth="1"
                fill="none"
                className="text-white"
              />
              <circle
                cx="50"
                cy="50"
                r="4"
                fill="currentColor"
                className="text-orange-500"
              />
              <circle
                cx="0"
                cy="50"
                r="2"
                fill="currentColor"
                className="text-white"
              />
              <circle
                cx="100"
                cy="50"
                r="2"
                fill="currentColor"
                className="text-white"
              />
              <circle
                cx="50"
                cy="0"
                r="2"
                fill="currentColor"
                className="text-white"
              />
              <circle
                cx="50"
                cy="100"
                r="2"
                fill="currentColor"
                className="text-white"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <nav
              aria-label="Breadcrumb"
              className="mb-6 text-sm text-slate-300"
            >
              <ol className="flex flex-wrap items-center justify-center lg:justify-start gap-x-2 gap-y-1">
                <li>
                  <Link
                    href="/"
                    className="hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Home
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-500">
                  /
                </li>
                <li>
                  <Link
                    href="/ae/services/"
                    className="hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Services
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-500">
                  /
                </li>
                <li>
                  <Link
                    href="/ae/services/study-analysis/"
                    className="hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    Study &amp; Analysis
                  </Link>
                </li>
                <li aria-hidden="true" className="text-slate-500">
                  /
                </li>
                <li aria-current="page" className="text-white">
                  Arc Flash Study
                </li>
              </ol>
            </nav>
            <span className="inline-block text-xs font-bold tracking-widest text-orange-400 uppercase mb-4">
              {data.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 text-balance">
              {data.headline}
            </h1>
            <p className="hero-subtext text-lg md:text-xl text-slate-300 max-w-3xl mx-auto lg:mx-0 mt-6 mb-4 leading-relaxed">
              <strong>
                An arc flash study is an engineering analysis that calculates
                the incident energy released during an electrical arc fault,
                so workers can be protected with the correct PPE and equipment
                boundaries.
              </strong>{" "}
              CareLAbz combines{" "}
              <a
                href="https://etap.com/"
                target="_blank"
                rel="noopener"
                className="underline decoration-orange-400/60 underline-offset-4 hover:text-orange-300 transition-colors"
              >
                ETAP
              </a>{" "}
              modelling, on-site data collection, and{" "}
              <a
                href="https://www.dewa.gov.ae/"
                target="_blank"
                rel="noopener"
                className="underline decoration-orange-400/60 underline-offset-4 hover:text-orange-300 transition-colors"
              >
                DEWA
              </a>
              -compliant reporting to deliver actionable arc flash mitigation
              aligned with{" "}
              <a
                href="https://standards.ieee.org/ieee/1584/"
                target="_blank"
                rel="noopener"
                className="underline decoration-orange-400/60 underline-offset-4 hover:text-orange-300 transition-colors"
              >
                IEEE 1584
              </a>{" "}
              and{" "}
              <a
                href="https://www.nfpa.org/codes-and-standards/nfpa-70e"
                target="_blank"
                rel="noopener"
                className="underline decoration-orange-400/60 underline-offset-4 hover:text-orange-300 transition-colors"
              >
                NFPA 70E
              </a>{" "}
              for industrial and commercial facilities across the UAE.
            </p>
            <time
              dateTime="2026-04-10"
              className="block text-sm text-slate-400 mb-8"
            >
              Last updated April 2026
            </time>
            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Link
                href="#contact"
                className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3.5 text-base font-semibold text-white shadow-lg transition-all hover:bg-orange-600 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500 focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {data.primaryCta}
              </Link>
              <Link
                href="/brochure"
                className="inline-flex items-center justify-center rounded-lg border-2 border-white/30 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-navy"
              >
                {data.secondaryCta}
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4">
              {data.trustBadges.map((badge) => (
                <div
                  key={badge.label}
                  className="flex flex-col items-center justify-center rounded-lg bg-white/5 border border-white/10 p-4 backdrop-blur-sm"
                >
                  <div className="w-10 h-10 mb-2 flex items-center justify-center rounded-full bg-white/10">
                    <CheckCircle className="w-5 h-5 text-orange-400" />
                  </div>
                  <span className="text-xs font-semibold text-white/90 text-center">
                    {badge.label}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Image */}
          <div className="relative hidden lg:block">
            <div className="absolute -inset-4 bg-gradient-to-r from-orange-500/20 to-orange-500/5 rounded-3xl blur-3xl" />
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden bg-slate-800 shadow-2xl">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ChallengesSection({ data }: { data: PageData["challenges"] }) {
  return (
    <section className="bg-offWhite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-balance">
            {data.heading}
          </h2>
          <p className="text-lg text-slate-600 leading-relaxed">
            {data.subheading}
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.features.map((feature) => (
            <div
              key={feature.title}
              className="group relative rounded-xl border border-slate-200 bg-white p-8 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-orange-500/50 hover:-translate-y-1"
            >
              <div className="mb-6 inline-flex items-center justify-center rounded-xl bg-orange-50 p-3 transition-colors group-hover:bg-orange-100">
                <FeatureIcon icon={feature.icon} />
              </div>
              <h3 className="text-xl font-bold text-navy mb-3">
                {feature.title}
              </h3>
              <p className="text-slate-600 leading-relaxed">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function ContentSectionLeft({ data }: { data: ContentSection }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image */}
          <div className="relative order-2 lg:order-1">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>

          {/* Content */}
          <div className="order-1 lg:order-2">
            {data.eyebrow && (
              <span className="inline-block text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">
                {data.eyebrow}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-6 text-balance">
              {data.heading}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {data.description}
            </p>
            {data.bullets && (
              <ul className="space-y-4">
                {data.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{bullet.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

function ContentSectionRight({ data }: { data: ContentSection }) {
  return (
    <section className="bg-offWhite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Content */}
          <div>
            {data.eyebrow && (
              <span className="inline-block text-xs font-bold tracking-widest text-orange-500 uppercase mb-4">
                {data.eyebrow}
              </span>
            )}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-6 text-balance">
              {data.heading}
            </h2>
            <p className="text-lg text-slate-600 leading-relaxed mb-8">
              {data.description}
            </p>
            {data.bullets && (
              <ul className="space-y-4">
                {data.bullets.map((bullet, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <CheckCircle className="w-6 h-6 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{bullet.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>

          {/* Image */}
          <div className="relative">
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-xl">
              <Image
                src={data.image}
                alt={data.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function RiskAssessmentSection({
  data,
}: {
  data: PageData["riskAssessment"];
}) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-balance">
            {data.heading}
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {data.steps.map((step) => (
            <div
              key={step.step}
              className="relative rounded-xl border border-slate-200 bg-white p-8 shadow-sm"
            >
              <span className="absolute top-6 right-6 text-6xl font-bold text-orange-500/10">
                {step.step}
              </span>
              <h3 className="text-xl font-bold text-navy mb-3 relative">
                {step.title}
              </h3>
              <p className="text-slate-600 leading-relaxed relative">
                {step.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function IndustriesSection({ data }: { data: PageData["industries"] }) {
  return (
    <section className="bg-navy py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
            {data.heading}
          </h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {data.cards.map((card) => (
            <div
              key={card.name}
              className="group relative aspect-[4/3] rounded-xl overflow-hidden cursor-pointer"
            >
              <Image
                src={card.image}
                alt={card.imageAlt}
                fill
                sizes="(max-width: 768px) 100vw, 25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-navy/90 via-navy/40 to-transparent" />
              <div className="absolute inset-0 flex items-end p-6">
                <h3 className="text-lg font-bold text-white">{card.name}</h3>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function InsightsSection({ data }: { data: PageData["insights"] }) {
  return (
    <section className="bg-offWhite py-16 sm:py-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-balance">
            {data.heading}
          </h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {data.cards.map((card) => (
            <article
              key={card.title}
              className="group rounded-xl bg-white shadow-sm overflow-hidden transition-all duration-300 hover:shadow-lg"
            >
              <div className="relative aspect-[16/9] overflow-hidden">
                <Image
                  src={card.image}
                  alt={card.imageAlt}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                />
              </div>
              <div className="p-6">
                <span className="inline-block text-xs font-bold tracking-wider text-orange-500 uppercase mb-2">
                  {card.category}
                </span>
                <h3 className="text-lg font-bold text-navy mb-2 line-clamp-2">
                  {card.title}
                </h3>
                <p className="text-slate-600 text-sm mb-4 line-clamp-2">
                  {card.excerpt}
                </p>
                <Link
                  href={card.href}
                  aria-label={`Read article: ${card.title}`}
                  className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  <span className="sr-only">Read article: {card.title}</span>
                  <span aria-hidden="true">Read more</span>
                  <ArrowRight
                    aria-hidden="true"
                    className="ml-1 w-4 h-4 transition-transform group-hover/link:translate-x-1"
                  />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function FAQSection({ faqs }: { faqs: FAQItem[] }) {
  return (
    <section className="bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-navy mb-4 text-balance">
            Frequently Asked Questions
          </h2>
        </div>
        <FaqAccordion faqs={faqs} />
      </div>
    </section>
  );
}

function CTABanner({ data }: { data: PageData["cta"] }) {
  return (
    <section id="contact" className="relative py-16 sm:py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-navy" />
      <div className="relative mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-4 text-balance">
          {data.heading}
        </h2>
        <p className="text-lg text-white/90 max-w-2xl mx-auto mb-8">
          {data.subtext}
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link
            href="/contact"
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-navy shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
          >
            {data.primaryCta}
          </Link>
          <Link
            href="tel:+97140000000"
            className="inline-flex items-center justify-center rounded-lg border-2 border-white/50 px-8 py-3.5 text-base font-semibold text-white transition-all hover:bg-white/10 hover:border-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
          >
            <Phone className="mr-2 w-5 h-5" />
            {data.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  );
}

function Footer({ data }: { data: PageData["footer"] }) {
  return (
    <footer className="bg-navy border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link
              href="/"
              className="text-xl font-bold text-white mb-4 inline-block"
            >
              CareLAbz
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mt-4">
              {data.companyBlurb}
            </p>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Services
            </h3>
            <ul className="space-y-3">
              {data.services.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Industries */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Industries
            </h3>
            <ul className="space-y-3">
              {data.industries.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-slate-400 text-sm hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4">
              Contact
            </h3>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">
                  {data.contact.address}
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-5 h-5 text-orange-400 shrink-0" />
                <a
                  href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
                  className="text-slate-400 text-sm hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {data.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-5 h-5 text-orange-400 shrink-0" />
                <a
                  href={`mailto:${data.contact.email}`}
                  className="text-slate-400 text-sm hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {data.contact.email}
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Row */}
        <div className="mt-12 pt-8 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-sm">
            &copy; {new Date().getFullYear()} CareLAbz. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link
              href="/privacy"
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Privacy Policy
            </Link>
            <Link
              href="/terms"
              className="text-slate-500 text-sm hover:text-slate-300 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
            >
              Terms
            </Link>
            <div className="flex items-center gap-4">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn"
                className="text-slate-500 hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Linkedin className="w-5 h-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-slate-500 hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-slate-500 hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Facebook className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function ArcFlashStudyPage() {
  const strapi = await fetchStrapiSafe();

  const headline = strapi?.title || FALLBACK_TITLE;
  const subtext = strapi?.metaDescription || FALLBACK_META_DESCRIPTION;
  const faqs: FAQItem[] =
    strapi?.faqs && strapi.faqs.length > 0
      ? strapi.faqs.map((f) => ({ question: f.question, answer: f.answer }))
      : FALLBACK_FAQS;

  const data = buildPageData({ headline, subtext, faqs });
  const metaDescription = strapi?.metaDescription || FALLBACK_META_DESCRIPTION;

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Arc Flash Study and Analysis",
    serviceType: "Arc Flash Hazard Analysis",
    description: metaDescription,
    url: PAGE_URL,
    provider: {
      "@type": "Organization",
      name: "CareLAbz",
      url: "https://carelabz.com",
      telephone: "+971-4-XXX-XXXX",
      address: {
        "@type": "PostalAddress",
        addressLocality: "Dubai",
        addressRegion: "Dubai",
        addressCountry: "AE",
      },
    },
    areaServed: [
      { "@type": "Place", name: "Dubai" },
      { "@type": "Place", name: "United Arab Emirates" },
    ],
    audience: {
      "@type": "BusinessAudience",
      audienceType: "Industrial and commercial facility operators",
    },
    hasOfferCatalog: {
      "@type": "OfferCatalog",
      name: "Electrical Safety Services",
      itemListElement: [
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Short Circuit Analysis",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Protective Device Coordination Study",
          },
        },
        {
          "@type": "Offer",
          itemOffered: {
            "@type": "Service",
            name: "Power Quality Analysis",
          },
        },
      ],
    },
    speakable: {
      "@type": "SpeakableSpecification",
      cssSelector: ["h1", ".hero-subtext", ".faq-answer"],
    },
    datePublished: "2026-04-09",
    dateModified: "2026-04-10",
  };

  const faqJsonLd = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: data.faqs.map((faq) => ({
      "@type": "Question",
      name: faq.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: faq.answer,
      },
    })),
  };

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CareLAbz",
    url: "https://carelabz.com",
    telephone: "+971-4-XXX-XXXX",
    address: {
      "@type": "PostalAddress",
      streetAddress: "Business Bay",
      addressLocality: "Dubai",
      addressRegion: "Dubai",
      postalCode: "00000",
      addressCountry: "AE",
    },
    areaServed: "United Arab Emirates",
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://carelabz.com/",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Services",
        item: "https://carelabz.com/ae/services/",
      },
      {
        "@type": "ListItem",
        position: 3,
        name: "Study & Analysis",
        item: "https://carelabz.com/ae/services/study-analysis/",
      },
      {
        "@type": "ListItem",
        position: 4,
        name: "Arc Flash Study",
        item: PAGE_URL,
      },
    ],
  };

  const howToJsonLd = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: "How CareLAbz Performs an Arc Flash Study",
    description:
      "Step-by-step process for conducting an IEEE 1584 compliant arc flash study in Dubai UAE",
    totalTime: "P2W",
    tool: [
      { "@type": "HowToTool", name: "ETAP software" },
      { "@type": "HowToTool", name: "Power system analyzer" },
      { "@type": "HowToTool", name: "Arc flash label printer" },
    ],
    step: data.riskAssessment.steps.map((s, i) => ({
      "@type": "HowToStep",
      position: i + 1,
      name: s.title,
      text: s.description,
    })),
  };

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />
      <JsonLd data={howToJsonLd} />

      <StickyNavbar />

      <main id="main-content">
        <HeroSection
          data={{ ...data.hero, trustBadges: data.trustBadges }}
        />
        <ChallengesSection data={data.challenges} />
        <ContentSectionLeft data={data.safetySection} />
        <ContentSectionRight data={data.reportsSection} />
        <RiskAssessmentSection data={data.riskAssessment} />
        <IndustriesSection data={data.industries} />
        <InsightsSection data={data.insights} />
        <FAQSection faqs={data.faqs} />
        <CTABanner data={data.cta} />
      </main>

      <Footer data={data.footer} />
    </>
  );
}
