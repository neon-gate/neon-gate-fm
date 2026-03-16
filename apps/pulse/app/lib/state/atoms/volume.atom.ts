import { atom } from 'jotai'

import { Volume } from '@domain'
import { volume } from '@state'

export const volumeAtom = atom<Volume>(volume)
