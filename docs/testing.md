# Testing

The goal is confidence in behaviour that can hurt (auth, validation, error
mapping), not a coverage number.

## Backend (`Backend/test`, vitest + supertest)

Prisma is mocked, so the suite needs no database and runs in about a second.
Covered:

- login: wrong credentials, malformed body, token accepted by `/auth/me`
- **every write route and the feedback list reject** missing/garbage tokens
- zod validation: unknown fields stripped (no mass assignment), `javascript:` URLs,
  `imageOnRight: false` accepted / non-boolean rejected, enum and range checks,
  empty update bodies, derived timeline `startDate`
- feedback: public create, ignores client `id`/`createdAt`, rating/email/length limits
- error mapping: Prisma `P2025` -> 404, unexpected errors -> generic 500 with no leak, bad JSON -> 400
- `/health` up/down, CORS allowlist (incl. trailing-slash config), security headers

Rate limiters are disabled when `NODE_ENV=test`.

Not covered (needs a real database): migrations and actual SQL behaviour. If you
add business logic or raw queries, add an integration suite against a throwaway
Postgres (e.g. a CI service container).

## Frontend (`Frontend`, vitest + Testing Library)

- `useApi`: request de-duplication, caching, error + refetch
- `Feedback` form: validation blocks submit, success only after a 2xx, error and 429 messages
- `safeUrl`: blocks `javascript:`, `data:`, protocol-relative URLs

## CI

`.github/workflows/ci.yml` runs on every push/PR: backend tests; frontend lint,
tests and production build; `npm audit` (high severity, non-blocking).
