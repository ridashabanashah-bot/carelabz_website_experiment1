import { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
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
} from "lucide-react"
import { StickyNavbar } from "@/components/sticky-navbar"
import { FAQAccordion, type FAQItem } from "@/components/faq-accordion"
import { JsonLd } from "@/components/json-ld"

/* ------------------------------------------------------------------ */
/*  TypeScript Interfaces for CMS Integration                          */
/* ------------------------------------------------------------------ */

interface TrustBadge {
  label: string
  icon: string
}

interface FeatureCard {
  icon: "shield" | "zap" | "file-text" | "users"
  title: string
  description: string
}

interface BulletPoint {
  text: string
}

interface ContentSection {
  eyebrow?: string
  heading: string
  description: string
  bullets?: BulletPoint[]
  imageAlt: string
}

interface ProcessStep {
  step: string
  title: string
  description: string
}

interface IndustryCard {
  name: string
  imageAlt: string
}

interface InsightCard {
  category: string
  title: string
  excerpt: string
  href: string
  imageAlt: string
}

interface FooterLink {
  label: string
  href: string
}

interface ContactInfo {
  address: string
  phone: string
  email: string
}

interface PageData {
  hero: {
    eyebrow: string
    headline: string
    subtext: string
    primaryCta: string
    secondaryCta: string
  }
  trustBadges: TrustBadge[]
  challenges: {
    heading: string
    subheading: string
    features: FeatureCard[]
  }
  safetySection: ContentSection
  reportsSection: ContentSection
  riskAssessment: {
    heading: string
    steps: ProcessStep[]
  }
  industries: {
    heading: string
    cards: IndustryCard[]
  }
  insights: {
    heading: string
    cards: InsightCard[]
  }
  faqs: FAQItem[]
  cta: {
    heading: string
    subtext: string
    primaryCta: string
    secondaryCta: string
  }
  footer: {
    companyBlurb: string
    services: FooterLink[]
    industries: FooterLink[]
    contact: ContactInfo
  }
}

/* ------------------------------------------------------------------ */
/*  Page Content Data (wire this to Strapi later)                      */
/* ------------------------------------------------------------------ */

const PAGE_DATA: PageData = {
  hero: {
    eyebrow: "POWER SYSTEM SAFETY",
    headline: "Arc Flash Study & Analysis in Dubai, UAE",
    subtext:
      "Protect your workforce and assets with comprehensive arc flash hazard analysis. ETAP-based assessments, IEEE 1584 compliance, and actionable safety recommendations for industrial facilities.",
    primaryCta: "Request a Quote",
    secondaryCta: "Download Brochure",
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
    imageAlt: "Engineer performing electrical safety assessment",
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
    imageAlt: "Arc flash study engineering report documentation",
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
      { name: "Oil & Gas", imageAlt: "Oil and gas refinery at sunset" },
      { name: "Healthcare", imageAlt: "Modern hospital facility" },
      { name: "Data Centers", imageAlt: "Server room with blue lighting" },
      { name: "Manufacturing", imageAlt: "Industrial manufacturing plant" },
      { name: "Utilities", imageAlt: "Electrical utility substation" },
      { name: "Commercial Real Estate", imageAlt: "Modern commercial building" },
      { name: "Education", imageAlt: "University campus building" },
      { name: "Government", imageAlt: "Government administrative building" },
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
        imageAlt: "IEEE standards documentation",
      },
      {
        category: "Compliance",
        title: "DEWA Requirements for Arc Flash Studies",
        excerpt:
          "A comprehensive guide to meeting Dubai Electricity and Water Authority electrical safety regulations.",
        href: "/insights/dewa-arc-flash-requirements",
        imageAlt: "DEWA compliance checklist",
      },
      {
        category: "Best Practices",
        title: "Reducing Incident Energy in Your Facility",
        excerpt:
          "Practical strategies for lowering arc flash hazard levels through system design and protective device settings.",
        href: "/insights/reducing-incident-energy",
        imageAlt: "Electrical panel with safety equipment",
      },
    ],
  },
  faqs: [
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
        "The cost of an arc flash study depends on the number of panels, switchgear, and substations in your facility, as well as the complexity of the electrical distribution system. CareLAbz provides custom quotes tailored to each project. Contact us for a free consultation and we will assess your requirements and provide a detailed proposal at no obligation.",
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
  ],
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
}

/* ------------------------------------------------------------------ */
/*  SEO Metadata                                                       */
/* ------------------------------------------------------------------ */

const PAGE_URL =
  "https://carelabz.com/ae/services/study-analysis/arc-flash-study"
const META_TITLE = "Arc Flash Study Dubai UAE | CareLAbz"
const META_DESCRIPTION =
  "Expert arc flash study and analysis services in Dubai UAE. ETAP-based assessments, hazard analysis and compliance for industrial facilities."

export function generateMetadata(): Metadata {
  return {
    title: META_TITLE,
    description: META_DESCRIPTION,
    keywords: [
      "arc flash study Dubai",
      "arc flash analysis UAE",
      "ETAP arc flash",
      "IEEE 1584 UAE",
      "arc flash hazard analysis",
      "NFPA 70E Dubai",
    ],
    alternates: {
      canonical: PAGE_URL,
    },
    openGraph: {
      title: META_TITLE,
      description: META_DESCRIPTION,
      url: PAGE_URL,
      siteName: "CareLAbz",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: META_TITLE,
      description: META_DESCRIPTION,
    },
  }
}

/* ------------------------------------------------------------------ */
/*  Icon Helper                                                        */
/* ------------------------------------------------------------------ */

function FeatureIcon({ icon }: { icon: FeatureCard["icon"] }) {
  const iconClass = "size-8 text-orange-500"
  switch (icon) {
    case "shield":
      return <Shield className={iconClass} />
    case "zap":
      return <Zap className={iconClass} />
    case "file-text":
      return <FileText className={iconClass} />
    case "users":
      return <Users className={iconClass} />
    default:
      return <Shield className={iconClass} />
  }
}

/* ------------------------------------------------------------------ */
/*  Section Components                                                 */
/* ------------------------------------------------------------------ */

function HeroSection({ data }: { data: PageData["hero"] & { trustBadges: TrustBadge[] } }) {
  return (
    <section className="relative bg-navy pt-24 pb-16 sm:pt-32 sm:pb-24 overflow-hidden">
      {/* Circuit pattern background */}
      <div className="absolute inset-0 opacity-10">
        <svg className="absolute inset-0 h-full w-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="circuit" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
              <path d="M0 50h40M60 50h40M50 0v40M50 60v40" stroke="currentColor" strokeWidth="1" fill="none" className="text-white" />
              <circle cx="50" cy="50" r="4" fill="currentColor" className="text-orange-500" />
              <circle cx="0" cy="50" r="2" fill="currentColor" className="text-white" />
              <circle cx="100" cy="50" r="2" fill="currentColor" className="text-white" />
              <circle cx="50" cy="0" r="2" fill="currentColor" className="text-white" />
              <circle cx="50" cy="100" r="2" fill="currentColor" className="text-white" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#circuit)" />
        </svg>
      </div>

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Column - Content */}
          <div className="text-center lg:text-left">
            <span className="inline-block text-xs font-bold tracking-widest text-orange-400 uppercase mb-4">
              {data.eyebrow}
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-white leading-tight mb-6 text-balance">
              {data.headline}
            </h1>
            <p className="text-lg text-slate-300 max-w-xl mx-auto lg:mx-0 mb-8 leading-relaxed">
              {data.subtext}
            </p>
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
                  <div className="size-10 mb-2 flex items-center justify-center rounded-full bg-white/10">
                    <CheckCircle className="size-5 text-orange-400" />
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
                src="/images/hero-arc-flash.jpg"
                alt="Electrical engineer performing arc flash safety assessment"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function ChallengesSection({ data }: { data: PageData["challenges"] }) {
  return (
    <section className="bg-off-white py-16 sm:py-24">
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
              <h3 className="text-xl font-bold text-navy mb-3">{feature.title}</h3>
              <p className="text-slate-600 leading-relaxed">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
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
                src="/images/safety-assessment.jpg"
                alt={data.imageAlt}
                fill
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
                    <CheckCircle className="size-6 text-orange-500 shrink-0 mt-0.5" />
                    <span className="text-slate-700">{bullet.text}</span>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}

function ContentSectionRight({ data }: { data: ContentSection }) {
  return (
    <section className="bg-off-white py-16 sm:py-24">
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
                    <CheckCircle className="size-6 text-orange-500 shrink-0 mt-0.5" />
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
                src="/images/arc-flash-report.jpg"
                alt={data.imageAlt}
                fill
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function RiskAssessmentSection({ data }: { data: PageData["riskAssessment"] }) {
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
  )
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
                src={`/images/industries/${card.name.toLowerCase().replace(/\s+/g, "-").replace("&", "and")}.jpg`}
                alt={card.imageAlt}
                fill
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
  )
}

function InsightsSection({ data }: { data: PageData["insights"] }) {
  return (
    <section className="bg-off-white py-16 sm:py-24">
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
                  src={`/images/insights/${card.title.toLowerCase().replace(/\s+/g, "-").slice(0, 30)}.jpg`}
                  alt={card.imageAlt}
                  fill
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
                  className="inline-flex items-center text-sm font-semibold text-orange-500 hover:text-orange-600 transition-colors group/link focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  Read more
                  <ArrowRight className="ml-1 size-4 transition-transform group-hover/link:translate-x-1" />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
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
        <FAQAccordion faqs={faqs} />
      </div>
    </section>
  )
}

function CTABanner({ data }: { data: PageData["cta"] }) {
  return (
    <section
      id="contact"
      className="relative py-16 sm:py-24 overflow-hidden"
    >
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
            <Phone className="mr-2 size-5" />
            {data.secondaryCta}
          </Link>
        </div>
      </div>
    </section>
  )
}

function Footer({ data }: { data: PageData["footer"] }) {
  return (
    <footer className="bg-navy border-t border-white/10">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <Link href="/" className="text-xl font-bold text-white mb-4 inline-block">
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
                <MapPin className="size-5 text-orange-400 shrink-0 mt-0.5" />
                <span className="text-slate-400 text-sm">{data.contact.address}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="size-5 text-orange-400 shrink-0" />
                <a
                  href={`tel:${data.contact.phone.replace(/\s/g, "")}`}
                  className="text-slate-400 text-sm hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
                >
                  {data.contact.phone}
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="size-5 text-orange-400 shrink-0" />
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
                <Linkedin className="size-5" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Twitter"
                className="text-slate-500 hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Twitter className="size-5" />
              </a>
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
                className="text-slate-500 hover:text-orange-400 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500"
              >
                <Facebook className="size-5" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

/* ------------------------------------------------------------------ */
/*  Page Component                                                     */
/* ------------------------------------------------------------------ */

export default async function ArcFlashStudyPage() {
  const data = PAGE_DATA

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: "Arc Flash Study & Analysis in Dubai, UAE",
    description: META_DESCRIPTION,
    url: PAGE_URL,
    provider: {
      "@type": "Organization",
      name: "CareLAbz",
      url: "https://carelabz.com",
    },
    areaServed: {
      "@type": "Place",
      name: "Dubai, UAE",
    },
  }

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
  }

  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "CareLAbz",
    url: "https://carelabz.com",
    telephone: "+971 4 XXX XXXX",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  }

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: "https://carelabz.com/" },
      { "@type": "ListItem", position: 2, name: "Services", item: "https://carelabz.com/ae/services" },
      { "@type": "ListItem", position: 3, name: "Study & Analysis", item: "https://carelabz.com/ae/services/study-analysis" },
      { "@type": "ListItem", position: 4, name: "Arc Flash Study", item: PAGE_URL },
    ],
  }

  return (
    <>
      <JsonLd data={serviceJsonLd} />
      <JsonLd data={faqJsonLd} />
      <JsonLd data={localBusinessJsonLd} />
      <JsonLd data={breadcrumbJsonLd} />

      <StickyNavbar />

      <main>
        <HeroSection data={{ ...data.hero, trustBadges: data.trustBadges }} />
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
  )
}
