/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Vibrant Catan resource colors
        'wood': {
          DEFAULT: '#1a5f3a',
          light: '#2d8659',
        },
        'brick': {
          DEFAULT: '#c8553d',
          light: '#e07856',
        },
        'sheep': {
          DEFAULT: '#9fdf9f',
          light: '#c3f0c3',
        },
        'wheat': {
          DEFAULT: '#f4d35e',
          light: '#f7e287',
        },
        'ore': {
          DEFAULT: '#6b7280',
          light: '#9ca3af',
        },
        'desert': {
          DEFAULT: '#e8d4a2',
          light: '#f0e6c8',
        },
        'water': {
          DEFAULT: '#4299e1',
          light: '#63b3ed',
        },
      },
    },
  },
  plugins: [],
}
