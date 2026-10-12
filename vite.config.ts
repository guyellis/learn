import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  publicDir: 'assets',
  build: {
    outDir: 'public',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  server: {
    port: Number(process.env.PORT) || 8888,
  },
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./test/_setup.js'],
    coverage: {
      provider: 'istanbul',
      reporter: ['text', 'html', 'json'],
      include: ['src/**/*.{js,jsx}'],
      exclude: ['src/dev/**', 'src/index.jsx', 'src/tester.jsx'],
      thresholds: {
        branches: 50,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
  },
});
