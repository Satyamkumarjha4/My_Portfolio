# Development

Requirements: Node 20+, PostgreSQL.

## Backend

```bash
cd Backend
cp .env.example .env            # then fill it in
npm install
npx prisma migrate dev          # applies migrations
npx prisma db seed              # optional sample data (only fills empty tables)
npm run dev                     # nodemon on $PORT
npm test                        # vitest + supertest (Prisma is mocked, no DB needed)
```

### Environment variables

| Variable | Required | Purpose |
|---|---|---|
| `DATABASE_URL` | yes | PostgreSQL connection string (use the pooled URL in production) |
| `ADMIN_ID` | yes | Admin login id |
| `ADMIN_PASSWORD_HASH` | yes | bcrypt hash. Generate: `npm run hash-password -- "<password>"` |
| `JWT_SECRET` | yes | >= 32 random chars (`openssl rand -hex 32`) |
| `CORS_ORIGINS` | prod | Comma-separated browser origins, no trailing slash needed |
| `TRUST_PROXY` | prod | Set to `1` behind a reverse proxy so rate limiting sees real client IPs |
| `PORT` | no | Defaults to 3000 |
| `LOG_LEVEL` | no | pino level, default `info` |

The server refuses to start if a required variable is missing.

## Frontend

```bash
cd Frontend
cp .env.example .env            # VITE_API_URL=http://localhost:3000/api
npm install
npm run dev                     # http://localhost:5173
npm run lint && npm test && npm run build
```

`VITE_*` variables are **public**: they are inlined into the JS bundle. Never put
secrets in them. The only one used is `VITE_API_URL`.

## Migrations

Schema changes: edit `schema.prisma`, run `npx prisma migrate dev --name <change>`,
commit the generated SQL. Production: `npx prisma migrate deploy`.
The `20251001000000_ordering_and_constraints` migration backfills
`TimelineItem.startDate` from the year in each label and adds range constraints
as `NOT VALID` (enforced for new writes without failing on legacy rows).
