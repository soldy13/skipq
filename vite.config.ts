/// <reference types="vitest/config" />
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so the static build works on GitHub Pages sub-paths as well as Vercel/Netlify.
export default defineConfig({
  base: './',
  plugins: [react()],
  server: {
    host: true,
    port: 5173,
    // Test coverage and review captures are written into the project; they're not app sources.
    watch: { ignored: ['**/coverage/**', '**/.impeccable/**', '**/dist/**'] },
  },
  test: {
    environment: 'jsdom',
    include: ['src/**/*.test.{ts,tsx}'],
    coverage: { include: ['src/domain/**', 'src/store/**', 'src/i18n/**', 'src/data/**'] },
  },
});
