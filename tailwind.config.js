/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all files that contain Nativewind classes.
  content: [
    "./App.tsx",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        primary: "#f48c25",
        "background-light": "#f8f7f5",
        "background-dark": "#121212",
      },
      fontFamily: {
        regular: ["Inter-Regular", "sans-serif"],
        medium: ["Inter-Medium", "sans-serif"],
        semibold: ["Inter-SemiBold", "sans-serif"],
        bold: ["Inter-Bold", "sans-serif"],
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.75rem",
        xl: "1.5rem",
        full: "9999px",
      },
    },
  },
  plugins: [],
};
