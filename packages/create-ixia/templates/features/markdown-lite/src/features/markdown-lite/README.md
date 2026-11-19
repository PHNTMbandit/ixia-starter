# Markdown Lite

Render plain Markdown with [TanStack Markdown](https://tanstack.com/markdown) and Ixia UI styling.
It has no build step and no content pipeline, and it has no dependency on any routes.

**Lite or Full?** Pick one per project.

|                 | Lite (this feature)                         | Full (Markdown Full)                          |
| --------------- | ------------------------------------------- | --------------------------------------------- |
| Format          | Markdown, callouts, comment components      | MDX: Markdown plus JSX tags                   |
| Compiled        | At render time, from a string               | At build time, by Content Collections         |
| Build setup     | None                                        | Vite plugin and `content-collections.ts`      |
| Content sources | Anything that gives you a string            | `.mdx` files in `content/`                    |
| Use it for      | CMS or database text, docs without React UI | Docs and marketing pages with live components |

Both pair with Content Page (`@/features/content-page`) for the page header, table of contents,
pagination, copy button, and code blocks.

## Public API

Import from `@/features/markdown-lite`:

- `Markdown`: render a markdown string or a parsed `MarkdownDocument` via `content`.
- `parseMarkdownDocument`: parse with TanStack's heading, callout, and comment-component
  extensions. Use the same document for rendering and the table of contents.
- Types: `MarkdownProps`, `MarkdownDocument`, `MarkdownHeading`, `MarkdownComponents`.

```tsx
import { ContentPage } from '@/features/content-page'
import type { ContentPageData } from '@/features/content-page'
import { Markdown, parseMarkdownDocument } from '@/features/markdown-lite'

// The React Compiler memoizes this, so no `useMemo` is needed.
function Article({ page }: { page: ContentPageData }) {
  const document = parseMarkdownDocument(page.content)

  return (
    <ContentPage page={page} headings={document.headings ?? []}>
      <Markdown content={document} />
      <ContentPage.TableOfContents />
    </ContentPage>
  )
}
```

## Custom rendering

Pass `components` to override HTML elements. Keep application-specific component
registries and router links in the consuming feature rather than in this module.
Default links are ordinary anchors, so rendering works without a router provider.
To give fenced code a copy button, register Content Page's code block:
`components={{ pre: ContentCodeBlock }}`.

TanStack's native comment-component syntax is enabled:

```markdown
<!-- ::separator -->

<!-- ::start:notice title="Note" -->

This body supports **markdown**.
<!-- ::end:notice -->

> [!TIP]
> Callouts are enabled too.
```

Comment nodes are rendered through the `md-comment-component` entry, **not** an
`html` handler. The renderer receives `data-component`, JSON-encoded
`data-attributes`, and rendered `children`. Validate attributes before using them
as UI props.

```tsx
import { Separator } from 'ixia-ui-react/separator'

import { Markdown, type MarkdownComponents } from '@/features/markdown-lite'

function CustomComponent(props: {
  'data-component': string
  'data-attributes': string
  children?: React.ReactNode
}) {
  if (props['data-component'] === 'separator') {
    return <Separator />
  }
  if (props['data-component'] === 'notice') {
    return <aside>{props.children}</aside>
  }
  throw new Error(`Unknown markdown component: ${props['data-component']}`)
}

const components = {
  'md-comment-component': CustomComponent,
} satisfies MarkdownComponents

// <Markdown content={content} components={components} />
```

Callouts render as `div.markdown-alert` with title/content children, not as
blockquotes. JSX and JavaScript imports in `.mdx` files are not evaluated by this
renderer. If you need JSX in your content, use Markdown Full instead.

## Structure

- `components/markdown.tsx`: renderer and default element styling.
- `utils/parse-markdown.ts`: shared parsing configuration.
- `index.ts`: the feature's single public entry point.

The CLI installs this feature at `src/features/markdown-lite`, without another `src`
directory inside it.
