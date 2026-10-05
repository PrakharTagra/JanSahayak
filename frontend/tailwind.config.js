/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gov: {
          dark: "#050f1d",       // Deepest background
          navy: "#0a192f",       // Primary container background
          card: "#0f233d",       // Card background
          cardHover: "#153052",  // Card hover
          border: "#1c3c66",     // Subtle boundary
          borderLight: "#2a5286",// Highlight boundary
          saffron: "#FF9933",    // Indian flag saffron
          amber: "#D97706",      // Warm action amber
          amberLight: "#F59E0B", // High-contrast amber
          green: "#138808",      // Indian flag green
          emerald: "#10B981",    // Success state
          ruby: "#EF4444",       // Danger/alert state
          slate: "#94A3B8",      // Muted descriptive text
          muted: "#64748B",      // Secondary metadata
        }
      },
      fontFamily: {
        sans: ["'Plus Jakarta Sans'", "-apple-system", "BlinkMacSystemFont", "sans-serif"],
        serif: ["'Merriweather'", "Georgia", "serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        hindi: ["'Tiro Devanagari Hindi'", "serif"],
      },
      boxShadow: {
        'gov-card': '0 4px 20px -2px rgba(5, 15, 29, 0.7), 0 2px 6px -1px rgba(0, 0, 0, 0.5)',
        'gov-btn': '0 2px 8px 0 rgba(217, 119, 6, 0.35)',
        'gov-focus': '0 0 0 3px rgba(255, 153, 51, 0.4)',
      }
    },
  },
  plugins: [],
};