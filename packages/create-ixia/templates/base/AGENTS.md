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

# Project guide

This is a React/TypeScript TanStack Start application using Vite+, Tailwind CSS,
and Ixia UI. Read `README.md` and `package.json` to identify the features and
scripts selected for this project; authentication, database, localization,
content, Storybook, and testing are optional.

## Layout and conventions

- `src/routes/` contains file-based routes; `src/routeTree.gen.ts` is generated
  and should not be edited. The `@/` alias points to `src/`.
- Place feature-specific code in `src/features/` and shared UI in
  `src/components/` when those directories are present or needed.
- Import Ixia UI components from subpaths, such as `ixia-ui-react/button`, not
  the package root. Follow the existing TypeScript and React patterns.
- If localization is enabled, edit the configured `messages/` source files
  rather than generated `src/paraglide/` output.
- Keep server credentials in environment variables, never in client code or
  committed files. Use `.env-template`, when present, for placeholders only.

## Validation

- Use `vp check`, `vp test`, and `vp build` as appropriate for the change.
  Testing and Storybook are optional; Storybook browser tests require
  Playwright browsers.
- Consult the selected-feature sections of `README.md` for feature-specific
  setup and commands.
