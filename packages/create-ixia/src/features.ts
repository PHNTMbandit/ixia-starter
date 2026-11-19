/**
 * The feature registry is the single source of truth for everything the CLI can
 * add to a generated project. Each feature declares the npm dependencies it
 * needs, the env vars it relies on, the template directory its files live in,
 * any post-scaffold setup commands, and the other features it requires.
 *
 * To add a new feature: append an entry here and drop its files in
 * `templates/features/<id>/`. The prompt list and scaffolding read from this
 * registry automatically.
 */

export type FeatureId =
  | 'auth'
  | 'commit-tooling'
  | 'content-page'
  | 'dark-mode'
  | 'github-actions'
  | 'highlight'
  | 'localization'
  | 'markdown-full'
  | 'markdown-lite'
  | 'neon-drizzle'
  | 'storybook'
  | 'testing'

export type FeatureGroupId = 'markdown'

/** Features in a group are alternatives: a project gets at most one of them. */
export const FEATURE_GROUPS: Record<FeatureGroupId, { message: string; none: string }> = {
  markdown: { message: 'How should content pages be written?', none: 'None' },
}

export interface Feature {
  id: FeatureId
  /** Short label shown in the multiselect prompt. */
  label: string
  /** One-line explanation shown as prompt hint. */
  hint: string
  /** Pre-selected in the prompt when true. */
  recommended?: boolean
  /** Added only as a dependency of other features; not offered in the prompt. */
  hidden?: boolean
  /** Mutually exclusive with the other features in the group; chosen with a single select. */
  group?: FeatureGroupId
  /** Other features that must be enabled for this one to work. */
  requires?: FeatureId[]
  /** Runtime deps added to the generated package.json. */
  dependencies?: Record<string, string>
  /** Dev deps added to the generated package.json. */
  devDependencies?: Record<string, string>
  /** Scripts merged into the generated package.json. */
  scripts?: Record<string, string>
  /** Env keys appended to the generated .env-template. */
  env?: { key: string; comment?: string; value?: string }[]
  /** Template folder under templates/features/<templateDir>. */
  templateDir?: string
  /** Human-readable follow-up steps printed after scaffolding. */
  postInstallNotes?: string[]
}

export const FEATURES: Feature[] = [
  {
    dependencies: {
      '@better-auth/drizzle-adapter': '^1.7.25',
      'better-auth': '^1.7.25',
    },
    env: [
      {
        comment: 'Base URL of your app (used for callbacks)',
        key: 'BETTER_AUTH_URL',
        value: 'http://localhost:3000',
      },
      {
        comment: 'Random secret — generate with: openssl rand -base64 32',
        key: 'BETTER_AUTH_SECRET',
        value: '',
      },
    ],
    hint: 'Email/password + sessions, protected routes',
    id: 'auth',
    label: 'Authentication (Better Auth)',
    postInstallNotes: [
      'Set BETTER_AUTH_URL and BETTER_AUTH_SECRET in `.env` (generate the secret with `openssl rand -base64 32`).',
      'Generate auth tables: `vp dlx auth@latest generate`, then `vp run db:push`.',
    ],
    recommended: true,
    requires: ['neon-drizzle', 'localization', 'dark-mode'],
    templateDir: 'auth',
  },
  {
    devDependencies: {
      '@commitlint/cli': '^21.2.4',
      '@commitlint/config-conventional': '^21.2.4',
      commitizen: '^4.3.2',
      'cz-conventional-changelog': '^3.3.0',
    },
    hint: 'Commitizen, commitlint, and conventional commits',
    id: 'commit-tooling',
    label: 'Commit tooling',
    scripts: {
      commit: 'git add . && git commit',
      cz: 'cz',
    },
    templateDir: 'commit-tooling',
  },
  {
    hidden: true,
    hint: 'Page header, table of contents, pagination, copy button and code blocks',
    id: 'content-page',
    label: 'Content page',
    templateDir: 'content-page',
  },
  {
    hint: 'SSR-safe light/dark/system theme with persistence',
    id: 'dark-mode',
    label: 'Dark mode / theming',
    recommended: true,
    templateDir: 'dark-mode',
  },
  {
    hint: 'PR workflow: format, lint, test, build',
    id: 'github-actions',
    label: 'GitHub Actions CI',
    templateDir: 'github-actions',
  },
  {
    dependencies: {
      '@tanstack/highlight': '^1.2.12',
    },
    hint: 'Build-time code highlighting for MDX, with light and dark themes (needs Markdown Full)',
    id: 'highlight',
    label: 'Syntax highlighting (TanStack Highlight)',
    postInstallNotes: [
      'Fences are highlighted when pages compile; add languages in `src/features/highlight/utils/highlighter.ts`.',
      'Opt a fence into line numbers with its meta string, for example ```tsx lineNumbers.',
    ],
    requires: ['markdown-full'],
    templateDir: 'highlight',
  },
  {
    dependencies: {
      '@inlang/paraglide-js-react': '^1.0.4',
    },
    devDependencies: {
      '@inlang/paraglide-js': '^3.2.2',
    },
    hint: 'Compiled, type-safe i18n (English + Japanese to start)',
    id: 'localization',
    label: 'Localization (Paraglide)',
    postInstallNotes: [
      'Edit translations in `messages/<locale>.json`; add locales in project.inlang/settings.json.',
    ],
    recommended: true,
    templateDir: 'localization',
  },
  {
    dependencies: {
      '@tanstack/markdown': '1.2.0',
    },
    group: 'markdown',
    hint: 'Plain Markdown rendered at runtime from any string. No build step, no JSX.',
    id: 'markdown-lite',
    label: 'Lite: TanStack Markdown',
    postInstallNotes: [
      'Render a string with `<Markdown content={page.content} />` from `@/features/markdown-lite`.',
      'Sample pages live in `src/content/pages.ts` and are served at `/content/<slug>`.',
      'Need JSX components inside your content? Choose Markdown Full (MDX) instead.',
    ],
    requires: ['content-page'],
    templateDir: 'markdown-lite',
  },
  {
    dependencies: {
      '@content-collections/mdx': '^0.2.2',
    },
    devDependencies: {
      '@content-collections/core': '^0.15.3',
      '@content-collections/vite': '^0.3.1',
      '@types/mdast': '^4.0.4',
      'github-slugger': '^2.0.0',
      'mdast-util-to-string': '^4.0.0',
      'remark-gfm': '^4.0.1',
      'remark-parse': '^11.0.0',
      unified: '^11.0.5',
      'unist-util-visit': '^5.2.0',
    },
    group: 'markdown',
    hint: 'MDX pages with React components, compiled at build time by Content Collections',
    id: 'markdown-full',
    label: 'Full: MDX (Content Collections)',
    postInstallNotes: [
      'Add `.mdx` files to `content/`; they are served at `/content/<file-name>` by `src/routes/content.$slug.tsx`.',
      'Render a compiled page with `<Mdx code={page.mdx} />` from `@/features/markdown-full`.',
      'Register components used as JSX tags through the `components` prop; MDX `import` statements are bundled at build time.',
      'Edit `content-collections.ts` to add collections or change the front-matter schema.',
    ],
    requires: ['content-page'],
    templateDir: 'markdown-full',
  },
  {
    dependencies: {
      '@neondatabase/serverless': '^1.2.1',
      'drizzle-orm': '^0.45.4',
      pg: '^8.23.1',
    },
    devDependencies: {
      '@types/pg': '^8.23.1',
      dotenv: '^18.0.10',
      'drizzle-kit': '0.31.11',
    },
    env: [
      {
        comment: 'Neon Postgres connection string — https://neon.tech',
        key: 'DATABASE_URL',
        value: 'postgresql://user:password@your-neon-host.neon.tech/dbname?sslmode=require',
      },
    ],
    hint: 'Serverless Postgres with type-safe queries and migrations',
    id: 'neon-drizzle',
    label: 'Neon DB + Drizzle ORM',
    postInstallNotes: [
      'Create `.env` from `.env-template` (`cp .env-template .env`) and set DATABASE_URL to your Neon connection string.',
      'Run `vp run db:generate` then `vp run db:push` to create your schema.',
    ],
    recommended: true,
    scripts: {
      'db:generate': 'drizzle-kit generate',
      'db:migrate': 'drizzle-kit migrate',
      'db:pull': 'drizzle-kit pull',
      'db:push': 'drizzle-kit push',
      'db:studio': 'drizzle-kit studio',
    },
    templateDir: 'neon-drizzle',
  },
  {
    devDependencies: {
      '@storybook/addon-a11y': '^10.6.7',
      '@storybook/addon-docs': '^10.6.7',
      '@storybook/addon-themes': '^10.6.7',
      '@storybook/addon-vitest': '^10.6.7',
      '@storybook/react-vite': '^10.6.7',
      '@vitest/browser-playwright': 'catalog:',
      playwright: '^1.65.1',
      storybook: '^10.6.7',
    },
    hint: 'Component development and visual testing',
    id: 'storybook',
    label: 'Storybook',
    scripts: {
      'build-storybook': 'storybook build',
      storybook: 'storybook dev -p 6006',
    },
    templateDir: 'storybook',
  },
  {
    devDependencies: {
      '@testing-library/dom': '^10.4.2',
      '@testing-library/jest-dom': '^7.0.1',
      '@testing-library/react': '^16.3.3',
      jsdom: '^31.0.1',
      playwright: '^1.65.1',
    },
    hint: 'Unit and browser tests with Testing Library',
    id: 'testing',
    label: 'Testing (Vitest + Playwright)',
    recommended: true,
    scripts: {
      test: 'vp test',
    },
    templateDir: 'testing',
  },
]

export const FEATURE_BY_ID: Record<FeatureId, Feature> = Object.fromEntries(
  FEATURES.map((feature) => [feature.id, feature]),
) as Record<FeatureId, Feature>

/**
 * Expand a user's selection to include any required dependencies (e.g. auth
 * pulls in neon-drizzle). Returns the full, de-duplicated set.
 */
export function resolveSelection(selected: FeatureId[]): FeatureId[] {
  const resolved = new Set<FeatureId>(),
    visit = (id: FeatureId) => {
      if (resolved.has(id)) {
        return
      }
      resolved.add(id)
      for (const required of FEATURE_BY_ID[id].requires ?? []) {
        visit(required)
      }
    }

  for (const id of selected) {
    visit(id)
  }

  for (const group of Object.keys(FEATURE_GROUPS)) {
    const chosen = FEATURES.filter((feature) => feature.group === group && resolved.has(feature.id))
    if (chosen.length > 1) {
      throw new Error(
        `Choose only one of: ${chosen.map((feature) => feature.id).join(', ')}. They overlap.`,
      )
    }
  }

  return FEATURES.filter((feature) => resolved.has(feature.id)).map((feature) => feature.id)
}
