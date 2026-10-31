import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { describe, expect, it } from 'vitest';
import { renderRoutePage, outputFileFor, writeRoutePages } from './route-pages.mjs';

const root = path.resolve(import.meta.dirname, '..');
const template = fs.readFileSync(path.join(root, 'index.html'), 'utf8').replaceAll('__SITE_URL__', 'https://example.dev');
const pages = JSON.parse(fs.readFileSync(path.join(root, 'src/config/pages.json'), 'utf8'));
const siteUrl = 'https://example.dev';

const meta = (html, re) => re.exec(html)?.[1];

describe('renderRoutePage', () => {
  it('sets title, description, canonical, og and twitter tags for a route', () => {
    const page = pages.find((p) => p.path === '/projects');
    const html = renderRoutePage(template, { siteUrl, page });
    expect(html).toContain('<title>Projects | Satyam Kumar Jha</title>');
    expect(meta(html, /<meta name="description" content="([^"]*)"/)).toBe(page.description);
    expect(meta(html, /<link rel="canonical" href="([^"]*)"/)).toBe('https://example.dev/projects');
    expect(meta(html, /property="og:url" content="([^"]*)"/)).toBe('https://example.dev/projects');
    expect(meta(html, /property="og:title" content="([^"]*)"/)).toBe('Projects | Satyam Kumar Jha');
    expect(meta(html, /property="og:description" content="([^"]*)"/)).toBe(page.description);
    expect(meta(html, /property="og:image" content="([^"]*)"/)).toBe('https://example.dev/og-image.png');
    expect(meta(html, /name="twitter:card" content="([^"]*)"/)).toBe('summary_large_image');
    expect(meta(html, /name="twitter:title" content="([^"]*)"/)).toBe('Projects | Satyam Kumar Jha');
    expect(meta(html, /name="twitter:image" content="([^"]*)"/)).toBe('https://example.dev/og-image.png');
  });

  it('uses a trailing-slash canonical only for the home page, and escapes HTML', () => {
    const home = renderRoutePage(template, { siteUrl, page: pages[0] });
    expect(meta(home, /<link rel="canonical" href="([^"]*)"/)).toBe('https://example.dev/');
    expect(home).toContain('Full-Stack &amp; AI/ML Developer</title>');
    const tricky = renderRoutePage(template, { siteUrl, page: { path: '/x', title: 'A "q" <b>', description: 'a & b' } });
    expect(tricky).toContain('<title>A &quot;q&quot; &lt;b&gt;</title>');
    expect(tricky).toContain('content="a &amp; b"');
  });

  it('keeps everything else in the document untouched', () => {
    const html = renderRoutePage(template, { siteUrl, page: pages[1] });
    expect(html).toContain('<div id="root"></div>');
    expect(html).toContain('application/ld+json');
  });

  it('throws when the template no longer has an expected tag', () => {
    const broken = template.replace(/<link rel="canonical"[^>]*>/, '');
    expect(() => renderRoutePage(broken, { siteUrl, page: pages[1] })).toThrow(/canonical/);
  });
});

describe('writeRoutePages', () => {
  it('writes dist/<route>/index.html for every page and rewrites dist/index.html for "/"', () => {
    const dist = fs.mkdtempSync(path.join(os.tmpdir(), 'dist-'));
    fs.writeFileSync(path.join(dist, 'index.html'), template);
    const written = writeRoutePages({ distDir: dist, siteUrl, pages });
    expect(written.sort()).toEqual(['about/index.html', 'contact/index.html', 'index.html', 'info/index.html', 'projects/index.html', 'status/index.html']);
    expect(fs.readFileSync(path.join(dist, 'about/index.html'), 'utf8')).toContain('<title>About | Satyam Kumar Jha</title>');
    expect(outputFileFor('/d', '/')).toBe('/d/index.html');
    fs.rmSync(dist, { recursive: true });
  });
});
