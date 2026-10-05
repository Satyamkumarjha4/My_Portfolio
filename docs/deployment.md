# Deployment

## One-time: rotate the admin credential (required)

Before this change the admin token was embedded in the public frontend bundle, so
**treat the old `ADMIN_TOKEN` and any `VITE_ADMIN_*` values as compromised.**

1. `cd Backend && npm run hash-password -- "<new strong password>"`
2. On the API host set: `ADMIN_ID`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` (`openssl rand -hex 32`),
   `CORS_ORIGINS=https://<your-frontend-domain>`, `TRUST_PROXY=1`
3. Remove `ADMIN_TOKEN` from the API host and `VITE_ADMIN_*` from Vercel and local `.env` files
4. Apply migrations: `npx prisma migrate deploy`
5. Redeploy the API **and** the frontend (the old bundle still contains the old values; the old token no longer works)

## API

Any Node host (Render, Railway, Fly...). Build step: `npm ci && npx prisma generate`.
Start: `npm start`. Health check path: `/health` (returns 503 if the DB is down).
Use the pooled DB URL for the app and run migrations with the direct URL.

## Frontend (Vercel)

Set `VITE_API_URL` to `https://<api-host>/api`. `vercel.json` provides SPA rewrites
(static files such as `robots.txt` are not rewritten), immutable caching for
`/assets/*` and security headers. Update the canonical/OG/sitemap domain in
`index.html` and `public/sitemap.xml` if the site is not on `satyamportfolio-seven.vercel.app`.

## Operations

- Logs are structured JSON (pino); the `Authorization` header is redacted
- Point an uptime monitor at `/health`
- Dependabot (`.github/dependabot.yml`) opens weekly update PRs
