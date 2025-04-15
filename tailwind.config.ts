// @ts-nocheck
/** @type {import('tailwindcss').Config} */
const config = {
  content: {
    files: ['./src/**/*.{html,ts}'],
    safelist: [
      'space-y-10',
      'space-x-10',
      // Podés agregar más clases si las usás en tu app
    ],
  },
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
