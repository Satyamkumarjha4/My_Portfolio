import fs from 'node:fs';
import path from 'node:path';

export const renderRobots = (siteUrl) =>
  `User-agent: *\nDisallow: /admin\nAllow: /\n\nSitemap: ${siteUrl}/sitemap.xml\n`;

export const renderSitemap = (siteUrl, paths, lastmod) => {
  const urls = paths
    .map((p) => `  <url><loc>${siteUrl}${p === '/' ? '/' : p}</loc><lastmod>${lastmod}</lastmod></url>`)
    .join('\n');
  return `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`;
};

export const writeSeoFiles = ({ distDir, siteUrl, paths, now = new Date() }) => {
  fs.writeFileSync(path.join(distDir, 'robots.txt'), renderRobots(siteUrl));
  fs.writeFileSync(path.join(distDir, 'sitemap.xml'), renderSitemap(siteUrl, paths, now.toISOString().slice(0, 10)));
};
