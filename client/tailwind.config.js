/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
  theme: {
    extend: {
      colors: {
        'background': '#FDFDF5', // Soft, minimal beige
        'card': '#FFFFFF',       // Clean white for cards
        'text-dark': '#1E3A8A',  // Your "dark blue" for text
        'text-light': '#4B5563', // A softer gray for paragraphs
        'accent-yellow': '#FACC15', // Your "mild yellow"
        'accent-blue': '#1E3A8A',   // Your "dark blue" for buttons
      },
      fontFamily: {
        // A minimal and attractive rounded font
        'sans': ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        'xl': '1.0rem',
        '2xl': '1.5rem',
      },
      ringColor: {
        'accent-blue': '#1E3A8A',
      }
    },
    screens: {
      xs: "480px",
      ss: "620px",
      sm: "768px",
      md: "1024px",
      lg: "1200px",
      xl: "1700px",
    },
  },
  plugins: [],
}

