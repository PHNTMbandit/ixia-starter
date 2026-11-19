# Markdown Full

Render MDX compiled at build time by [Content Collections](https://www.content-collections.dev/docs/content/mdx),
with Ixia UI styling. Pages can contain JSX tags. It has no dependency on any routes or page metadata.

**Lite or Full?** Pick one per project.

|                 | Lite (Markdown Lite)                        | Full (this feature)                           |
| --------------- | ------------------------------------------- | --------------------------------------------- |
| Format          | Markdown, callouts, comment components      | MDX: Markdown plus JSX tags                   |
| Compiled        | At render time, from a string               | At build time, by Content Collections         |
| Build setup     | None                                        | Vite plugin and `content-collections.ts`      |
| Content sources | Anything that gives you a string            | `.mdx` files in `content/`                    |
| Use it for      | CMS or database text, docs without React UI | Docs and marketing pages with live components |

Both pair with Content Page (`@/features/content-page`) for the page header, table of contents,
pagination, copy button, and code blocks.

## Public API

Import from `@/features/markdown-full`:

- `Mdx`: renders compiled output with default element styling. Pass the page's `mdx` string as `code`
  and extra components through `components`.
- Types: `MdxProps`, `MdxComponents`, `MdxHeading`.

Build-time only, imported from `content-collections.ts` and never from application code:

- `compileMdxDocument(context, document, options?)` in `utils/compile-mdx.ts`. It wraps
  `compileMDX` with GitHub Flavored Markdown and heading ids, and returns `{ mdx, headings }`.
  `options` are the `@content-collections/mdx` options; extra remark plugins run after the defaults.

```ts
import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

import { compileMdxDocument } from './src/features/markdown-full/utils/compile-mdx'

const pages = defineCollection({
  directory: 'content',
  include: '*.mdx',
  name: 'pages',
  schema: z.object({ content: z.string(), title: z.string() }),
  transform: async (document, context) => ({
    ...document,
    ...(await compileMdxDocument(context, document)),
    slug: document._meta.path,
  }),
})

export default defineConfig({ content: [pages] })
```

```tsx
import { allPages } from 'content-collections'

import { Mdx } from '@/features/markdown-full'

// Page: allPages.find((item) => item.slug === slug)
;<Mdx code={page.mdx} components={{ Callout }} />
```

## Components in MDX

Content Collections bundles every `import` in an `.mdx` file into that page's compiled code.
Don't import shared UI there. Register it through `components` instead, then use it as a JSX tag:

```mdx
<Callout tone="info">Registered through the `components` prop.</Callout>
```

Compound components work too, such as `<Alert.Title>` when `Alert` is registered.
Fenced code blocks render as `pre > code.language-*`. Register Content Page's code block with
`components={{ pre: ContentCodeBlock }}` to give them a copy button, and `Preview: ContentPreview`
for a bordered live-example row.

## Live code examples

A `tsx` or `jsx` fence with the `preview` flag compiles into a `<CodeExample>` element that holds the
fence itself and a `<CodeExample.Preview>` with its JSX (`remarkCodePreview`, included in
`compileMdxDocument`):

````mdx
```tsx preview
<Button variant="primary">Click Me</Button>
```
````

Register `CodeExample: ContentCodeExample` along with every component the example uses
(here `Button`). Without the flag, the fence stays a plain code block. Because the fence stays in the
tree, plugins that run later, such as Highlight, still process it.

Preview JSX does not receive Markdown paragraph wrappers, including inside compound components.
Use explicit `<p>` elements when the example needs paragraphs.

## Extra plugins

`compileMdxDocument(context, document, options)` takes the `@content-collections/mdx` options. Rehype
plugins pass straight through, for example Highlight's `rehypePlugins: [highlightRehype]`.

## Headings

`headings` is a list of `{ id, text, level }` for every heading, and the same ids are set on the
rendered headings. `ContentPage.TableOfContents` reads it from the page automatically.

## Structure

- `components/mdx.tsx`: renderer and default element styling.
- `utils/compile-mdx.ts`: the build-time compile wrapper (Node only).
- `utils/code-preview.ts`: the remark plugin behind `tsx preview` fences.
- `utils/mdx-headings.ts`: heading ids and heading extraction shared by compile and the TOC data.
- `index.ts`: the feature's public entry point for application code.

The CLI installs this feature at `src/features/markdown-full`.
