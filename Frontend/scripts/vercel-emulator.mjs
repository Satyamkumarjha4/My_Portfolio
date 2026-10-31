// A small local stand-in for how Vercel serves dist/ with this project's vercel.json:
// filesystem first, then rewrites, otherwise a real 404, and the configured headers
// (including the CSP) on every response. It is for local production-like testing only.
import fs from 'node:fs';
import http from 'node:http';
import path from 'node:path';

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.svg': 'image/svg+xml', '.xml': 'application/xml',
  '.txt': 'text/plain; charset=utf-8', '.ico': 'image/x-icon', '.webp': 'image/webp',
};

const readBalanced = (str, start) => {
  let depth = 0;
  for (let i = start; i < str.length; i++) {
    if (str[i] === '\\') { i++; continue; }
    if (str[i] === '(') depth++;
    if (str[i] === ')' && --depth === 0) return i;
  }
  throw new Error(`Unbalanced group in route pattern: ${str}`);
};

// Subset of Vercel's path-to-regexp syntax that vercel.json uses here:
// ":name(regex)", ":name*", ":name+", ":name", and raw "(regex)" groups.
export const compileSource = (source) => {
  const names = [];
  let re = '';
  for (let i = 0; i < source.length; ) {
    const ch = source[i];
    if (ch === ':') {
      const m = /^:([A-Za-z_][A-Za-z0-9_]*)/.exec(source.slice(i));
      names.push(m[1]);
      i += m[0].length;
      if (source[i] === '(') {
        const end = readBalanced(source, i);
        re += source.slice(i, end + 1);
        i = end + 1;
      } else if (source[i] === '*') { re += '(.*)'; i++; }
      else if (source[i] === '+') { re += '(.+)'; i++; }
      else re += '([^/]+)';
    } else if (ch === '(') {
      const end = readBalanced(source, i);
      re += source.slice(i, end + 1);
      names.push(`$${names.length}`);
      i = end + 1;
    } else {
      re += ch.replace(/[.*+?^${}|[\]\\]/g, '\\$&');
      i++;
    }
  }
  return { regex: new RegExp(`^${re}$`), names };
};

const fill = (destination, names, match) =>
  names.reduce((out, name, i) => out.replaceAll(`:${name}`, match[i + 1] ?? ''), destination);

// Replaces the API host(s) in the connect-src directive with the local API origin, leaving
// everything else (including 'self') untouched. Returns what was replaced so callers can say so.
export const swapConnectSrc = (csp, apiOrigin) => {
  const replaced = [];
  const out = csp
    .split(';')
    .map((directive) => {
      const trimmed = directive.trim();
      if (!trimmed.startsWith('connect-src')) return trimmed;
      const [name, ...values] = trimmed.split(/\s+/);
      const kept = values.filter((v) => {
        const isHost = /^https?:\/\//.test(v);
        if (isHost) replaced.push(v);
        return !isHost;
      });
      return [name, ...kept, apiOrigin].join(' ');
    })
    .filter(Boolean)
    .join('; ');
  return { csp: out, replaced };
};

export const createVercelServer = ({ distDir, vercelJson, apiOrigin, log = () => {} }) => {
  const rewrites = (vercelJson.rewrites ?? []).map((r) => ({ ...compileSource(r.source), destination: r.destination }));
  let cspSwap = null;
  const headerRules = (vercelJson.headers ?? []).map((rule) => ({
    ...compileSource(rule.source),
    headers: rule.headers.map(({ key, value }) => {
      if (apiOrigin && key.toLowerCase() === 'content-security-policy') {
        const swapped = swapConnectSrc(value, apiOrigin);
        cspSwap = { from: swapped.replaced, to: apiOrigin };
        return { key, value: swapped.csp };
      }
      return { key, value };
    }),
  }));

  const root = path.resolve(distDir);
  const fileAt = (urlPath) => {
    const abs = path.resolve(root, `.${urlPath}`);
    if (abs !== root && !abs.startsWith(root + path.sep)) return null; // no path traversal
    try {
      const stat = fs.statSync(abs);
      if (stat.isFile()) return abs;
      if (stat.isDirectory() && fs.existsSync(path.join(abs, 'index.html'))) return path.join(abs, 'index.html');
    } catch { /* not found */ }
    return null;
  };

  const server = http.createServer((req, res) => {
    let urlPath;
    try {
      urlPath = decodeURIComponent(new URL(req.url, 'http://x').pathname);
    } catch {
      res.writeHead(400).end('Bad request');
      return;
    }

    for (const rule of headerRules) {
      if (rule.regex.test(urlPath)) for (const { key, value } of rule.headers) res.setHeader(key, value);
    }

    let file = fileAt(urlPath);
    let how = 'file';
    if (!file) {
      for (const rw of rewrites) {
        const match = rw.regex.exec(urlPath);
        if (!match) continue;
        const target = fileAt(fill(rw.destination, rw.names, match));
        if (target) { file = target; how = `rewrite -> ${path.relative(root, target)}`; }
        break;
      }
    }

    if (!file) {
      log(req.method, urlPath, 404, 'no file, no rewrite');
      res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
      res.end('404: NOT_FOUND');
      return;
    }
    log(req.method, urlPath, 200, how);
    res.writeHead(200, { 'Content-Type': TYPES[path.extname(file)] || 'application/octet-stream' });
    if (req.method === 'HEAD') return res.end();
    fs.createReadStream(file).pipe(res);
  });

  return { server, get cspSwap() { return cspSwap; } };
};
