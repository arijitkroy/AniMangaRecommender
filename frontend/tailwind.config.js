/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          light: "#6366f1",
          DEFAULT: "#4f46e5",
          dark: "#4338ca",
        },
        secondary: {
          light: "#f472b6",
          DEFAULT: "#ec4899",
          dark: "#db2777",
        },
        background: {
          DEFAULT: "#0f172a",
          card: "#1e293b",
        },
        text: {
          primary: "#f1f5f9",
          secondary: "#cbd5e1",
        },
      },
    },
  },
  plugins: [],
};
