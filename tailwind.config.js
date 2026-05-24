/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          purple: "#8B5CF6", // Violet 500
          blue: "#3B82F6",   // Blue 500
          glow: "#A78BFA",   // Violet 300
        },
        dark: {
          base: "#030014",    // Very deep black/purple
          surface: "#090522", // Deep purple-black
          card: "rgba(18, 11, 48, 0.4)",    // Glassmorphic purple card base
          border: "rgba(139, 92, 246, 0.15)",  // Semi-transparent borders
          nav: "#05021A",
        }
      },
      fontFamily: {
        sans: ['Inter', 'Outfit', 'sans-serif'],
      },
      animation: {
        'pulse-glow': 'pulseGlow 3s infinite ease-in-out',
        'float': 'float 6s infinite ease-in-out',
        'float-slow': 'float 9s infinite ease-in-out',
      },
      keyframes: {
        pulseGlow: {
          '0%, 100%': { opacity: '0.4', filter: 'drop-shadow(0 0 15px rgba(139, 92, 246, 0.3))' },
          '50%': { opacity: '0.8', filter: 'drop-shadow(0 0 25px rgba(59, 130, 246, 0.5))' },
        },
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-12px)' },
        }
      }
    },
  },
  plugins: [],
}
