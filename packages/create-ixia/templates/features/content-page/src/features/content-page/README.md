# Content Page

A compound page layout shared by Markdown Lite and
Markdown Full. It works with any content source: it needs a page
object, not a renderer or a router.

## Public API

Import from `@/features/content-page`:

```tsx
import { ContentPage } from '@/features/content-page'

;<ContentPage
  page={page}
  pages={pages}
  link={(item) => <Link to="/docs/$slug" params={{ slug: item.slug }} />}
>
  <ContentPage.Header>
    <ContentPage.Header.Category />
    <ContentPage.Header.Heading>
      <ContentPage.Header.Title>{page.title}</ContentPage.Header.Title>
      <ContentPage.Header.Actions>
        <ContentPage.Copy />
        <ContentPage.Pagination>
          <ContentPage.Pagination.Previous />
          <ContentPage.Pagination.Next />
        </ContentPage.Pagination>
      </ContentPage.Header.Actions>
    </ContentPage.Header.Heading>
    <ContentPage.Header.Description>{page.description}</ContentPage.Header.Description>
  </ContentPage.Header>
  {/* <Markdown content={page.content} /> or <Mdx code={page.mdx} /> */}
  <ContentPage.TableOfContents />
</ContentPage>
```

- `ContentPage`: the root. `page` needs `slug`, `title`, and `content` (raw source); `category`,
  `description`, `order`, and `headings` are optional. `pages` enables previous/next, `link` renders
  their router links, and `headings` overrides `page.headings`.
- `ContentPage.Header` (`Category`, `Heading`, `Title`, `Actions`, `Description`, `Links`), also
  exported alone as `ContentPageHeader`; only `Category` needs a page.
- `ContentPage.Pagination` with `Previous` and `Next`. Pages sort by `order`; unordered pages follow in
  collection order. Boundaries render disabled buttons. It requires `link`.
- `ContentPage.Copy`: copies the page's source with Ixia's `CopyButton` and a "Copy page" label. For
  any other string, use `CopyButton` from `ixia-ui-react/copy-button` directly.
- `ContentPage.TableOfContents`: the page's h2-h4 headings, keyed by slug so it resets when navigating.
  It adds no positioning; pass `className` for that.
- `ContentPage.ExternalLink`: a small outline button opening a URL in a new tab.
- `ContentTableOfContents`: the same list for any headings.
- `ContentCodeBlock`: a `pre` replacement for Markdown and MDX with a headerless code window and a copy
  action. Fenced source is displayed as text, not executed. Syntax-highlighted fences (see Highlight)
  keep their markup and are copied as plain text. It needs `ixia-ui-react@2.2.3` or newer, where the
  first item is the default.
- `ContentCodeExample`: Code and Preview tabs for a ` ```tsx preview ` fence, with `ContentCodeExample.Preview`
  holding the live JSX. Register it as `CodeExample` (see Markdown Full); both parts are generated.
- `ContentPreview`: a bordered row for live examples written by hand inside MDX.
- `useContentPage()`: the current page, headings, and neighbors, inside `ContentPage`.

`link` keeps the layout router-agnostic. It receives the neighbor page and returns the element Ixia's
`Button` renders, for example TanStack Router's `Link`.

## Structure

- `components/`: one file per part; `root.tsx` provides the context and neighbors.
- `components/code/`: the code block, code example (with its `Preview` part) and live preview row.
- `context.ts` and `types.ts`: the context hook and the page data types.
- `index.ts`: the feature's single public entry point.

The CLI installs this feature at `src/features/content-page` whenever Markdown Lite or Full is selected.
