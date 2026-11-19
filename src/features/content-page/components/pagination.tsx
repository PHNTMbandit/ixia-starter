import { CaretLeftIcon, CaretRightIcon } from '@phosphor-icons/react/dist/ssr'
import { Button } from 'ixia-ui-react/button'
import { ButtonGroup } from 'ixia-ui-react/button-group'

import { useContentPage } from '../context'
import type { ContentPageData } from '../types'

type PaginationLinkProps = Omit<React.ComponentProps<typeof Button>, 'render'>

function PaginationRoot(props: React.ComponentProps<typeof ButtonGroup>) {
  return <ButtonGroup variant="secondary" tone="neutral" {...props} />
}

function PaginationLink({ page, ...props }: PaginationLinkProps & { page?: ContentPageData }) {
  const { link } = useContentPage()
  if (!page) {
    return <Button {...props} disabled nativeButton />
  }
  if (!link) {
    throw new Error('ContentPage.Pagination requires a `link` prop on <ContentPage>.')
  }
  return (
    <Button
      title={page.title}
      nativeButton={false}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- The rendered element is a navigation link.
      role="link"
      render={link(page)}
      {...props}
    />
  )
}

function Next({ children, ...props }: PaginationLinkProps) {
  const { next } = useContentPage()
  return (
    <PaginationLink aria-label="Next page" page={next} {...props}>
      {children ?? <CaretRightIcon />}
    </PaginationLink>
  )
}

function Previous({ children, ...props }: PaginationLinkProps) {
  const { previous } = useContentPage()
  return (
    <PaginationLink aria-label="Previous page" page={previous} {...props}>
      {children ?? <CaretLeftIcon />}
    </PaginationLink>
  )
}

const ContentPagePagination = Object.assign(PaginationRoot, { Next, Previous })

export { ContentPagePagination }
