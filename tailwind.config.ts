import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sarabun)", "system-ui", "sans-serif"],
        display: ["var(--font-prompt)", "var(--font-sarabun)", "sans-serif"],
      },
      colors: {
        ink: "#16324F",
        brand: {
          DEFAULT: "#00A651",
          dark: "#008544",
          light: "#E6F7EE",
        },
        accent: {
          DEFAULT: "#F26A21",
          dark: "#D4531A",
          light: "#FEEDE2",
        },
      },
      keyframes: {
        "pop-in": {
          "0%": { opacity: "0", transform: "scale(0.9) translateY(8px)" },
          "100%": { opacity: "1", transform: "scale(1) translateY(0)" },
        },
        "grow-bar": {
          "0%": { transform: "scaleX(0)" },
          "100%": { transform: "scaleX(1)" },
        },
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
      animation: {
        "pop-in": "pop-in 0.35s cubic-bezier(0.22,1,0.36,1) both",
        "grow-bar": "grow-bar 0.6s cubic-bezier(0.22,1,0.36,1) both",
        float: "float 3s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
