<!--VITE PLUS START-->

# Using Vite+, the Unified Toolchain for the Web

This project is using Vite+, a unified toolchain built on top of Vite, Rolldown, Vitest, tsdown, Oxlint, Oxfmt, and Vite Task. Vite+ wraps runtime management, package management, and frontend tooling in a single global CLI called `vp`. Vite+ is distinct from Vite, and it invokes Vite through `vp dev` and `vp build`. Run `vp help` to print a list of commands and `vp <command> --help` for information about a specific command.

Docs are local at `node_modules/vite-plus/docs` or online at https://viteplus.dev/guide/.

## Built-in Commands vs Scripts

`vp <name>` runs a built-in command. `vp run <name>` runs a `package.json` script or a `vite.config.ts` task. Scripts cannot overwrite built-ins, so `vp dev` and `vp run dev` may do different things. Check `package.json` and `vite.config.ts` first, and run `vp run <name>` when the project defines a script or task with that name.

## Tool Versions

Run `vp toolchain` to show versions and relationships in the active Vite+
release. Add a tool name to select part of the graph. For example, run
`vp toolchain vite`. Use `--global` to ignore the local `vite-plus` package. Use
`vp why <package>` to show the package-manager dependency graph.

## Review Checklist

- [ ] Run `vp install` after pulling remote changes and before getting started.
- [ ] Run `vp check` and `vp test` to format, lint, type check and test changes.
- [ ] Check if there are `vite.config.ts` tasks or `package.json` scripts necessary for validation, run via `vp run <script>`.
- [ ] If setup, runtime, or package-manager behavior looks wrong, run `vp env doctor` and include its output when asking for help.

<!--VITE PLUS END-->

# Ixia Starter repository

This repository contains a React/TypeScript TanStack Start application and the
`create-ixia` CLI that scaffolds projects from it. Read `README.md` for setup
and feature details before changing either.

## Layout and ownership

- Application routes are in `src/routes/`, shared UI in `src/components/`, and
  feature modules in `src/features/`. The `@/` alias points to `src/`.
- `packages/create-ixia/src/features.ts` defines the CLI's feature registry;
  `packages/create-ixia/src/scaffold.ts` copies the base template and selected
  feature overlays from `packages/create-ixia/templates/`. Keep registry
  metadata, templates, and scaffold tests consistent when changing features.
- `src/features/content-page`, `markdown-lite`, `markdown-full`, and
  `highlight` are the source of truth for their CLI template copies. After
  changing them, use `pwsh -File scripts/sync-features.ps1`; add `-Check` to
  verify synchronization. The script also updates a sibling `ixia-docs`
  checkout if present, so inspect its destinations before running it.

## Conventions

- Import Ixia UI components from their subpaths, such as
  `ixia-ui-react/button`, rather than the package root.
- Treat `src/routeTree.gen.ts`, `src/paraglide/`, and generated CSS as generated
  output. Edit route files or translation sources in `messages/` instead.
- Keep server credentials in environment variables, never in client code or
  committed files. Use `.env-template` for placeholder names, not real secrets.
- Preserve existing TypeScript, React, localization, and formatting patterns.

## Validation

- Run relevant tests with `vp test`; for example,
  `vp test --project unit src/tests/unit/content-scaffold.unit.test.ts` covers
  the scaffold. Storybook browser tests require Playwright browsers.
- When changing the CLI or its templates, also run
  `vp exec pnpm --filter create-ixia build`.
