import { defineConfig } from 'vite-plus/pack'

export default defineConfig({ deps: { 
    // tsdown <0.23 compatibility: resolve external dependency subpaths.
    // Remove to preserve subpath imports as written (the new default).
    // https://tsdown.dev/options/dependencies#deps-resolvedepsubpath
    resolveDepSubpath: true },
  clean: true,
  entry: ['src/index.ts'],
  format: 'esm',
  target: 'node24',
})
