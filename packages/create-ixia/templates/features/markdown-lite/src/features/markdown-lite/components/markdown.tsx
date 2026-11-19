// oxlint-disable id-length

import type { MarkdownDocument } from '@tanstack/markdown'
import { Markdown as ReactMarkdown } from '@tanstack/markdown/react'
import type { MarkdownComponents } from '@tanstack/markdown/react'

import { parseMarkdownDocument } from '../utils/parse-markdown'

interface MarkdownProps {
  content: string | MarkdownDocument
  className?: string
  components?: Partial<MarkdownComponents>
}

const components = {
  a: ({ children, href, ...props }) => (
    <a
      href={href}
      className="font-semibold hover:underline"
      style={{ color: 'var(--color-brand-primary)' }}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: ({ children }) => (
    <blockquote
      className="my-md border-l-4 py-sm pl-lg italic opacity-75"
      style={{ borderColor: 'var(--color-brand-border-strong)' }}
    >
      {children}
    </blockquote>
  ),
  code: ({ children }) => (
    <code
      className="p-xs font-body text-sm"
      style={{
        backgroundColor: 'var(--color-surface-secondary, rgba(0, 0, 0, 0.05))',
        color: 'var(--color-text-default)',
      }}
    >
      {children}
    </code>
  ),
  h1: ({ children, ...props }) => (
    <h1 className="mt-lg mb-md text-3xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }) => (
    <h2 className="mt-lg mb-md text-2xl font-bold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }) => (
    <h3 className="mt-md mb-sm text-xl font-bold" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }) => (
    <h4 className="mt-md mb-sm text-lg font-semibold" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }) => (
    <h5 className="mt-sm mb-xs text-base font-semibold" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }) => (
    <h6 className="mt-sm mb-xs text-sm font-semibold" {...props}>
      {children}
    </h6>
  ),
  img: ({ alt, ...props }) => (
    <img
      {...props}
      alt={alt ?? ''}
      className="my-md h-auto max-w-full"
      loading="lazy"
      style={{ borderRadius: '0.5rem' }}
    />
  ),
  li: ({ children }) => <li className="my-xs">{children}</li>,
  ol: ({ children }) => <ol className="my-md list-inside list-decimal space-y-xs">{children}</ol>,
  p: ({ children }) => <p className="my-sm leading-relaxed">{children}</p>,
  pre: ({ children }) => (
    <pre
      className="my-md overflow-x-auto p-lg text-sm"
      style={{
        backgroundColor: 'var(--color-surface-muted, rgba(0, 0, 0, 0.08))',
        borderRadius: '0.5rem',
      }}
    >
      {children}
    </pre>
  ),
  table: ({ children }) => (
    <div className="my-md overflow-x-auto">
      <table
        className="w-full border-collapse border"
        style={{ borderColor: 'var(--color-border-strong, rgba(0, 0, 0, 0.1))' }}
      >
        {children}
      </table>
    </div>
  ),
  tbody: ({ children }) => <tbody>{children}</tbody>,
  td: ({ children }) => <td className="px-md py-sm">{children}</td>,
  th: ({ children }) => <th className="px-md py-sm text-left">{children}</th>,
  thead: ({ children }) => (
    <thead className="font-bold" style={{ backgroundColor: 'var(--color-surface-secondary)' }}>
      {children}
    </thead>
  ),
  tr: ({ children }) => (
    <tr
      className="border-b"
      style={{ borderColor: 'var(--color-border-strong, rgba(0, 0, 0, 0.1))' }}
    >
      {children}
    </tr>
  ),
  ul: ({ children }) => <ul className="my-md list-inside list-disc space-y-xs">{children}</ul>,
} satisfies MarkdownComponents

function toDocument(content: string | MarkdownDocument) {
  if (typeof content === 'string') {
    return parseMarkdownDocument(content)
  }
  return content
}

function Markdown({ content, className, components: customComponents }: MarkdownProps) {
  const document = toDocument(content),
    mergedComponents = { ...components, ...customComponents } satisfies MarkdownComponents

  return (
    <div className={className}>
      <ReactMarkdown components={mergedComponents} headingAnchors>
        {document}
      </ReactMarkdown>
    </div>
  )
}

export { Markdown, type MarkdownProps }
