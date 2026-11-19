interface ContentHeading {
  id: string
  text: string
  level: number
}

/** The minimum a page needs to work with every ContentPage part. Extra fields are fine. */
interface ContentPageData {
  slug: string
  title: string
  /** Raw source, copied by `ContentPage.Copy`. */
  content: string
  category?: string
  description?: string
  /** Sorts pagination ascending; unordered pages follow in collection order. */
  order?: number
  headings?: readonly ContentHeading[]
}

/** Renders the router link for a previous/next page, e.g. `<Link to="/docs/$slug" params={{ slug }} />`. */
type ContentPageLink = (page: ContentPageData) => React.ReactElement

type ContentPageProps = React.ComponentProps<'article'> & {
  page: ContentPageData
  /** Every page in the collection; required for previous/next navigation. */
  pages?: readonly ContentPageData[]
  /** Required by `ContentPage.Pagination`. */
  link?: ContentPageLink
  /** Overrides `page.headings`, for example headings parsed from Markdown at render time. */
  headings?: readonly ContentHeading[]
}

interface ContentPageContextValue {
  page: ContentPageData
  headings: readonly ContentHeading[]
  previous?: ContentPageData
  next?: ContentPageData
  link?: ContentPageLink
}

export type {
  ContentHeading,
  ContentPageContextValue,
  ContentPageData,
  ContentPageLink,
  ContentPageProps,
}
