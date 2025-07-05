import { Config } from '@tailwindcss/postcss';

/** @type {Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--color-background)",
        foreground: "var(--color-text-primary)",
        primary: {
          DEFAULT: "var(--color-royal-blue)",
          foreground: "white",
          light: "var(--color-royal-blue-light)",
          dark: "var(--color-royal-blue-dark)",
        },
        secondary: {
          DEFAULT: "var(--color-cyan)",
          foreground: "white",
          light: "var(--color-cyan-light)",
          dark: "var(--color-cyan-dark)",
        },
        accent: {
          DEFAULT: "var(--color-purple)",
          foreground: "white",
          light: "var(--color-purple-light)",
          dark: "var(--color-purple-dark)",
        },
        muted: {
          DEFAULT: "var(--color-border)",
          foreground: "var(--color-text-secondary)",
        },
        border: "var(--color-border)",
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
        'gradient-conic': 'conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))',
        'gradient-primary': 'linear-gradient(to right, var(--color-cyan), var(--color-royal-blue), var(--color-purple))',
      },
    },
  },
  plugins: [],
}
