import { CodeBlock } from 'ixia-ui-react/code-block'
import { useContext } from 'react'

import { CodeExampleContext } from './code-example-context'
import { getCodeSnippet } from './code-snippet'

/**
 * A `pre` replacement for Markdown and MDX: one headerless code window with a copy action.
 * It shows highlighted source as-is and copies it as plain text.
 */
function ContentCodeBlock({ children, ...props }: React.ComponentProps<'pre'>) {
  const insideExample = useContext(CodeExampleContext),
    snippet = getCodeSnippet(children)

  if (!snippet) {
    return <pre {...props}>{children}</pre>
  }

  // Rebuilt around the code's own children so a registered `code` component doesn't restyle it.
  const source = (
    <pre {...props}>
      <code className={snippet.className}>{snippet.children}</code>
    </pre>
  )
  if (insideExample) {
    return source
  }

  const items = [{ code: snippet.text, content: source, id: 'code', label: 'Code' }]

  return (
    <CodeBlock items={items} className="my-md">
      <CodeBlock.Window>
        <CodeBlock.Actions>
          <CodeBlock.Copy />
        </CodeBlock.Actions>
      </CodeBlock.Window>
    </CodeBlock>
  )
}

export { ContentCodeBlock }
