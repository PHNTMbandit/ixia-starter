import { TableOfContents } from 'ixia-ui-react/table-of-contents'

import { useContentPage } from '../context'
import type { ContentHeading } from '../types'

type ContentTableOfContentsProps = React.ComponentProps<typeof TableOfContents> & {
  headings: readonly ContentHeading[]
}

const ITEM_DEPTH = { 2: 1, 3: 2, 4: 3 } as const

function renderEntries(entries: readonly ContentHeading[]): React.ReactNode[] {
  return entries.flatMap((entry) => {
    if (!entry.id || (entry.level !== 2 && entry.level !== 3 && entry.level !== 4)) {
      return []
    }

    return [
      <TableOfContents.Item
        key={entry.id}
        className="min-w-0 truncate"
        depth={ITEM_DEPTH[entry.level]}
        targetId={entry.id}
        title={entry.text}
      >
        {entry.text}
      </TableOfContents.Item>,
    ]
  })
}

/**
 * Lists h2-h4 headings from any source. Positioning and visibility belong to the caller.
 * Renders nothing when there are no headings.
 */
function ContentTableOfContents({
  headings,
  children,
  ref,
  ...props
}: ContentTableOfContentsProps) {
  const entries = renderEntries(headings)

  if (entries.length === 0) {
    return undefined
  }

  return (
    // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Ixia renders a div without a polymorphic root.
    <TableOfContents role="navigation" aria-label="Table of contents" ref={ref} {...props}>
      {children}
      <TableOfContents.List>{entries}</TableOfContents.List>
    </TableOfContents>
  )
}

/** The current page's headings. Keyed by slug so its state resets when navigating. */
function ContentPageTableOfContents(props: Omit<ContentTableOfContentsProps, 'headings'>) {
  const { headings, page } = useContentPage()
  return <ContentTableOfContents key={page.slug} headings={headings} {...props} />
}

export { ContentPageTableOfContents, ContentTableOfContents, type ContentTableOfContentsProps }
