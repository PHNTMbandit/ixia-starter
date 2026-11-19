import { createFileRoute, Link, notFound } from '@tanstack/react-router'
import { allPages } from 'content-collections'
import { Alert } from 'ixia-ui-react/alert'

import { ContentCodeBlock, ContentPage } from '@/features/content-page'
import type { ContentPageData } from '@/features/content-page'
import { Mdx } from '@/features/markdown-full'

// Renders `content/<slug>.mdx` at `/content/<slug>`.
export const Route = createFileRoute('/content/$slug')({
  component: ContentRoute,
  loader: ({ params }) => {
    const page = allPages.find((item) => item.slug === params.slug)
    if (!page) {
      throw notFound()
    }
    return page
  },
})

// Components used as JSX tags in `.mdx` files are registered here, not imported in the files.
const components = { Alert, pre: ContentCodeBlock }

function link(page: ContentPageData) {
  return <Link to="/content/$slug" params={{ slug: page.slug }} />
}

function ContentRoute() {
  const page = Route.useLoaderData()

  return (
    <ContentPage
      page={page}
      pages={allPages}
      link={link}
      className="mx-auto flex w-full max-w-[48rem] flex-col gap-lg px-md py-lg"
    >
      <ContentPage.Header>
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
      <Mdx code={page.mdx} components={components} />
      <ContentPage.TableOfContents className="fixed top-[8rem] right-[2rem] hidden 2xl:block" />
    </ContentPage>
  )
}
