# Next.js × Vercel Template

A deliberately small Next.js 16 starter whose value is in its **Vercel configuration**:

- Only `main` and `develop` trigger Vercel builds. Feature branches are ignored.
- Builds on `main`/`develop` are skipped when only docs/meta files changed.
- Install and build are tuned for fast, cache-friendly Vercel builds.

## Use this template

**GitHub:** click **Use this template** → create your repo. (Repo owner: enable *Settings → General → Template repository* once.)

**CLI:**

```bash
npx create-next-app@latest my-app --example "https://github.com/<org>/nextjs-vercel-template" --use-pnpm
```

Then:

```bash
pnpm install
pnpm dev
```

## Branch → environment mapping

| Branch      | Vercel deployment          | Triggered by         |
| ----------- | -------------------------- | -------------------- |
| `main`      | **Production**             | push / merge         |
| `develop`   | **Preview** (staging)      | push / merge         |
| anything else | **none**                 | —                    |

Work on `feature/*` branches, open PRs into `develop`, and promote `develop` → `main`. Only the merges deploy.

### How the filtering works (two layers)

1. **`vercel.json` → `git.deploymentEnabled`** — the primary gate. `"**": false` disables every branch (including ones with `/` like `feature/login`), then `main` and `develop` are re-enabled. Vercel deploys a branch if *any* matching rule is `true`. Blocked branches never queue a build, so they don't consume build minutes or concurrency slots.
2. **`scripts/vercel-ignore-build.sh`** (Ignored Build Step) — the safety net. It re-checks the branch (override with an `ALLOWED_BRANCHES` env var, space-separated) and skips the build when only `*.md`, `docs/`, `.github/`, `.vscode/` or `LICENSE` changed since the last deployment.

> Changing the deploy branches? Update **both** `vercel.json` and `ALLOWED_BRANCHES` (or the default in the script).

## Build-time optimizations

**In the repo (already done):**

| Setting | Why |
| --- | --- |
| Turbopack (Next.js 16 default) | Rust bundler, much faster than webpack |
| Turbopack build FS cache (on by default since 16.3) | Writes to `.next/cache`, which Vercel restores between builds → incremental rebuilds |
| `pnpm install --frozen-lockfile --prefer-offline` | Deterministic install, reuses Vercel's cached store |
| `packageManager` + `engines.node` + `.nvmrc` | Vercel uses the exact pnpm/Node versions; no version drift, no fallback installs |
| Minimal dependencies (no Tailwind/ESLint/UI libs) | Less to install, less to compile — add only what the project needs |
| `productionBrowserSourceMaps: false` | Skips browser source map generation |
| `SKIP_TYPECHECK=1` (opt-in env var) | Skips `tsc` during `next build` when you type-check elsewhere |
| Ignored Build Step | Docs-only commits don't build at all |

**In the Vercel dashboard (do once per project — not expressible in `vercel.json`):**

1. **Settings → Git → Production Branch:** `main`.
2. **Settings → Build and Deployment → Build Machine:** choose *Enhanced* or *Turbo* (paid plans) — the single biggest build-time win.
3. **Settings → Build and Deployment → On-Demand Concurrent Builds:** enable, so `main` and `develop` never queue behind each other.
4. **Settings → Build and Deployment → Prioritize Production Builds:** enable.
5. **Settings → Environment Variables:** scope staging values to *Preview* + branch `develop`, production values to *Production*.
6. *(Optional, Pro)* **Settings → Environments:** create a `staging` custom environment tracking `develop` for a dedicated domain and env-var set.
7. Do **not** set Build/Install command overrides in the dashboard — `vercel.json` is the source of truth so every project built from this template behaves the same.

Never commit `.vercel/`; each project links itself with `vercel link`.

## Scripts

| Command | |
| --- | --- |
| `pnpm dev` | Dev server (Turbopack, FS cache on) |
| `pnpm build` | Production build |
| `pnpm start` | Serve the production build |
| `pnpm typecheck` | `tsc --noEmit` |

Test the ignore script locally:

```bash
VERCEL_GIT_COMMIT_REF=feature/foo bash scripts/vercel-ignore-build.sh; echo "exit=$?  (0 = skip)"
```

## License

MIT
