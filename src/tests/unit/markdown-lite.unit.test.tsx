import { render, screen } from '@testing-library/react'
// oxlint-disable-next-line vitest/no-importing-vitest-globals -- Explicit imports provide types.
import { describe, expect, it, vi } from 'vite-plus/test'

import { ContentCodeBlock, ContentTableOfContents } from '@/features/content-page'
import { Markdown, parseMarkdownDocument } from '@/features/markdown-lite'
import type { MarkdownComponents } from '@/features/markdown-lite'

const EMPTY_HEADINGS: NonNullable<ReturnType<typeof parseMarkdownDocument>['headings']> = []

// JSDOM has no layout observers, which the table of contents needs.
class LayoutObserverMock {
  observe = vi.fn<(target: Element) => void>()
  unobserve = vi.fn<(target: Element) => void>()
  disconnect = vi.fn<() => void>()
}

describe('markdown lite', () => {
  it('renders without a router, with heading ids that a table of contents can target', () => {
    expect.hasAssertions()
    try {
      vi.stubGlobal('ResizeObserver', LayoutObserverMock)
      vi.stubGlobal('IntersectionObserver', LayoutObserverMock)
      const document = parseMarkdownDocument(
          '# Title\n\n## Repeated\n\n### Repeated\n\n[Internal](/guide)',
        ),
        headings = document.headings ?? EMPTY_HEADINGS,
        { container } = render(
          <>
            <Markdown content={document} />
            <ContentTableOfContents headings={headings} aria-label="Contents" />
          </>,
        ),
        targets = [...container.querySelectorAll<HTMLElement>('h2, h3')]

      expect(new Set(targets.map((target) => target.id)).size).toBe(2)
      expect(screen.getAllByRole('button', { name: 'Repeated' })).toHaveLength(2)
      expect(screen.getByRole('link', { name: 'Internal' })).toHaveAttribute('href', '/guide')
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('accepts a string and a parsed document alike', () => {
    expect.hasAssertions()
    const { rerender } = render(<Markdown content="## From a string" />)

    expect(screen.getByRole('heading', { name: 'From a string' })).toBeInTheDocument()
    rerender(<Markdown content={parseMarkdownDocument('## From a document')} />)
    expect(screen.getByRole('heading', { name: 'From a document' })).toBeInTheDocument()
  })

  it('supports native comment components and callouts rather than an HTML handler', () => {
    expect.hasAssertions()
    const content =
        '<!-- ::start:notice title="Notice" -->\n**Important**\n<!-- ::end:notice -->\n\n> [!TIP]\n> Remember this.',
      components = {
        'md-comment-component': (props: {
          'data-component': string
          'data-attributes': string
          children?: React.ReactNode
        }) => (
          <aside aria-label={props['data-component']} data-attributes={props['data-attributes']}>
            {props.children}
          </aside>
        ),
      } satisfies MarkdownComponents,
      { container } = render(<Markdown content={content} components={components} />)

    expect(screen.getByRole('complementary', { name: 'notice' })).toHaveTextContent('Important')
    expect(screen.getByRole('complementary', { name: 'notice' })).toHaveAttribute(
      'data-attributes',
      '{"title":"Notice"}',
    )
    expect(container.querySelector('.markdown-alert-tip')).toHaveTextContent('Remember this.')
  })

  it('gives fenced code a copy action through the shared code block', () => {
    expect.hasAssertions()
    render(
      <Markdown content={'```ts\nconst answer = 42\n```'} components={{ pre: ContentCodeBlock }} />,
    )

    expect(screen.getByText('const answer = 42')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })
})
