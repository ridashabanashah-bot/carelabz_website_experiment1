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
      },
    },
  },
  plugins: [typography],
};
export default config;
