import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        background: '#07111f',
        surface: '#0f172a',
        panel: '#111c31',
        primary: '#3b82f6',
        primaryHover: '#2563eb',
        secondary: '#64748b',
        success: '#16a34a',
        danger: '#dc2626',
        warning: '#f59e0b',
        muted: '#94a3b8',
        border: '#1e293b',
        text: '#e2e8f0',
      },
      fontFamily: {
        sans: ['var(--font-body)', 'sans-serif'],
        heading: ['var(--font-heading)', 'sans-serif'],
      },
      fontSize: {
        heading: ['2rem', { lineHeight: '2.25rem', fontWeight: '700' }],
        subheading: ['1.25rem', { lineHeight: '1.75rem', fontWeight: '600' }],
        body: ['0.95rem', { lineHeight: '1.5rem' }],
        caption: ['0.8rem', { lineHeight: '1.25rem' }],
      },
      spacing: {
        18: '4.5rem',
        22: '5.5rem',
      },
      borderRadius: {
        xl2: '1.25rem',
      },
      boxShadow: {
        glow: '0 18px 60px rgba(59, 130, 246, 0.18)',
        soft: '0 10px 30px rgba(15, 23, 42, 0.35)',
      },
      backgroundImage: {
        'hero-grid': 'radial-gradient(circle at top, rgba(59,130,246,0.18), transparent 35%), linear-gradient(180deg, rgba(15,23,42,0.95), rgba(7,17,31,1))',
      },
    },
  },
  plugins: [],
};

export default config;
