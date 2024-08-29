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
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
    },
  },
  plugins: [
    require('daisyui'),
  ],
  daisyui: {
    themes: [
      {
        mydarktheme: {
          "primary": "#2C7BE5",
          "primary-content": "#FFFFFF",
          "secondary": "#28A745",
          "secondary-content": "#FFFFFF",
          "accent": "#FFA726",
          "accent-content": "#FFFFFF",
          "neutral": "#101720",
          "neutral-content": "#E8F1FC",
          "base-100": "#101720",
          "base-200": "#1E2025",
          "base-300": "#2A2E35",
          "base-content": "#E8F1FC",
          "info": "#2C7BE5",
          "info-content": "#FFFFFF",
          "success": "#28A745",
          "success-content": "#FFFFFF",
          "warning": "#FFA726",
          "warning-content": "#FFFFFF",
          "error": "#FF4D4D",
          "error-content": "#FFFFFF",
        },
      },
    ],
  },

};
export default config;
