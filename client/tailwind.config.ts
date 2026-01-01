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
          primary: "#F7AA0E",
          secondary: "#000000",
          accent: "#F2F2F2",
        },
        // Footer color system
        footer: {
          bg: {
            primary: "#0f172a",    // slate-900
            secondary: "#1e293b",  // slate-800
            accent: "#334155",     // slate-700
          },
          text: {
            primary: "#f9fafb",    // gray-50
            secondary: "#d1d5db",  // gray-300
            muted: "#9ca3af",      // gray-400
            subtle: "#6b7280",     // gray-500
          },
          border: {
            light: "rgba(255, 255, 255, 0.1)",
            medium: "rgba(255, 255, 255, 0.2)",
            heavy: "rgba(255, 255, 255, 0.3)",
          },
          accent: {
            blue: "#3b82f6",       // blue-500
            purple: "#a855f7",     // purple-500
            green: "#22c55e",      // green-500
            orange: "#f97316",     // orange-500
            pink: "#ec4899",       // pink-500
          },
          glass: {
            bg: "rgba(255, 255, 255, 0.05)",
            border: "rgba(255, 255, 255, 0.1)",
            hover: "rgba(255, 255, 255, 0.1)",
          },
        },
        // Social media brand colors
        social: {
          facebook: "#1877f2",
          twitter: "#000000",
          instagram: {
            start: "#f58529",
            middle: "#dd2a7b",
            end: "#8134af",
          },
          linkedin: "#0a66c2",
          youtube: "#ff0000",
          whatsapp: "#25d366",
        },
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
      },
      screens: {
        xs: "480px", // Custom extra small (Mobile portrait)
        "mobile-landscape": "568px", // Custom breakpoint for mobile landscape
        "3xl": "1600px", // Extra large desktop
      },
      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "footer-gradient": "linear-gradient(to bottom right, var(--tw-gradient-stops))",
        "instagram-gradient": "linear-gradient(to bottom right, #f58529, #dd2a7b, #8134af)",
      },
      boxShadow: {
        "glow-blue": "0 0 20px rgba(59, 130, 246, 0.3)",
        "glow-purple": "0 0 20px rgba(168, 85, 247, 0.3)",
        "glow-white": "0 0 15px rgba(255, 255, 255, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};
export default config;
