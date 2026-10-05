# Deployment and production cutover

This is the runbook for taking `audit-improvements` to production, plus the
steady-state notes for the API (Render), frontend (Vercel) and database (Neon).
**No secret values belong in this file, in git, or in chat.**

## Where things stand (verified 2026-10-05)

| Item | State |
|---|---|
| Live frontend bundle | Still the **old build**: it contains the old admin token and the old admin id/key, so anyone can write to the live API until the cutover is done |
| Live API | Old code, still accepting the old static token |
| Database migrations | **Already applied** to production (`20251001000000_ordering_and_constraints`, `20251002000000_project_case_study`). Additive only; the old API was verified to keep working with the new schema |
| Branch | `audit-improvements`, clean, 30 backend + 14 frontend tests, lint/tsc/build pass |
| Rehearsal | `scripts/smoke-test.sh` passed 58/58 against the new code running in production mode against the real database, with freshly generated credentials, and left the data unchanged |

## Credentials: what is compromised

| Credential | Status | Action |
|---|---|---|
| `ADMIN_TOKEN` (old static bearer token) | Compromised: was compiled into the public JS bundle | Remove from Render. The new code never reads it |
| `VITE_ADMIN_ID`, `VITE_ADMIN_ACCESS_KEY`, `VITE_ADMIN_TOKEN` | Compromised: public in the bundle | Remove from Vercel **and** from your local `Frontend/.env` |
| New `ADMIN_ID`, `ADMIN_PASSWORD_HASH`, `JWT_SECRET` | Must be freshly generated | Never reuse any old value or password |
| `DATABASE_URL` | **Not** exposed by this incident (never in git history or the bundle) | No rotation required. Rotate only if you want to |

Old Vercel deployments keep their old bundles reachable at their unique deployment
URLs. That is why rotation is mandatory and not optional: once the old values stop
working, those bundles are harmless.

## Cutover sequence

Do not deploy the frontend before the backend is verified. The new frontend cannot
log in against the old API, and the `/status` page describes the old exposure.

### STEP 1: Rotate credentials (your machine)

```bash
cd Backend
# 1. admin id: any new non-guessable value (not "admin")
# 2. password: 20+ random characters, store it in a password manager
# 3. hash it (bcrypt, cost 12). The hash is what goes to Render, never the password
npm run hash-password -- "<the new password>"
# 4. JWT secret (64 hex chars)
openssl rand -hex 32
```

Keep the plaintext password only in your password manager. Do not commit anything.
If you still have the pre-generated file `NEW_CREDENTIALS_DELETE_AFTER_USE.env`
in the Claude session scratchpad, copy the values from it into Render and your password
manager, then delete it.

### STEP 2: Render environment (manual)

Render dashboard > your web service > **Environment**:

| Variable | Value |
|---|---|
| `ADMIN_ID` | the new id |
| `ADMIN_PASSWORD_HASH` | the bcrypt hash from Step 1 (starts with `$2`; paste as-is, no quotes) |
| `JWT_SECRET` | the 64-char secret from Step 1 |
| `CORS_ORIGINS` | `https://satyamportfolio-seven.vercel.app` (comma-separate extra origins such as a custom domain; no paths). Browsers send the origin without a trailing slash |
| `TRUST_PROXY` | `1` |
| `NODE_ENV` | `production` |
| `DATABASE_URL` | keep the existing production value (the Neon pooled URL) |
| `ADMIN_TOKEN` | **delete this variable** |

Check the service settings: **Build command** `npm ci && npx prisma generate`,
**Start command** `npm start`, **Root directory** `Backend`, **Health check path** `/livez`
(use `/livez`, not `/health`, so a sleeping database does not mark the service unhealthy).
Do **not** run `prisma migrate` from the build: migrations are already applied.

### STEP 3: Vercel environment (manual)

Vercel > project > **Settings > Environment Variables**:

- **Delete** `VITE_ADMIN_ID`, `VITE_ADMIN_ACCESS_KEY`, `VITE_ADMIN_TOKEN` (all environments)
- **Keep** `VITE_API_URL` = `https://<render-service>.onrender.com/api`
- Delete the same three lines from your local `Frontend/.env`

The new code does not reference them, so the build cannot embed them; removing them
removes the temptation and the stale values.

### STEP 4: Deploy the backend

1. Merge `audit-improvements` into `main` (or deploy that branch from Render).
2. Wait for the Render deploy to finish ("Live").
3. Verify, **before touching Vercel**:

```bash
export API_ORIGIN=https://<render-service>.onrender.com
curl -i  $API_ORIGIN/livez        # 200 {"status":"ok"}
curl -i  $API_ORIGIN/health       # 200 db:"up". If 503 "degraded", Neon was asleep: retry in 5 s
```

4. Run the smoke test (new authentication, old token dead, authorization, CRUD,
   database restored). Credentials come from your environment, never from the command line history:

```bash
read -rs ADMIN_PASSWORD; export ADMIN_PASSWORD     # type it, nothing is echoed
read -rs OLD_TOKEN;      export OLD_TOKEN          # the retired token, for the "must be 401" check
export ADMIN_ID=<new id> JWT_SECRET=<new secret> FRONTEND_ORIGIN=https://satyamportfolio-seven.vercel.app
./scripts/smoke-test.sh                            # expect: RESULT: N passed, 0 failed
unset ADMIN_PASSWORD OLD_TOKEN JWT_SECRET
```

If anything fails, **stop** and do not deploy the frontend (see Rollback).

### STEP 5: Deploy the frontend

Vercel redeploys on push to `main`. After it is live:

```bash
# no secret-based auth and no old values in the bundle
curl -s https://satyamportfolio-seven.vercel.app/ | grep -o '/assets/[^"]*\.js' | while read p; do
  curl -s "https://satyamportfolio-seven.vercel.app$p" | grep -c -e VITE_ADMIN -e LetsGoo
done                                                # every line must be 0
```

Then manually, from the real Vercel site: log in at `/admin`, create/edit/delete a
test project, open `/projects`, `/about`, `/contact` (submit one feedback), `/status`.

### Rollback

- **Frontend problem:** in Vercel, promote the previous deployment ("Instant rollback").
  Note the old frontend cannot log in to the new API, so the admin panel is unavailable
  until you roll forward again. Public pages keep working.
- **Backend problem:** redeploy the previous Render commit. The migrations are additive,
  so the old API works with the new schema (verified). Do **not** restore `ADMIN_TOKEN`:
  that would re-open the exposure.
- **Database:** nothing to roll back; no destructive migration was applied.

## Production smoke tests

`scripts/smoke-test.sh` automates the items below (58 checks). Manual equivalents:

**Public:** `GET /api/projects`, `/achievements`, `/tech-stacks`, `/timeline` return
200 and an array, `Cache-Control: public, max-age=60...`; `POST /api/feedback` with
`{"rating":9}` returns 400; with a valid body returns 201 (then delete it from the admin).

**Authentication:** correct login 200 + token; wrong password 401; wrong id 401;
old credentials 401; old token on any write route 401; `Bearer not.a.jwt` 401;
`alg:none` token 401; wrong-secret token 401; expired token 401 (needs `JWT_SECRET`,
also covered by unit tests); in the browser, "Logout" removes `admin_token` from
`sessionStorage` and `/admin` redirects to the login page.

**Authorization:** `POST/PUT/DELETE` on `/projects`, `/achievements`, `/tech-stacks`,
`/timeline`, `DELETE /feedback/:id`, `GET /feedback` and `GET /auth/me` all return
401 without a token.

**Admin CRUD:** create a `[smoke-test]` project (201), read it, update it (200),
delete it (204), delete again (404), update a non-existent id (404). Compare row
counts before and after; they must match.

## Rate limiting: per client, not global

Limits: feedback 5 per hour per client, login 10 per 15 minutes per client.
They live in process memory, so they reset when the instance restarts.

Two-network test (Network A = home Wi-Fi, Network B = phone hotspot):

```bash
# From Network A: send 6 INVALID submissions (400, nothing is written; they still count)
for i in 1 2 3 4 5 6; do curl -s -o /dev/null -w "%{http_code} " -X POST $API_ORIGIN/api/feedback \
  -H 'Content-Type: application/json' -d '{"rating":9}'; done; echo
# expect: 400 400 400 400 400 429, with a Retry-After header on the 429

# From Network B, right after: one submission
curl -s -o /dev/null -w "%{http_code}\n" -X POST $API_ORIGIN/api/feedback -H 'Content-Type: application/json' -d '{"rating":9}'
# expect 400 (validation ran = not rate limited)
```

- Network B gets **429**: Render's proxy chain makes every visitor look like the same
  address (or the wrong hop is trusted). Investigate `TRUST_PROXY` (the number of proxies
  in front of the app; `1` is correct for Render's single load balancer) by logging
  `req.ip` and the `X-Forwarded-For` header for a test request. Do not change the
  limiter implementation or the limits.
- Network A never gets 429: `TRUST_PROXY` is probably unset, or the header is being
  spoofed past a hop count that is too high.
- Wait for the window to pass (1 hour feedback, 15 min login) before re-testing login.
  Do not weaken limits to make testing easier.

## Production performance verification

The final numbers must come from the **deployed** site, not local builds.

```bash
pip install playwright                      # Google Chrome must be installed
python3 scripts/measure-prod.py https://satyamportfolio-seven.vercel.app 7   # median of 7
```

Record LCP, CLS, INP, TTFB, transferred KiB and blocking time for `/` and `/projects`
in `docs/performance.md`. Targets from the pre-cutover baseline of the old site: Home
LCP 3748 ms / CLS 0.707 / 1715 KiB; Projects LCP 4200 ms / 870 KiB.

**Cold vs warm API** (run when Render has been idle 20+ minutes; temporarily disable
the keep-warm workflow, otherwise the service will never be cold):

```bash
API_ORIGIN=https://<render-service>.onrender.com ./scripts/cold-warm.sh
```

Pre-cutover baseline: cold 55.4 s, warm 0.38 s. Do not change the keep-warm approach
unless these numbers show a problem.

## Keep-warm (Render free tier)

`.github/workflows/keep-warm.yml` pings `GET /livez` every 10 minutes.

- `/livez` does not touch the database (verified: it returns 200 in ~13 ms while the
  database is unreachable, whereas `/health` returns 503). The Neon compute can still
  auto-suspend; the first query after that takes ~2 s.
- The workflow uses only the repository **variable** `API_ORIGIN` (no secrets) and
  prints just the status code and timing, never the URL or the body.
- Setup (manual): GitHub > repo > **Settings > Secrets and variables > Actions >
  Variables > New repository variable** `API_ORIGIN` = `https://<render-service>.onrender.com`.
  Scheduled workflows only run from the default branch, so merge first. Then Actions >
  "Keep API warm" > Run workflow once to confirm it works.
- **This does not guarantee availability.** GitHub may delay or skip scheduled runs under
  load, scheduled workflows are disabled after 60 days without repository activity, and
  Render can still restart the instance. Occasional cold starts will still happen; the
  frontend waits up to 75 s and tells the visitor the API is waking up.
- A permanently warm free instance consumes ~730 of Render's 750 free hours per month.

## Local artifacts that need cleanup

- `scratchpad/prod_backup_pre_migration.dump` (a `pg_dump` taken before the migrations)
  **contains the feedback emails**. It is outside the repository and untracked
  (`git ls-files` shows no `.dump`). It is **not needed for code rollback**: the
  migrations are additive and the old API was verified against the new schema.
  Keep it only as a data safety net until production is verified, then delete it.
- `NEW_CREDENTIALS_DELETE_AFTER_USE.env` (mode 600, same scratchpad): delete after the
  values are in Render and your password manager.

## Final checklist

**Pre-deploy**
- [ ] Branch clean, tests pass, build passes
- [ ] New credentials generated; old ones identified for revocation (`ADMIN_TOKEN`, `VITE_ADMIN_*`)
- [ ] Render variables ready; Vercel variables ready
- [ ] Database migrations verified (already applied)
- [ ] Production backup confirmed (local `pg_dump`)

**Deploy**
- [ ] Rotate credentials (Step 1)
- [ ] Update Render (Step 2) and remove `ADMIN_TOKEN`
- [ ] Remove `VITE_ADMIN_*` from Vercel (Step 3)
- [ ] Deploy backend, then verify `/livez`, `/health`
- [ ] Verify new authentication, old token returns 401 (`smoke-test.sh`)
- [ ] Deploy frontend; verify admin login, public pages, feedback, `/status`

**Post-deploy**
- [ ] Two-network rate-limit test
- [ ] LCP/CLS/INP/TTFB measured on the deployed site
- [ ] Cold and warm API latency recorded
- [ ] `API_ORIGIN` variable set; keep-warm workflow run once manually
- [ ] No secrets in the frontend bundle; no secrets in Render logs
- [ ] Delete the local backup dump and the credentials file

## Reference

### API (Render)

Any Node host works. Build: `npm ci && npx prisma generate`. Start: `npm start`.
Use the pooled Neon URL for the app; run future migrations with
`npx prisma migrate deploy` from a trusted machine.

### Frontend (Vercel)

`VITE_API_URL` is the only variable the app reads. `vercel.json` provides SPA rewrites
(static files such as `robots.txt` are not rewritten), immutable caching for `/assets/*`
and security headers. Update the canonical/OG/sitemap domain in `index.html` and
`public/sitemap.xml` if the site is not on `satyamportfolio-seven.vercel.app`.

### Operations

- Logs are structured JSON (pino); the `Authorization` header is redacted
- Point an uptime monitor at `/livez` (process) and, less often, `/health` (database)
- Dependabot (`.github/dependabot.yml`) opens weekly update PRs
- Logout clears the browser token; tokens are stateless and valid for at most 2 hours.
  Rotating `JWT_SECRET` revokes all of them immediately
