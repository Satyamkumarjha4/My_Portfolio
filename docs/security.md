# Security

## Threat model

Public, read-mostly content site with one admin (the owner). Assets worth
protecting: the integrity of published content, visitors' feedback (contains
emails), and the admin credential. No payments, no user accounts.

## Admin authentication

- `POST /api/auth/login` compares the id in constant time and the password with
  bcrypt (cost 12 recommended). On success it issues an HS256 JWT valid for 2 hours.
- `authMiddleware` verifies signature, expiry, algorithm (pinned to HS256) and `role`.
- Secrets exist only in server environment variables. Nothing sensitive ships to the browser.
- The token lives in `sessionStorage` (cleared when the tab closes). Trade-off:
  a script injected via XSS could read it, whereas an httpOnly cookie could not.
  A cookie was not chosen because the API and frontend are on different sites,
  which needs `SameSite=None` and is blocked by Safari/Firefox third-party cookie
  rules. XSS exposure is limited by React escaping, URL validation (`safeUrl`,
  server-side http(s)-only schemas) and security headers. See [decisions/0001](decisions/0001-jwt-in-session-storage.md).
- Login is limited to 10 attempts / 15 min / IP. Successful logins are counted too;
  with 2-hour tokens a legitimate admin will not hit this, so it was left as is.
- Logout clears the token in the browser. Tokens are stateless, so a copied token
  stays valid until it expires (max 2 h). Rotating `JWT_SECRET` revokes all tokens.

## Controls in place

| Area | Control |
|---|---|
| Injection | Prisma parameterised queries; no raw SQL besides `SELECT 1` |
| Mass assignment | zod schemas strip unknown keys; server controls `id`, `createdAt` |
| Input limits | 20 kB body, per-field length caps, array size caps |
| Abuse | Rate limits on login and public feedback |
| CORS | Allowlist from `CORS_ORIGINS`; only GET/POST/PUT/DELETE |
| Headers | helmet on the API; nosniff, frame-deny, referrer, permissions policies on the frontend |
| Info leakage | Central error handler: generic 500s, no Prisma messages, `x-powered-by` removed |
| Stored XSS | `http(s)`/`/path` only for URLs (server schemas + `safeUrl` on render) |

## Residual risks / follow-ups

- Single shared admin account, no MFA, no token revocation before expiry (rotate `JWT_SECRET` to revoke all)
- `sessionStorage` token (see above)
- Feedback spam is throttled per IP only; add a CAPTCHA/honeypot if it becomes a problem
- Run `npm audit` periodically (CI does; Dependabot opens PRs)
