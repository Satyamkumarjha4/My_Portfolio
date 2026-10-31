import fs from 'node:fs';
import path from 'node:path';

export const OG_IMAGE_PATH = '/og-image.png';

const escapeHtml = (value) =>
  String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Replace exactly one tag; fail loudly if index.html drifts from what we expect,
// so a route can never silently ship with the home page's tags.
const replaceOne = (html, pattern, replacement, label) => {
  if (!pattern.test(html)) throw new Error(`[route-pages] could not find ${label} in index.html`);
  return html.replace(pattern, () => replacement);
};

export const canonicalFor = (siteUrl, pagePath) => `${siteUrl}${pagePath}`;

export const renderRoutePage = (template, { siteUrl, page }) => {
  const url = canonicalFor(siteUrl, page.path);
  const title = escapeHtml(page.title);
  const description = escapeHtml(page.description);
  const image = `${siteUrl}${OG_IMAGE_PATH}`;

  let html = template;
  html = replaceOne(html, /<title>[^<]*<\/title>/, `<title>${title}</title>`, '<title>');
  html = replaceOne(html, /<meta name="description" content="[^"]*" \/>/, `<meta name="description" content="${description}" />`, 'meta description');
  html = replaceOne(html, /<link rel="canonical" href="[^"]*" \/>/, `<link rel="canonical" href="${url}" />`, 'canonical');
  html = replaceOne(html, /<meta property="og:title" content="[^"]*" \/>/, `<meta property="og:title" content="${title}" />`, 'og:title');
  html = replaceOne(html, /<meta property="og:description" content="[^"]*" \/>/, `<meta property="og:description" content="${description}" />`, 'og:description');
  html = replaceOne(html, /<meta property="og:url" content="[^"]*" \/>/, `<meta property="og:url" content="${url}" />`, 'og:url');
  html = replaceOne(html, /<meta property="og:image" content="[^"]*" \/>/, `<meta property="og:image" content="${image}" />`, 'og:image');
  html = replaceOne(html, /<meta name="twitter:card" content="[^"]*" \/>/, '<meta name="twitter:card" content="summary_large_image" />', 'twitter:card');
  html = replaceOne(html, /<meta name="twitter:title" content="[^"]*" \/>/, `<meta name="twitter:title" content="${title}" />`, 'twitter:title');
  html = replaceOne(html, /<meta name="twitter:description" content="[^"]*" \/>/, `<meta name="twitter:description" content="${description}" />`, 'twitter:description');
  html = replaceOne(html, /<meta name="twitter:image" content="[^"]*" \/>/, `<meta name="twitter:image" content="${image}" />`, 'twitter:image');
  return html;
};

// "/" overwrites dist/index.html; every other route gets dist/<route>/index.html.
export const outputFileFor = (distDir, pagePath) =>
  pagePath === '/' ? path.join(distDir, 'index.html') : path.join(distDir, pagePath.replace(/^\//, ''), 'index.html');

export const writeRoutePages = ({ distDir, siteUrl, pages }) => {
  const template = fs.readFileSync(path.join(distDir, 'index.html'), 'utf8');
  const written = [];
  for (const page of pages) {
    const file = outputFileFor(distDir, page.path);
    const html = renderRoutePage(template, { siteUrl, page });
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, html);
    written.push(path.relative(distDir, file));
  }
  return written;
};
