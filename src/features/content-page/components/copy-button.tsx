import { CheckIcon, CopyIcon } from '@phosphor-icons/react/dist/ssr'
import { CopyButton } from 'ixia-ui-react/copy-button'

import { useContentPage } from '../context'

type ContentPageCopyProps = Omit<React.ComponentProps<typeof CopyButton>, 'children' | 'content'>

function ContentPageCopy(props: ContentPageCopyProps) {
  const { page } = useContentPage()

  return (
    <CopyButton {...props} content={page.content} variant="secondary" tone="neutral">
      {(copied: boolean) => {
        if (copied) {
          return (
            <>
              <CheckIcon /> Copy page
            </>
          )
        }
        return (
          <>
            <CopyIcon /> Copy page
          </>
        )
      }}
    </CopyButton>
  )
}

export { ContentPageCopy, type ContentPageCopyProps }
