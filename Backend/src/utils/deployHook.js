import logger from './logger.js';

// Public pages are built from a snapshot of the API content, so after the admin
// changes content the frontend has to be rebuilt. Writes call the Vercel Deploy
// Hook (VERCEL_DEPLOY_HOOK_URL), debounced so a burst of edits triggers one build.
// Unset env var = no-op.
export const DEBOUNCE_MS = 60_000;
// A burst that never goes quiet still triggers a build after this long.
export const MAX_WAIT_MS = 5 * 60_000;

let timer = null;
let burstStartedAt = 0;

const send = async () => {
  timer = null;
  burstStartedAt = 0;
  const url = process.env.VERCEL_DEPLOY_HOOK_URL;
  if (!url) return;
  try {
    const res = await fetch(url, { method: 'POST', signal: AbortSignal.timeout(8_000) });
    if (res.ok) logger.info('Triggered frontend deploy hook');
    else logger.warn({ status: res.status }, 'Frontend deploy hook returned an error status');
  } catch (err) {
    // Never include the URL: it is a secret.
    logger.warn({ err: err.message }, 'Frontend deploy hook request failed');
  }
};

export const scheduleDeploy = () => {
  if (!process.env.VERCEL_DEPLOY_HOOK_URL) return;
  const now = Date.now();
  if (!timer) burstStartedAt = now;
  else clearTimeout(timer);
  const delay = Math.min(DEBOUNCE_MS, Math.max(0, burstStartedAt + MAX_WAIT_MS - now));
  timer = setTimeout(send, delay);
  timer.unref();
};

// Called on shutdown so a pending rebuild is not lost when the instance stops.
export const flushDeploy = async () => {
  if (!timer) return;
  clearTimeout(timer);
  await send();
};

// Test helper.
export const cancelPendingDeploy = () => {
  if (timer) clearTimeout(timer);
  timer = null;
  burstStartedAt = 0;
};
