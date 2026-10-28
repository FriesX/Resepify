import type { Config } from "tailwindcss";

export default {
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
          DEFAULT: "var(--color-primary)",
          hover: "var(--color-primary-hover)",
          light: "var(--color-primary-light)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          hover: "var(--color-secondary-hover)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          hover: "var(--color-accent-hover)",
          light: "var(--color-accent-light)",
        },
        cream: {
          50: "#FFFDF9",
          100: "#FFFBEB",
          200: "#FEF3C7",
          300: "#FDE68A",
        },
        terracotta: {
          50: "#FFF7ED",
          100: "#FFEDD5",
          200: "#FED7AA",
          500: "#F97316",
          700: "#C2410C",
          800: "#9A3412",
          900: "#7C2D12",
        },
        sage: {
          50: "#F0FDF4",
          100: "#DCFCE7",
          500: "#22C55E",
          600: "#16A34A",
          700: "#059669",
          800: "#047857",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        border: "var(--color-border)",
      },
      fontFamily: {
        serif: ["var(--font-serif)", "Playfair Display", "Georgia", "serif"],
        sans: ["var(--font-sans)", "Plus Jakarta Sans", "Nunito Sans", "sans-serif"],
      },
      borderRadius: {
        clay: "18px",
        "clay-sm": "12px",
        "clay-lg": "24px",
      },
      boxShadow: {
        clay: "0 10px 25px -5px rgba(154, 52, 18, 0.08), 0 8px 10px -6px rgba(154, 52, 18, 0.04)",
        "clay-hover": "0 20px 30px -10px rgba(154, 52, 18, 0.14), 0 10px 12px -5px rgba(154, 52, 18, 0.06)",
        "clay-card": "0 4px 20px rgba(0, 0, 0, 0.04), 0 1px 3px rgba(0, 0, 0, 0.02)",
        "clay-button": "0 4px 14px 0 rgba(154, 52, 18, 0.35)",
        "clay-accent": "0 4px 14px 0 rgba(5, 150, 105, 0.3)",
      },
    },
  },
  plugins: [],
} satisfies Config;
