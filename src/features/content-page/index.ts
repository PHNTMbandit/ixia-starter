import { ContentPageCopy } from './components/copy-button'
import { ContentPageExternalLink } from './components/external-link'
import { ContentPageHeader } from './components/header'
import { ContentPagePagination } from './components/pagination'
import { ContentPageRoot } from './components/root'
import { ContentPageTableOfContents } from './components/table-of-contents'

type ContentPageCompound = typeof ContentPageRoot & {
  Copy: typeof ContentPageCopy
  ExternalLink: typeof ContentPageExternalLink
  Header: typeof ContentPageHeader
  Pagination: typeof ContentPagePagination
  TableOfContents: typeof ContentPageTableOfContents
}

// Annotated so declaration emit can name the type instead of inlining Ixia's internal prop types.
const ContentPage: ContentPageCompound = Object.assign(ContentPageRoot, {
  Copy: ContentPageCopy,
  ExternalLink: ContentPageExternalLink,
  Header: ContentPageHeader,
  Pagination: ContentPagePagination,
  TableOfContents: ContentPageTableOfContents,
})

export { ContentPage }
export { ContentCodeBlock, ContentCodeExample, ContentPreview } from './components/code'
export { ContentPageHeader } from './components/header'
export { ContentTableOfContents } from './components/table-of-contents'
export { useContentPage } from './context'
export type { ContentCodeExampleProps } from './components/code'
export type { ContentTableOfContentsProps } from './components/table-of-contents'
export type { ContentHeading, ContentPageData, ContentPageLink, ContentPageProps } from './types'
