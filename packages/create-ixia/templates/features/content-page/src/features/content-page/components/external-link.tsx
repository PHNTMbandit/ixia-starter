import { Button } from 'ixia-ui-react/button'

type ContentPageExternalLinkProps = Omit<React.ComponentProps<typeof Button>, 'render'> & {
  href: string
}

/** A small outline button that opens `href` in a new tab. */
function ContentPageExternalLink({ href, ...props }: ContentPageExternalLinkProps) {
  return (
    <Button
      size="small"
      tone="neutral"
      variant="outline"
      nativeButton={false}
      // oxlint-disable-next-line jsx-a11y/prefer-tag-over-role -- Renders an <a>; overrides Base UI's role="button".
      role="link"
      // oxlint-disable-next-line jsx-a11y/control-has-associated-label -- Button renders its children inside the anchor.
      render={<a href={href} target="_blank" rel="noopener noreferrer" />}
      {...props}
    />
  )
}

export { ContentPageExternalLink, type ContentPageExternalLinkProps }
