/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}"
  ],
  darkMode: "class", // ✅ class 방식으로 다크모드 제어
  theme: {
    extend: {},
  },
  plugins: [],
}
