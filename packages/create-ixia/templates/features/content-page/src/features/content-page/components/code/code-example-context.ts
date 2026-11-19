import { createContext } from 'react'

/** True while a code example renders its source, so the code block doesn't add its own window. */
const CodeExampleContext = createContext(false)

export { CodeExampleContext }
