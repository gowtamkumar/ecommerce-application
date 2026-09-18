import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        global: {
          primary: "var(--global-primary)",
          secondary: "var(--global-secondary)",
          hover: "var(--primary-hover)",
          text: "var(--text-color)",
          bg: "var(--background-color)",
          "button-primary": "var(--button-primary-color)",
          "button-hover": "var(--button-hover-color)",
          "button-text": "var(--button-text-color)",
          "topbar-bg": "var(--topbar-bg)",
          "topbar-text": "var(--topbar-text)",
          "header-bg": "var(--header-bg)",
          "header-text": "var(--header-text)",
          "footer-bg": "var(--footer-bg)",
          "footer-text": "var(--footer-text)",
        },
      },
      borderRadius: {
        "global-button-radius": "var(--button-border-radius)",
      },
      fontFamily: {
        "global-fontfamily": ["var(--secondary-font)", "sans-serif"],
        "global-primary-fontfamily": "var(--primary-font)",
        "global-secondary-fontfamily": "var(--secondary-font)",
      },
      fontSize: {
        "global-size-p": "var(--base-font-size)",
      },
      screens: {
        xs: "480px",
        "mobile-landscape": "568px",
        "3xl": "1600px",
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic":
          "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
