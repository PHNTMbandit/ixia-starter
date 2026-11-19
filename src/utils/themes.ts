import { ComputerTowerIcon, MoonIcon, SunIcon } from '@phosphor-icons/react'

import type { Theme } from '@/hooks/use-theme'
import {
  'common.themes.dark' as common_themes_dark,
  'common.themes.light' as common_themes_light,
  'common.themes.system' as common_themes_system,
} from '@/paraglide/messages'

interface ThemeOption {
  icon: typeof SunIcon
  label: string
  value: Theme
}

const themes: ThemeOption[] = [
  { icon: SunIcon, label: common_themes_light(), value: 'light' },
  { icon: MoonIcon, label: common_themes_dark(), value: 'dark' },
  { icon: ComputerTowerIcon, label: common_themes_system(), value: 'system' },
]

function getThemeByValue(value: Theme, options: readonly ThemeOption[]) {
  return options.find((option) => option.value === value)
}

export { themes, getThemeByValue }
