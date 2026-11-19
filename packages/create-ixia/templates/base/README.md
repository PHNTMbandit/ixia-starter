# {{projectName}}

A full-stack React application built with TanStack Start, Ixia UI, and Vite+.

## Getting Started

Requires Node.js 24 or newer and pnpm.

```sh
vp install
vp dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Coding-agent instructions

`AGENTS.md` is the shared project guide for coding agents. `CLAUDE.md` and
`GEMINI.md` import it for Claude Code and Gemini CLI, and
`.github/copilot-instructions.md` provides Copilot guidance. Update
`AGENTS.md` as the project evolves.

## Commands

| Command | Description |
| --- | --- |
| `vp dev` | Start the development server |
| `vp build` | Build for production |
| `vp preview` | Preview the production build |
| `vp check` | Format, lint, and type-check the project |

## Project Structure

- `src/routes/` — file-based routes and pages
- `src/components/` — shared UI components
- `src/features/` — feature-specific modules
- `src/hooks/` — React hooks
- `src/lib/` — shared libraries and integrations
- `src/styles/` — global styles
