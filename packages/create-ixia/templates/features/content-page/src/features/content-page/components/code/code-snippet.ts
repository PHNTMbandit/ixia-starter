import { isValidElement } from 'react'

const TRAILING_NEWLINE = /\n$/

interface CodeSnippet {
  /** Plain source for copying, without highlighting markup. */
  text: string
  className?: string
  /** The code element's children: a string, or highlighted token spans. */
  children: React.ReactNode
}

function getText(node: React.ReactNode): string {
  if (typeof node === 'string' || typeof node === 'number') {
    return String(node)
  }
  if (Array.isArray(node)) {
    return node.map(getText).join('')
  }
  if (isValidElement<{ children?: React.ReactNode }>(node)) {
    return getText(node.props.children)
  }
  return ''
}

/** Reads the `code` element MDX and Markdown render inside a `pre`, highlighted or not. */
function getCodeSnippet(children: React.ReactNode): CodeSnippet | undefined {
  if (!isValidElement<React.ComponentProps<'code'>>(children)) {
    return undefined
  }

  const text = getText(children.props.children).replace(TRAILING_NEWLINE, '')
  if (!text) {
    return undefined
  }
  return { children: children.props.children, className: children.props.className, text }
}

export { getCodeSnippet, type CodeSnippet }
