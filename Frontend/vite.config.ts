import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolveSiteUrl } from './scripts/site-url.mjs'

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  // VITE_SITE_URL is the single source for the public URL (canonical, OG, sitemap).
  const siteUrl = resolveSiteUrl(loadEnv(mode, '.', 'VITE_').VITE_SITE_URL)

  return {
    plugins: [
      react(),
      tailwindcss(),
      {
        name: 'site-url-in-html',
        transformIndexHtml: (html: string) => html.replaceAll('__SITE_URL__', siteUrl),
      },
    ],
    define: { 'import.meta.env.VITE_SITE_URL': JSON.stringify(siteUrl) },
  }
})
