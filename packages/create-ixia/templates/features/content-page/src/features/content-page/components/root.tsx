import { ContentPageContext } from '../context'
import type { ContentPageProps } from '../types'

function ContentPageRoot({ page, pages, link, headings, ...props }: ContentPageProps) {
  const orderedPages = pages?.toSorted(
      (left, right) =>
        (left.order ?? Number.MAX_SAFE_INTEGER) - (right.order ?? Number.MAX_SAFE_INTEGER),
    ),
    position = orderedPages?.findIndex((entry) => entry.slug === page.slug) ?? -1

  if (orderedPages && position === -1) {
    throw new Error(`ContentPage "${page.slug}" is missing from its page collection.`)
  }

  return (
    <ContentPageContext
      value={{
        headings: headings ?? page.headings ?? [],
        link,
        next: orderedPages?.[position + 1],
        page,
        previous: orderedPages?.[position - 1],
      }}
    >
      <article {...props} />
    </ContentPageContext>
  )
}

export { ContentPageRoot }
