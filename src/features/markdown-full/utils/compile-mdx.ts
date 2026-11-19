import type { Context, Meta } from '@content-collections/core'
import { compileMDX } from '@content-collections/mdx'
import type { Options } from '@content-collections/mdx'
import remarkGfm from 'remark-gfm'

import { remarkCodePreview } from './code-preview'
import { extractMdxHeadings, remarkHeadingIds } from './mdx-headings'
import type { MdxHeading } from './mdx-headings'

interface MdxDocument {
  _meta: Meta
  content: string
}

// oxlint-disable-next-line typescript/consistent-type-definitions -- Must stay serializable for content-collections.
type CompiledMdx = {
  mdx: string
  headings: MdxHeading[]
}

async function compileMdxDocument(
  context: Pick<Context, 'cache'>,
  document: MdxDocument,
  { remarkPlugins = [], ...options }: Options = {},
): Promise<CompiledMdx> {
  const mdx = await compileMDX(context, document, {
    ...options,
    remarkPlugins: [remarkGfm, remarkHeadingIds, remarkCodePreview, ...remarkPlugins],
  })

  return { headings: extractMdxHeadings(document.content), mdx }
}

export { compileMdxDocument, type CompiledMdx, type MdxDocument }
