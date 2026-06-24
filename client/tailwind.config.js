/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#0F6CBD',
          light: '#E0F2FE',
          dark: '#0C5A9E',
        },
        secondary: {
          DEFAULT: '#14B8A6',
          light: '#CCFBF1',
          dark: '#0D9488',
        },
        accent: {
          DEFAULT: '#22C55E',
          light: '#DCFCE7',
          dark: '#166534',
        },
        medical: {
          blue: '#0F6CBD',
          teal: '#14B8A6',
          green: '#22C55E',
          bg: '#F8FAFC',
          card: '#FFFFFF',
          textPrimary: '#0F172A',
          textSecondary: '#64748B',
          success: '#22C55E',
          warning: '#F59E0B',
          danger: '#EF4444',
          info: '#3B82F6',
        }
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', '-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'Helvetica Neue', 'Arial', 'sans-serif'],
      },
      fontSize: {
        'page-title': ['28px', { lineHeight: '36px', fontWeight: '800' }],
        'section-title': ['20px', { lineHeight: '28px', fontWeight: '700' }],
        'card-title': ['16px', { lineHeight: '24px', fontWeight: '600' }],
        'body-text': ['14px', { lineHeight: '20px' }],
        'label-text': ['13px', { lineHeight: '18px' }],
        'table-text': ['13px', { lineHeight: '18px' }],
        'sidebar-text': ['13px', { lineHeight: '18px' }],
      },
      boxShadow: {
        'premium': '0 4px 20px -2px rgba(15, 108, 189, 0.05), 0 2px 12px -4px rgba(15, 108, 189, 0.03)',
        'premium-hover': '0 12px 30px -4px rgba(15, 108, 189, 0.08), 0 4px 16px -6px rgba(15, 108, 189, 0.05)',
      }
    },
  },
  plugins: [],
};

