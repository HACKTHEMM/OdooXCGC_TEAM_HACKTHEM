/**
 * @type {import('tailwindcss').Config}
 */
export default {
  content: [
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        // Dark Mode Colors
        'midnight': '#0F0F1C',
        'neon-green': '#00E6A0',
        'iridescent-purple': '#A972FF',
        'soft-gray': '#AAAAAA',
        'glass-dark': 'rgba(255, 255, 255, 0.05)',
        'glass-dark-hover': 'rgba(255, 255, 255, 0.1)',

        // Light Mode Colors
        'cloud-white': '#F8F9FB',
        'bright-blue': '#0066FF',
        'vibrant-pink': '#FF4081',
        'charcoal': '#212121',
        'slate-gray': '#555555',
        'glass-light': 'rgba(0, 0, 0, 0.05)',
        'glass-light-hover': 'rgba(0, 0, 0, 0.1)',
      },
      backgroundImage: {
        'neon-gradient': 'linear-gradient(135deg, #00E6A0 0%, #A972FF 100%)',
        'glass-gradient-dark': 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(255, 255, 255, 0.05) 100%)',
        'glass-gradient-light': 'linear-gradient(135deg, rgba(0, 0, 0, 0.08) 0%, rgba(0, 0, 0, 0.03) 100%)',
      },
      backdropBlur: {
        'glass': '20px',
      },
      boxShadow: {
        'neon': '0 0 20px rgba(0, 230, 160, 0.3)',
        'purple': '0 0 20px rgba(169, 114, 255, 0.3)',
        'glass-dark': '0 8px 32px rgba(0, 0, 0, 0.3)',
        'glass-light': '0 8px 32px rgba(0, 0, 0, 0.1)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(0, 230, 160, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(0, 230, 160, 0.6)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
      },
    },
  },
  plugins: [],
};
