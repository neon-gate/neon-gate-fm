import { atom } from 'jotai'

import { theme } from '@state'
import { ThemePreference } from '@domain'

export const themePreferenceAtom = atom<ThemePreference>(theme)
