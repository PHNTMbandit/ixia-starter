import { CodeBlock } from 'ixia-ui-react/code-block'
import { useContext } from 'react'

import { CodeExampleContext } from './code-example-context'
import { getCodeSnippet } from './code-snippet'
import type { CodeSnippet } from './code-snippet'

// Rebuilt around the code's own children so a registered `code` component doesn't restyle it.
function renderSource(snippet: CodeSnippet, props: React.ComponentProps<'pre'>) {
  return (
    <pre {...props}>
      <code className={snippet.className}>{snippet.children}</code>
    </pre>
  )
}

function getItems(snippet: CodeSnippet, props: React.ComponentProps<'pre'>) {
  return [{ code: snippet.text, content: renderSource(snippet, props), id: 'code', label: 'Code' }]
}

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

  if (insideExample) {
    return renderSource(snippet, props)
  }

  return (
    <CodeBlock items={getItems(snippet, props)} className="my-md">
      <CodeBlock.Window>
        <CodeBlock.Actions>
          <CodeBlock.Copy />
        </CodeBlock.Actions>
      </CodeBlock.Window>
    </CodeBlock>
  )
}

export { ContentCodeBlock }
