export function getOrganizationSchema() {
  return {
    "@type": "Organization",
    "@id": "https://carelabz.com/#organization",
    name: "CareLabs",
    url: "https://carelabz.com",
    logo: "https://carelabz.com/images/logo/carelabs-logo.svg",
    telephone: "+1-800-123-4567",
    email: "info@carelabz.com",
    address: {
      "@type": "PostalAddress",
      streetAddress: "1234 Energy Drive, Suite 200",
      addressLocality: "Houston",
      addressRegion: "TX",
      postalCode: "77001",
      addressCountry: "US",
    },
    sameAs: ["https://ae.linkedin.com/company/carelabs"],
  };
}

export function getOrganizationSchemaCA() {
  return {
    "@type": "Organization",
    "@id": "https://carelabz.com/#organization-ca",
    name: "CareLabs",
    url: "https://carelabz.com/ca/",
    logo: "https://carelabz.com/images/logo/carelabs-logo.svg",
    telephone: "+1-800-456-7890",
    email: "info@carelabz.com",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Toronto",
      addressRegion: "ON",
      addressCountry: "CA",
    },
    sameAs: ["https://ae.linkedin.com/company/carelabs"],
  };
}

export function getWebSiteSchema() {
  return {
    "@type": "WebSite",
    "@id": "https://carelabz.com/#website",
    url: "https://carelabz.com",
    name: "CareLabs",
    publisher: { "@id": "https://carelabz.com/#organization" },
  };
}

export function getWebPageSchema(
  url: string,
  name: string,
  description: string,
  lang: string = "en-US"
) {
  return {
    "@type": "WebPage",
    "@id": url,
    url,
    name,
    description,
    inLanguage: lang,
    isPartOf: { "@id": "https://carelabz.com/#website" },
    publisher: { "@id": "https://carelabz.com/#organization" },
  };
}

export function getBreadcrumbSchema(
  items: { name: string; url: string }[]
) {
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url,
    })),
  };
}

export function buildJsonLd(schemas: object[]) {
  return {
    "@context": "https://schema.org",
    "@graph": schemas,
  };
}
