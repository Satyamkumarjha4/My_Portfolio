import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { scheduleDeploy, flushDeploy, cancelPendingDeploy, DEBOUNCE_MS, MAX_WAIT_MS } from '../src/utils/deployHook.js';

const fetchMock = vi.fn();

beforeEach(() => {
  vi.useFakeTimers();
  vi.stubGlobal('fetch', fetchMock);
  fetchMock.mockResolvedValue({ ok: true, status: 200 });
  process.env.VERCEL_DEPLOY_HOOK_URL = 'https://hooks.example/deploy/secret';
});

afterEach(() => {
  cancelPendingDeploy();
  delete process.env.VERCEL_DEPLOY_HOOK_URL;
  fetchMock.mockReset();
  vi.unstubAllGlobals();
  vi.useRealTimers();
});

describe('deploy hook debounce', () => {
  it('is a no-op when VERCEL_DEPLOY_HOOK_URL is unset', async () => {
    delete process.env.VERCEL_DEPLOY_HOOK_URL;
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it('does not call before the debounce window has passed', async () => {
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1);
    expect(fetchMock).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(fetchMock.mock.calls[0][0]).toBe('https://hooks.example/deploy/secret');
    expect(fetchMock.mock.calls[0][1].method).toBe('POST');
  });

  it('collapses a burst of writes into one call, 60s after the last write', async () => {
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(20_000);
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(20_000);
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS - 1);
    expect(fetchMock).not.toHaveBeenCalled();
    await vi.advanceTimersByTimeAsync(1);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await vi.advanceTimersByTimeAsync(10 * 60_000);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('starts a new burst after a call has gone out', async () => {
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('still fires after MAX_WAIT_MS if writes never go quiet', async () => {
    for (let t = 0; t < MAX_WAIT_MS; t += 30_000) {
      scheduleDeploy();
      await vi.advanceTimersByTimeAsync(30_000);
    }
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });

  it('swallows hook failures', async () => {
    fetchMock.mockRejectedValue(new Error('network down'));
    scheduleDeploy();
    await expect(vi.advanceTimersByTimeAsync(DEBOUNCE_MS)).resolves.not.toThrow();
    fetchMock.mockResolvedValue({ ok: false, status: 500 });
    scheduleDeploy();
    await vi.advanceTimersByTimeAsync(DEBOUNCE_MS);
    expect(fetchMock).toHaveBeenCalledTimes(2);
  });

  it('flushes a pending call on shutdown', async () => {
    scheduleDeploy();
    await flushDeploy();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    await flushDeploy(); // nothing pending any more
    expect(fetchMock).toHaveBeenCalledTimes(1);
  });
});
