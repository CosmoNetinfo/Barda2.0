import type { Config } from "tailwindcss";

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
        primary: {
          DEFAULT: "#E8201A",
          50: "#fdf3f2",
          100: "#fce5e3",
          500: "#E8201A",
          600: "#d11913",
        },
        success: {
          DEFAULT: "#2E8B3A",
          50: "#f4fcf5",
          100: "#e5f8e8",
          500: "#2E8B3A",
          600: "#247330",
        }
      },
      fontFamily: {
        barlow: ["var(--font-barlow-condensed)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      }
    },
  },
  plugins: [],
};
export default config;
