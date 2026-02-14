import { defineConfig } from 'vite';

// Vite: Fast build tool and dev server for modern web projects
export default defineConfig({
  root: 'src/client',
  server: {
    port: 3000,
    // Proxy API requests to Express backend
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: '../../dist/client',
    emptyOutDir: true,
  },
});
