/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Modern Medical Color Palette
        primary: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1E88E5', // Primary Blue
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A3D91',
        },
        health: {
          50: '#E8F5E8',
          100: '#C8E6C9',
          200: '#A5D6A7',
          300: '#81C784',
          400: '#66BB6A',
          500: '#43A047', // Mint Green for health indicators
          600: '#388E3C',
          700: '#2E7D32',
          800: '#1B5E20',
          900: '#0D4F14',
        },
        alert: {
          50: '#FFF3E0',
          100: '#FFE0B2',
          200: '#FFCC80',
          300: '#FFB74D',
          400: '#FFA726',
          500: '#FF7043', // Soft Coral for alerts
          600: '#F57C00',
          700: '#E65100',
          800: '#D84315',
          900: '#BF360C',
        },
        background: {
          primary: '#F4F6F8', // Off-white background
          card: '#FFFFFF', // White cards
          hover: '#FAFBFC',
        },
        text: {
          primary: '#263238', // Dark slate grey
          secondary: '#607D8B', // Muted grey for labels
          light: '#90A4AE',
          white: '#FFFFFF',
        },
        border: {
          light: '#E1E5E9',
          medium: '#CFD8DC',
          dark: '#B0BEC5',
        },
        // Legacy support
        border: 'rgb(225 229 233)',
        background: 'rgb(244 246 248)',
        foreground: 'rgb(38 50 56)',
        medical: {
          50: '#E3F2FD',
          100: '#BBDEFB',
          200: '#90CAF9',
          300: '#64B5F6',
          400: '#42A5F5',
          500: '#1E88E5',
          600: '#1976D2',
          700: '#1565C0',
          800: '#0D47A1',
          900: '#0A3D91',
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        medical: ['Inter', 'Roboto', 'system-ui', 'sans-serif'],
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'heartbeat': 'heartbeat 1.2s ease-in-out infinite',
        'pulse-ring': 'pulse-ring 2s cubic-bezier(0.455, 0.03, 0.515, 0.955) infinite',
        'fade-in': 'fadeIn 0.5s ease-in-out',
        'slide-up': 'slideUp 0.3s ease-out',
      },
      keyframes: {
        heartbeat: {
          '0%, 100%': { transform: 'scale(1)' },
          '25%': { transform: 'scale(1.1)' },
          '50%': { transform: 'scale(1)' },
          '75%': { transform: 'scale(1.05)' },
        },
        'pulse-ring': {
          '0%': {
            transform: 'scale(0.8)',
            opacity: '1',
          },
          '100%': {
            transform: 'scale(2.4)',
            opacity: '0',
          },
        },
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(10px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
      },
      boxShadow: {
        'soft': '0 2px 15px -3px rgba(0, 0, 0, 0.07), 0 10px 20px -2px rgba(0, 0, 0, 0.04)',
        'medical': '0 4px 20px -2px rgba(30, 136, 229, 0.1), 0 2px 8px -2px rgba(30, 136, 229, 0.06)',
        'health': '0 4px 20px -2px rgba(67, 160, 71, 0.1), 0 2px 8px -2px rgba(67, 160, 71, 0.06)',
        'alert': '0 4px 20px -2px rgba(255, 112, 67, 0.1), 0 2px 8px -2px rgba(255, 112, 67, 0.06)',
      },
      screens: {
        'xs': '475px',
        'sm': '640px',
        'md': '768px',
        'lg': '1024px',
        'xl': '1280px',
        '2xl': '1536px',
        // Mobile-first breakpoints
        'mobile': {'max': '639px'},
        'tablet': {'min': '640px', 'max': '1023px'},
        'desktop': {'min': '1024px'},
      },
      spacing: {
        'safe-top': 'env(safe-area-inset-top)',
        'safe-bottom': 'env(safe-area-inset-bottom)',
        'safe-left': 'env(safe-area-inset-left)',
        'safe-right': 'env(safe-area-inset-right)',
        // Medical spacing
        '18': '4.5rem',
        '22': '5.5rem',
      },
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],
        'base': ['1rem', { lineHeight: '1.5rem' }],
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
      },
      borderRadius: {
        'medical': '12px',
        'card': '16px',
      },
      maxWidth: {
        'mobile': '100vw',
        'tablet': '768px',
        'desktop': '1024px',
      },
      minHeight: {
        'touch': '44px',
        'mobile-screen': '100vh',
        'mobile-safe': 'calc(100vh - env(safe-area-inset-top) - env(safe-area-inset-bottom))',
      },
      zIndex: {
        'mobile-nav': '1000',
        'mobile-overlay': '999',
        'mobile-modal': '1001',
      }
    },
  },
  plugins: [
    function({ addUtilities, addComponents }) {
      const newUtilities = {
        '.touch-manipulation': {
          'touch-action': 'manipulation',
        },
        '.scroll-smooth': {
          'scroll-behavior': 'smooth',
          '-webkit-overflow-scrolling': 'touch',
        },
        '.no-tap-highlight': {
          '-webkit-tap-highlight-color': 'transparent',
        },
        '.mobile-viewport': {
          'width': '100vw',
          'min-height': '100vh',
          'min-height': '100dvh',
        },
        '.safe-area-full': {
          'padding-top': 'env(safe-area-inset-top)',
          'padding-bottom': 'env(safe-area-inset-bottom)',
          'padding-left': 'env(safe-area-inset-left)',
          'padding-right': 'env(safe-area-inset-right)',
        }
      }
      
      const newComponents = {
        '.medical-card': {
          '@apply bg-background-card rounded-card shadow-soft border border-border-light': {},
        },
        '.medical-button-primary': {
          '@apply bg-primary-500 hover:bg-primary-600 text-text-white font-medium py-3 px-6 rounded-medical transition-all duration-200 shadow-medical': {},
        },
        '.medical-button-secondary': {
          '@apply bg-background-card hover:bg-background-hover text-text-primary font-medium py-3 px-6 rounded-medical border border-border-light transition-all duration-200': {},
        },
        '.medical-input': {
          '@apply w-full px-4 py-3 border border-border-light rounded-medical focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 bg-background-card text-text-primary': {},
        },
        '.vital-card-normal': {
          '@apply bg-health-50 border border-health-200 text-health-800': {},
        },
        '.vital-card-warning': {
          '@apply bg-alert-50 border border-alert-200 text-alert-800': {},
        },
        '.vital-card-critical': {
          '@apply bg-red-50 border border-red-200 text-red-800': {},
        },
      }
      
      addUtilities(newUtilities)
      addComponents(newComponents)
    }
  ],
}