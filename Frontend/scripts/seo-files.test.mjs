import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderRobots, renderSitemap, writeSeoFiles } from './seo-files.mjs';
import { DEFAULT_SITE_URL, resolveSiteUrl } from './site-url.mjs';

describe('resolveSiteUrl', () => {
  it('defaults and strips trailing slashes', () => {
    expect(resolveSiteUrl(undefined)).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl('  ')).toBe(DEFAULT_SITE_URL);
    expect(resolveSiteUrl('https://example.dev///')).toBe('https://example.dev');
  });
});

describe('seo files', () => {
  it('builds a sitemap from the site URL and route list', () => {
    const xml = renderSitemap('https://example.dev', ['/', '/about'], '2026-01-02');
    expect(xml).toContain('<loc>https://example.dev/</loc><lastmod>2026-01-02</lastmod>');
    expect(xml).toContain('<loc>https://example.dev/about</loc>');
    expect(xml).not.toContain('vercel.app');
  });

  it('points robots.txt at the sitemap and blocks /admin', () => {
    const txt = renderRobots('https://example.dev');
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain('Sitemap: https://example.dev/sitemap.xml');
  });

  it('writes both files into the dist directory', () => {
    const dir = fs.mkdtempSync(path.join(os.tmpdir(), 'seo-'));
    writeSeoFiles({ distDir: dir, siteUrl: 'https://example.dev', paths: ['/'], now: new Date('2026-03-04T10:00:00Z') });
    expect(fs.readFileSync(path.join(dir, 'sitemap.xml'), 'utf8')).toContain('<lastmod>2026-03-04</lastmod>');
    expect(fs.existsSync(path.join(dir, 'robots.txt'))).toBe(true);
    fs.rmSync(dir, { recursive: true });
  });
});
