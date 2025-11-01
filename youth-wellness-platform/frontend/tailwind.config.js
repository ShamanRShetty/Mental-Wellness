/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enables class-based dark mode
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a',        // Main background
          card: '#1e293b',      // Card background
          border: '#334155',    // Border color
          text: '#e2e8f0',      // Primary text
          muted: '#94a3b8',     // Muted text
        },
      },
    },
  },
  plugins: [],
}
