import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      backgroundImage: {
        "hero-bg": "url('/HeroBackground.png')",
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  safelist: [
    // Gradient backgrounds
    "bg-gradient-to-br",
    "from-purple-400",
    "via-pink-500",
    "to-red-500",
    "from-blue-400",
    "via-cyan-500",
    "to-teal-500",
    "from-orange-400",
    "via-red-500",
    "to-pink-500",
    "from-green-400",
    "via-emerald-500",
    "to-teal-500",
    "from-indigo-400",
    "via-purple-500",
    "to-pink-500",
    "from-yellow-400",
    "via-orange-500",
    "to-red-500",
    "from-gray-800",
    "via-gray-900",
    "to-black",
    "from-green-300",
    "via-blue-500",
    "to-purple-600",
    // Solid backgrounds
    "bg-purple-600",
    "bg-blue-600",
    "bg-emerald-600",
    "bg-rose-600",
    "bg-amber-600",
    "bg-indigo-600",
    "bg-teal-600",
    "bg-slate-600",
    "bg-red-600",
    "bg-violet-600",
    "bg-cyan-600",
    "bg-lime-600",
  ],
  daisyui: {
    themes: [
      {
        mydarktheme: {
          "primary": "#00ADB5",           // Neon Cyan
          "primary-content": "#EEEEEE",   // Light Gray
          "secondary": "#393E46",         // Slate Gray
          "secondary-content": "#F5F5F5", // Soft White
          "accent": "#F38181",            // Soft Coral
          "accent-content": "#FFF9F9",    // Light Pink
          "neutral": "#222831",           // Dark Charcoal
          "neutral-content": "#D6D6D6",   // Pale Gray
          "base-100": "#1A1A2E",          // Deep Midnight Blue
          "base-200": "#0F0F1A",          // Near Black
          "base-300": "#2E2E3E",          // Dim Blue Gray
          "base-content": "#E0E0E0",      // Light Silver
          "info": "#00ADB5",              // Neon Cyan
          "info-content": "#DFF7F7",      // Soft Cyan
          "success": "#21BF73",           // Mint Green
          "success-content": "#F0FDF4",   // Pale Mint
          "warning": "#FF9F1C",           // Bright Orange
          "warning-content": "#FFF8E0",   // Soft Yellow
          "error": "#E94560",             // Hot Red
          "error-content": "#FFECEC",     // Pale Pink
        }

      },
    ],
  },

};
export default config;
