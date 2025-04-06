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
        },
        grayLine: {
          DEFAULT: "#6b7280",
        },
        strokeOptions: {
          white: "#ffffff",
          red: "#e03131",
          green: "#2f9e44",
          blue: "#1971c2",
          orange : "#f08c00" 
        },
        background: {
          pink:"#ffc9c9",
          green:"#b2f2bb",
          blue:"#a5d8ff",
          peach:"#ffec99"
        }
      },
    },
  },
  plugins: [],
} satisfies Config;