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
      },
      fontFamily: {
        serif: ["var(--font-montserrat)", "system-ui", "sans-serif"],
        display: ["var(--font-montserrat)", "system-ui", "sans-serif"],
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
