/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./{about,blog,contact,privacy,terms,tools}/**/*.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#eef2ff',
          100: '#e0e7ff',
          200: '#c7d2fe',
          300: '#a5b4fc',
          400: '#818cf8',
          500: '#6366f1',
          600: '#4F46E5', // exact Indigo Blue
          700: '#4338ca',
          800: '#3730a3',
          900: '#312e81',
          950: '#1e1b4b',
        },
        accent: {
          DEFAULT: '#06B6D4', // Electric Cyan
        },
        secondary: {
          DEFAULT: '#8B5CF6', // Soft Purple
        },
        bg: {
          light: '#F8FAFC',
          dark: '#0F172A',
        },
        text: {
          light: '#0F172A',
          dark: '#F1F5F9',
        }
      },
      fontFamily: {
        heading: ['Inter', 'sans-serif'],
        body: ['Roboto', 'sans-serif'],
        sans: ['Roboto', 'sans-serif'], // default to body for general text
      },
      boxShadow: {
        'soft': '0 4px 20px -2px rgba(0, 0, 0, 0.05)',
        'soft-lg': '0 10px 25px -3px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'xl': '16px',
        '2xl': '24px',
      }
    },
  },
  plugins: [],
}
