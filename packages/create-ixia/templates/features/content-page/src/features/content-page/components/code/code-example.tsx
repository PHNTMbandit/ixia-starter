import { CodeBlock } from 'ixia-ui-react/code-block'
import { Children, isValidElement } from 'react'

import { CodeExampleContext } from './code-example-context'
import { ContentCodeExamplePreview } from './code-example-preview'

interface ContentCodeExampleProps {
  /** The source copied by the copy action, as written in the fence. */
  code: string
  /** The code block for the Code tab, plus a `CodeExample.Preview` for the Preview tab. */
  children?: React.ReactNode
}

function isPreview(slot: React.ReactNode) {
  return isValidElement(slot) && slot.type === ContentCodeExamplePreview
}

/**
 * Code and Preview tabs for a `tsx preview` fence. Register it as the MDX component
 * `CodeExample`; `remarkCodePreview` generates the element and both of its children.
 */
function ContentCodeExampleRoot({ children, code }: ContentCodeExampleProps) {
  const slots = Children.toArray(children),
    items = [
      {
        code,
        content: (
          <CodeExampleContext value>{slots.filter((slot) => !isPreview(slot))}</CodeExampleContext>
        ),
        id: 'code',
        label: 'Code',
      },
      { code, content: slots.filter(isPreview), id: 'preview', label: 'Preview' },
    ]

  return (
    <CodeBlock items={items} className="my-md">
      <CodeBlock.Header>
        <CodeBlock.Tabs />
      </CodeBlock.Header>
      <CodeBlock.Window>
        <CodeBlock.Actions>
          <CodeBlock.Copy />
        </CodeBlock.Actions>
      </CodeBlock.Window>
    </CodeBlock>
  )
}

export { ContentCodeExampleRoot, type ContentCodeExampleProps }
