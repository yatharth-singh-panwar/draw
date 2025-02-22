import type { Config } from "tailwindcss";

export default {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#2563eb', // Blue-600
          dark: '#1e40af',    // Blue-800
        },
        secondary: {
          DEFAULT: '#1e293b', // Slate-800
          light: '#334155',   // Slate-700
        }
      },
    },
  },
  plugins: [],
} satisfies Config;

