# Technical audit and remediation status

Original audit of the repository (October 2025) and what was done about each
finding. IDs match the audit backlog. "Open" items are deliberate follow-ups.

## Summary of the starting point

Express 5 + Prisma + PostgreSQL CRUD API and a Vite/React SPA with an admin panel.
Clean and consistent, but tutorial-level: no tests, no logging, no rate limiting,
and an admin "login" that was purely cosmetic with the admin API token compiled
into the public JS bundle.

## Security findings

| ID | Severity | Finding | Status |
|---|---|---|---|
| S-1 | Critical | `VITE_ADMIN_TOKEN/ID/ACCESS_KEY` inlined into the public bundle; anyone could call every write endpoint | **Fixed**: server-side login, JWT, no secrets in client. **Action required:** rotate credentials, see [deployment.md](deployment.md) |
| S-2 | Critical | Client-side `location.state` "authorization" | **Fixed**: `RequireAdmin` verifies the token with the API |
| S-3 | High | Public `POST /feedback` unthrottled, mass assignment | **Fixed**: rate limit, schema whitelist, length caps |
| S-4 | High | `...req.body` into Prisma on all writes | **Fixed**: zod schemas strip unknown keys |
| S-5 | Medium | CORS wide open (earlier allowlist failed due to a trailing slash) | **Fixed**: env allowlist, slashes normalised, tested |
| S-6 | Medium | Static shared token, `!==` comparison, no expiry | **Fixed**: JWT with expiry; constant-time id check |
| S-7 | Medium | `error.message` returned to clients | **Fixed**: central handler, generic messages |
| S-8 | Medium | No security headers | **Fixed**: helmet (API) and headers in `vercel.json` |
| S-9 | Medium | Unvalidated URLs rendered as `href` (`javascript:`) | **Fixed**: server schema + `safeUrl` on render |
| S-10/11 | Low | No dependency scanning; email logged to console | **Fixed**: Dependabot + CI audit; log removed |

## Backend backlog

| ID | Pri | Task | Status |
|---|---|---|---|
| BE-001/002 | P0 | Server-side admin login, rotate token | Done (rotation is a manual step) |
| BE-003 | P0 | Rate limiting | Done |
| BE-004 | P0 | CORS allowlist | Done |
| BE-005 | P1 | Schema validation | Done (zod) |
| BE-006 | P1 | Error handling and logging | Done (central handler, pino) |
| BE-007 | P1 | Real health check | Done (DB probe with timeout) |
| BE-008 | P1 | API tests | Done (25 supertest cases) |
| BE-009 | P1 | Security headers | Done |
| BE-010 | P2 | HTTP caching + compression | Done |
| BE-011 | P2 | Deterministic ordering | Done (`sortOrder`, explicit `orderBy`) |
| BE-012 | P2 | Typed timeline date | Done (`startDate`, backfilled) |
| BE-013 | P2 | DB constraints | Done (`NOT VALID` CHECKs). No index added: no query needs one |
| BE-014 | P2 | Seed + env docs | Done |
| BE-015 | P2 | Env validation, graceful shutdown | Done |
| BE-016 | P3 | Stale comments / duplicated enums | Done (validators replaced by schemas) |
| BE-017 | P3 | Dependabot / audit | Done |

## Frontend backlog

| ID | Pri | Task | Status |
|---|---|---|---|
| FE-001 | P0 | Remove client secrets, real login flow | Done |
| FE-002 | P0 | Feedback success state | Done |
| FE-003 | P0 | Declare `react-intersection-observer` | Done |
| FE-004 | P1 | Full-page reload navigation | Done (verified in a browser) |
| FE-005 | P1 | Image optimisation | Done (1.5 MB -> 240 KB, same paths) |
| FE-006 | P1 | Shared data layer | Done (`useApi`, own implementation: no new dependency) |
| FE-007 | P1 | Code splitting | Done (admin ~96 kB no longer in the main bundle) |
| FE-008 | P1 | SEO baseline | Done (meta, OG, JSON-LD, robots, sitemap, per-route titles) |
| FE-009 | P1 | Timeline scroll logic | Done |
| FE-010 | P1 | Core accessibility | Mostly done: dialog semantics + Escape, labelled login, keyboard star rating, focus ring, reduced motion. **Open:** full focus trapping in modals; a full screen-reader pass |
| FE-011 | P1 | Single source for projects | Done |
| FE-012 | P2 | De-duplicate admin tables/modals | **Partial**: shared hook, types and error handling (~270 lines removed). The full config-driven table/modal rewrite was not done: each table has bespoke rendering and there is no visual regression safety net |
| FE-013 | P2 | Unused deps and debug logs | Done (`react-icons` kept: it is used by `TechCard`) |
| FE-014 | P2 | Simplify Hero/Achievements state | Done |
| FE-015 | P2 | Loading/empty/error states | Done for public pages. **Open:** admin delete failures only log to the console |
| FE-016 | P2 | Safe URLs on render | Done |
| FE-017 | P3 | Misc cleanup | Done |
| FE-018 | P3 | Frontend tests | Done (8 tests) |

## Full-stack / DevOps

| ID | Pri | Task | Status |
|---|---|---|---|
| FS-001 | P0 | Coordinated auth cutover | Code done; **deploy both sides together** |
| FS-002 | P1 | CI pipeline | Done (`.github/workflows/ci.yml`) |
| FS-003 | P1 | Docs and `.env.example` | Done |
| FS-004 | P2 | Request logging / uptime | Logging done; point an uptime monitor at `/health` yourself |
| FS-005 | P2 | API cold starts | **Open**: measure first (host unknown) |
| FS-006 | P3 | Architecture docs + differentiation | Done: this folder, ADRs, `/status` page, project case studies |

## Differentiation features added

- `/status` "Under the hood": live health, architecture diagram, API explorer, decisions
- Per-project case studies (`caseStudy` field, editable in the admin)
- CI badge, tests and ADRs visible in the repository

Deliberately not built: GitHub-stats integration (adds an external dependency and
rate limits for marginal value), Redis, GraphQL, 3D scenes.
