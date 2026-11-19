import { rehypeHighlightCodeBlocks } from '@tanstack/highlight/rehype'
import type { RehypeHighlightOptions } from '@tanstack/highlight/rehype'

import { highlighter } from './highlighter'

/**
 * Build-time rehype plugin: replaces every `pre > code.language-*` with highlighted markup.
 * Fences choose line numbers themselves, for example `tsx lineNumbers`.
 * Pass it to `compileMdxDocument(context, document, { rehypePlugins: [highlightRehype] })`.
 * It is a `[plugin, options]` pair because unified calls plugins with their options.
 */
const highlightRehype: [typeof rehypeHighlightCodeBlocks, RehypeHighlightOptions] = [
  rehypeHighlightCodeBlocks,
  { highlighter },
]

export { highlightRehype }
