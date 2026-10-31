import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';
import { compileSource, createVercelServer, swapConnectSrc } from './vercel-emulator.mjs';

const root = path.resolve(import.meta.dirname, '..');
const vercelJson = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));

let dist;
let base;
let emulator;

beforeAll(async () => {
  dist = fs.mkdtempSync(path.join(os.tmpdir(), 'emu-'));
  const put = (rel, body) => {
    fs.mkdirSync(path.dirname(path.join(dist, rel)), { recursive: true });
    fs.writeFileSync(path.join(dist, rel), body);
  };
  put('index.html', 'HOME');
  for (const r of ['about', 'projects', 'contact', 'info', 'status']) put(`${r}/index.html`, `PAGE ${r}`);
  put('assets/app-abc.js', 'console.log(1)');
  put('og-image.png', 'png');
  emulator = createVercelServer({ distDir: dist, vercelJson, apiOrigin: 'http://localhost:3000' });
  await new Promise((r) => emulator.server.listen(0, r));
  base = `http://localhost:${emulator.server.address().port}`;
});
afterAll(() => {
  emulator.server.close();
  fs.rmSync(dist, { recursive: true });
});

const get = (p, init) => fetch(base + p, init);

describe('routing like vercel.json', () => {
  it('serves each prebuilt route directly (deep links)', async () => {
    expect(await (await get('/')).text()).toBe('HOME');
    for (const r of ['about', 'projects', 'contact', 'info', 'status']) {
      const res = await get(`/${r}`);
      expect(res.status, r).toBe(200);
      expect(await res.text()).toBe(`PAGE ${r}`);
    }
  });

  it('falls back to index.html for /admin and /admin/*', async () => {
    for (const p of ['/admin', '/admin/login', '/admin/table/projects']) {
      const res = await get(p);
      expect(res.status, p).toBe(200);
      expect(await res.text(), p).toBe('HOME');
    }
  });

  it('returns a real 404 for everything else', async () => {
    for (const p of ['/nope', '/projects/unknown', '/Contact', '/assets/missing.js']) {
      expect((await get(p)).status, p).toBe(404);
    }
  });

  it('serves static files and does not escape dist/', async () => {
    expect((await get('/og-image.png')).status).toBe(200);
    expect((await get('/..%2f..%2fetc/passwd')).status).toBe(404);
  });
});

describe('headers from vercel.json', () => {
  it('sets immutable caching only on /assets/*', async () => {
    expect((await get('/assets/app-abc.js')).headers.get('cache-control')).toBe('public, max-age=31536000, immutable');
    expect((await get('/about')).headers.get('cache-control')).toBeNull();
  });

  it('sets the security headers on pages and on 404s', async () => {
    for (const p of ['/about', '/nope']) {
      const h = (await get(p)).headers;
      expect(h.get('x-content-type-options'), p).toBe('nosniff');
      expect(h.get('x-frame-options'), p).toBe('DENY');
      expect(h.get('content-security-policy'), p).toBeTruthy();
    }
  });

  it('keeps the CSP identical except for the API host in connect-src', async () => {
    const original = vercelJson.headers.flatMap((h) => h.headers).find((h) => h.key === 'Content-Security-Policy').value;
    const served = (await get('/')).headers.get('content-security-policy');
    expect(served).toContain("connect-src 'self' http://localhost:3000");
    expect(served).not.toContain('onrender.com');
    const dropConnect = (csp) => csp.split(';').map((d) => d.trim()).filter((d) => !d.startsWith('connect-src'));
    expect(dropConnect(served)).toEqual(dropConnect(original));
    expect(emulator.cspSwap).toEqual({ from: ['https://*.onrender.com'], to: 'http://localhost:3000' });
  });
});

describe('helpers', () => {
  it('swapConnectSrc leaves CSPs without connect-src hosts alone apart from adding the origin', () => {
    expect(swapConnectSrc("default-src 'self'; connect-src 'self'", 'http://localhost:1').csp).toBe(
      "default-src 'self'; connect-src 'self' http://localhost:1"
    );
  });

  it('compileSource handles named groups and wildcards', () => {
    expect(compileSource('/:route(about|info)').regex.test('/about')).toBe(true);
    expect(compileSource('/:route(about|info)').regex.test('/aboutx')).toBe(false);
    expect(compileSource('/admin/:path*').regex.test('/admin/a/b')).toBe(true);
    expect(compileSource('/assets/(.*)').regex.test('/assets/x.js')).toBe(true);
  });
});
