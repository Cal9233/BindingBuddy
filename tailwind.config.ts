import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "poke-blue": "#3B6B9E",
        "poke-yellow": "#E63946",
        "poke-dark": "#0F1117",
        "poke-card": "#1A1D27",
        "poke-border": "#2A2D3A",
        "poke-text": "#F0F0F8",
        "poke-muted": "#8B8FA8",
        "poke-gold": "#2EC4B6",
      },
      fontFamily: {
        display: ["var(--font-barlow-condensed)", "sans-serif"],
        sans: ["var(--font-dm-sans)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
