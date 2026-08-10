import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      fontFamily: {
        sans: ["Inter", "sans-serif"],
        serif: ["Fraunces", "serif"],
      },
      colors: {
        background: "#0D1420",
        foreground: "#F3EFE6",
        card: {
          DEFAULT: "#141B2B",
          foreground: "#F3EFE6",
        },
        popover: {
          DEFAULT: "#141B2B",
          foreground: "#F3EFE6",
        },
        primary: {
          DEFAULT: "#D6A85A",
          foreground: "#0D1420",
          hover: "#B98A3E",
        },
        secondary: {
          DEFAULT: "#19202B",
          foreground: "#F3EFE6",
          hover: "#1F2937",
        },
        muted: {
          DEFAULT: "#141B2B",
          foreground: "#8C93A3",
        },
        accent: {
          DEFAULT: "#212225",
          foreground: "#D6A85A",
        },
        border: "rgba(255, 255, 255, 0.08)",
        input: "rgba(255, 255, 255, 0.1)",
        ring: "#D6A85A",
        
        navy: {
          base: "#0D1420",
          elevated: "#141B2B",
        },
        gold: {
          DEFAULT: "#D6A85A",
          dark: "#B98A3E",
          light: "#F0CD8E",
        },
        slate: {
          muted: "#8C93A3"
        },
        destructive: {
          DEFAULT: "#D9534F",
          foreground: "#F3EFE6",
        },
        success: {
          DEFAULT: "#5CB85C",
          foreground: "#F3EFE6",
        },
        warning: {
          DEFAULT: "#F0AD4E",
          foreground: "#F3EFE6",
        },
        info: {
          DEFAULT: "#5BC0DE",
          foreground: "#F3EFE6",
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #D6A85A, #F0CD8E)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(214, 168, 90, 0.15)',
        'elevated': '0 4px 20px rgba(0, 0, 0, 0.4)',
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
        xl: "1rem",
        "2xl": "1.5rem",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
