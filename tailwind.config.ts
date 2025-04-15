/** @type {import('tailwindcss').Config} */
const config = {
  mode: 'jit', // Asegura que JIT está habilitado
  content: [
    './src/**/*.{html,ts}', // Asegura que se incluyan todos los archivos relevantes
    './src/**/*.html', // Agrega también archivos HTML si usas templating
    './src/**/*.ts', // Archivos TypeScript
  ],
  safelist: [
    'space-y-10', // Asegura que space-y-10 no se elimine
    'space-x-10', // Si usas clases space-x, agrégalas también
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

export default config;
