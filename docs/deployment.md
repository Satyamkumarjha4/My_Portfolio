# Deployment

## Current production state (verified 2026-10-05)

- The **live** frontend bundle still contains the old admin token and the old
  admin id/key, so the live API's write endpoints are open to anyone until this
  branch is deployed with new secrets. Deploy promptly.
- Database migrations are **already applied** to the production Neon database
  (`20251001000000_ordering_and_constraints`, `20251002000000_project_case_study`).
  They are additive and the currently deployed (old) API was verified to keep working.
  A pre-migration `pg_dump` was taken locally.

## Order of operations

Deploy the backend first, then the frontend, after setting the new variables.
The `/status` page tells visitors the token used to be exposed, so do not ship
the frontend before the old credential is dead.

## One-time: rotate the admin credential (required)

Before this change the admin token was embedded in the public frontend bundle, so
**treat the old `ADMIN_TOKEN` and any `VITE_ADMIN_*` values as compromised.**

1. `cd Backend && npm run hash-password -- "<new strong password>"`
2. On the API host set: `ADMIN_ID`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` (`openssl rand -hex 32`),
   `CORS_ORIGINS=https://<your-frontend-domain>`, `TRUST_PROXY=1`
3. Remove `ADMIN_TOKEN` from the API host and `VITE_ADMIN_*` from Vercel and local `.env` files
4. Migrations: already applied (see above). For future schema changes run `npx prisma migrate deploy`
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

## Keep-warm (Render free tier)

Measured: after ~15 min idle the first request took **55 s** (warm: ~0.4 s).
`.github/workflows/keep-warm.yml` pings `GET /livez` every 10 minutes. `/livez`
does not touch the database, so the Neon compute can still auto-suspend (it is
billed separately; keeping it awake 24/7 would exceed the free compute allowance).
Set the repository variable `API_ORIGIN` (Settings > Secrets and variables >
Actions > Variables), e.g. `https://<service>.onrender.com`. Trade-offs: one
always-on free service uses ~730 of Render's 750 free instance-hours/month;
GitHub may delay scheduled runs, so occasional cold starts can still happen;
scheduled workflows are paused after 60 days without repository activity.
The frontend also waits up to 75 s and tells the visitor the API is waking up.

## Post-deploy checks

1. `curl -i https://<api>/livez` and `/health` return 200 (`db: up`)
2. The old admin token and the old admin id/key are rejected
3. Rate limits are per visitor, not global: from network A submit invalid feedback
   6 times (6th = 429), then from network B (e.g. phone hotspot) once (must be 400, not 429).
   If B also gets 429, Render added a proxy hop: adjust `TRUST_PROXY`
4. Log in to `/admin`, create/edit/delete a test project

## Operations

- Logs are structured JSON (pino); the `Authorization` header is redacted
- Point an uptime monitor at `/health`
- Dependabot (`.github/dependabot.yml`) opens weekly update PRs
