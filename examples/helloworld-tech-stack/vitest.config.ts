import { defineConfig } from 'vitest/config';

// Vitest: Fast unit testing framework built on top of Vite
export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['tests/**/*.test.ts'],
  },
});
