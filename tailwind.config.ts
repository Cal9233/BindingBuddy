import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        brand: {
          bg: "#08080F",
          card: "#0F0F1C",
          red: "#CC2222",
          purple: "#7B2FFF",
          gold: "#4D9FFF",
          text: "#F0F0F0",
          muted: "#8888AA",
        },
      },
      fontFamily: {
        display: ["var(--font-exo2)", "sans-serif"],
        sans: ["var(--font-inter)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
