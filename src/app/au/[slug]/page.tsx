import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Montserrat } from "next/font/google";
import { marked } from "marked";
import {
  Shield,
  FileText,
  CheckCircle,
  ChevronRight,
  Activity,
  BarChart2,
  Settings,
  Cpu,
  ClipboardList,
  ArrowRight,
} from "lucide-react";
import { RegionNavbar } from "@/components/region-navbar";
import { RegionFooter } from "@/components/region-footer";
import { JsonLd } from "@/components/JsonLd";
import { FloatingSidebar } from "@/components/service-page/floating-sidebar";
import { FeatureTabs } from "@/components/service-page/feature-tabs";
import { ServiceFaqAccordion } from "@/components/service-page/faq-accordion-new";
import { FaqAccordion } from "@/components/faq-accordion";
import { getServicePageBySlug, ServicePage } from "@/lib/strapi";
import { getBlogPost, BlogPost } from "@/lib/strapi-blog";
import { COUNTRY_CONFIGS } from "@/lib/countries-config";

export const dynamic = "force-dynamic";

const CC = "au";
const COUNTRY_NAME = "Australia";
const HREFLANG = "en-AU";
const config = COUNTRY_CONFIGS[CC];

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
});

interface PageProps {
  params: { slug: string };
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const pageUrl = `https://carelabz.com/${CC}/${params.slug}/`;
  const service = await getServicePageBySlug(`${params.slug}-${CC}`);
  if (service) {
    return {
      title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
      description: service.metaDescription || undefined,
      keywords: service.seoKeywords?.join(", "),
      alternates: {
        canonical: pageUrl,
        languages: { [HREFLANG]: pageUrl, "x-default": pageUrl },
      },
      openGraph: {
        title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
        description: service.metaDescription || undefined,
        url: pageUrl,
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
        description: service.metaDescription || undefined,
      },
    };
  }
  const post = await getBlogPost(CC, `${params.slug}-${CC}`);
  if (post) {
    return {
      title: post.metaTitle ?? `${post.title} | Carelabs ${COUNTRY_NAME}`,
      description: post.metaDescription ?? post.excerpt ?? undefined,
      keywords: post.seoKeywords ?? undefined,
      alternates: {
        canonical: pageUrl,
        languages: { [HREFLANG]: pageUrl, "x-default": pageUrl },
      },
      openGraph: {
        title: post.metaTitle ?? `${post.title} | Carelabs ${COUNTRY_NAME}`,
        description: post.metaDescription ?? post.excerpt ?? undefined,
        url: pageUrl,
        siteName: "Carelabs",
        type: "article",
      },
      twitter: {
        card: "summary_large_image",
        title: post.metaTitle ?? `${post.title} | Carelabs ${COUNTRY_NAME}`,
        description: post.metaDescription ?? post.excerpt ?? undefined,
      },
    };
  }
  return { title: `Not Found | Carelabs ${COUNTRY_NAME}` };
}

const STEP_ICONS = [ClipboardList, Cpu, BarChart2, Settings, Activity, Shield];

function buildServiceData(service: ServicePage) {
  return {
    title: service.title,
    eyebrow: service.eyebrow || "ELECTRICAL SAFETY",
    definitionalLede: service.definitionalLede || service.metaDescription || "",
    trustBadges: service.trustBadges || config.standards.slice(0, 4).map((s) => ({ label: s })),
    featuresHeading: service.featuresHeading || "Key Challenges We Solve",
    featuresSubtext:
      service.featuresSubtext ||
      "Our engineers identify and resolve electrical safety risks before they become costly incidents.",
    features: service.features || [],
    safetyEyebrow: service.safetyEyebrow || "WORKER SAFETY",
    safetyHeading: service.safetyHeading || "Protecting Your Team",
    safetyBody:
      service.safetyBody ||
      `Electrical hazards are among the leading causes of workplace injuries in ${COUNTRY_NAME} facilities.`,
    safetyBullets: service.safetyBullets || [],
    reportsEyebrow: service.reportsEyebrow || "DELIVERABLES",
    reportsHeading: service.reportsHeading || "Comprehensive Report Package",
    reportsBody:
      service.reportsBody ||
      `Every engagement concludes with a ${config.primaryStandard}-aligned report package.`,
    reportsBullets: service.reportsBullets || [],
    processHeading: service.processHeading || "Our Process",
    processSteps: service.processSteps || [],
    faqs: service.faqs || [],
    faqSectionHeading: service.faqSectionHeading || "Frequently Asked Questions",
    ctaBannerHeading: service.ctaBannerHeading || "Ready to Schedule Your Study?",
    ctaBannerBody:
      service.ctaBannerBody ||
      "Our certified engineers deliver fast turnaround, clear reports, and full compliance support.",
    ctaBannerPrimaryText: service.ctaBannerPrimaryText || "Get a Free Quote",
    ctaBannerPrimaryHref: service.ctaBannerPrimaryHref || config.contactPath,
    ctaBannerSecondaryText: service.ctaBannerSecondaryText || "View All Services",
    ctaBannerSecondaryHref: service.ctaBannerSecondaryHref || config.servicesIndexPath,
  };
}

function ServiceView({ service, slug }: { service: ServicePage; slug: string }) {
  const data = buildServiceData(service);
  const pageUrl = `https://carelabz.com/${CC}/${slug}/`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebPage",
        "@id": pageUrl,
        url: pageUrl,
        name: service.metaTitle || `${service.title} | Carelabs ${COUNTRY_NAME}`,
        description: service.metaDescription || undefined,
        inLanguage: HREFLANG,
        isPartOf: { "@id": "https://carelabz.com/#website" },
      },
      {
        "@type": "Service",
        name: service.title,
        serviceType: "Electrical Safety Engineering",
        description: data.definitionalLede || service.metaDescription || undefined,
        url: pageUrl,
        provider: {
          "@type": "LocalBusiness",
          name: "Carelabs",
          url: "https://carelabz.com",
          telephone: config.phone,
          email: config.email,
          address: {
            "@type": "PostalAddress",
            addressLocality: config.address,
            addressCountry: CC.toUpperCase(),
          },
        },
        areaServed: { "@type": "Country", name: COUNTRY_NAME },
      },
      ...(data.faqs.length > 0
        ? [{
            "@type": "FAQPage",
            mainEntity: data.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }]
        : []),
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: `https://carelabz.com/${CC}/` },
          { "@type": "ListItem", position: 2, name: "Services", item: `https://carelabz.com${config.servicesIndexPath}` },
          { "@type": "ListItem", position: 3, name: service.title, item: pageUrl },
        ],
      },
    ],
  };

  return (
    <main className={`${montserrat.className} bg-[#EEF4FF]`}>
      <JsonLd data={jsonLd} />
      <RegionNavbar config={config} />
      <FloatingSidebar />

      <section className="bg-[#EEF4FF] pt-32 pb-24 relative overflow-hidden">
        <div className="absolute w-[700px] h-[700px] rounded-full bg-white/50 -top-48 -right-48" />
        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <nav aria-label="Breadcrumb" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-sm text-[#374151]">
              <li><Link href={config.servicesIndexPath} className="hover:text-[#FF6633] transition-colors">Services</Link></li>
              <li><ChevronRight className="h-3 w-3" /></li>
              <li className="text-[#1A2538] font-medium">{service.title}</li>
            </ol>
          </nav>
          <div className="max-w-3xl">
            <p className="text-sm font-semibold text-[#1A2538] uppercase tracking-widest mb-4">{data.eyebrow}</p>
            <h1 className="text-4xl sm:text-5xl font-semibold text-[#1A2538] leading-tight mb-6">{service.title}</h1>
            {data.definitionalLede && (
              <p className="text-xl text-[#374151] leading-relaxed mb-8">{data.definitionalLede}</p>
            )}
            <Link href={data.ctaBannerPrimaryHref} className="inline-flex items-center bg-[#FF6633] text-white rounded-[50px] h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-sm">
              Free Consultation <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
            {data.trustBadges.length > 0 && (
              <div className="flex flex-wrap gap-3 mt-10">
                {data.trustBadges.map((badge, i) => (
                  <span key={i} className="inline-flex items-center gap-1.5 bg-white rounded-full px-4 py-2 text-sm font-medium text-[#0050B3] border border-blue-100 shadow-sm">
                    <Shield className="h-3.5 w-3.5" />
                    {badge.label}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="bg-[#EEF4FF] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-4xl sm:text-5xl font-semibold text-[#1A2538] mb-6">{data.featuresHeading}</h2>
            {data.featuresSubtext && <p className="text-lg text-[#374151] leading-relaxed">{data.featuresSubtext}</p>}
          </div>
        </div>
      </section>

      {data.features.length > 0 && (
        <section className="bg-white py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] mb-12">What We Deliver</h2>
            <FeatureTabs features={data.features} />
          </div>
        </section>
      )}

      <section className="bg-[#EEF4FF] py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div>
              <p className="text-sm font-semibold text-[#FF6633] uppercase tracking-widest mb-4">{data.safetyEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2538] mb-6">{data.safetyHeading}</h2>
              <p className="text-[#374151] leading-relaxed mb-8">{data.safetyBody}</p>
              {data.safetyBullets.length > 0 && (
                <ul className="space-y-4 mb-8">
                  {data.safetyBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <CheckCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#0050B3]" />
                      <span className="text-[#374151]">{bullet}</span>
                    </li>
                  ))}
                </ul>
              )}
              <Link href={config.contactPath} className="inline-flex items-center bg-[#0050B3] text-white rounded-[50px] h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-sm">
                Contact Us <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
            <div className="relative rounded-2xl overflow-hidden bg-blue-100 aspect-[4/3] flex items-center justify-center">
              <Shield className="h-24 w-24 text-[#0050B3]/20" />
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid gap-12 lg:grid-cols-2 lg:items-center">
            <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-[4/3] flex items-center justify-center order-2 lg:order-1">
              <FileText className="h-24 w-24 text-slate-300" />
            </div>
            <div className="order-1 lg:order-2">
              <p className="text-sm font-semibold text-[#FF6633] uppercase tracking-widest mb-4">{data.reportsEyebrow}</p>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#1A2538] mb-6">{data.reportsHeading}</h2>
              <p className="text-[#374151] leading-relaxed mb-8">{data.reportsBody}</p>
              {data.reportsBullets.length > 0 && (
                <ol className="space-y-4 mb-8">
                  {data.reportsBullets.map((bullet, i) => (
                    <li key={i} className="flex items-start gap-4">
                      <span className="flex-shrink-0 flex items-center justify-center bg-[#0050B3] text-white rounded-full w-8 h-8 text-sm font-bold">{i + 1}</span>
                      <span className="text-[#374151] pt-1">{bullet}</span>
                    </li>
                  ))}
                </ol>
              )}
              <Link href={config.contactPath} className="inline-flex items-center bg-[#0050B3] text-white rounded-[50px] h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-sm">
                Reach Out <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {data.processSteps.length > 0 && (
        <section className="bg-[#EEF4FF] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] text-center mb-16">{data.processHeading}</h2>
            <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {data.processSteps.map((step, index) => {
                const Icon = STEP_ICONS[index % STEP_ICONS.length];
                const stepNum = step.number ?? index + 1;
                return (
                  <div key={stepNum} className="relative bg-white rounded-[30px] shadow-sm p-8">
                    <span className="absolute top-4 right-6 text-6xl font-bold text-[#0050B3]/10">{String(stepNum).padStart(2, "0")}</span>
                    <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-50">
                      <Icon className="h-6 w-6 text-[#0050B3]" />
                    </div>
                    <h3 className="text-lg font-bold text-[#1A2538] mb-2">{step.title}</h3>
                    <p className="text-[#374151] text-sm leading-relaxed">{step.description}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>
      )}

      {data.faqs.length > 0 && (
        <section className="bg-[#EEF4FF] py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl sm:text-4xl font-semibold text-[#1A2538] text-center mb-12">{data.faqSectionHeading}</h2>
            <ServiceFaqAccordion faqs={data.faqs} />
          </div>
        </section>
      )}

      <section className="bg-[#0050B3] py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">{data.ctaBannerHeading}</h2>
          {data.ctaBannerBody && <p className="text-lg text-blue-100 mb-10 max-w-2xl mx-auto">{data.ctaBannerBody}</p>}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href={data.ctaBannerSecondaryHref} className="inline-flex items-center justify-center rounded-[50px] border-2 border-white text-white h-[50px] px-8 font-semibold hover:bg-white hover:text-[#0050B3] transition-all">
              {data.ctaBannerSecondaryText}
            </Link>
            <Link href={data.ctaBannerPrimaryHref} className="inline-flex items-center justify-center rounded-[50px] bg-[#FF6633] text-white h-[50px] px-8 font-semibold hover:scale-105 transition-all shadow-lg">
              {data.ctaBannerPrimaryText}
            </Link>
          </div>
        </div>
      </section>

      <RegionFooter config={config} />
    </main>
  );
}

function formatDate(s: string | null): string {
  if (!s) return "";
  try {
    return new Date(s).toLocaleDateString("en-US", { year: "numeric", month: "long", day: "numeric" });
  } catch {
    return s;
  }
}

function BlogView({ post }: { post: BlogPost }) {
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: post.title,
    description: post.metaDescription ?? post.excerpt ?? "",
    inLanguage: HREFLANG,
    author: { "@type": "Person", name: post.author ?? "Carelabs Engineering Team" },
    datePublished: post.publishedDate ?? post.publishedAt,
    dateModified: post.updatedAt,
    publisher: { "@type": "Organization", name: "Carelabs", url: "https://carelabz.com" },
    ...(post.heroImage ? { image: `https://carelabz.com${post.heroImage}` } : {}),
    url: `https://carelabz.com/${CC}/${post.slug}/`,
  };

  return (
    <>
      <RegionNavbar config={config} />
      <JsonLd data={articleJsonLd} />

      <main id="main-content">
        <section className="bg-[#EEF4FF] pt-28 pb-16 px-4">
          <div className="mx-auto max-w-4xl">
            <nav aria-label="Breadcrumb" className="flex items-center gap-2 text-sm text-[#374151] mb-6 flex-wrap">
              <Link href={`/${CC}/`} className="hover:text-[#1A2538] transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link href={config.blogIndexPath} className="hover:text-[#1A2538] transition-colors">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#1A2538] line-clamp-1">{post.title}</span>
            </nav>
            {post.category && (
              <span className="inline-block text-xs font-bold text-orange-500 uppercase tracking-widest mb-4">{post.category}</span>
            )}
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#1A2538] mb-6 leading-tight">{post.title}</h1>
            <div className="flex flex-wrap items-center gap-4 text-[#374151] text-sm mb-10">
              {post.author && <span>By <span className="text-[#1A2538] font-medium">{post.author}</span></span>}
              {post.publishedDate && <time dateTime={post.publishedDate}>{formatDate(post.publishedDate)}</time>}
            </div>
            {post.heroImage && post.heroImage.startsWith("http") ? (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden">
                <Image src={post.heroImage} alt={post.heroImageAlt ?? post.title} fill priority className="object-cover" sizes="(max-width: 896px) 100vw, 896px" />
              </div>
            ) : (
              <div className="relative aspect-[16/9] rounded-xl overflow-hidden bg-gradient-to-br from-[#0050B3] to-[#1A2538] flex items-center justify-center">
                <span className="text-white/20 text-8xl font-bold">CL</span>
              </div>
            )}
          </div>
        </section>

        <section className="bg-offWhite py-16 px-4">
          <div className="mx-auto max-w-3xl">
            <div
              className="prose prose-lg max-w-none prose-headings:text-[#1A2538] prose-headings:font-bold prose-p:text-[#374151] prose-li:text-[#374151] prose-strong:text-[#1A2538] prose-a:text-[#FF6633] prose-a:no-underline hover:prose-a:underline"
              dangerouslySetInnerHTML={{ __html: marked(post.body || "") as string }}
            />
            {post.tags && post.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2">
                {post.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-4 py-1.5 text-xs font-medium text-slate-600">{tag}</span>
                ))}
              </div>
            )}
          </div>
        </section>

        {post.faqs && post.faqs.length > 0 && (
          <section className="bg-white py-16 px-4">
            <div className="mx-auto max-w-3xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-navy mb-8">Frequently Asked Questions</h2>
              <FaqAccordion faqs={post.faqs} />
            </div>
          </section>
        )}

        <section className="bg-[#0050B3] py-20 px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">Need Expert Electrical Safety Support?</h2>
            <p className="text-white/70 text-lg mb-8 max-w-2xl mx-auto">
              Carelabs provides arc flash studies, power system analysis, and {config.primaryStandard} compliance services across {COUNTRY_NAME}.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href={config.contactPath} className="inline-flex items-center justify-center rounded-lg bg-orange-500 px-8 py-3 text-base font-semibold text-white hover:bg-orange-600 transition-colors">
                Get a Free Quote
                <ArrowRight className="ml-2 w-4 h-4" />
              </Link>
              <Link href={config.blogIndexPath} className="inline-flex items-center justify-center rounded-lg border border-white/30 px-8 py-3 text-base font-semibold text-white hover:bg-white/10 transition-colors">
                More Articles
              </Link>
            </div>
          </div>
        </section>
      </main>
      <RegionFooter config={config} />
    </>
  );
}

export default async function Page({ params }: PageProps) {
  const service = await getServicePageBySlug(`${params.slug}-${CC}`);
  if (service) return <ServiceView service={service} slug={params.slug} />;
  const post = await getBlogPost(CC, `${params.slug}-${CC}`);
  if (post) return <BlogView post={post} />;
  notFound();
}
