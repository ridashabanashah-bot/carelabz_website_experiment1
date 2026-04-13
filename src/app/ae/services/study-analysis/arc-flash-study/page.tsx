export const dynamic = "force-dynamic";

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
import { getServicePageBySlug, type ServicePage } from "@/lib/strapi";

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
    primaryHref: string;
    secondaryCta: string;
    secondaryHref: string;
  };
  footer: {
    companyBlurb: string;
    services: FooterLink[];
    industries: FooterLink[];
    contact: ContactInfo;
  };
}

/* ------------------------------------------------------------------ */
/*  Strapi → PageData mapper                                           */
/* ------------------------------------------------------------------ */

const ICON_CYCLE: FeatureCard["icon"][] = ["shield", "zap", "file-text", "users"];

function buildPageDataFromStrapi(strapi: ServicePage): PageData {
  return {
    hero: {
      eyebrow: strapi.eyebrow ?? "",
      headline: strapi.title,
      subtext: strapi.metaDescription,
      primaryCta: strapi.ctaPrimaryText ?? "",
      secondaryCta: strapi.ctaSecondaryText ?? "",
      image: strapi.heroImagePath ?? "",
      imageAlt: strapi.heroImageAlt ?? "",
    },
    trustBadges: (strapi.trustBadges ?? []).map((b) => ({
      label: b.label,
      icon: b.label.toLowerCase().replace(/\s+/g, "-"),
    })),
    challenges: {
      heading: strapi.featuresHeading ?? "",
      subheading: strapi.featuresSubtext ?? "",
      features: (strapi.features ?? []).map((f, i) => ({
        icon: ICON_CYCLE[i % ICON_CYCLE.length],
        title: f.title,
        description: f.description,
      })),
    },
    safetySection: {
      eyebrow: strapi.safetyEyebrow ?? undefined,
      heading: strapi.safetyHeading ?? "",
      description: strapi.safetyBody ?? "",
      bullets: (strapi.safetyBullets ?? []).map((s) => ({ text: s })),
      image: strapi.safetyImage ?? "",
      imageAlt: strapi.safetyImageAlt ?? "",
    },
    reportsSection: {
      eyebrow: strapi.reportsEyebrow ?? undefined,
      heading: strapi.reportsHeading ?? "",
      description: strapi.reportsBody ?? "",
      bullets: (strapi.reportsBullets ?? []).map((s) => ({ text: s })),
      image: strapi.reportsImage ?? "",
      imageAlt: strapi.reportsImageAlt ?? "",
    },
    riskAssessment: {
      heading: strapi.processHeading ?? "",
      steps: (strapi.processSteps ?? []).map((s) => ({
        step: String(s.number).padStart(2, "0"),
        title: s.title,
        description: s.description,
      })),
    },
    industries: {
      heading: strapi.industriesHeading ?? "",
      cards: (strapi.industries ?? []).map((ind) => ({
        name: ind.name,
        image: ind.image,
        imageAlt: ind.alt,
      })),
    },
    insights: {
      heading: strapi.insightsHeading ?? "",
      cards: (strapi.insights ?? []).map((ins) => ({
        category: ins.category,
        title: ins.title,
        excerpt: ins.description,
        href: ins.href,
        image: ins.image,
        imageAlt: ins.alt,
      })),
    },
    faqs: (strapi.faqs ?? []).map((f) => ({
      question: f.question,
      answer: f.answer,
    })),
    cta: {
      heading: strapi.ctaBannerHeading ?? "",
      subtext: strapi.ctaBannerBody ?? "",
      primaryCta: strapi.ctaBannerPrimaryText ?? "",
      primaryHref: strapi.ctaBannerPrimaryHref ?? "/contact",
      secondaryCta: strapi.ctaBannerSecondaryText ?? "",
      secondaryHref: strapi.ctaBannerSecondaryHref ?? "tel:+97140000000",
    },
    footer: {
      companyBlurb: strapi.footerDescription ?? "",
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
        phone: strapi.footerPhone ?? "",
        email: strapi.footerEmail ?? "",
        address: strapi.footerAddress ?? "",
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

  if (!strapi) {
    return {
      title: "Carelabs — Electrical Safety Services",
    };
  }

  const metaTitle = strapi.metaTitle;
  const metaDescription = strapi.metaDescription;

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
    authors: [{ name: "Carelabs Engineering Team" }],
    creator: "Carelabs",
    publisher: "Carelabs",
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
      siteName: "Carelabs",
      type: "website",
      images: [
        {
          url: "/og/arc-flash-study.jpg",
          width: 1200,
          height: 630,
          alt: "Carelabs Arc Flash Study Services in Dubai UAE",
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
              Carelabs combines{" "}
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
            href={data.primaryHref}
            className="inline-flex items-center justify-center rounded-lg bg-white px-8 py-3.5 text-base font-semibold text-navy shadow-lg transition-all hover:bg-slate-100 hover:shadow-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-orange-500"
          >
            {data.primaryCta}
          </Link>
          <Link
            href={data.secondaryHref}
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
              aria-label="CareLabs — Test, Calibrate, Inspect, Certify"
              className="inline-block mb-4"
            >
              <Image
                src="/images/logo/carelabs-logo.png"
                alt="CareLabs"
                width={866}
                height={288}
                className="h-12 w-auto"
              />
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
            &copy; {new Date().getFullYear()} Carelabs. All rights reserved.
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

  if (!strapi) {
    return (
      <main id="main-content" className="flex min-h-screen items-center justify-center bg-navy">
        <p className="text-white text-lg">Page content unavailable. Please try again later.</p>
      </main>
    );
  }

  const data = buildPageDataFromStrapi(strapi);

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: strapi.title,
    serviceType: "Arc Flash Hazard Analysis",
    description: strapi.metaDescription,
    url: PAGE_URL,
    provider: {
      "@type": "Organization",
      name: "Carelabs",
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
    name: "Carelabs",
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
    name: "How Carelabs Performs an Arc Flash Study",
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
