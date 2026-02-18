/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  darkMode: "class",
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: "#359FA3",
          foreground: "#FFFFFF",
        },
        secondary: {
          DEFAULT: "#F3F4F6",
          foreground: "#1F2937",
        },
        destructive: {
          DEFAULT: "#DB5141",
          foreground: "#FFFFFF",
        },
        muted: {
          DEFAULT: "#F3F4F6",
          foreground: "#4E6B6E",
        },
        accent: {
          DEFAULT: "#F3F4F6",
          foreground: "#1F2937",
        },
        card: {
          DEFAULT: "#FFFFFF",
          foreground: "#142F3D",
        },
        border: "#E5E7EB",
        input: "#E5E7EB",
        ring: "#359FA3",
        background: "#FFFFFF",
        foreground: "#142F3D",
      },
    },
  },
  plugins: [],
};
