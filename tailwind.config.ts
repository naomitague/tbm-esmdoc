import type { Config } from 'tailwindcss';

export default {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#1a5632',
          light: '#e8f0eb',
          dark: '#133f25',
          50: '#f0f7f2',
          100: '#e8f0eb',
          200: '#c5dece',
          300: '#93c4a2',
          400: '#5aa573',
          500: '#1a5632',
          600: '#164a2b',
          700: '#133f25',
          800: '#0f331e',
          900: '#0b2716',
        },
        accent: {
          DEFAULT: '#2563eb',
          light: '#eff4ff',
        },
      },
      fontFamily: {
        heading: ['Oranienbaum', 'serif'],
        body: ['IBM Plex Sans', 'sans-serif'],
      },
    },
  },
  plugins: [],
} satisfies Config;
