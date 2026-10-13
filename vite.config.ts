import { resolve } from 'path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

export default defineConfig({
  build: {
    emptyOutDir: true,
    outDir: 'public',
    rollupOptions: {
      input: {
        main: resolve(import.meta.dirname, 'index.html'),
        notFound: resolve(import.meta.dirname, '404.html'),
      },
    },
  },
  plugins: [
    react({
      jsxRuntime: 'automatic',
    }),
  ],
  publicDir: 'assets',
  server: {
    port: Number(process.env.PORT) || 8888,
  },
  test: {
    coverage: {
      exclude: ['src/dev/**', 'src/index.jsx', 'src/tester.jsx'],
      include: ['src/**/*.{js,jsx,ts,tsx}'],
      provider: 'istanbul',
      reporter: ['text', 'html', 'json'],
      thresholds: {
        branches: 50,
        functions: 70,
        lines: 70,
        statements: 70,
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/_setup.ts'],
  },
});
