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
        primary: "#21304F",
        secondary: "#F1D8BA",
        "brand-blue": "#21304F",
        "brand-gold": "#F1D8BA",
      },
      fontFamily: {
        vogue: ["Vogue", "Georgia", "Times New Roman", "serif"],
      },
      zIndex: {
        "60": "60",
        "100": "100",
      },
    },
  },
  plugins: [],
};

export default config;
