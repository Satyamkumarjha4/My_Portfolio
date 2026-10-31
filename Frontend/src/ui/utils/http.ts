import { clearToken, getToken } from './auth';

// Minimal fetch-based JSON client. It replaces axios and keeps the small part of
// its surface the app relied on: `{ data }` results, a base URL, a timeout, and
// errors that carry `response.status` / `response.data` for non-2xx replies.

// The API runs on a free Render instance that sleeps when idle; a cold start was
// measured at ~55s. The timeout must outlast that, or a cold start becomes an error.
const TIMEOUT_MS = 75_000;

export interface HttpResponse<T> {
  data: T;
  status: number;
}

export class HttpError extends Error {
  readonly status?: number;
  readonly response?: { status: number; data: unknown };
  readonly code?: 'TIMEOUT' | 'NETWORK';

  constructor(message: string, init: { status?: number; data?: unknown; code?: 'TIMEOUT' | 'NETWORK' } = {}) {
    super(message);
    this.name = 'HttpError';
    this.status = init.status;
    this.code = init.code;
    if (init.status !== undefined) this.response = { status: init.status, data: init.data };
  }
}

interface ClientOptions {
  baseURL?: string;
  headers?: Record<string, string>;
  // Adds headers per request (e.g. the auth token).
  authHeaders?: () => Record<string, string>;
  // Called for every 401 reply before the error is thrown.
  onUnauthorized?: () => void;
}

const parseBody = async (res: Response): Promise<unknown> => {
  if (res.status === 204) return undefined;
  const text = await res.text();
  if (!text) return undefined;
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const createClient = ({ baseURL = '', headers = {}, authHeaders, onUnauthorized }: ClientOptions) => {
  const root = baseURL.replace(/\/+$/, '');

  const request = async <T>(method: string, path: string, body?: unknown): Promise<HttpResponse<T>> => {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

    const finalHeaders: Record<string, string> = { ...headers, ...authHeaders?.() };
    if (body !== undefined) finalHeaders['Content-Type'] = 'application/json';

    let res: Response;
    try {
      res = await fetch(`${root}${path}`, {
        method,
        headers: finalHeaders,
        body: body === undefined ? undefined : JSON.stringify(body),
        signal: controller.signal,
      });
    } catch (err) {
      if (controller.signal.aborted) throw new HttpError(`Request timed out after ${TIMEOUT_MS / 1000}s`, { code: 'TIMEOUT' });
      throw new HttpError(err instanceof Error ? err.message : 'Network error', { code: 'NETWORK' });
    } finally {
      clearTimeout(timer);
    }

    const data = await parseBody(res);
    if (!res.ok) {
      if (res.status === 401) onUnauthorized?.();
      throw new HttpError(`Request failed with status ${res.status}`, { status: res.status, data });
    }
    return { data: data as T, status: res.status };
  };

  return {
    get: <T = unknown>(path: string) => request<T>('GET', path),
    post: <T = unknown>(path: string, body?: unknown) => request<T>('POST', path, body ?? {}),
    put: <T = unknown>(path: string, body?: unknown) => request<T>('PUT', path, body ?? {}),
    delete: <T = unknown>(path: string) => request<T>('DELETE', path),
  };
};

const baseURL = import.meta.env.VITE_API_URL as string | undefined;

// Public, unauthenticated endpoints.
export const publicApi = createClient({ baseURL });

// Admin endpoints: attaches the bearer token and signs the user out on 401.
export const adminApi = createClient({
  baseURL,
  headers: { 'Cache-Control': 'no-cache' },
  authHeaders: (): Record<string, string> => {
    const token = getToken();
    return token ? { Authorization: `Bearer ${token}` } : {};
  },
  onUnauthorized: () => {
    clearToken();
    if (!window.location.pathname.startsWith('/admin/login')) {
      window.location.assign('/admin/login');
    }
  },
});
