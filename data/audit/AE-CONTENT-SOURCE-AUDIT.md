# AE Content Source Audit Report
Generated: 2026-04-27T18:39:57

## 1. Codebase Analysis — Hardcoded vs Strapi per File

### Homepage — `app/ae/page.tsx`
- Hardcoded strings: **40**
- Strapi field references: **25**
- Fallback patterns: **4**

**Hardcoded UI copy:**
  - [JSX text] `Content unavailable — please try again shortly`
  - [JSX text] `Power System Engineering`
  - [JSX text] `We protect people, facilities, and operations through rigorous power system engi`
  - [JSX text] `Capabilities`
  - [JSX text] `What We Do`
  - [JSX text] `View All Services`
  - [JSX text] `Your Safety.`
  - [JSX text] `Engineered.`
  - [JSX text] `Methodology`
  - [JSX text] `How We Work`
  - [JSX text] `Insights`
  - [JSX text] `From the Blog`
  - [JSX text] `Read All Articles`
  - [JSX text] `Common Questions`
  - [JSX text] `Let&apos;s Talk.`
  - [JSX text] `Tell us about your facility and compliance requirements.`
  - [JSX text] `Contact Us`
  - [Quoted string] `,
      type: `
  - [Quoted string] `,
      locale: `
  - [Quoted string] `,
    },
    twitter: {
      card: `
  - ... and 20 more

**Strapi fields used:**
  `config.address, config.blogIndexPath, config.contactPath, config.email, config.hreflang, config.phone, config.servicesIndexPath, page.ctaBannerPrimaryHref, page.faqs, page.footerAddress, page.footerEmail, page.footerPhone, page.heroHeadline, page.heroPrimaryCtaHref, page.heroPrimaryCtaText, page.heroSecondaryCtaHref, page.heroSecondaryCtaText, page.heroSubtext, page.industries, page.insights`

**Fallback defaults (Strapi field → hardcoded backup):**
  - `page.heroHeadline` → `Electrical Safety Demands Precision.`
  - `page.heroSubtext` → `DEWA-compliant arc flash studies, power system analysis, and`
  - `page.heroPrimaryCtaText` → `Get a Quote`
  - `page.heroSecondaryCtaText` → `Our Services`

---

### Services Index — `app/ae/services/page.tsx`
- Hardcoded strings: **12**
- Strapi field references: **8**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [JSX text] `United Arab Emirates · Engineering`
  - [JSX text] `Our Services`
  - [JSX text] `Services are currently being loaded. Please check back shortly.`
  - [JSX text] `Learn More`
  - [JSX text] `Ready to schedule a study?`
  - [JSX text] `Tell us about your facility and compliance requirements.`
  - [JSX text] `Request a Quote`
  - [Quoted string] `,
    type: `
  - [Quoted string] `,
    locale: `
  - [Quoted string] `,
  },
};

function getServiceHref(svc: ServicePage): string {
  const suffix = `
  - [Quoted string] `CollectionPage`
  - [Quoted string] `Carelabs UAE — Services`

**Strapi fields used:**
  `config.contactPath, config.hreflang, config.primaryStandard, config.serviceDetailPattern, config.servicesIndexPath, service.id, service.metaDescription, service.title`

---

### Service Detail — `app/ae/services/[slug]/page.tsx`
- Hardcoded strings: **31**
- Strapi field references: **26**
- Fallback patterns: **7**

**Hardcoded UI copy:**
  - [JSX text] `Home`
  - [JSX text] `Services`
  - [JSX text] `Free Consultation`
  - [JSX text] `What We Deliver`
  - [JSX text] `Our Process`
  - [Quoted string] `;
const COUNTRY_NAME = `
  - [Quoted string] `;
const HREFLANG = `
  - [Quoted string] `),
    alternates: {
      canonical: pageUrl,
      languages: { [HREFLANG]: pa`
  - [Quoted string] `: pageUrl },
    },
    openGraph: {
      title: service.metaTitle || `${servic`
  - [Quoted string] `,
      type: `
  - [Quoted string] `,
      locale: `
  - [Quoted string] `,
    },
    twitter: {
      card: `
  - [Quoted string] `Service`
  - [Quoted string] `Electrical Safety Engineering`
  - [Quoted string] `LocalBusiness`
  - [Quoted string] `Carelabs`
  - [Quoted string] `PostalAddress`
  - [Quoted string] `,
          },
        },
        areaServed: { `
  - [Quoted string] `Country`
  - [Quoted string] `FAQPage`
  - ... and 11 more

**Strapi fields used:**
  `config.address, config.contactPath, config.email, config.primaryStandard, config.servicesIndexPath, service.body, service.ctaBannerBody, service.ctaBannerHeading, service.ctaBannerPrimaryHref, service.ctaBannerPrimaryText, service.definitionalLede, service.eyebrow, service.faqSectionHeading, service.faqs, service.features, service.featuresHeading, service.metaDescription, service.metaTitle, service.processHeading, service.processSteps`

**Fallback defaults (Strapi field → hardcoded backup):**
  - `service.featuresHeading` → `Key Outcomes`
  - `service.processHeading` → `How We Work`
  - `service.safetyEyebrow` → `Safety`
  - `service.safetyHeading` → `Protecting Your Team`
  - `service.faqSectionHeading` → `Common Questions`
  - `service.ctaBannerHeading` → `Ready to schedule a study?`
  - `service.ctaBannerPrimaryText` → `Get a Quote`

---

### Blog Index — `app/ae/blog/page.tsx`
- Hardcoded strings: **15**
- Strapi field references: **11**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [JSX text] `Knowledge Hub`
  - [JSX text] `Insights & Field Notes`
  - [JSX text] `No articles yet. Check back soon.`
  - [JSX text] `Need expert support?`
  - [JSX text] `Our UAE team is ready to help with arc flash studies, system protection, and DEW`
  - [JSX text] `Get a Quote`
  - [Quoted string] `,
    type: `
  - [Quoted string] `,
    locale: `
  - [Quoted string] `)
    .trim();
}

function formatDate(s: string | null): string {
  if (!s) retu`
  - [Quoted string] `;
  try {
    return new Date(s).toLocaleDateString(`
  - [Quoted string] `, {
      day: `
  - [Quoted string] `,
      month: `
  - [Quoted string] `,
      year: `
  - [Quoted string] `,
    });
  } catch {
    return `
  - [Quoted string] `;
  }
}

function postDate(post: BlogPost): string {
  return post.publishedDate`

**Strapi fields used:**
  `config.blogDetailPattern, config.blogIndexPath, config.contactPath, config.hreflang, config.primaryStandard, post.category, post.id, post.publishedAt, post.publishedDate, post.slug, post.title`

---

### Blog Detail — `app/ae/blog/[slug]/page.tsx`
- Hardcoded strings: **26**
- Strapi field references: **18**
- Fallback patterns: **1**

**Hardcoded UI copy:**
  - [JSX text] `Home`
  - [JSX text] `Insights`
  - [JSX text] `Common Questions`
  - [JSX text] `Need expert support?`
  - [JSX text] `Get a Quote`
  - [JSX text] `More Articles`
  - [Quoted string] `;
const COUNTRY_NAME = `
  - [Quoted string] `;
const HREFLANG = `
  - [Quoted string] `)
    .trim();
}

function formatDate(s: string | null): string {
  if (!s) retu`
  - [Quoted string] `;
  try {
    return new Date(s).toLocaleDateString(`
  - [Quoted string] `, {
      year: `
  - [Quoted string] `,
      month: `
  - [Quoted string] `,
      day: `
  - [Quoted string] `: pageUrl },
    },
    openGraph: {
      title: post.metaTitle ?? `${title} | `
  - [Quoted string] `,
      type: `
  - [Quoted string] `,
      locale: `
  - [Quoted string] `,
    },
    twitter: {
      card: `
  - [Quoted string] `,
      title: post.metaTitle ?? `${title} | Carelabs ${COUNTRY_NAME}`,
      de`
  - [Quoted string] `Article`
  - [Quoted string] `,
    inLanguage: HREFLANG,
    author: {
      `
  - ... and 6 more

**Strapi fields used:**
  `config.blogIndexPath, config.contactPath, config.primaryStandard, post.author, post.body, post.category, post.excerpt, post.faqs, post.heroImage, post.heroImageAlt, post.metaDescription, post.metaTitle, post.publishedAt, post.publishedDate, post.seoKeywords, post.tags, post.title, post.updatedAt`

**Fallback defaults (Strapi field → hardcoded backup):**
  - `post.author` → `Carelabs Engineering Team`

---

### About — `app/ae/about/page.tsx`
- Hardcoded strings: **13**
- Strapi field references: **10**
- Fallback patterns: **2**

**Hardcoded UI copy:**
  - [JSX text] `About`
  - [JSX text] `What We Stand For`
  - [JSX text] `Standards We Follow`
  - [Quoted string] `,
      type: `
  - [Quoted string] `,
      locale: `
  - [Quoted string] `>
            {page?.heroHeadline ?? `
  - [Quoted string] `>
            {page?.heroSubtext ??
              `
  - [Quoted string] `>
              {page?.missionHeading ? `
  - [Quoted string] `>
                {page.valuesHeading ?? `
  - [Quoted string] `>
                {page.statsHeading ?? `
  - [Quoted string] `>
              {page.certifications.join(`
  - [Quoted string] `>
            {page?.ctaBannerHeading ?? `
  - [Quoted string] `
            >
              {page?.ctaBannerPrimaryText ?? `

**Strapi fields used:**
  `config.contactPath, config.hreflang, page.certifications, page.ctaBannerSubtext, page.missionBody, page.missionHeading, page.stats, page.statsHeading, page.values, page.valuesHeading`

**Fallback defaults (Strapi field → hardcoded backup):**
  - `page.valuesHeading` → `Our Values`
  - `page.statsHeading` → `By the Numbers`

---

### Contact — `app/ae/contact/page.tsx`
- Hardcoded strings: **10**
- Strapi field references: **3**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [JSX text] `Contact`
  - [JSX text] `Reach Us`
  - [JSX text] `Email is the fastest way to start.`
  - [JSX text] `Our UAE team responds within one business day. For urgent compliance questions, `
  - [JSX text] `Or send a message`
  - [Quoted string] `,
      type: `
  - [Quoted string] `,
      locale: `
  - [Quoted string] `>
            {page?.heroHeadline ?? `
  - [Quoted string] `>
              {page?.formHeading ?? `
  - [Quoted string] `>
              {page?.formSubtext ??
                `

**Strapi fields used:**
  `config.countryName, config.dialCodeCountryIso2, config.hreflang`

---

### Case Studies Index — `app/ae/case-studies/page.tsx`
- Hardcoded strings: **11**
- Strapi field references: **8**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [JSX text] `Portfolio`
  - [JSX text] `Case Studies`
  - [JSX text] `Selected UAE projects from the Carelabs power system engineering team.`
  - [JSX text] `Coming Soon`
  - [JSX text] `Case studies are being compiled.`
  - [JSX text] `Discuss Your Project`
  - [JSX text] `Read Case Study`
  - [JSX text] `Ready to start a project?`
  - [JSX text] `Contact Us`
  - [Quoted string] `,
    type: `
  - [Quoted string] `,
    locale: `

**Strapi fields used:**
  `config.contactPath, config.hreflang, config.primaryStandard, study.excerpt, study.id, study.industry, study.slug, study.title`

---

### Case Study Detail — `app/ae/case-studies/[slug]/page.tsx`
- Hardcoded strings: **18**
- Strapi field references: **14**
- Fallback patterns: **2**

**Hardcoded UI copy:**
  - [JSX text] `Home`
  - [JSX text] `Case Studies`
  - [JSX text] `Client:`
  - [JSX text] `Challenge`
  - [JSX text] `Solution`
  - [JSX text] `Tell us about your facility — we&apos;ll respond within one business day.`
  - [JSX text] `Discuss Your Project`
  - [Quoted string] `;
const COUNTRY_NAME = `
  - [Quoted string] `;
const HREFLANG = `
  - [Quoted string] `: url },
    },
    openGraph: {
      title: study.metaTitle ?? `${study.title}`
  - [Quoted string] `,
      type: `
  - [Quoted string] `,
      locale: `
  - [Quoted string] `,
    },
  };
}

export default async function CaseStudyPage({ params }: PagePro`
  - [Quoted string] `Article`
  - [Quoted string] `Organization`
  - [Quoted string] `Carelabs`
  - [Quoted string] `Breadcrumb`
  - [Quoted string] `Have a similar challenge?`

**Strapi fields used:**
  `config.caseStudyPath, config.contactPath, study.body, study.challenge, study.client, study.ctaHref, study.ctaText, study.excerpt, study.industry, study.metaDescription, study.metaTitle, study.results, study.solution, study.title`

**Fallback defaults (Strapi field → hardcoded backup):**
  - `config.caseStudyPath` → `/ae/case-studies/`
  - `study.ctaText` → `Have a similar challenge?`

---

### Navbar — `components/ae-navbar.tsx`
- Hardcoded strings: **12**
- Strapi field references: **5**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [JSX text] `About Us`
  - [JSX text] `Services`
  - [JSX text] `All Services`
  - [JSX text] `Contact Us`
  - [JSX text] `About Us`
  - [JSX text] `Services`
  - [JSX text] `Contact Us`
  - [Quoted string] `shrink-0`
  - [Quoted string] `Carelabs`
  - [Quoted string] `rotate-180`
  - [Quoted string] `
            onClick={() => setMenuOpen(!menuOpen)}
            aria-label={menu`
  - [Quoted string] `Open menu`

**Strapi fields used:**
  `config.aboutPath, config.cc, config.contactPath, config.services, config.servicesIndexPath`

---

### Footer — `components/ae-footer.tsx`
- Hardcoded strings: **12**
- Strapi field references: **6**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [JSX text] `Services`
  - [JSX text] `Company`
  - [JSX text] `About`
  - [JSX text] `Insights`
  - [JSX text] `Case Studies`
  - [JSX text] `Contact`
  - [JSX text] `Contact`
  - [JSX text] `CARELABS`
  - [Quoted string] `lg:col-span-1`
  - [Quoted string] `Carelabs`
  - [Quoted string] `space-y-3`
  - [Quoted string] `space-y-3`

**Strapi fields used:**
  `config.aboutPath, config.blogIndexPath, config.caseStudyPath, config.contactPath, config.footerDescription, config.services`

---

### Countries Config — `lib/countries-config.ts`
- Hardcoded strings: **1522**
- Strapi field references: **1**
- Fallback patterns: **0**

**Hardcoded UI copy:**
  - [Quoted string] ` or `
  - [Quoted string] ` for `
  - [Quoted string] ` or `
  - [Quoted string] ` or `
  - [Quoted string] ` or `
  - [Quoted string] ` or `
  - [Quoted string] `IEEE 1584`
  - [Quoted string] `NOM-029-STPS-2011`
  - [Quoted string] `Mexican Electrical Code (NOM-001-SEDE)`
  - [Quoted string] `STPS`
  - [Quoted string] `Arc Flash Study`
  - [Quoted string] `Short Circuit Analysis`
  - [Quoted string] `Load Flow Analysis`
  - [Quoted string] `Relay Coordination Study`
  - [Quoted string] `,
    countryName: `
  - [Quoted string] `,
    countryNameLocative: `
  - [Quoted string] `,
    hreflang: `
  - [Quoted string] `,
    dialCodeCountryIso2: `
  - [Quoted string] `,
    servicesIndexPath: `
  - [Quoted string] `,
    serviceDetailPattern: `
  - ... and 1502 more

**Strapi fields used:**
  `config.mjs`

---

## 2. Strapi CMS Content — Field Completeness

### home-pages
  - Entry count: **1**
  - Populated fields (sample): `id, documentId, region, heroHeadline, heroSubtext, heroPrimaryCtaText, heroPrimaryCtaHref, heroSecondaryCtaText, heroSecondaryCtaHref, trustBadges, servicesHeading, servicesSubtext, services, industriesHeading, industries`
  - Empty/null fields (sample): `heroEyebrow, heroImage, heroImageAlt, whyHeading, whySubtext, whyFeatures, insightsHeading, insights, ctaBannerSecondaryText, ctaBannerSecondaryHref, footerDescription, footerPhone, ogImage`

### service-pages
  Error: object of type 'NoneType' has no len()

### blog-posts
  - Entry count: **38**
  - Populated fields (sample): `id, documentId, slug, title, body, category, author`

### about-pages
  - Entry count: **1**
  - Populated fields (sample): `id, documentId, region, heroHeadline, heroSubtext, missionHeading, missionBody, valuesHeading, values, statsHeading, stats, certifications, ctaBannerHeading, ctaBannerSubtext, ctaBannerPrimaryText`
  - Empty/null fields (sample): `heroImage, heroImageAlt, teamHeading, team`

### contact-pages
  - Entry count: **1**
  - Populated fields (sample): `id, documentId, region, heroHeadline, heroSubtext, email, address, formHeading, formSubtext, metaTitle, metaDescription, createdAt, updatedAt, publishedAt`
  - Empty/null fields (sample): `phone, mapEmbedUrl, officeHours`

### case-studies
  - Entry count: **1**
  - Populated fields (sample): `id, documentId, slug, title, body`

## 3. Summary

| Metric | Count |
|--------|-------|
| Total hardcoded strings found | 1722 |
| Total Strapi field references | 135 |
| Total fallback patterns | 16 |
| Strapi ratio | 135/1857 (7%) |

## 4. High-Priority Hardcoded Content to Migrate to Strapi

These are strings that should be CMS-driven for easier editing and regional variation:

| File | Hardcoded String | Suggested Strapi Field |
|------|-----------------|----------------------|
| contact/page.tsx | `info@carelabz.com` | Use `config.email` from countries-config |
| services/page.tsx | `Our Services` hero heading | `servicesIndexHeading` on HomePage |
| blog/page.tsx | `Insights & Field Notes` hero heading | `blogIndexHeading` on HomePage |
| case-studies/page.tsx | `Case Studies` hero heading | `caseStudiesHeading` on HomePage |
| blog/page.tsx, services/page.tsx | CTA section copy | CTA fields on respective index pages |
| homepage | `FALLBACK_PROCESS` methodology steps | `methodology` component on HomePage |