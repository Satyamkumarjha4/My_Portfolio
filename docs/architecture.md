# Architecture

```
Browser (React SPA on Vercel)
  |  public pages:  GET  /api/{projects,achievements,tech-stacks,timeline}
  |                 POST /api/feedback        (rate limited)
  |  admin pages:   POST /api/auth/login  ->  JWT (2h)  ->  Authorization: Bearer
  v
Express 5 (Backend/src/app.js)
  helmet -> cors(allowlist) -> compression -> json(20kb)
  -> route -> [rate limit] -> [authMiddleware] -> [validate(zod)] -> controller
  -> Prisma -> PostgreSQL
  -> notFound -> errorHandler (maps Zod/Prisma errors, logs with pino)
```

## Backend (`Backend/`)

| Path | Responsibility |
|---|---|
| `src/app.js` | Builds the Express app (exported so tests can use it) and `/health` |
| `src/index.js` | Loads env, fails fast on missing config, starts the server, graceful shutdown |
| `src/routes/*` | URL -> middleware chain -> controller. One file per resource |
| `src/middleware/auth.js` | Verifies the admin JWT (HS256, `role: admin`) |
| `src/middleware/validate.js` | Parses `req.body` with a zod schema; unknown keys are stripped (prevents mass assignment) |
| `src/middleware/rateLimit.js` | Login and feedback limiters |
| `src/middleware/cache.js` | `Cache-Control` helpers for public content |
| `src/middleware/errorHandler.js` | One place that turns errors into stable JSON responses |
| `src/controllers/crudController.js` | Generic list/create/update/remove used by all resources |
| `src/utils/schemas.js` | All input schemas, the only place validation rules live |
| `prisma/schema.prisma` | Data model; migrations in `prisma/migrations` |

There is deliberately no service or repository layer: the controllers are thin
wrappers over Prisma and there is no business logic to isolate. Add one when a
second consumer or real logic appears (see [decisions/0002](decisions/0002-no-service-layer.md)).

### Data model

`Project`, `Achievement`, `TechStack`, `TimelineItem` are content tables (no
relations, no joins, so no N+1 risk). `Feedback` is the only table written by the
public. Notable columns:

- `Project.sortOrder`: explicit display order (lower first)
- `TimelineItem.startDate`: sortable date derived from the free-text `date` label
- CHECK constraints (added `NOT VALID`) on `Feedback.rating` (1-5) and `TechStack.proficiency` (1-100)

No secondary indexes are defined on purpose: no query filters on any column, and
every table is small enough that a sequential scan beats an index.

## Frontend (`Frontend/`)

```
src/
  App.tsx                 routes; everything except Home is React.lazy
  ui/
    features/             route-level pages (Home, About, Projects, Contact, Info, Status)
    components/           presentational + section components
    hooks/                useApi (SWR-style cache), useMediaQuery, usePageMeta, useEscapeKey
    utils/                axios instances, auth token storage, safeUrl
  admin/
    Page/                 Login, Dashboard, Table router
    components/           tables + modals per resource, RequireAdmin guard
    hooks.ts              useAdminResource (list/select/delete), getErrorMessage
```

- **Data fetching**: public components call `useApi('/path')`. Results are cached
  for 60s, concurrent consumers share one request, and stale data is shown while
  revalidating. Every consumer renders loading, error (with retry) and empty states.
- **Auth**: `/admin/login` posts to `/api/auth/login`; the JWT is kept in
  `sessionStorage`. `RequireAdmin` verifies it with `GET /api/auth/me` before
  rendering admin routes, and the axios interceptor clears it and redirects on any 401.
- **Rendering**: client-side only. Per-route titles/descriptions are set by
  `usePageMeta`; static OG/JSON-LD tags live in `index.html`.

## "Under the hood" page (`/status`)

Shows the backend instead of describing it: a live `/health` widget (DB status,
DB latency, browser round trip, uptime, re-checked every 30 s while the tab is
visible), the architecture diagram, an API explorer that calls the real public
endpoints and shows status, timing, size and caching headers, and short
engineering-decision summaries linking to these docs. Projects can also carry an
optional plain-text `caseStudy`, rendered safely (no HTML injection) under the project card.
