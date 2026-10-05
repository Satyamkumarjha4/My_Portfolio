# API reference

Base URL: `VITE_API_URL` (e.g. `https://api.example.com/api`). All bodies are JSON (max 20 kB).

## Conventions

- `Authorization: Bearer <jwt>` is required for every route marked **admin**.
- Validation errors: `400 { "error": "Validation failed", "details": [{ "path": "rating", "message": "..." }] }`
- Other errors: `{ "error": "<message>" }`. Internals are never returned; they are logged server-side.
- Unknown fields in request bodies are ignored (stripped).

| Status | Meaning |
|---|---|
| 400 | Validation failed / malformed JSON / empty update |
| 401 | Missing, invalid or expired token; bad credentials |
| 404 | Unknown route or record |
| 409 | Unique constraint conflict |
| 413 | Body larger than 20 kB |
| 429 | Rate limited |
| 500 | Unexpected error (generic message) |
| 503 | `/health` only: database unreachable |

## Auth

| Method | Path | Notes |
|---|---|---|
| POST | `/auth/login` | Body `{ id, password }` -> `{ token, expiresIn }`. 10 requests / 15 min / IP |
| GET | `/auth/me` | **admin**. `200 { ok: true }` if the token is valid |

## Content resources

`projects`, `achievements`, `tech-stacks`, `timeline` share the same shape:

| Method | Path | Auth | Result |
|---|---|---|---|
| GET | `/<resource>` | public | `200` array, ordered (see below). `Cache-Control: public, max-age=60, stale-while-revalidate=300` |
| POST | `/<resource>` | admin | `201` created record |
| PUT | `/<resource>/:id` | admin | `200` updated record. Partial updates allowed, at least one field |
| DELETE | `/<resource>/:id` | admin | `204`. `404` if missing |

Ordering: projects `sortOrder, title`; achievements `date desc`; tech-stacks `category, name`; timeline `startDate desc` (nulls last), then title.

### Field rules

| Resource | Fields |
|---|---|
| project | `title` (<=200), `description` (<=5000), `techStack[]`, `tags[]` (<=50 items of <=60 chars), `imageUrl` (http(s) URL or `/path`), `githubUrl`, `demoUrl` (http(s)), `imageOnRight` (boolean), `sortOrder` (int, optional), `caseStudy` (<=20000 chars, optional; blank line = paragraph, `## ` = heading) |
| achievement | `title`, `date` (ISO date), `overview`, `certificate` (http(s) URL, `/path` or null) |
| tech-stack | `name`, `category` (`Languages`, `Frontend`, `Python_Frameworks`, `Databases`, `Data_Science`, `Tools`), `proficiency` (int 1-100), `description`, `iconName` |
| timeline | `title`, `date` (label, e.g. `2022 - 2026`), `description`, `type` (`EDUCATION`, `HACKATHON`, `WORK`), `remarks` (optional), `startDate` (optional; derived from the first 4-digit year in `date` when omitted) |

## Feedback

| Method | Path | Auth | Notes |
|---|---|---|---|
| POST | `/feedback` | public | `{ email, name, rating (int 1-5), remark? (<=2000) }`. 5 requests / hour / IP. `id` and `createdAt` are server-controlled |
| GET | `/feedback` | admin | Newest first. `Cache-Control: no-store` |
| DELETE | `/feedback/:id` | admin | `204` |

## Health

`GET /livez` -> `200 { status: "ok" }`. Process liveness only, no database access (used by keep-warm).


`GET /health` -> `200 { status: "ok", db: "up", dbLatencyMs, uptimeSeconds, timestamp }`
or `503 { status: "degraded", db: "down" }`. The DB probe has a 3 s timeout. Never cached.
