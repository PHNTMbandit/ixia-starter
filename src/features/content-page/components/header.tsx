import { cn } from 'ixia-ui-react/utils'

import { useContentPage } from '../context'

function HeaderRoot({ className, ...props }: React.ComponentProps<'header'>) {
  return (
    <header
      className={cn('flex flex-col gap-sm border-b border-border pb-lg', className)}
      {...props}
    />
  )
}

function Actions({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex shrink-0 items-center gap-2xs', className)} {...props} />
}

function Category({ className, children, ...props }: React.ComponentProps<'span'>) {
  const { page } = useContentPage()
  return (
    <span className={cn('style-text-default--1 text-brand-default', className)} {...props}>
      {children ?? page.category}
    </span>
  )
}

function Description({ className, ...props }: React.ComponentProps<'p'>) {
  return <p className={cn('style-text-prose-1 text-on-surface-variant', className)} {...props} />
}

function Heading({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex items-center justify-between', className)} {...props} />
}

function Links({ className, ...props }: React.ComponentProps<'div'>) {
  return <div className={cn('flex gap-xs', className)} {...props} />
}

function Title({ className, children, ...props }: React.ComponentProps<'h1'>) {
  return (
    <h1
      className={cn('min-w-0 style-text-strong-3 wrap-break-word text-on-surface', className)}
      {...props}
    >
      {children}
    </h1>
  )
}

/** Also usable alone, without a page provider; only `Category` needs one. */
const ContentPageHeader = Object.assign(HeaderRoot, {
  Actions,
  Category,
  Description,
  Heading,
  Links,
  Title,
})

export { ContentPageHeader }
