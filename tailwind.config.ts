import type { Config } from "tailwindcss";
import typography from "@tailwindcss/typography";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        navy: "#0B1A2F",
        offWhite: "#F8FAFC",
        slateCard: "#1E293B",
        "off-white": "#F8FAFC",
        "slate-card": "#1E293B",
        carelabsBlue: "#0050B3",
        carelabsOrange: "#FF6633",
        carelabsText: "#1A2538",
        carelabsBg: "#EEF4FF",
        carelabsTextSecondary: "#374151",
        carelabsFooter: "#23282D",
        // Northern Europe palette
        nordicBlue: "#1A3650",
        nordicMid: "#4A7C9B",
        sand: "#DDD5C5",
        sandLight: "#F0EBE1",
        warmWhite: "#F9F7F3",
        nordicSlate: "#243E54",
        // United Arab Emirates palette
        aeDeep: "#0A1628",
        aeNavy: "#0F2847",
        aeInk: "#163560",
        aeMid: "#1E5A8A",
        aeSky: "#2D7AB8",
        aeSteel: "#5A8FB4",
        aePale: "#D4E3F0",
        aeIce: "#EBF2F8",
        aeStone: "#F2EDE6",
        aeWarm: "#F8F5F0",
        aeWhite: "#FAFBFC",
        aeOrange: "#F97316",
        // AE v0 brand palette (from Carelabs Brand Guidelines)
        brand: {
          blue: "#2575B6",
          orange: "#F15C30",
          "dark-blue": "#094D76",
          gray: "#9C9B9A",
          "light-gray": "#F2F2F4",
        },
      },
      fontFamily: {
        serif: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        body: ["var(--font-poppins)", "system-ui", "sans-serif"],
        condensed: [
          "var(--font-barlow-condensed)",
          "system-ui",
          "sans-serif",
        ],
        accent: ["var(--font-playfair)", "Georgia", "serif"],
        // NE fonts (Fraunces + Syne)
        "ne-display": ["var(--font-fraunces)", "Georgia", "serif"],
        "ne-accent": ["var(--font-fraunces)", "Georgia", "serif"],
        "ne-body": ["var(--font-syne)", "system-ui", "sans-serif"],
        "ne-nav": ["var(--font-syne)", "system-ui", "sans-serif"],
        // AE v0 fonts (Anton + Inter) — replaces DM Serif Display
        "ae-display": ["var(--font-anton)", "Anton", "sans-serif"],
        "ae-body": ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        "ae-nav": ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        // Generic v0 aliases
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-anton)", "Anton", "sans-serif"],
      },
      animation: {
        marquee: "marquee 30s linear infinite",
        "marquee-slow": "marquee-slow 40s linear infinite",
      },
      keyframes: {
        marquee: {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-50%)" },
        },
        "marquee-slow": {
          "0%": { transform: "translateX(0)" },
          "100%": { transform: "translateX(-33.333%)" },
        },
      },
    },
  },
  plugins: [typography],
};
export default config;
