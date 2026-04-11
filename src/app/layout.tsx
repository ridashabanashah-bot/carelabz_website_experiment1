import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { JsonLd } from "@/components/JsonLd";

const geistSans = localFont({
  src: "./fonts/GeistVF.woff",
  variable: "--font-geist-sans",
  weight: "100 900",
});
const geistMono = localFont({
  src: "./fonts/GeistMonoVF.woff",
  variable: "--font-geist-mono",
  weight: "100 900",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carelabz.com"),
  title: "CareLAbz — Electrical Safety Services",
  description:
    "Professional electrical safety services including arc flash studies, power system analysis, and compliance solutions in Dubai, UAE.",
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "CareLAbz",
  url: "https://carelabz.com",
  logo: "https://carelabz.com/icon.svg",
  sameAs: [
    "https://www.linkedin.com/company/carelabz",
    "https://www.facebook.com/carelabz",
    "https://twitter.com/carelabz",
    "https://en.wikipedia.org/wiki/Arc_flash",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AE">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-50 focus:rounded focus:bg-orange-500 focus:px-4 focus:py-2 focus:text-white focus:shadow-lg"
        >
          Skip to content
        </a>
        <JsonLd data={organizationJsonLd} />
        {children}
      </body>
    </html>
  );
}
