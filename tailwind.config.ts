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
        background: "#0D0D0D",
        card: "#161618",
        "card-elevated": "#1E1E22",
        neon: {
          green: "#39FF14",
          cyan: "#00E5FF",
          magenta: "#FF007F",
          yellow: "#FFE600",
        },
        muted: {
          DEFAULT: "#94A3B8",
          dark: "#64748B",
        },
      },
      boxShadow: {
        "neo-green": "3px 3px 0px #39FF14",
        "neo-magenta": "3px 3px 0px #FF007F",
        "neo-cyan": "3px 3px 0px #00E5FF",
        "neo-sm-green": "2px 2px 0px #39FF14",
        "neo-sm-magenta": "2px 2px 0px #FF007F",
        "glow-green": "0 0 20px rgba(57, 255, 20, 0.35)",
        "glow-magenta": "0 0 20px rgba(255, 0, 127, 0.35)",
        "glow-cyan": "0 0 20px rgba(0, 229, 255, 0.35)",
      },
      fontFamily: {
        display: ["Impact", "Space Grotesk", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
      },
      keyframes: {
        laser: {
          "0%, 100%": { top: "5%" },
          "50%": { top: "90%" },
        },
        pulseGlow: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.5" },
        },
      },
      animation: {
        laser: "laser 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "pulse-slow": "pulseGlow 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
export default config;
