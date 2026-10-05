import axios from 'axios';
import { clearToken, getToken } from './auth';

// The API runs on a free Render instance that sleeps when idle; a cold start was
// measured at ~55s. The timeout must outlast that, or a cold start becomes an error.
const TIMEOUT_MS = 75_000;

export const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: TIMEOUT_MS,
});

export const adminApi = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: TIMEOUT_MS,
  headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-cache' },
});

adminApi.interceptors.request.use((config) => {
  const token = getToken();
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

adminApi.interceptors.response.use(
  (res) => res,
  (error) => {
    if (error.response?.status === 401) {
      clearToken();
      if (!window.location.pathname.startsWith('/admin/login')) {
        window.location.assign('/admin/login');
      }
    }
    return Promise.reject(error);
  }
);
