import { access, glob, mkdir, mkdtemp, readFile, readdir, rm, writeFile } from 'node:fs/promises'
import { tmpdir } from 'node:os'
import path from 'node:path'

// oxlint-disable-next-line vitest/no-importing-vitest-globals -- Explicit imports provide types.
import { describe, expect, it } from 'vite-plus/test'

import { FEATURES, resolveSelection } from '../../../packages/create-ixia/src/features'
import type { FeatureId } from '../../../packages/create-ixia/src/features'
import { scaffold } from '../../../packages/create-ixia/src/scaffold'

const templatesDir = path.resolve(import.meta.dirname, '../../../packages/create-ixia/templates'),
  OBSOLETE_UI = /from\s+['"]ixia-ui-react['"]|form\.FormErrors|field\.FieldInputGroup/

async function generate(features: FeatureId[]) {
  const targetDir = await mkdtemp(path.join(tmpdir(), 'ixia-content-scaffold-'))
  await scaffold({
    features: resolveSelection(features),
    projectName: 'content-check',
    targetDir,
    templatesDir,
  })
  return targetDir
}

async function readJson(file: string): Promise<unknown> {
  return JSON.parse(await readFile(file, 'utf8'))
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function dependencyVersions(value: unknown): Record<string, string> {
  if (!isRecord(value)) {
    throw new Error('Invalid package.json')
  }
  const versions: Record<string, string> = {}
  for (const section of ['dependencies', 'devDependencies'] as const) {
    const dependencies = value[section]
    if (!isRecord(dependencies)) {
      throw new Error(`Missing ${section}`)
    }
    for (const [name, version] of Object.entries(dependencies)) {
      if (typeof version !== 'string') {
        throw new Error(`Invalid version for ${name}`)
      }
      versions[name] = version
    }
  }
  return versions
}

function catalog(workspace: string): string | undefined {
  return /^catalog:\n(?<entries>[\s\S]*?)(?=^\S)/m.exec(workspace.replaceAll('\r\n', '\n'))?.groups
    ?.entries
}

function guardMatches(workflow: string, name: string, cwd: string): Promise<boolean> {
  const condition = new RegExp(
      `- name: ${name}\\s+if: \\$\\{\\{\\s*hashFiles\\(([^)]+)\\)\\s*!=\\s*''\\s*\\}\\}`,
    ).exec(workflow),
    patterns = condition?.[1].match(/'[^']+'/g)
  if (!patterns) {
    throw new Error(`Missing file guard for ${name}`)
  }
  return glob(
    patterns.map((pattern) => pattern.slice(1, -1)),
    { cwd },
  )
    .next()
    .then(({ done }) => !done)
}

describe('scaffold dependency versions', () => {
  it.each<{ features: FeatureId[]; label: string }>([
    {
      features: FEATURES.filter((feature) => feature.id !== 'markdown-lite').map(
        (feature) => feature.id,
      ),
      label: 'with Markdown Full',
    },
    { features: ['markdown-lite'], label: 'with Markdown Lite' },
  ])('matches root versions $label', async ({ features }) => {
    expect.hasAssertions()
    const targetDir = await generate(features),
      repositoryDir = path.resolve(import.meta.dirname, '../../..')

    try {
      const [generated, root] = await Promise.all([
          readJson(path.join(targetDir, 'package.json')),
          readJson(path.join(repositoryDir, 'package.json')),
        ]),
        rootVersions = dependencyVersions(root),
        generatedVersions = dependencyVersions(generated),
        sharedNames = Object.keys(generatedVersions).filter((name) => name in rootVersions),
        [generatedWorkspace, rootWorkspace] = await Promise.all([
          readFile(path.join(targetDir, 'pnpm-workspace.yaml'), 'utf8'),
          readFile(path.join(repositoryDir, 'pnpm-workspace.yaml'), 'utf8'),
        ])

      expect(sharedNames.length).toBeGreaterThan(0)
      expect(
        Object.fromEntries(sharedNames.map((name) => [name, generatedVersions[name]])),
      ).toStrictEqual(Object.fromEntries(sharedNames.map((name) => [name, rootVersions[name]])))

      expect(catalog(generatedWorkspace)).toBeDefined()
      expect(catalog(generatedWorkspace)).toBe(catalog(rootWorkspace))
    } finally {
      await rm(targetDir, { force: true, recursive: true })
    }
  })
})

describe('markdown lite and full scaffolding', () => {
  it.each<{ features: FeatureId[]; flavor: 'markdown-full' | 'markdown-lite'; other: string }>([
    { features: ['markdown-lite'], flavor: 'markdown-lite', other: 'markdown-full' },
    { features: ['markdown-lite', 'dark-mode'], flavor: 'markdown-lite', other: 'markdown-full' },
    { features: ['markdown-lite', 'auth'], flavor: 'markdown-lite', other: 'markdown-full' },
    { features: ['markdown-full'], flavor: 'markdown-full', other: 'markdown-lite' },
    { features: ['markdown-full', 'auth'], flavor: 'markdown-full', other: 'markdown-lite' },
  ])(
    'installs $flavor with the shared content page for $features',
    async ({ features, flavor, other }) => {
      expect.hasAssertions()
      const targetDir = await generate(features),
        read = (file: string) => readFile(path.join(targetDir, file), 'utf8')

      try {
        const viteConfig = await read('vite.config.ts'),
          packageJson = await readJson(path.join(targetDir, 'package.json')),
          flavorFiles = await readdir(path.join(targetDir, 'src/features', flavor), {
            recursive: true,
          }),
          srcTree = await readdir(path.join(targetDir, 'src'), { recursive: true }),
          sharedSources = srcTree.filter((name) =>
            /^features[\\/](?<feature>content-page|markdown-lite|markdown-full)[\\/].*\.tsx?$/.test(
              name,
            ),
          )

        await Promise.all(
          [
            'src/features/content-page/index.ts',
            `src/features/${flavor}/index.ts`,
            'src/routes/content.$slug.tsx',
          ].map((file) => access(path.join(targetDir, file))),
        )
        await expect(access(path.join(targetDir, 'src/features', other))).rejects.toThrow(/ENOENT/)

        expect(viteConfig).not.toContain('#if')
        expect(viteConfig.includes('contentCollections()')).toBe(flavor === 'markdown-full')
        expect(flavorFiles).not.toContain('src')
        expect({
          full: JSON.stringify(packageJson).includes('@content-collections/mdx'),
          lite: JSON.stringify(packageJson).includes('@tanstack/markdown'),
        }).toStrictEqual({
          full: flavor === 'markdown-full',
          lite: flavor === 'markdown-lite',
        })

        for (const file of sharedSources) {
          // oxlint-disable-next-line no-await-in-loop -- Few small files; keeps failures attributable.
          await expect(read(path.join('src', file))).resolves.not.toMatch(
            /features\/docs|@tanstack\/react-router|content-collections'/,
          )
        }
        for (const file of srcTree.filter((name) => /\.tsx?$/.test(name))) {
          // oxlint-disable-next-line no-await-in-loop -- Few small files; keeps failures attributable.
          await expect(read(path.join('src', file))).resolves.not.toMatch(OBSOLETE_UI)
        }
      } finally {
        await rm(targetDir, { force: true, recursive: true })
      }
    },
  )

  it('offers Lite and Full as a single choice and adds the shared page layout', () => {
    expect.hasAssertions()
    expect(resolveSelection(['markdown-lite'])).toStrictEqual(['content-page', 'markdown-lite'])
    expect(resolveSelection(['markdown-full'])).toStrictEqual(['content-page', 'markdown-full'])
    expect(() => resolveSelection(['markdown-lite', 'markdown-full'])).toThrow(/only one of/)
    expect(FEATURES.find((feature) => feature.id === 'content-page')).toMatchObject({
      hidden: true,
    })
  })
})

describe('highlight scaffolding', () => {
  it('requires Markdown Full and rejects Lite', () => {
    expect.hasAssertions()
    expect(resolveSelection(['highlight'])).toStrictEqual([
      'content-page',
      'highlight',
      'markdown-full',
    ])
    expect(() => resolveSelection(['highlight', 'markdown-lite'])).toThrow(/only one of/)
  })

  it('wires the highlighter into the root, content collections and package', async () => {
    expect.hasAssertions()
    const targetDir = await generate(['highlight']),
      read = (file: string) => readFile(path.join(targetDir, file), 'utf8')

    try {
      const root = await read('src/routes/__root.tsx'),
        collections = await read('content-collections.ts'),
        packageJson = JSON.stringify(await readJson(path.join(targetDir, 'package.json')))

      expect(root).toContain('<HighlightTheme />')
      expect(collections).toContain('rehypePlugins: [highlightRehype]')
      expect(packageJson).toContain('@tanstack/highlight')
      expect(`${root}${collections}`).not.toMatch(/#(?:if|else|endif)/)
      await expect(
        access(path.join(targetDir, 'src/features/highlight/index.ts')),
      ).resolves.toBeUndefined()
    } finally {
      await rm(targetDir, { force: true, recursive: true })
    }
  })

  it('leaves the highlighter out of projects without it', async () => {
    expect.hasAssertions()
    const targetDir = await generate(['markdown-full']),
      read = (file: string) => readFile(path.join(targetDir, file), 'utf8')

    try {
      const root = await read('src/routes/__root.tsx'),
        collections = await read('content-collections.ts'),
        packageJson = JSON.stringify(await readJson(path.join(targetDir, 'package.json')))

      expect({
        compileOptions: collections.includes(
          'compileMdxDocument(context, document, compileOptions)',
        ),
        dependency: packageJson.includes('@tanstack/highlight'),
        plugin: collections.includes('highlight'),
        theme: root.includes('HighlightTheme'),
      }).toStrictEqual({
        compileOptions: true,
        dependency: false,
        plugin: false,
        theme: false,
      })
      expect(`${root}${collections}`).not.toMatch(/#(?:if|else|endif)/)
      await expect(access(path.join(targetDir, 'src/features/highlight'))).rejects.toThrow(/ENOENT/)
    } finally {
      await rm(targetDir, { force: true, recursive: true })
    }
  })
})

describe('coding-agent instructions', () => {
  it.each<{ features: FeatureId[]; label: string }>([
    { features: [], label: 'without optional features' },
    { features: ['auth', 'highlight'], label: 'with optional features' },
  ])('provides usable guidance $label', async ({ features }) => {
    expect.hasAssertions()
    const targetDir = await generate(features),
      read = (file: string) => readFile(path.join(targetDir, file), 'utf8')

    try {
      const [agents, claude, gemini, copilot, readme] = await Promise.all([
        read('AGENTS.md'),
        read('CLAUDE.md'),
        read('GEMINI.md'),
        read('.github/copilot-instructions.md'),
        read('README.md'),
      ])

      expect(agents).toContain('README.md')
      expect(agents).not.toContain('packages/create-ixia')
      expect({ claude, gemini }).toStrictEqual({
        claude: expect.stringMatching(/^@(?:\.\/)?AGENTS\.md\s*$/),
        gemini: expect.stringMatching(/^@(?:\.\/)?AGENTS\.md\s*$/),
      })
      expect(copilot).toMatch(/follow.*AGENTS\.md/i)
      expect(readme).toContain('AGENTS.md')
    } finally {
      await rm(targetDir, { force: true, recursive: true })
    }
  })
})

describe('github actions scaffolding', () => {
  it.each<{
    features: FeatureId[]
    label: string
    localization: boolean
    playwright: boolean
    tests: boolean
  }>([
    {
      features: ['github-actions'],
      label: 'without optional dependencies',
      localization: false,
      playwright: false,
      tests: false,
    },
    {
      features: ['github-actions', 'testing'],
      label: 'with testing but no tests',
      localization: false,
      playwright: true,
      tests: false,
    },
    {
      features: ['github-actions', 'storybook'],
      label: 'with Storybook',
      localization: false,
      playwright: true,
      tests: true,
    },
    {
      features: ['github-actions', 'localization', 'storybook', 'testing'],
      label: 'with optional dependencies',
      localization: true,
      playwright: true,
      tests: true,
    },
  ])('keeps the generated workflow in sync $label', async (scenario) => {
    expect.hasAssertions()
    const targetDir = await generate(scenario.features),
      repositoryDir = path.resolve(import.meta.dirname, '../../..')

    try {
      if (scenario.playwright) {
        const playwrightDir = path.join(targetDir, 'node_modules/playwright')
        await mkdir(playwrightDir, { recursive: true })
        await writeFile(path.join(playwrightDir, 'package.json'), '{}')
      }

      const [generated, repository] = await Promise.all([
          readFile(path.join(targetDir, '.github/workflows/ci.yml'), 'utf8'),
          readFile(path.join(repositoryDir, '.github/workflows/ci.yml'), 'utf8'),
        ]),
        [localization, playwright, tests, generatedCli, repositoryCli] = await Promise.all([
          guardMatches(generated, 'Generate Paraglide messages', targetDir),
          guardMatches(generated, 'Install Playwright Browsers', targetDir),
          guardMatches(generated, 'Test code', targetDir),
          guardMatches(generated, 'Build create-ixia', targetDir),
          guardMatches(repository, 'Build create-ixia', repositoryDir),
        ])

      expect(generated.replaceAll('\r\n', '\n')).toBe(repository.replaceAll('\r\n', '\n'))
      expect({ generatedCli, localization, playwright, repositoryCli, tests }).toStrictEqual({
        generatedCli: false,
        localization: scenario.localization,
        playwright: scenario.playwright,
        repositoryCli: true,
        tests: scenario.tests,
      })
      await expect(access(path.join(targetDir, '.github/workflows/merge-pr.yml'))).rejects.toThrow(
        /ENOENT/,
      )
    } finally {
      await rm(targetDir, { force: true, recursive: true })
    }
  })

  it('does not add CI when the feature is not selected', async () => {
    expect.hasAssertions()
    const targetDir = await generate([])

    try {
      await expect(access(path.join(targetDir, '.github/workflows/ci.yml'))).rejects.toThrow(
        /ENOENT/,
      )
    } finally {
      await rm(targetDir, { force: true, recursive: true })
    }
  })
})
