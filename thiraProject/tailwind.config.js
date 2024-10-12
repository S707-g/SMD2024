/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        "scrollbar-thumb": "#4b5563", // Thumb color
        "scrollbar-track": "#1f2937", // Track color
      },
    },
  },
  variants: {
    scrollbar: ["rounded"], // Enable rounded variant
  },
  plugins: [require("tailwind-scrollbar")],
};
