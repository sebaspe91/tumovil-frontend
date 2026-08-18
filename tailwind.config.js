/** @type {import('tailwindcss').Config} */
export default {
  content: ["index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        primary: {
          50: "#EFF6FF",
          100: "#DBEAFE",
          200: "#BEDBFF",
          300: "#8EC5FF",
          400: "#51A2FF",
          500: "#2B7FFF",
          600: "#155DFC",
          700: "#1447E6",
          800: "#193CB8",
          900: "#1C398E",
          950: "#162456"
        }
      }

    },
  },
  plugins: [],
}

