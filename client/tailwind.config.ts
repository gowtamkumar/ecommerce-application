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
          accent: "var(--global-accent)",
          hover: "var(--primary-hover)",
          text: "var(--text-color)",
          bg: "var(--background-color)",
          "card-bg": "var(--card-background)",
          "button-primary": "var(--button-primary-color)",
          "button-hover": "var(--button-hover-color)",
          "button-text": "var(--button-text-color)",
          "icon-color": "var(--icon-color)",
          "icon-hover-color": "var(--icon-hover-color)",
          "icon-bg": "var(--icon-bg)",
          "icon-hover-bg": "var(--icon-hover-bg)",
          "icon-size": "var(--icon-size)",
          "topbar-bg": "var(--topbar-bg)",
          "topbar-text": "var(--topbar-text)",
          "header-bg": "var(--header-bg)",
          "header-text": "var(--header-text)",
          "footer-bg": "var(--footer-bg)",
          "footer-text": "var(--footer-text)",
          "social-color": "var(--social-icon-color)",
          "social-hover-color": "var(--social-icon-hover-color)",
          "social-bg": "var(--social-icon-bg)",
          "social-hover-bg": "var(--social-icon-hover-bg)",
        },
      },
      borderRadius: {
        "global-button-radius": "var(--button-border-radius)",
      },
      fontWeight: {
        "global-button-weight": "var(--button-font-weight)",
      },
      spacing: {
        "global-button-padding-y": "var(--button-padding-y)",
        "global-button-padding-x": "var(--button-padding-x)",
      },
      fontFamily: {
        "global-fontfamily": ["var(--secondary-font)", "sans-serif"],
        "global-primary-fontfamily": "var(--primary-font)",
        "global-secondary-fontfamily": "var(--secondary-font)",
      },
      fontSize: {
        "global-size-h1": "var(--h1-size)",
        "global-size-h2": "var(--h2-size)",
        "global-size-h3": "var(--h3-size)",
        "global-size-h4": "var(--h3-size)", // Fallback to h3
        "global-size-h5": "var(--h3-size)", // Fallback to h3
        "global-size-h6": "var(--h3-size)", // Fallback to h3
        "global-size-p": "var(--base-font-size)",
        "global-button-size": "var(--button-font-size)",
      },
      screens: {
        xs: "480px", // Custom extra small (Mobile portrait)
        "mobile-landscape": "568px", // Custom breakpoint for mobile landscape
        "3xl": "1600px", // Extra large desktop
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      },

      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
