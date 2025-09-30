/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        brandPink:  "#ff69b4",
        brandPurple:"#7c3aed",
        brandBlue:  "#3b82f6"
      }
    }
  },
  plugins: [],
}
