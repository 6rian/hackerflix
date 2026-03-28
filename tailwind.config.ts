import type { Config } from 'tailwindcss';

export default {
  content: ['./inertia/**/*.{ts,tsx}', './resources/views/**/*.edge'],
  darkMode: 'class',
  theme: {
    extend: {},
  },
  plugins: [],
} satisfies Config;
