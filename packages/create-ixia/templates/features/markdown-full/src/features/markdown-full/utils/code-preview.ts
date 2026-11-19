import type { Code, Root, RootContent } from 'mdast'
import type { Processor } from 'unified'
import { SKIP, visit } from 'unist-util-visit'

const PREVIEW_FLAG = /(?:^|\s)preview(?:\s|$)/,
  PREVIEW_LANGUAGES = new Set(['jsx', 'tsx'])

interface MdxJsxElement {
  type: 'mdxJsxFlowElement'
  name: string
  attributes: { type: 'mdxJsxAttribute'; name: string; value: string }[]
  children: unknown[]
}

function isPreviewFence({ lang, meta }: Code) {
  return Boolean(lang && PREVIEW_LANGUAGES.has(lang) && PREVIEW_FLAG.test(meta ?? ''))
}

function isRoot(node: ReturnType<Processor['parse']>): node is Root {
  return node.type === 'root'
}

// Adjacent JSX lines parse as one paragraph, which the page would style as body text.
function unwrapParagraphs(tree: Root) {
  visit(tree, 'paragraph', (node, index, parent) => {
    if (!parent || index === undefined) {
      return undefined
    }

    const siblings: unknown[] = parent.children
    siblings.splice(index, 1, ...node.children)
    return [SKIP, index]
  })
  return tree.children
}

function createElement(name: string, children: unknown[], code?: string): MdxJsxElement {
  const attributes: MdxJsxElement['attributes'] = []
  if (code !== undefined) {
    attributes.push({ name: 'code', type: 'mdxJsxAttribute', value: code })
  }

  return {
    attributes,
    children,
    name,
    type: 'mdxJsxFlowElement',
  }
}

// The fence stays in the tree so later plugins, such as syntax highlighting, still see it.
function createCodeExample(fence: Code, preview: RootContent[]) {
  const meta = fence.meta?.replace(PREVIEW_FLAG, ' ').trim(),
    source: Code = { ...fence, meta: meta || undefined }

  return createElement(
    'CodeExample',
    [source, createElement('CodeExample.Preview', preview)],
    fence.value,
  )
}

function createTransformer(parse: Processor['parse']) {
  return (tree: Root) => {
    visit(tree, 'code', (node, index, parent) => {
      if (!parent || index === undefined || !isPreviewFence(node)) {
        return undefined
      }

      const preview = parse(node.value),
        // The MDX parser yields JSX flow elements that mdast's own types don't list.
        siblings: unknown[] = parent.children
      if (!isRoot(preview)) {
        return undefined
      }

      siblings[index] = createCodeExample(node, unwrapParagraphs(preview))
      return [SKIP, index + 1]
    })
  }
}

/**
 * Turns a `tsx preview` or `jsx preview` fence into a `<CodeExample>` holding the fence itself and
 * a `<CodeExample.Preview>` with the fence's JSX, compiled with the page so the example renders live.
 * Register `CodeExample` (for example `ContentCodeExample`) in the MDX components.
 */
// oxlint-disable no-this-in-exported-function -- Unified binds plugins to their processor.
function remarkCodePreview(this: Processor) {
  return createTransformer(this.parse.bind(this))
}

export { remarkCodePreview }
