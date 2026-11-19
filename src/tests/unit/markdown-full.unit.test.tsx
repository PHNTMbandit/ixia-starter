import type { Context } from '@content-collections/core'
import type { Options } from '@content-collections/mdx'
import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { Button } from 'ixia-ui-react/button'
// oxlint-disable-next-line vitest/no-importing-vitest-globals -- Explicit imports provide types.
import { describe, expect, it, vi } from 'vite-plus/test'

import { ContentCodeBlock, ContentCodeExample } from '@/features/content-page'
import { highlightRehype } from '@/features/highlight/utils/rehype-highlight'
import { Mdx } from '@/features/markdown-full'
import type { MdxDocument } from '@/features/markdown-full/utils/compile-mdx'

// The compiler only asks the cache to run the build and return its result.
const cache: Context['cache'] = async (input, build) => build(input),
  components = { Button, CodeExample: ContentCodeExample, pre: ContentCodeBlock }

function compileOptions(highlight: boolean): Options {
  const options: Options = {}
  if (highlight) {
    options.rehypePlugins = [highlightRehype]
  }
  return options
}

function renderWithClipboard(mdx: string, writeText: (text: string) => Promise<void>) {
  vi.stubGlobal('navigator', { clipboard: { writeText } })
  return render(<Mdx code={mdx} components={components} />)
}

async function compile(content: string, highlight = false) {
  // Esbuild, which compiles MDX, rejects jsdom's Uint8Array. Restore Node's before it loads.
  globalThis.Uint8Array = Object.getPrototypeOf(new TextEncoder().encode('')).constructor
  const { compileMdxDocument } = await import('@/features/markdown-full/utils/compile-mdx'),
    document: MdxDocument = {
      _meta: {
        directory: '.',
        extension: 'mdx',
        fileName: 'page.mdx',
        filePath: 'page.mdx',
        path: 'page',
      },
      content,
    },
    options = compileOptions(highlight),
    { mdx } = await compileMdxDocument({ cache }, document, options)
  return mdx
}

describe('code previews', () => {
  it('renders a preview fence as Code and Preview tabs without a paragraph around the JSX', async () => {
    expect.hasAssertions()
    const code =
        '<Button variant="primary">Click Me</Button>\n<Button variant="outline">Button</Button>',
      mdx = await compile(`\`\`\`tsx preview\n${code}\n\`\`\`\n`),
      { container } = render(<Mdx code={mdx} components={components} />)

    expect(
      [...container.querySelectorAll('[role="tab"]')].map((tab) => tab.textContent),
    ).toStrictEqual(['Code', 'Preview'])
    expect(screen.queryByRole('button', { name: 'Click Me' })).not.toBeInTheDocument()
    fireEvent.click(screen.getByRole('tab', { name: 'Preview' }))

    expect(screen.getByRole('button', { name: 'Click Me' }).closest('p')).toBeNull()
    expect(screen.getByRole('button', { name: 'Button' })).toBeInTheDocument()
  })

  it('shows a plain fence as one headerless code window that is never executed', async () => {
    expect.hasAssertions()
    const mdx = await compile('```tsx\n<Button>Not rendered</Button>\n```\n')

    render(<Mdx code={mdx} components={components} />)

    expect(screen.queryByRole('tablist')).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: 'Not rendered' })).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /copy/i })).toBeInTheDocument()
  })

  it('keeps highlighting inside the example and copies plain source', async () => {
    expect.hasAssertions()
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined),
      source = '<Button variant="primary">Click Me</Button>',
      mdx = await compile(`\`\`\`tsx preview\n${source}\n\`\`\`\n`, true),
      { container } = renderWithClipboard(mdx, writeText)

    try {
      expect(container.querySelector('.th-token.th-tag')).toHaveTextContent('Button')
      expect(container.querySelectorAll('pre')).toHaveLength(1)
      fireEvent.click(screen.getByRole('button', { name: /copy/i }))
      await waitFor(() => expect(writeText).toHaveBeenCalledWith(source))
    } finally {
      vi.unstubAllGlobals()
    }
  })

  it('copies highlighted fences with line numbers as the original lines', async () => {
    expect.hasAssertions()
    const writeText = vi.fn<(text: string) => Promise<void>>().mockResolvedValue(undefined),
      mdx = await compile('```ts lineNumbers\nconst a = 1\nconst b = 2\n```\n', true),
      { container } = renderWithClipboard(mdx, writeText)

    try {
      expect(container.querySelectorAll('.th-line')).toHaveLength(2)
      fireEvent.click(screen.getByRole('button', { name: /copy/i }))
      await waitFor(() => expect(writeText).toHaveBeenCalledWith('const a = 1\nconst b = 2'))
    } finally {
      vi.unstubAllGlobals()
    }
  })
})
