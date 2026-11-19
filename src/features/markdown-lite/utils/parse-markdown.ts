import { docsMarkdownExtensions } from '@tanstack/markdown/extensions/docs'
import { parseMarkdown } from '@tanstack/markdown/parser'

function parseMarkdownDocument(content: string) {
  return parseMarkdown(content, { extensions: docsMarkdownExtensions() })
}

export { parseMarkdownDocument }
