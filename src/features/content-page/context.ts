import { createContext, use } from 'react'

import type { ContentPageContextValue } from './types'

const ContentPageContext = createContext<ContentPageContextValue | undefined>(undefined)

function useContentPage() {
  const context = use(ContentPageContext)
  if (!context) {
    throw new Error('ContentPage parts must be used within <ContentPage>.')
  }
  return context
}

export { ContentPageContext, useContentPage }
