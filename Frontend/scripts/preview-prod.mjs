// npm run preview:prod
// Production-like local run: build the site against your LOCAL backend and serve dist/
// the way Vercel would (rewrites, real 404s, vercel.json headers incl. the CSP).
//
//   BACKEND_PORT=3000 PORT=4173 npm run preview:prod
//   npm run preview:prod -- --skip-build        # just serve the existing dist/
//   npm run preview:prod -- --keep-snapshot     # keep the freshly fetched src/data/snapshot.json
//
// The build runs the normal prebuild (snapshot) + vite build + postbuild. The snapshot is
// fetched from your local backend, so dist/ embeds your dev database content; the committed
// src/data/snapshot.json is restored afterwards unless you pass --keep-snapshot.
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { createVercelServer } from './vercel-emulator.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const args = process.argv.slice(2);
const flag = (name) => args.includes(`--${name}`);
const value = (name, fallback) => {
  const i = args.indexOf(`--${name}`);
  return i >= 0 && args[i + 1] ? args[i + 1] : fallback;
};

const port = Number(value('port', process.env.PORT)) || 4173;
const backendPort = Number(value('backend-port', process.env.BACKEND_PORT)) || 3000;
const apiOrigin = `http://localhost:${backendPort}`;
const apiUrl = `${apiOrigin}/api`;
const siteUrl = `http://localhost:${port}`;
const distDir = path.join(root, 'dist');
const snapshotFile = path.join(root, 'src/data/snapshot.json');

if (!flag('skip-build')) {
  const original = fs.existsSync(snapshotFile) ? fs.readFileSync(snapshotFile) : null;
  console.log(`\n[preview:prod] building with VITE_API_URL=${apiUrl} VITE_SITE_URL=${siteUrl}`);
  console.log('[preview:prod] (the snapshot step needs your local backend running to pick up dev data)\n');
  const result = spawnSync('npm', ['run', 'build'], {
    cwd: root,
    stdio: 'inherit',
    env: { ...process.env, VITE_API_URL: apiUrl, VITE_SITE_URL: siteUrl },
  });
  if (original && !flag('keep-snapshot')) {
    fs.writeFileSync(snapshotFile, original);
    console.log('\n[preview:prod] committed src/data/snapshot.json restored (dist/ keeps the fresh data). Use --keep-snapshot to keep it.');
  }
  if (result.status !== 0) {
    console.error('[preview:prod] build failed');
    process.exit(result.status ?? 1);
  }
}

if (!fs.existsSync(path.join(distDir, 'index.html'))) {
  console.error('[preview:prod] dist/ not found. Run without --skip-build first.');
  process.exit(1);
}

const vercelJson = JSON.parse(fs.readFileSync(path.join(root, 'vercel.json'), 'utf8'));
const { server, ...emulator } = createVercelServer({
  distDir,
  vercelJson,
  apiOrigin,
  log: (method, urlPath, status, how) => {
    if (urlPath.startsWith('/assets/')) return;
    console.log(`${new Date().toLocaleTimeString('en-GB')}  ${method} ${urlPath} -> ${status} (${how})`);
  },
});

server.listen(port, () => {
  console.log(`\n[preview:prod] serving dist/ at ${siteUrl}  (Vercel emulation: rewrites, 404s, headers)`);
  const swap = emulator.cspSwap;
  if (swap) {
    console.log(
      `[preview:prod] CSP connect-src: replaced ${swap.from.join(', ') || '(nothing)'} with ${swap.to} for this local run only. ` +
        'vercel.json is unchanged.'
    );
  } else {
    console.log('[preview:prod] no Content-Security-Policy header found in vercel.json');
  }
  if (![4173, 5173].includes(port)) {
    console.log(`[preview:prod] note: add ${siteUrl} to CORS_ORIGINS in Backend/.env.local, or the API will reject the browser.`);
  }
  console.log('[preview:prod] press Ctrl+C to stop\n');
});
