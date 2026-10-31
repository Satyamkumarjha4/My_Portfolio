# 0001 - Short-lived JWT in sessionStorage for admin auth

**Status:** accepted

**Problem.** The admin panel used credentials and a static API token baked into
the frontend bundle (`VITE_*`), so anyone could read them and call every write endpoint.

**Decision.** Authenticate server-side (`/api/auth/login`, bcrypt) and issue a
2-hour JWT that the SPA sends as a bearer token, stored in `sessionStorage`.

**Alternatives.**
- httpOnly cookie: strictly better against XSS, but the API and the SPA are on
  different sites, so it needs `SameSite=None; Secure` and is unreliable under
  third-party-cookie blocking. Revisit if both are served from one domain.
- Keep a static token but hide the UI: rejected, that is the original bug.
- Full OAuth/identity provider: far too heavy for one admin.

**Consequences.** Simple and stateless. Revocation = rotate `JWT_SECRET`. XSS
would expose the token, mitigated by escaping/URL validation/headers and the short lifetime.
