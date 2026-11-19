# Markdown Full (MDX)

Pages are written as `.mdx` files in `content/` and compiled at build time by
[Content Collections](https://www.content-collections.dev/docs/content/mdx). Compilation
produces a ready-to-render `mdx` string and a `headings` list for each page, so nothing is
compiled in the browser. Pages can use React components as JSX tags.

- `content/*.mdx`: your pages, each with `title` and `description` front matter and an optional `order`.
- `content-collections.ts`: the collection definition and front-matter schema.
- `src/features/markdown-full/`: the `Mdx` renderer and build-time helpers. See its README.
- `src/features/content-page/`: the page header, table of contents, pagination, copy button and code blocks.
- `src/routes/content.$slug.tsx`: serves `content/<slug>.mdx` at `/content/<slug>`.

```tsx
import { allPages } from 'content-collections'

import { Mdx } from '@/features/markdown-full'

const page = allPages.find((item) => item.slug === 'hello')

// <Mdx code={page.mdx} components={{ Alert }} />
```

Register components used as JSX tags through `components`. Don't `import` shared UI inside `.mdx`
files: Content Collections bundles those imports into every page.

Looking for plain Markdown without a build step? Re-run `create-ixia` and choose Lite instead.
