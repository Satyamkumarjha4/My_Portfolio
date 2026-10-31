# 0003 - HTTP caching instead of Redis

**Status:** accepted

**Context.** Public GETs return small, rarely-changing tables.

**Decision.** `Cache-Control: public, max-age=60, stale-while-revalidate=300` +
Express ETags on the content endpoints, and a 60 s client cache with in-flight
de-duplication (`useApi`). No Redis.

**Why.** The database load is trivial; the real cost is network latency and API
cold starts, which browser/CDN caching removes better than a server cache would.
Redis would add an infrastructure dependency and an invalidation problem for no measurable gain.

**Consistency.** An admin edit can take up to ~60 s to appear for visitors. The admin
client sends `Cache-Control: no-cache`, so the owner always sees fresh data.
