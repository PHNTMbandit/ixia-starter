import { highlightThemeCss } from '../utils/theme-css'

/**
 * Light and dark token colors. React hoists the style into the document head and renders it once,
 * so it can sit anywhere in the root document.
 */
function HighlightTheme() {
  return (
    <style href="highlight-theme" precedence="default">
      {highlightThemeCss}
    </style>
  )
}

export { HighlightTheme }
