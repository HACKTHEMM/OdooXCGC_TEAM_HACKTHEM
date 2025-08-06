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
        // Modern Theme Colors - Light & Futuristic
        'twilight-bg': '#F5F7FA',
        'electric-coral': '#FF6B6B',
        'sky-blue': '#5AC8FA',
        'lavender-mist': '#C3A9FF',
        'charcoal-text': '#2B2D42',
        'soft-white': '#FFFFFF',
        'muted-gray': '#4B5563',  // Changed from #6B7280 to a darker gray for better contrast
        'pearl-white': '#F8FAFC',

        // Modern Glass Effects
        'glass-surface': 'rgba(255, 255, 255, 0.6)',
        'glass-hover': 'rgba(255, 255, 255, 0.75)',
        'glass-active': 'rgba(255, 255, 255, 0.85)',
        'glass-border': 'rgba(255, 255, 255, 0.4)',
        'glass-light': 'rgba(255, 255, 255, 0.3)',
        'glass-light-hover': 'rgba(255, 255, 255, 0.5)',
        'glass-dark': 'rgba(43, 45, 66, 0.1)',
        'glass-dark-hover': 'rgba(43, 45, 66, 0.2)',

        // Essential aliases for consistency
        'accent-primary': '#FF6B6B',
        'accent-secondary': '#5AC8FA',
        'text-primary': '#2B2D42',
        'text-secondary': '#6B7280',
      },
      backgroundImage: {
        'modern-gradient': 'linear-gradient(135deg, #FF6B6B 0%, #5AC8FA 50%, #C3A9FF 100%)',
        'coral-gradient': 'linear-gradient(135deg, #FF6B6B 0%, #C3A9FF 100%)',
        'sky-gradient': 'linear-gradient(135deg, #5AC8FA 0%, #C3A9FF 100%)',
        'pastel-gradient': 'linear-gradient(135deg, #F8FAFC 0%, #FF6B6B 25%, #5AC8FA 75%, #C3A9FF 100%)',
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.6) 0%, rgba(255, 255, 255, 0.3) 100%)',
        'twilight-gradient': 'radial-gradient(ellipse at top, #F5F7FA 0%, #E2E8F0 50%, #CBD5E1 100%)',
      },
      backdropBlur: {
        'glass': '20px',
        'heavy': '40px',
      },
      boxShadow: {
        'coral': '0 0 20px rgba(255, 107, 107, 0.4)',
        'sky': '0 0 20px rgba(90, 200, 250, 0.4)',
        'lavender': '0 0 20px rgba(195, 169, 255, 0.4)',
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1)',
        'glass-lg': '0 16px 64px rgba(0, 0, 0, 0.15)',
        'modern': '0 0 30px rgba(255, 107, 107, 0.3), 0 0 60px rgba(90, 200, 250, 0.2)',
        'soft': '0 4px 16px rgba(43, 45, 66, 0.1)',
        'soft-lg': '0 8px 32px rgba(43, 45, 66, 0.15)',
      },
      animation: {
        'float': 'float 6s ease-in-out infinite',
        'glow': 'glow 2s ease-in-out infinite alternate',
        'slide-up': 'slideUp 0.5s ease-out',
        'pulse-neon': 'pulseNeon 2s ease-in-out infinite',
        'gradient-shift': 'gradientShift 3s ease infinite',
      },
      keyframes: {
        float: {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        glow: {
          'from': { boxShadow: '0 0 20px rgba(255, 107, 107, 0.3)' },
          'to': { boxShadow: '0 0 30px rgba(255, 107, 107, 0.6)' },
        },
        slideUp: {
          'from': { opacity: '0', transform: 'translateY(30px)' },
          'to': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseNeon: {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(255, 107, 107, 0.4)',
            borderColor: 'rgba(255, 107, 107, 0.6)'
          },
          '50%': {
            boxShadow: '0 0 40px rgba(255, 107, 107, 0.8)',
            borderColor: 'rgba(255, 107, 107, 1)'
          },
        },
        gradientShift: {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%': { backgroundPosition: '100% 50%' },
        },
      },
    },
  },
  plugins: [],
};
