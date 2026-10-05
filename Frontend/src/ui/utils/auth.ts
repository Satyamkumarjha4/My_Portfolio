// The admin JWT is short-lived and kept in sessionStorage (cleared when the
// tab closes). It is issued by POST /api/auth/login; no secret ships in the bundle.
const KEY = 'admin_token';

export const getToken = (): string | null => {
  try {
    return sessionStorage.getItem(KEY);
  } catch {
    return null;
  }
};

export const setToken = (token: string): void => {
  try {
    sessionStorage.setItem(KEY, token);
  } catch {
    /* storage unavailable: user will have to log in again */
  }
};

export const clearToken = (): void => {
  try {
    sessionStorage.removeItem(KEY);
  } catch {
    /* ignore */
  }
};
