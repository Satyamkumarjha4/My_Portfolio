# Performance measurements

Method: `main` (before) vs this branch (after), production builds served by
`vite preview` against a local stub API (60 ms latency, same 3 projects with the
real screenshots). Lighthouse 12, mobile emulation with simulated throttling,
median of 3 runs. LCP was cross-checked with real `PerformanceObserver` LCP
entries in Chrome (4x CPU slowdown, 150 ms RTT, 1.6 Mbps), median of 5 runs.
Numbers are from a local machine, so use them for before/after comparison, not as absolute production values.

| Metric | Home before -> after | Projects before -> after |
|---|---|---|
| Lighthouse performance | 88 -> 93 | 97 -> 94 |
| Accessibility | 79 -> 88 | 87 -> 96 |
| SEO | 75 -> 100 | 75 -> 100 |
| Total transfer | 1710 KiB -> 397 KiB | 1711 KiB -> 396 KiB |
| Total Blocking Time | 98 -> 31 ms | 61 -> 28 ms |
| CLS | 0.174 -> 0.052 | 0 -> 0 |
| FCP | 1.80 -> 1.80 s | 1.80 -> 1.80 s |
| LCP (Lighthouse, simulated) | 2.45 -> 3.00 s | 2.31 -> 2.96 s |
| LCP (real entries, throttled) | 3.61 -> 2.52 s | 3.89 -> 3.83 s |
| Main JS (gzip) | 178 kB single file | 166 kB + Admin 15 kB loaded on demand |

## Reading the LCP rows honestly

Lighthouse's *simulated* LCP got worse by about 0.5 s while the *measured* LCP
improved on Home and was flat on Projects. In the simulation the LCP element
changed from the hero paragraph to the navbar logo, which the simulator models as
loading later. The real-entry measurement is the more trustworthy signal here,
but this is a known discrepancy rather than a proven win, so re-measure on the
deployed site (Render cold starts will dominate there).

## Lessons applied

- Route-splitting every page added a chunk request to each landing page. Only the
  admin panel (96 kB) and `/status` are split; the small public pages are bundled.
- The first project image is `loading="eager" fetchPriority="high"`; lazy-loading
  an above-the-fold image delays LCP.
- The hero typewriter line reserves its height, which removed most of the CLS.

## Release verification (2026-10-05)

Real Chrome, mobile viewport, 4x CPU slowdown, 150 ms RTT / 1.6 Mbps, cache
disabled, median of 5. **Before** = the live production site (old code on
Vercel + Render, API warm). **After** = this branch's production build served
locally with gzip, calling the new API locally against the production database
(the branch is not deployed yet). TTFB is therefore not comparable between the
two columns; the HTML is static either way, so the branch does not change it.

| Metric | Home before | Home after | Projects before | Projects after |
|---|---:|---:|---:|---:|
| LCP | 3748 ms | 3112 ms | 4200 ms | 3812 ms |
| CLS | 0.707 | 0.036 | 0.002 | 0.006 |
| INP (click) | 40 ms | 40 ms | 40 ms | 40 ms |
| TTFB (document) | 1069 ms (prod) | 968 ms (local) | 1295 ms (prod) | 966 ms (local) |
| Transferred | 1715 KiB | 346 KiB | 870 KiB | 343 KiB |
| Blocking time | 0 ms | 0 ms | 33 ms | 49 ms |

LCP element: Home = hero `<h1>` (text, no resource), Projects = hero `<p>` (text).
The navbar logo (`S-*.png`, ~6 kB) is always the *first* candidate (~2.5 s) and is
then superseded by the text. The hero text fades in with framer-motion, and text
painted at opacity 0 is not an LCP candidate, so which element is "last" depends on
animation timing. In Lighthouse's run the logo ended up as the final candidate and
its simulation charged it the JS-bundle -> PNG request chain. Real measurements on
both builds end on the hero text and LCP improved, so nothing was changed for
Lighthouse's sake. The remaining LCP cost is the entrance animation itself (a design choice).

Backend (live Render, measured from India):

| State | TTFB | Total |
|---|---:|---:|
| Cold (after idle) | 55.4 s | 55.4 s |
| Warm (median of 5) | 0.38 s | 0.38 s |

First DB query after Neon auto-suspend: ~2.3 s (observed once via `/health`).
