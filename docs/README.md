# Documentation

| Document | What it covers |
|---|---|
| [architecture.md](architecture.md) | How the system fits together: request flow, data model, frontend structure |
| [api.md](api.md) | Every endpoint: auth, request/response shapes, status codes, caching, rate limits |
| [security.md](security.md) | Threat model, auth design, what was fixed and what remains |
| [development.md](development.md) | Local setup, environment variables, scripts, migrations, seeding |
| [local-testing.md](local-testing.md) | Run the full stack locally in a production-like way (built frontend with CSP, fake deploy hook) and a manual test checklist |
| [deployment.md](deployment.md) | Rotating secrets, deploying API and frontend, CI |
| [../scripts/](../scripts/) | `smoke-test.sh` (production API checks), `cold-warm.sh` (Render latency), `measure-prod.py` (real-browser performance) |
| [testing.md](testing.md) | Test strategy and how to run the suites |
| [performance.md](performance.md) | Before/after Lighthouse and real-browser measurements, with caveats |
| [audit-report.md](audit-report.md) | The original technical audit, with the status of every backlog item |
| [decisions/](decisions/) | Architecture decision records (why, not just what) |
