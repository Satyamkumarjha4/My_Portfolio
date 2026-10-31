// Prebuild step: bake the public API content into src/data/snapshot.json so the
// site can render real content on first paint even if the API is asleep.
//
// - Fetches the four public collections from VITE_API_URL (timeout + one retry,
//   because a sleeping Render instance can take ~1 minute to answer).
// - On failure it keeps the committed snapshot and logs a warning.
// - It only fails the build when there is no snapshot to fall back to.
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

// API path -> key in snapshot.json
export const RESOURCES = {
  '/projects': 'projects',
  '/tech-stacks': 'techStacks',
  '/timeline': 'timeline',
  '/achievements': 'achievements',
};

const here = path.dirname(fileURLToPath(import.meta.url));
export const SNAPSHOT_PATH = path.resolve(here, '../src/data/snapshot.json');

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

const fetchJsonArray = async (url, { fetchImpl, timeoutMs, retries, retryDelayMs }) => {
  let lastError;
  for (let attempt = 0; attempt <= retries; attempt++) {
    if (attempt > 0) await sleep(retryDelayMs);
    try {
      const res = await fetchImpl(url, { signal: AbortSignal.timeout(timeoutMs), headers: { Accept: 'application/json' } });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const body = await res.json();
      if (!Array.isArray(body)) throw new Error('response is not an array');
      return body;
    } catch (err) {
      lastError = err;
    }
  }
  throw lastError;
};

const readExisting = (file) => {
  try {
    return JSON.parse(fs.readFileSync(file, 'utf8'));
  } catch {
    return null;
  }
};

/**
 * @returns {Promise<{ snapshot: object, refreshed: string[], kept: string[] }>}
 */
export const buildSnapshot = async ({
  apiUrl,
  file = SNAPSHOT_PATH,
  fetchImpl = fetch,
  timeoutMs = 70_000,
  retries = 1,
  retryDelayMs = 2_000,
  log = console,
} = {}) => {
  const existing = readExisting(file);
  const base = (apiUrl || '').replace(/\/+$/, '');
  const next = { ...(existing ?? {}) };
  const refreshed = [];
  const kept = [];

  if (!base) {
    log.warn('[snapshot] VITE_API_URL is not set; not refreshing content.');
  }

  await Promise.all(
    Object.entries(RESOURCES).map(async ([apiPath, key]) => {
      if (!base) return kept.push(key);
      try {
        next[key] = await fetchJsonArray(`${base}${apiPath}`, { fetchImpl, timeoutMs, retries, retryDelayMs });
        refreshed.push(key);
      } catch (err) {
        kept.push(key);
        log.warn(`[snapshot] could not fetch ${apiPath} (${err.message}); keeping the committed ${key}.`);
      }
    })
  );

  const missing = Object.values(RESOURCES).filter((key) => !Array.isArray(next[key]));
  if (missing.length) {
    throw new Error(
      `No snapshot data for: ${missing.join(', ')}. The API was unreachable and there is no committed ` +
        `${path.relative(process.cwd(), file)} to fall back to. Set VITE_API_URL to a reachable API and rebuild.`
    );
  }

  // Stable key order so unchanged content produces an unchanged file.
  const ordered = Object.fromEntries(Object.values(RESOURCES).map((key) => [key, next[key]]));
  const text = `${JSON.stringify(ordered, null, 2)}\n`;
  if (!existing || JSON.stringify(existing) !== JSON.stringify(ordered) || !fs.existsSync(file)) {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, text);
  }
  return { snapshot: ordered, refreshed, kept };
};

const isMain = process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href;
if (isMain) {
  const { loadEnv } = await import('vite');
  const env = loadEnv('production', process.cwd(), 'VITE_');
  try {
    const { snapshot, refreshed, kept } = await buildSnapshot({
      apiUrl: env.VITE_API_URL,
      timeoutMs: Number(process.env.SNAPSHOT_TIMEOUT_MS) || undefined,
    });
    const counts = Object.entries(snapshot).map(([k, v]) => `${k}=${v.length}`).join(' ');
    console.log(`[snapshot] refreshed: ${refreshed.join(', ') || 'none'}; kept committed: ${kept.join(', ') || 'none'} (${counts})`);
  } catch (err) {
    console.error(`[snapshot] ${err.message}`);
    process.exit(1);
  }
}
