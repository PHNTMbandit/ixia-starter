import { defineCollection, defineConfig } from '@content-collections/core'
import { z } from 'zod'

import { compileMdxDocument } from './src/features/markdown-full/utils/compile-mdx'
// #if highlight
import { highlightRehype } from './src/features/highlight/utils/rehype-highlight'
// #endif

// #if highlight
const compileOptions = { rehypePlugins: [highlightRehype] }
// #else
const compileOptions = {}
// #endif

// oxlint-disable no-underscore-dangle -- `_meta` is Content Collections' file metadata field.
// Every `.mdx` file in `content/` becomes an entry in `allPages` (from `content-collections`).
const pages = defineCollection({
  directory: 'content',
  include: '**/*.mdx',
  name: 'pages',
  schema: z.object({
    content: z.string(),
    description: z.string(),
    order: z.number().optional(),
    title: z.string(),
  }),
  transform: async (document, context) => ({
    ...document,
    ...(await compileMdxDocument(context, document, compileOptions)),
    slug: document._meta.path,
  }),
})

export default defineConfig({ content: [pages] })
