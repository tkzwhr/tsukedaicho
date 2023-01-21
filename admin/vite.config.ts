/// <reference types="vitest" />
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: [
      { find: '@/graphql', replacement: '/../graphql/queries' },
      { find: '@', replacement: '/src' },
    ],
  },
  test: {
    globals: true,
    environment: 'happy-dom',
  },
});
