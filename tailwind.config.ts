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
        heading: ['"Space Grotesk"', "sans-serif"],
        body: ['"Plus Jakarta Sans"', "sans-serif"],
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

        // --- Creator Pulse palette ---
        pulse: {
          bg:       "#F7F7F5",
          text:     "#111111",
          white:    "#FFFFFF",
          lime:     "#C7FF3D",
          pink:     "#FF4FA3",
          blue:     "#5B7CFF",
          orange:   "#FF6B35",
          purple:   "#8B5CF6",
          muted:    "#888888",
          border:   "#E5E5E3",
          card:     "#FFFFFF",
          elevated: "#F0F0ED",
        },
      },
      backgroundImage: {
        'gold-gradient': 'linear-gradient(to right, #D6A85A, #F0CD8E)',
      },
      boxShadow: {
        'gold-glow': '0 0 20px rgba(214, 168, 90, 0.15)',
        'elevated': '0 4px 20px rgba(0, 0, 0, 0.4)',
        'pulse-card': '0 2px 16px rgba(0, 0, 0, 0.06)',
        'pulse-card-hover': '0 8px 30px rgba(0, 0, 0, 0.10)',
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
        "wave": {
          "0%": { transform: "rotate(0deg)" },
          "10%": { transform: "rotate(14deg)" },
          "20%": { transform: "rotate(-8deg)" },
          "30%": { transform: "rotate(14deg)" },
          "40%": { transform: "rotate(-4deg)" },
          "50%": { transform: "rotate(10deg)" },
          "60%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(0deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.4" },
          "50%": { opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "wave": "wave 2.5s ease-in-out infinite",
        "pulse-glow": "pulse-glow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
