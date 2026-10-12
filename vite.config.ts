import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [
    react({
      jsxRuntime: 'classic',
    }),
  ],
  publicDir: 'assets',
  build: {
    outDir: 'public',
    emptyOutDir: true,
  },
  server: {
    port: Number(process.env.PORT) || 8888,
  },
});
