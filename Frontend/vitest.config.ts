import { defineConfig } from 'vitest/config'
import { loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { resolveSiteUrl } from './scripts/site-url.mjs'

export default defineConfig({
  plugins: [react()],
  define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(resolveSiteUrl(loadEnv('test', '.', 'VITE_').VITE_SITE_URL)) },
  test: {
    environment: 'jsdom',
    globals: true,
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.test.{ts,tsx}', 'scripts/**/*.test.mjs'],
  },
})
