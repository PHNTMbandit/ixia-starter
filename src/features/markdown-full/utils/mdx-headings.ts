import GithubSlugger from 'github-slugger'
import type { Root } from 'mdast'
import { toString as nodeToString } from 'mdast-util-to-string'
import remarkGfm from 'remark-gfm'
import remarkParse from 'remark-parse'
import { unified } from 'unified'
import { visit } from 'unist-util-visit'

// oxlint-disable-next-line typescript/consistent-type-definitions
type MdxHeading = {
  id: string
  text: string
  level: number
}

interface HeadingIdOptions {
  onHeading?: (heading: MdxHeading) => void
}

interface HeadingProperties {
  hProperties?: Record<string, unknown>
}

function remarkHeadingIds({ onHeading }: HeadingIdOptions = {}) {
  return (tree: Root) => {
    const slugger = new GithubSlugger()
    visit(tree, 'heading', (node) => {
      const text = nodeToString(node),
        id = slugger.slug(text),
        data: HeadingProperties = node.data ?? {}
      node.data = { ...data, hProperties: { ...data.hProperties, id } }
      onHeading?.({ id, level: node.depth, text })
    })
  }
}

function extractMdxHeadings(content: string): MdxHeading[] {
  const headings: MdxHeading[] = [],
    processor = unified()
      .use(remarkParse)
      .use(remarkGfm)
      .use(remarkHeadingIds, {
        onHeading: (heading) => headings.push(heading),
      })

  processor.runSync(processor.parse(content))
  return headings
}

export { extractMdxHeadings, remarkHeadingIds, type MdxHeading }
