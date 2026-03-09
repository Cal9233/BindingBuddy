import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        "poke-blue": "#3C5AA6",
        "poke-yellow": "#FFCB05",
        "poke-dark": "#0F1117",
        "poke-card": "#1A1D27",
        "poke-border": "#2A2D3A",
        "poke-text": "#F0F0F8",
        "poke-muted": "#8B8FA8",
        "poke-gold": "#B3A125",
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
