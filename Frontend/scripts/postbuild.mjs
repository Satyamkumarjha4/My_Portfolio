// Runs after `vite build` (npm postbuild): generates the files that depend on
// the site URL (VITE_SITE_URL) so no URL is hardcoded in public/.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { loadEnv } from 'vite';
import { resolveSiteUrl } from './site-url.mjs';
import { writeSeoFiles } from './seo-files.mjs';
import { writeRoutePages } from './route-pages.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const distDir = path.join(root, 'dist');
const env = loadEnv('production', root, 'VITE_');
const siteUrl = resolveSiteUrl(process.env.VITE_SITE_URL ?? env.VITE_SITE_URL);
const pages = JSON.parse(fs.readFileSync(path.join(root, 'src/config/pages.json'), 'utf8'));

writeSeoFiles({ distDir, siteUrl, paths: pages.map((p) => p.path) });
console.log(`[postbuild] site URL ${siteUrl}: wrote robots.txt and sitemap.xml (${pages.length} URLs)`);

const written = writeRoutePages({ distDir, siteUrl, pages });
console.log(`[postbuild] wrote per-route HTML: ${written.join(', ')}`);
