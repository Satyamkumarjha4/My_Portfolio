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
