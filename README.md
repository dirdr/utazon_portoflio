# utazon

Monorepo for [utazon.fr](https://utazon.fr) — the portfolio site and the API behind it.

| App | Path | Stack | Deploys to |
|-----|------|-------|-----------|
| Portfolio | [`apps/portfolio`](apps/portfolio) | Vite · React 19 · Three.js · pnpm | Cloudflare Pages |
| Backend | [`apps/backend`](apps/backend) | Rust 2024 · Axum · cargo | GHCR image → Kubernetes via [`adrien_kubernetes_cluster`](https://github.com/dirdr/adrien_kubernetes_cluster) |

## Getting started

```sh
# portfolio
cd apps/portfolio && pnpm install && pnpm dev      # http://localhost:5173

# backend
cd apps/backend && cp .env.example .env && cargo run   # http://localhost:3001
```

## CI/CD

Each app has one workflow that gates its own deploy — nothing ships unless that
app's checks pass. Workflows are path-filtered, so a portfolio change never runs
the Rust pipeline and vice versa.

| Workflow | Trigger | Does |
|----------|---------|------|
| `portfolio.yml` | push / PR touching `apps/portfolio/**` | lint, typecheck, build → on `main`, deploy preview to [integration.utazon.fr](https://integration.utazon.fr) |
| `backend.yml` | push / PR touching `apps/backend/**` | fmt, clippy, test → on `main`, push `ghcr.io/dirdr/utazon-backend:sha-<short>` and bump the image tag in the cluster repo |
| `security.yml` | every push / PR | gitleaks across the full history |
| `release-portfolio.yml` | manual dispatch | version bump, `portfolio-vX.Y.Z` tag, `production` branch, deploy to [utazon.fr](https://utazon.fr), GitHub release, Discord notification |

### Releases

The portfolio is released manually from the Actions tab (*Release Portfolio* →
*Run workflow*) and tagged `portfolio-vX.Y.Z`. Tags `v3.0.8` and earlier predate
the monorepo and are left as-is.

The backend has no release workflow — every merge to `main` builds an image
tagged with its commit sha and bumps the cluster repo, which Argo CD reconciles.
