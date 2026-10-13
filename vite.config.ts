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
      exclude: ['src/dev/**', 'src/index.tsx', 'src/tester.jsx'],
      include: ['src/**/*.{ts,tsx}'],
      provider: 'istanbul',
      reporter: ['text', 'html', 'json'],
      thresholds: {
        branches: 100,
        functions: 100,
        lines: 100,
        statements: 100,
      },
    },
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./test/_setup.ts'],
  },
});
