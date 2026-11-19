import { createFileRoute, Link, notFound } from '@tanstack/react-router'

import { pages } from '@/content/pages'
import { ContentCodeBlock, ContentPage } from '@/features/content-page'
import type { ContentPageData } from '@/features/content-page'
import { Markdown, parseMarkdownDocument } from '@/features/markdown-lite'

// Renders the matching entry of `src/content/pages.ts` at `/content/<slug>`.
export const Route = createFileRoute('/content/$slug')({
  component: ContentRoute,
  loader: ({ params }) => {
    const page = pages.find((item) => item.slug === params.slug)
    if (!page) {
      throw notFound()
    }
    return page
  },
})

const components = { pre: ContentCodeBlock }

function link(page: ContentPageData) {
  return <Link to="/content/$slug" params={{ slug: page.slug }} />
}

function ContentRoute() {
  const page = Route.useLoaderData(),
    // Parsed once so the headings match the rendered ids; the React Compiler memoizes it.
    document = parseMarkdownDocument(page.content)

  return (
    <ContentPage
      page={page}
      pages={pages}
      link={link}
      headings={document.headings ?? []}
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
      <Markdown content={document} components={components} />
      <ContentPage.TableOfContents className="fixed top-[8rem] right-[2rem] hidden 2xl:block" />
    </ContentPage>
  )
}
