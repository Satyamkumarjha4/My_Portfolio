# Local production-like testing

Run the whole stack on your machine the way it will run in production (built frontend
with the CSP and Vercel-style routing, `NODE_ENV=production` backend, real Postgres) before
deploying. Nothing here deploys or pushes anything.

You need three terminals: **backend**, **fake deploy hook**, **frontend preview**.

> **Use a Neon dev branch, never production.** `Backend/.env` (the old one, untracked) probably
> still holds your production `DATABASE_URL` and the legacy `ADMIN_TOKEN`. The new
> `Backend/.env.local` wins because dotenv never overrides variables that are already set,
> but do not leave `DATABASE_URL` empty in `.env.local`: the server would silently fall back
> to the one in `.env`.

## 1. One-time setup

```bash
cd Backend
```

Open `Backend/.env.local` (gitignored) and replace every `REPLACE_ME_*`:

| Variable | Value |
|---|---|
| `DATABASE_URL` | the Neon **dev branch** connection string |
| `JWT_SECRET` | `openssl rand -hex 32` |
| `ADMIN_ID` | any id for local testing |
| `ADMIN_PASSWORD_HASH` | output of `npm run -s hash-password` (prompts twice, input hidden; paste the `$2b$...` result as-is, no quotes) |

Already set for you: `NODE_ENV=production`, `PORT=3000`,
`CORS_ORIGINS=http://localhost:4173,http://localhost:5173`, `VERCEL_DEPLOY_HOOK_URL=http://localhost:9999`.
`TRUST_PROXY` is deliberately unset (no proxy locally).

## 2. Database: check, migrate, start, confirm (terminal 1)

Run these from `Backend/`, in this order:

```bash
# a. Confirm which database you are about to touch (host + db name only, no password).
#    It must be the dev branch.
npm run db:host:local

# b. What migrations are pending?
npm run migrate:status:local

# c. Apply them
npm run migrate:deploy:local

# d. Optional: sample content, only fills EMPTY tables
node --env-file=.env.local prisma/seed.js

# e. Start the API on :3000 (production mode, reads .env.local)
npm run start:local
```

In another shell, confirm it is up:

```bash
curl -i http://localhost:3000/livez            # 200 {"status":"ok"}  (no database involved)
curl -s http://localhost:3000/health           # {"status":"ok","db":"up","dbLatencyMs":...}
curl -s http://localhost:3000/api/projects | head -c 300
```

`/health` can take ~2 s the first time after Neon has been idle, and returns **503** with
`"db":"down"` if `DATABASE_URL` is wrong. If `migrate:status:local` or `/health` complains,
fix `.env.local` before going on.

## 3. Fake deploy hook (terminal 2, from the repo root)

```bash
node scripts/fake-deploy-hook.mjs          # listens on :9999 (PORT=... to change)
```

It prints one line per POST it receives, with the time since the previous one. The backend
calls it (because `VERCEL_DEPLOY_HOOK_URL=http://localhost:9999`) after content writes, once
per burst, 60 s after the last write. Restart the backend if you edit `.env.local`.

## 4. Frontend, production-like (terminal 3)

```bash
cd Frontend
npm run preview:prod                        # build against http://localhost:3000/api, serve on :4173
# BACKEND_PORT=3001 PORT=4180 npm run preview:prod
# npm run preview:prod -- --skip-build      # re-serve the existing dist/
# npm run preview:prod -- --keep-snapshot   # keep the snapshot it fetched instead of restoring the committed one
```

What it does:

1. Runs `npm run build` with `VITE_API_URL=http://localhost:<backend port>/api` and
   `VITE_SITE_URL=http://localhost:<port>`: prebuild **snapshot** (fetched from your local
   backend, so `dist/` embeds your dev data), `vite build`, postbuild (per-route HTML,
   sitemap, robots).
2. Restores the committed `src/data/snapshot.json` so `git status` stays clean.
3. Serves `dist/` emulating `vercel.json`: filesystem first, then rewrites, real 404s, and the
   headers from `vercel.json` including the CSP.
4. **CSP:** the real `connect-src` only allows `https://*.onrender.com`, which would block
   `http://localhost:3000`. The server swaps only that host for the local API origin and
   prints that it did so. `vercel.json` is not modified.

If the backend is not running when you build, the snapshot step prints a warning and keeps the
committed snapshot (that is the fallback behaviour, not an error).

Open <http://localhost:4173>.

## 5. Manual checklist

Tick these off in order; step 5 and 6 depend on each other.

1. **Deep links and 404.** In the address bar open `http://localhost:4173/projects`,
   `/about` and `/admin/login` directly (not by clicking): each must load. `/nope` must show a
   plain 404 (not the app). The terminal prints each request with how it was served.
2. **Mobile menu.** DevTools > device toolbar (phone width). Open the menu: the page behind is
   **dimmed, not solid black**. `Esc` closes it. Open again: Tab stays inside the menu. The
   **Info** item navigates to `/info` and closes the menu.
3. **Keyboard.** On `/`, reload and press `Tab` once: the first stop is the **Skip to main
   content** link (visible only while focused; `Enter` jumps to the content). Keep tabbing on
   `/`: after the two hero buttons you reach **Show profile photo** (visible on focus);
   `Enter` swaps the code window and portrait.
4. **Console / CSP.** Open the console on `/`, `/about`, `/projects`, `/contact`, `/info`,
   `/status`. On `/about` click a certificate card to open the **certificate preview**; on
   `/status` use the API explorer. There must be **no** "Refused to ... Content Security
   Policy" errors. (A Google Drive page complaining inside the iframe is Google's, not ours.)
5. **Admin round trip.** Go to `/admin/login`, log in with `ADMIN_ID` and the password you
   hashed. Create, edit and delete one item (e.g. a tech stack entry or a project).
   - After each successful save/delete you see **"Saved — the public site updates in about a
     minute."**
   - Open the public page and **hard-reload** (`Ctrl+Shift+R`): the change is there. A plain
     reload may show the old list for up to a minute because the API sends
     `Cache-Control: max-age=60`. Locally there is no rebuild: the page picks the change up
     by revalidating from the API.
   - In the fake-hook terminal you see **exactly one** `POST` about **60 s after your last
     write**, not one per write. Make three quick edits and confirm it is still one.
6. **API down.** First re-run `npm run preview:prod` (backend still running) so the snapshot
   includes the item from step 5. Then stop the backend (`Ctrl+C` in terminal 1) and reload
   `/`, `/projects`, `/about`: all content is still there (from the snapshot), with **no**
   error block and no loading spinner. DevTools > Network shows the API calls failing quietly.
7. **Phone link.** On `/contact` the phone reads `+91 76830 95499` and the link is
   `tel:+917683095499` (hover it and read the status bar, or inspect the element).

## 6. Clean up

`Ctrl+C` each terminal. `git status` should show only the files you meant to change:
`Backend/.env.local`, `Frontend/.env` and `Frontend/dist/` are gitignored. `src/data/snapshot.json`
changes only if you used `--keep-snapshot`.

## Troubleshooting

| Symptom | Cause / fix |
|---|---|
| Browser: "blocked by CORS policy" | Backend `CORS_ORIGINS` must contain the exact origin you browse (`http://localhost:4173`, no trailing slash). Restart the backend after editing `.env.local`. |
| Admin login: 401 | Wrong `ADMIN_ID`, or the password does not match `ADMIN_PASSWORD_HASH`. Re-run `npm run -s hash-password` and paste the whole `$2b$12$...` string without quotes. |
| Backend exits "Missing required environment variables" | A line in `.env.local` is blank or misspelled. |
| `/health` 503, `/livez` 200 | Backend is fine, database unreachable: check `npm run db:host:local` and the Neon branch (it may be suspended; retry in a few seconds). |
| Fake hook never logs | Backend started before `.env.local` had `VERCEL_DEPLOY_HOOK_URL`, or the hook wasn't running when the 60 s elapsed (failures are only logged, then dropped). |
| Port already in use | `PORT=4180 npm run preview:prod`, and add that origin to `CORS_ORIGINS`. |

## What this does not prove

The emulator mimics `vercel.json`, but it is not Vercel. Verify routing (`/about` etc. served from
`about/index.html`, `/nope` 404, `/admin/login` loads) once on a Vercel **preview** deployment,
and see [deployment.md](deployment.md#content-snapshot-and-the-publish-hook) for the real deploy
hook setup.
