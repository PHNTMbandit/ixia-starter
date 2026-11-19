# Highlight

Build-time syntax highlighting for Markdown Full (MDX) code blocks, using
[TanStack Highlight](https://tanstack.com/highlight/latest/docs/guides/markdown-pipelines)'s
rehype plugin. Code is tokenized once while pages compile, so the browser ships no highlighter
and no language grammars. Fences in languages it doesn't know render as plain text.

It needs [Markdown Full](../markdown-full/README.md), whose `compileMdxDocument` accepts the plugin.
Markdown Lite renders at runtime and would use TanStack Markdown's own highlighter adapter instead.

## Setup

Pass the plugin when pages compile, in `content-collections.ts`:

```ts
import { highlightRehype } from './src/features/highlight/utils/rehype-highlight'

const compiled = await compileMdxDocument(context, document, {
  rehypePlugins: [highlightRehype],
})
```

Render the theme once in your root document:

```tsx
import { HighlightTheme } from '@/features/highlight'

// <body><HighlightTheme />…</body>
```

React hoists its style into `<head>` and deduplicates it, so it can sit anywhere in the root document.

`ContentCodeBlock` from Content Page already displays highlighted code and copies it as plain text.

## Using it

Fence titles, line numbers and highlighted lines come from the fence's meta string, for example
`tsx lineNumbers`. See the
[plugin options](https://tanstack.com/highlight/latest/docs/guides/markdown-pipelines#rehype).

- Add a language: import it from `@tanstack/highlight/languages/<name>` in `utils/highlighter.ts`.
- Change colors: swap the themes in `utils/theme-css.ts`. Light uses `:root`; dark uses `.dark`.

## Structure

- `utils/highlighter.ts`: the highlighter and its languages (build time).
- `utils/rehype-highlight.ts`: the rehype plugin (build time, Node only).
- `utils/theme-css.ts`: the generated theme CSS.
- `components/highlight-theme.tsx`: renders the theme CSS.
- `index.ts`: the browser-safe entry point. It exports only `HighlightTheme`, so importing it never
  pulls the highlighter into the client bundle.

The CLI installs this feature at `src/features/highlight` and wires both setup steps for you.
