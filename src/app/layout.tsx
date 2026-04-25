import type { Metadata } from "next";
import localFont from "next/font/local";
import {
  Montserrat,
  Poppins,
  Barlow_Condensed,
  Playfair_Display,
  Fraunces,
  Syne,
} from "next/font/google";
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

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-montserrat",
  display: "swap",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-poppins",
  display: "swap",
});

const barlowCondensed = Barlow_Condensed({
  subsets: ["latin"],
  weight: ["400", "600", "700", "800"],
  variable: "--font-barlow-condensed",
  display: "swap",
});

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "700"],
  style: ["normal", "italic"],
  variable: "--font-playfair",
  display: "swap",
});

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  style: ["normal", "italic"],
  variable: "--font-fraunces",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
  variable: "--font-syne",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://carelabz.com"),
  title: "Carelabs — Electrical Safety Services",
  description:
    "Professional electrical safety services including arc flash studies, power system analysis, and compliance solutions in Dubai, UAE.",
  openGraph: {
    type: "website",
    siteName: "Carelabs",
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    site: "@carelabz",
  },
};

const organizationJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Carelabs",
  url: "https://carelabz.com",
  logo: "https://carelabz.com/icon.svg",
  sameAs: [
    "https://ae.linkedin.com/company/carelabs",
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
        className={`${geistSans.variable} ${geistMono.variable} ${montserrat.variable} ${poppins.variable} ${barlowCondensed.variable} ${playfairDisplay.variable} ${fraunces.variable} ${syne.variable} antialiased bg-white text-gray-900`}
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
