export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Manrope', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'Menlo', 'monospace'],
      },
      colors: {
        brand: {
          red: '#9f1239',
          'red-hover': '#881337',
          'red-soft': '#fff1f2',
          amber: '#d97706',
          'amber-soft': '#fffbeb',
          black: '#0c0a09',
        },
        surface: {
          DEFAULT: '#ffffff',
          muted: '#f5f3f0',
          dim: '#e7e5e4',
        },
        ink: {
          DEFAULT: '#0c0a09',
          secondary: '#57534e',
          muted: '#a8a29e',
          faint: '#d6d3d1',
        },
      },
      borderRadius: {
        'sm': '6px',
        'md': '10px',
        'lg': '16px',
        'xl': '24px',
        '2xl': '32px',
        'full': '9999px',
      },
      boxShadow: {
        'sm': '0 1px 2px 0 rgba(12, 10, 9, 0.04)',
        'md': '0 4px 12px -2px rgba(12, 10, 9, 0.08), 0 2px 4px -2px rgba(12, 10, 9, 0.04)',
        'lg': '0 12px 40px -8px rgba(12, 10, 9, 0.12), 0 4px 12px -4px rgba(12, 10, 9, 0.06)',
        'xl': '0 20px 60px -12px rgba(12, 10, 9, 0.16), 0 8px 20px -6px rgba(12, 10, 9, 0.08)',
        'inner-sm': 'inset 0 1px 2px 0 rgba(12, 10, 9, 0.04)',
        'glow': '0 0 0 3px rgba(159, 18, 57, 0.12)',
      },
      spacing: {
        '18': '4.5rem',
        '88': '22rem',
        '128': '32rem',
      },
      fontSize: {
        'xxs': '0.6875rem',
      },
      lineHeight: {
        'tight': '1.2',
        'snug': '1.4',
        'relaxed': '1.7',
        'loose': '1.8',
      },
      letterSpacing: {
        'tightest': '-0.04em',
        'tighter': '-0.02em',
      },
      keyframes: {
        'fade-in': {
          '0%': { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'fade-in-up': {
          '0%': { opacity: '0', transform: 'translateY(16px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'scale-in': {
          '0%': { opacity: '0', transform: 'scale(0.96)' },
          '100%': { opacity: '1', transform: 'scale(1)' },
        },
        'slide-in-right': {
          '0%': { opacity: '0', transform: 'translateX(12px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.6' },
        },
      },
      animation: {
        'fade-in': 'fade-in 0.3s ease-out forwards',
        'fade-in-up': 'fade-in-up 0.4s ease-out forwards',
        'scale-in': 'scale-in 0.25s ease-out forwards',
        'slide-in-right': 'slide-in-right 0.3s ease-out forwards',
        'shimmer': 'shimmer 1.5s infinite',
        'pulse-soft': 'pulse-soft 2s ease-in-out infinite',
      },
      transitionDuration: {
        '150': '150ms',
        '250': '250ms',
        '350': '350ms',
      },
      transitionTimingFunction: {
        'out': 'cubic-bezier(0, 0, 0.2, 1)',
        'in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
      },
      zIndex: {
        'base': '0',
        'dropdown': '1000',
        'sticky': '1100',
        'overlay': '1200',
        'modal': '1300',
        'popover': '1400',
        'toast': '1500',
      },
      screens: {
        'xs': '475px',
        '3xl': '1600px',
      },
    },
  },
  plugins: [],
}
