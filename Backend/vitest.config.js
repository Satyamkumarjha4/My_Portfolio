import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    environment: 'node',
    env: {
      NODE_ENV: 'test',
      JWT_SECRET: 'test-secret-test-secret-test-secret-123',
      ADMIN_ID: 'admin',
      CORS_ORIGINS: 'https://site.example/',
    },
  },
});
