// oxlint-disable id-length
import { MDXContent } from '@content-collections/mdx/react'

type MdxComponents = NonNullable<React.ComponentProps<typeof MDXContent>['components']>

interface MdxProps {
  /** Compiled output from `compileMdxDocument`, usually `page.mdx`. */
  code: string
  className?: string
  /** Extra or replacement components, such as ones used as JSX tags in the MDX source. */
  components?: MdxComponents
}

const defaultComponents = {
  a: ({ children, ...props }: React.ComponentProps<'a'>) => (
    <a
      className="font-semibold hover:underline"
      style={{ color: 'var(--color-brand-primary)' }}
      {...props}
    >
      {children}
    </a>
  ),
  blockquote: (props: React.ComponentProps<'blockquote'>) => (
    <blockquote
      className="my-md border-l-4 py-sm pl-lg italic opacity-75"
      style={{ borderColor: 'var(--color-brand-border-strong)' }}
      {...props}
    />
  ),
  code: (props: React.ComponentProps<'code'>) => (
    <code
      className="p-xs font-body text-sm"
      style={{
        backgroundColor: 'var(--color-surface-secondary, rgba(0, 0, 0, 0.05))',
        color: 'var(--color-text-default)',
      }}
      {...props}
    />
  ),
  h1: ({ children, ...props }: React.ComponentProps<'h1'>) => (
    <h1 className="mt-lg mb-md text-3xl font-bold" {...props}>
      {children}
    </h1>
  ),
  h2: ({ children, ...props }: React.ComponentProps<'h2'>) => (
    <h2 className="mt-lg mb-md text-2xl font-bold" {...props}>
      {children}
    </h2>
  ),
  h3: ({ children, ...props }: React.ComponentProps<'h3'>) => (
    <h3 className="mt-md mb-sm text-xl font-bold" {...props}>
      {children}
    </h3>
  ),
  h4: ({ children, ...props }: React.ComponentProps<'h4'>) => (
    <h4 className="mt-md mb-sm text-lg font-semibold" {...props}>
      {children}
    </h4>
  ),
  h5: ({ children, ...props }: React.ComponentProps<'h5'>) => (
    <h5 className="mt-sm mb-xs text-base font-semibold" {...props}>
      {children}
    </h5>
  ),
  h6: ({ children, ...props }: React.ComponentProps<'h6'>) => (
    <h6 className="mt-sm mb-xs text-sm font-semibold" {...props}>
      {children}
    </h6>
  ),
  img: ({ alt, ...props }: React.ComponentProps<'img'>) => (
    <img
      alt={alt ?? ''}
      className="my-md h-auto max-w-full"
      loading="lazy"
      style={{ borderRadius: '0.5rem' }}
      {...props}
    />
  ),
  li: (props: React.ComponentProps<'li'>) => <li className="my-xs" {...props} />,
  ol: (props: React.ComponentProps<'ol'>) => (
    <ol className="my-md list-inside list-decimal space-y-xs" {...props} />
  ),
  p: (props: React.ComponentProps<'p'>) => <p className="my-sm leading-relaxed" {...props} />,
  pre: (props: React.ComponentProps<'pre'>) => (
    <pre
      className="my-md overflow-x-auto p-lg text-sm"
      style={{
        backgroundColor: 'var(--color-surface-muted, rgba(0, 0, 0, 0.08))',
        borderRadius: '0.5rem',
      }}
      {...props}
    />
  ),
  table: (props: React.ComponentProps<'table'>) => (
    <div className="my-md overflow-x-auto">
      <table
        className="w-full border-collapse border"
        style={{ borderColor: 'var(--color-border-strong, rgba(0, 0, 0, 0.1))' }}
        {...props}
      />
    </div>
  ),
  td: (props: React.ComponentProps<'td'>) => <td className="px-md py-sm" {...props} />,
  th: (props: React.ComponentProps<'th'>) => <th className="px-md py-sm text-left" {...props} />,
  thead: (props: React.ComponentProps<'thead'>) => (
    <thead
      className="font-bold"
      style={{ backgroundColor: 'var(--color-surface-secondary)' }}
      {...props}
    />
  ),
  tr: (props: React.ComponentProps<'tr'>) => (
    <tr
      className="border-b"
      style={{ borderColor: 'var(--color-border-strong, rgba(0, 0, 0, 0.1))' }}
      {...props}
    />
  ),
  ul: (props: React.ComponentProps<'ul'>) => (
    <ul className="my-md list-inside list-disc space-y-xs" {...props} />
  ),
} satisfies MdxComponents

function Mdx({ code, className, components }: MdxProps) {
  return (
    <div className={className}>
      <MDXContent code={code} components={{ ...defaultComponents, ...components }} />
    </div>
  )
}

export { Mdx, type MdxComponents, type MdxProps }
