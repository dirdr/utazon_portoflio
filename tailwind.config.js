/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        heading: ["NeueMontreal", "Inter", "system-ui", "sans-serif"],
        body: ["Nord", "Inter", "system-ui", "sans-serif"],
        // Override Tailwind defaults
        sans: ["Nord", "Inter", "system-ui", "sans-serif"],
      },
      fontWeight: {
        light: "300",
        normal: "400",
        medium: "500",
        bold: "700",
      },
    },
  },
  plugins: [require("daisyui")],
  daisyui: {
    themes: ["light", "dark"],
  },
};
