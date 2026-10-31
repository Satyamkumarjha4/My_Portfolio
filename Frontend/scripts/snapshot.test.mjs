import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { buildSnapshot } from './snapshot.mjs';

const quiet = { warn: vi.fn(), log: vi.fn() };
let dir;
let file;

const okFetch = (map) => vi.fn(async (url) => {
  const key = Object.keys(map).find((k) => url.endsWith(k));
  return { ok: true, status: 200, json: async () => map[key] };
});

const content = { '/projects': [{ id: 'p' }], '/tech-stacks': [{ id: 't' }], '/timeline': [{ id: 'l' }], '/achievements': [{ id: 'a' }] };
const opts = (extra = {}) => ({ apiUrl: 'http://api.test/api/', file, log: quiet, retryDelayMs: 0, ...extra });

beforeEach(() => {
  dir = fs.mkdtempSync(path.join(os.tmpdir(), 'snap-'));
  file = path.join(dir, 'data', 'snapshot.json');
  quiet.warn.mockClear();
});
afterEach(() => fs.rmSync(dir, { recursive: true, force: true }));

describe('buildSnapshot', () => {
  it('writes all four collections from the API', async () => {
    const fetchImpl = okFetch(content);
    const { refreshed } = await buildSnapshot(opts({ fetchImpl }));
    expect(refreshed).toHaveLength(4);
    expect(JSON.parse(fs.readFileSync(file, 'utf8'))).toEqual({
      projects: [{ id: 'p' }], techStacks: [{ id: 't' }], timeline: [{ id: 'l' }], achievements: [{ id: 'a' }],
    });
    expect(fetchImpl.mock.calls[0][0]).toBe('http://api.test/api/projects');
  });

  it('retries once, then succeeds (cold start)', async () => {
    let calls = 0;
    const fetchImpl = vi.fn(async (url) => {
      if (url.endsWith('/projects') && calls++ === 0) throw new Error('timeout');
      return { ok: true, status: 200, json: async () => content[Object.keys(content).find((k) => url.endsWith(k))] };
    });
    const { refreshed, kept } = await buildSnapshot(opts({ fetchImpl }));
    expect(refreshed).toContain('projects');
    expect(kept).toEqual([]);
  });

  it('keeps the committed snapshot and warns when the API is unreachable', async () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    const committed = { projects: [{ id: 'old' }], techStacks: [], timeline: [], achievements: [] };
    fs.writeFileSync(file, JSON.stringify(committed));
    const fetchImpl = vi.fn(async () => { throw new Error('ECONNREFUSED'); });
    const { snapshot, kept } = await buildSnapshot(opts({ fetchImpl }));
    expect(snapshot).toEqual(committed);
    expect(kept).toHaveLength(4);
    expect(quiet.warn).toHaveBeenCalled();
    expect(fetchImpl).toHaveBeenCalledTimes(8); // 4 resources x (1 try + 1 retry)
  });

  it('refreshes what it can and keeps the rest per collection', async () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ projects: [{ id: 'old' }], techStacks: [{ id: 'oldT' }], timeline: [], achievements: [] }));
    const fetchImpl = vi.fn(async (url) => {
      if (url.endsWith('/tech-stacks')) return { ok: false, status: 500, json: async () => ({}) };
      return { ok: true, status: 200, json: async () => content[Object.keys(content).find((k) => url.endsWith(k))] };
    });
    const { snapshot, kept } = await buildSnapshot(opts({ fetchImpl }));
    expect(kept).toEqual(['techStacks']);
    expect(snapshot.techStacks).toEqual([{ id: 'oldT' }]);
    expect(snapshot.projects).toEqual([{ id: 'p' }]);
  });

  it('fails only when there is no snapshot to fall back to', async () => {
    const fetchImpl = vi.fn(async () => { throw new Error('down'); });
    await expect(buildSnapshot(opts({ fetchImpl }))).rejects.toThrow(/No snapshot data/);
    expect(fs.existsSync(file)).toBe(false);
  });

  it('does not touch the network when VITE_API_URL is unset', async () => {
    fs.mkdirSync(path.dirname(file), { recursive: true });
    fs.writeFileSync(file, JSON.stringify({ projects: [], techStacks: [], timeline: [], achievements: [] }));
    const fetchImpl = vi.fn();
    await buildSnapshot(opts({ apiUrl: '', fetchImpl }));
    expect(fetchImpl).not.toHaveBeenCalled();
  });
});
