/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,js}"],
  theme: {
    extend: { // <-- All your customizations go in here!
      colors: {
        'primary': '#A259FF',   // Your playful purple
        'dark-bg': '#2B2B2B',   // Your main background
        'dark-card': '#3B3B3B', // For cards, inputs, etc.
      },
      fontFamily: {
        // This adds a rounded, playful font as the default
        'sans': ['Nunito', 'ui-sans-serif', 'system-ui'],
      },
      borderRadius: {
        'xl': '1.0rem',
        '2xl': '1.5rem',
      },
      // This adds the "glow" effect for playful focus
      ringColor: {
        'primary': '#A259FF',
      },
      boxShadow: {
        'glow-primary': '0 0 15px 0 rgba(162, 89, 255, 0.5)',
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