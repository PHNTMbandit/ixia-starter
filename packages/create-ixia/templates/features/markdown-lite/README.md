# Markdown Lite (TanStack Markdown)

Plain Markdown rendered at runtime with [TanStack Markdown](https://tanstack.com/markdown). There is
no build step and no content pipeline: give `Markdown` any string.

- `src/content/pages.ts`: sample pages as plain objects. Replace it with a CMS, database or files.
- `src/features/markdown-lite/`: the `Markdown` renderer and `parseMarkdownDocument`. See its README.
- `src/features/content-page/`: the page header, table of contents, pagination, copy button and code blocks.
- `src/routes/content.$slug.tsx`: serves each page at `/content/<slug>`.

```tsx
import { Markdown } from '@/features/markdown-lite'

// <Markdown content={page.content} />
```

Callouts (`> [!TIP]`) and TanStack's comment components are supported. There is no JSX in
content: if you need React components inside your pages, re-run `create-ixia` and choose Full (MDX).
