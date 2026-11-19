# Syntax highlighting

Code blocks in your `.mdx` pages are highlighted when the pages compile, using
[TanStack Highlight](https://tanstack.com/highlight/latest/docs/guides/markdown-pipelines). The
browser downloads no highlighter and no grammars.

- `content-collections.ts`: passes the `highlightRehype` plugin to `compileMdxDocument`.
- `src/routes/__root.tsx`: renders `<HighlightTheme />` for light and dark colors.
- `src/features/highlight/`: the highlighter, its languages and the theme. See its README.

Add a language by importing it in `src/features/highlight/utils/highlighter.ts`. Line numbers are
opt-in per fence, for example ` ```tsx lineNumbers `.
