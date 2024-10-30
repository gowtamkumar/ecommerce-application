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
        bioxin: {
          primary: "#F7AA0E",
          secondary: "#000000",
          accent: "#F2F2F2",
        },
      },
      fontFamily: {
        fontfamily: ["Poppins", "Urbanist"],
        "primary-fontfamily": "Poppins",
        "secondary-fontfamily": "Urbanist",
        "bangla-primary-fontfamily": "হিন্দ শিলিগুড়ি",
        "bangla-secondary-fontfamily": "আদর নইিরত",
      },
      fontSize: {
        "font-size-h1": "1rem",
        "font-size-h2": "0.8rem",
        "font-size-h3": "0.8rem",
        "font-size-h4": "0.8rem",
        "font-size-h5": "0.8rem",
        "font-size-h6": "0.8rem",
        "font-size-p": "0.5rem",
      },
      screens: {
        'xs': '480px',   // Custom extra small (Mobile portrait)
        'mobile-landscape': '568px',   // Custom breakpoint for mobile landscape
        '3xl': '1600px', // Extra large desktop
      },
      // backgroundImage: {
      //   "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      //   "gradient-conic":
      //     "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
      // },
    },
  },
  plugins: [
    require("tailwindcss-animate")
  ],
};
export default config;
