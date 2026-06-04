import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        kush: {
          50: "#f1f9f0",
          100: "#ddf0db",
          200: "#bce0b9",
          300: "#8fc98a",
          400: "#5dad57",
          500: "#3c9137",
          600: "#2c7429",
          700: "#245c22",
          800: "#1f4a1f",
          900: "#1a3d1b",
          950: "#0a210c",
        },
        gold: {
          400: "#e6c14d",
          500: "#d4a929",
        },
      },
      fontFamily: {
        sans: ["ui-sans-serif", "system-ui", "-apple-system", "Segoe UI", "Roboto", "Helvetica", "Arial", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
