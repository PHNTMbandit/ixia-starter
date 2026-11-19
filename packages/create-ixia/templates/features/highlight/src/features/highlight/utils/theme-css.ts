import { createThemeCss } from '@tanstack/highlight/theme'
import { githubDarkTheme } from '@tanstack/highlight/themes/github-dark'
import { githubLightTheme } from '@tanstack/highlight/themes/github-light'

// The surrounding code window owns the background and spacing, so the block itself stays bare.
const BARE_BLOCK = 'pre.th-code { margin: 0; padding: 0; background: transparent; }',
  highlightThemeCss = `${createThemeCss({
    dark: githubDarkTheme,
    darkSelector: '.dark',
    light: githubLightTheme,
    lightSelector: ':root',
  })}\n${BARE_BLOCK}`

export { highlightThemeCss }
