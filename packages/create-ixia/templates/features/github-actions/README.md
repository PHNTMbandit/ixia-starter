# GitHub Actions CI

Adds `.github/workflows/ci.yml` for pull requests and pushes to `main`. It runs
`vp check` and `vp build`, runs `vp test` when matching tests or stories exist
under `src/`, and enables Paraglide and Playwright setup when those optional
features are installed.

Run `vp install` and `vp check --fix` locally, then commit the formatted files
and generated `pnpm-lock.yaml`. CI installs dependencies with
`--frozen-lockfile`.
