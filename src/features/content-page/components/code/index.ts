import { ContentCodeExampleRoot } from './code-example'
import { ContentCodeExamplePreview } from './code-example-preview'

type ContentCodeExampleCompound = typeof ContentCodeExampleRoot & {
  Preview: typeof ContentCodeExamplePreview
}

// Annotated so declaration emit can name the type instead of inlining Ixia's internal prop types.
const ContentCodeExample: ContentCodeExampleCompound = Object.assign(ContentCodeExampleRoot, {
  Preview: ContentCodeExamplePreview,
})

export { ContentCodeExample }
export { ContentCodeBlock } from './code-block'
export { ContentPreview } from './preview'
export type { ContentCodeExampleProps } from './code-example'
