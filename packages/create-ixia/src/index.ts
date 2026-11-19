#!/usr/bin/env node
import { existsSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import {
  cancel,
  intro,
  isCancel,
  multiselect,
  note,
  outro,
  select,
  spinner,
  text,
} from '@clack/prompts'
import pc from 'picocolors'

import { FEATURE_GROUPS, FEATURES, resolveSelection } from './features.js'
import type { FeatureId } from './features.js'
import { collectPostInstallNotes, scaffold } from './scaffold.js'

const templatesDir = path.join(path.dirname(fileURLToPath(import.meta.url)), '..', 'templates')

async function main() {
  console.log()
  intro(pc.bgCyan(pc.black(' create-ixia ')))

  const projectName = await text({
    defaultValue: 'my-ixia-app',
    message: 'Project name?',
    placeholder: 'my-ixia-app',
    validate(value) {
      const name = value?.trim() || 'my-ixia-app'
      if (!/^[a-z0-9-~][a-z0-9-._~]*$/.test(name)) {
        return 'Use a valid npm package name (lowercase, no spaces).'
      }
      return undefined
    },
  })
  if (isCancel(projectName)) {
    return bail()
  }

  const name = projectName.trim() || 'my-ixia-app',
    targetDir = path.resolve(process.cwd(), name)

  if (existsSync(targetDir) && readdirSync(targetDir).length > 0) {
    cancel(`Directory "${name}" already exists and is not empty.`)
    process.exit(1)
  }

  const selectable = FEATURES.filter((feature) => !feature.hidden && !feature.group),
    picked = await multiselect({
      initialValues: selectable.filter((feature) => feature.recommended).map((feature) => feature.id),
      message: 'Which features do you want?',
      options: selectable.map((feature) => ({
        hint: feature.hint,
        label: feature.label,
        value: feature.id,
      })),
      required: false,
    })
  if (isCancel(picked)) {
    return bail()
  }

  // Alternatives, such as Markdown Lite or Full, are a single choice rather than checkboxes.
  for (const [group, { message, none }] of Object.entries(FEATURE_GROUPS)) {
    const choice = await select<FeatureId | 'none'>({
      message,
      options: [
        { label: none, value: 'none' },
        ...FEATURES.filter((feature) => feature.group === group).map((feature) => ({
          hint: feature.hint,
          label: feature.label,
          value: feature.id,
        })),
      ],
    })
    if (isCancel(choice)) {
      return bail()
    }
    if (choice !== 'none') {
      picked.push(choice)
    }
  }

  const features = resolveSelection(picked),
    added = features.filter((id) => !picked.includes(id))
  if (added.length > 0) {
    note(added.map((id) => `+ ${id} (required by your selection)`).join('\n'), 'Added dependencies')
  }

  const s = spinner()
  s.start('Scaffolding your project')
  try {
    await scaffold({ features, projectName: name, targetDir, templatesDir })
    s.stop('Project scaffolded')
  } catch (error) {
    s.stop('Scaffolding failed')
    cancel(error instanceof Error ? error.message : String(error))
    process.exit(1)
  }

  const notes = collectPostInstallNotes(features)
  if (notes.length > 0) {
    note(
      notes
        .map(
          ({ feature, notes: items }) =>
            `${pc.bold(feature.label)}\n${items.map((n) => `  • ${n}`).join('\n')}`,
        )
        .join('\n\n'),
      'Next steps for your features',
    )
  }

  outro(`${pc.bgMagenta("You're all set. Go build something great!")}\n\n  cd ${name}\n  vp install\n  vp dev`)
}

function bail() {
  cancel('Cancelled.')
  process.exit(0)
}

main().catch((error) => {
  console.error(error)
  process.exit(1)
})
