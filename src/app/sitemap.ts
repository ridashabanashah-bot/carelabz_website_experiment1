import { MetadataRoute } from "next";
import { getBlogPosts } from "@/lib/strapi-blog";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://carelabz.com";

  const serviceSlugs = [
    "study-analysis/arc-flash-study",
    "study-analysis/short-circuit-analysis",
    "study-analysis/load-flow-analysis",
    "study-analysis/relay-coordination-study",
    "study-analysis/harmonic-study",
    "study-analysis/power-quality-analysis",
    "study-analysis/motor-start-analysis",
    "study-analysis/power-system-study",
    "inspection/electrical-safety-inspection",
  ];

  const caServiceSlugs = [
    "arc-flash-study",
    "short-circuit-analysis",
    "load-flow-analysis",
    "relay-coordination-study",
  ];

  const staticPages: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, priority: 1.0, changeFrequency: "monthly" },
    { url: `${baseUrl}/us/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/us/services/`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${baseUrl}/us/about/`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/us/contact/`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/us/blog/`, priority: 0.8, changeFrequency: "daily" },
    { url: `${baseUrl}/us/case-studies/`, priority: 0.7, changeFrequency: "weekly" },
    { url: `${baseUrl}/ca/`, priority: 1.0, changeFrequency: "weekly" },
    { url: `${baseUrl}/ca/service/`, priority: 0.9, changeFrequency: "weekly" },
    { url: `${baseUrl}/ca/about-us/`, priority: 0.7, changeFrequency: "monthly" },
    { url: `${baseUrl}/ca/contact/`, priority: 0.8, changeFrequency: "monthly" },
    { url: `${baseUrl}/ca/blogs/`, priority: 0.8, changeFrequency: "daily" },
    { url: `${baseUrl}/ca/case-study/`, priority: 0.7, changeFrequency: "weekly" },
  ];

  const servicePages: MetadataRoute.Sitemap = serviceSlugs.map((slug) => ({
    url: `${baseUrl}/us/services/${slug}/`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  const caServicePages: MetadataRoute.Sitemap = caServiceSlugs.map((slug) => ({
    url: `${baseUrl}/ca/services/${slug}/`,
    lastModified: new Date(),
    priority: 0.9,
    changeFrequency: "monthly",
  }));

  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts("us");
    blogPages = posts.map((post) => ({
      url: `${baseUrl}/us/blog/${post.slug}/`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    }));
  } catch {
    // Strapi unavailable — skip blog posts in sitemap
  }

  let caBlogPages: MetadataRoute.Sitemap = [];
  try {
    const posts = await getBlogPosts("ca");
    caBlogPages = posts.map((post) => ({
      url: `${baseUrl}/ca/${post.slug}/`,
      lastModified: new Date(post.updatedAt || post.publishedAt),
      priority: 0.6,
      changeFrequency: "monthly" as const,
    }));
  } catch {
    // Strapi unavailable — skip CA blog posts in sitemap
  }

  return [...staticPages, ...servicePages, ...caServicePages, ...blogPages, ...caBlogPages];
}
