/** A bordered, wrapping row for live examples. Register it as an MDX component: `<Preview>`. */
function ContentPreview(props: React.ComponentProps<'div'>) {
  return (
    <div
      className="my-md flex flex-wrap items-center gap-md border p-xs"
      style={{ borderRadius: '0.5rem' }}
      {...props}
    />
  )
}

export { ContentPreview }
