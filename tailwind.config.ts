import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class", // Memastikan basisnya adalah dark mode
  theme: {
    extend: {
      colors: {
        // Basis Dark Mode (Zinc-950)
        background: "#09090b",
        foreground: "#fafafa",

        // Fintech Accents
        neonBlue: {
          DEFAULT: "#3b82f6",
          glow: "rgba(59, 130, 246, 0.5)",
        },
        neonRose: {
          DEFAULT: "#f43f5e",
          glow: "rgba(244, 63, 94, 0.5)",
        },
        neonEmerald: {
          DEFAULT: "#10b981",
          glow: "rgba(16, 185, 129, 0.5)",
        },

        // Shorthand untuk Card Glassmorphism
        card: {
          DEFAULT: "rgba(18, 18, 21, 0.8)", // Zinc-900 dengan opacity
          foreground: "#fafafa",
          border: "rgba(255, 255, 255, 0.1)",
        },

        // Neutral Grays
        muted: {
          DEFAULT: "#27272a", // Zinc-800
          foreground: "#a1a1aa", // Zinc-400
        },
      },
      backgroundImage: {
        // Gradient untuk efek 'Digital Glow' di background
        "digital-radial":
          "radial-gradient(circle at 50% -20%, #1e1b4b 0%, #09090b 80%)",
        "glass-gradient":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, rgba(255,255,255,0) 100%)",
      },
      boxShadow: {
        // Efek glow untuk tombol atau card aktif
        "neon-blue": "0 0 20px -5px rgba(59, 130, 246, 0.5)",
        "neon-rose": "0 0 20px -5px rgba(244, 63, 94, 0.5)",
      },
      borderRadius: {
        "2xl": "1rem",
        "3xl": "1.5rem",
      },
      fontFamily: {
        // Menggunakan Inter atau Geist jika sudah terinstall
        sans: ["var(--font-geist-sans)", "Inter", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      animation: {
        "pulse-slow": "pulse 6s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [
    require("tailwindcss-animate"), // Optional: untuk animasi entry yang smooth
  ],
};

export default config;
